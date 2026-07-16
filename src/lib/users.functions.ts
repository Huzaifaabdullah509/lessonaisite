import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ROLES = ["admin", "moderator", "editor", "user"] as const;
type Role = (typeof ROLES)[number];

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!data) throw new Error("Forbidden: admin role required");
}

async function assertAdminOrMod(context: { supabase: any; userId: string }) {
  const [{ data: a }, { data: m }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "moderator" }),
  ]);
  if (!a && !m) throw new Error("Forbidden: admin or moderator role required");
}

export const listAllUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrMod(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: users, error: uErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (uErr) throw new Error(uErr.message);

    const ids = users.users.map((u) => u.id);
    const [{ data: profiles }, { data: roles }, { data: bans }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, avatar_url, bio").in("id", ids),
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
      supabaseAdmin
        .from("user_bans")
        .select("user_id, reason, expires_at, active, created_at")
        .in("user_id", ids)
        .eq("active", true),
    ]);

    const profileById = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const rolesByUser = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });
    const now = Date.now();
    const banByUser = new Map<string, any>();
    (bans ?? []).forEach((b: any) => {
      if (!b.expires_at || new Date(b.expires_at).getTime() > now) banByUser.set(b.user_id, b);
    });

    return users.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      phone: u.phone ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      email_confirmed_at: u.email_confirmed_at,
      profile: profileById.get(u.id) ?? null,
      roles: rolesByUser.get(u.id) ?? [],
      ban: banByUser.get(u.id) ?? null,
    }));
  });

export const getUserDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrMod(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: u, error } = await supabaseAdmin.auth.admin.getUserById(data.id);
    if (error) throw new Error(error.message);
    const [{ data: profile }, { data: roles }, { data: bans }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", data.id).maybeSingle(),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", data.id),
      supabaseAdmin
        .from("user_bans")
        .select("*")
        .eq("user_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    return {
      user: {
        id: u.user!.id,
        email: u.user!.email ?? "",
        phone: u.user!.phone ?? "",
        created_at: u.user!.created_at,
        last_sign_in_at: u.user!.last_sign_in_at,
        email_confirmed_at: u.user!.email_confirmed_at,
        user_metadata: u.user!.user_metadata,
      },
      profile: profile ?? null,
      roles: (roles ?? []).map((r: any) => r.role as Role),
      bans: bans ?? [],
    };
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ userId: z.string().uuid(), role: z.enum(ROLES) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error && !/duplicate/i.test(error.message)) throw new Error(error.message);
    return { ok: true };
  });

export const removeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ userId: z.string().uuid(), role: z.enum(ROLES) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId && data.role === "admin") {
      throw new Error("You cannot remove your own admin role.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const banUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        reason: z.string().max(500).optional().default(""),
        durationDays: z.number().int().positive().max(3650).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) throw new Error("You cannot ban yourself.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Deactivate previous
    await supabaseAdmin
      .from("user_bans")
      .update({ active: false })
      .eq("user_id", data.userId)
      .eq("active", true);

    const expires_at = data.durationDays
      ? new Date(Date.now() + data.durationDays * 86400_000).toISOString()
      : null;

    const { error } = await supabaseAdmin.from("user_bans").insert({
      user_id: data.userId,
      banned_by: context.userId,
      reason: data.reason || null,
      expires_at,
      active: true,
    });
    if (error) throw new Error(error.message);

    // Revoke sessions via GoTrue admin ban duration (also blocks new sign-ins for that window)
    try {
      await supabaseAdmin.auth.admin.updateUserById(data.userId, {
        ban_duration: data.durationDays ? `${data.durationDays * 24}h` : "876000h",
      } as any);
    } catch {
      /* ignore if unsupported */
    }
    return { ok: true };
  });

export const unbanUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("user_bans")
      .update({ active: false })
      .eq("user_id", data.userId)
      .eq("active", true);
    try {
      await supabaseAdmin.auth.admin.updateUserById(data.userId, { ban_duration: "none" } as any);
    } catch {
      /* ignore */
    }
    return { ok: true };
  });

export const adminUpdateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        display_name: z.string().max(120).optional().nullable(),
        avatar_url: z.string().max(500).optional().nullable(),
        bio: z.string().max(1000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: data.userId,
        display_name: data.display_name ?? null,
        avatar_url: data.avatar_url ?? null,
        bio: data.bio ?? null,
        updated_at: new Date().toISOString(),
      });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateAuthUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        email: z.string().email().optional(),
        phone: z.string().max(30).optional(),
        password: z.string().min(6).max(200).optional(),
        email_confirm: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.email) patch.email = data.email;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.password) patch.password = data.password;
    if (data.email_confirm) patch.email_confirm = true;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, patch as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendPasswordReset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email(), redirectTo: z.string().url().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) throw new Error("You cannot delete yourself.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkMyBan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_bans")
      .select("reason, expires_at, active")
      .eq("user_id", context.userId)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return { banned: false as const };
    if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
      return { banned: false as const };
    }
    return {
      banned: true as const,
      reason: data.reason as string | null,
      expires_at: data.expires_at as string | null,
    };
  });
