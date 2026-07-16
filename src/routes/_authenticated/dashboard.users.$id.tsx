import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getUserDetail,
  assignRole,
  removeRole,
  banUser,
  unbanUser,
  adminUpdateProfile,
  adminUpdateAuthUser,
  sendPasswordReset,
  deleteUser,
} from "@/lib/users.functions";
import { toast } from "sonner";
import { ArrowLeft, ShieldAlert, Trash2, KeyRound, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/users/$id")({
  component: UserDetail,
});

const ALL_ROLES = ["admin", "moderator", "editor", "user"] as const;

function UserDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const getFn = useServerFn(getUserDetail);
  const assignFn = useServerFn(assignRole);
  const removeFn = useServerFn(removeRole);
  const banFn = useServerFn(banUser);
  const unbanFn = useServerFn(unbanUser);
  const updateProfileFn = useServerFn(adminUpdateProfile);
  const updateAuthFn = useServerFn(adminUpdateAuthUser);
  const resetPwFn = useServerFn(sendPasswordReset);
  const deleteFn = useServerFn(deleteUser);

  const q = useQuery({ queryKey: ["admin-user", id], queryFn: () => getFn({ data: { id } }) });

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState<string>("");

  useEffect(() => {
    if (q.data) {
      setDisplayName(q.data.profile?.display_name ?? "");
      setBio(q.data.profile?.bio ?? "");
      setAvatarUrl(q.data.profile?.avatar_url ?? "");
      setEmail(q.data.user.email ?? "");
      setPhone(q.data.user.phone ?? "");
    }
  }, [q.data]);

  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!q.data) return <p className="text-muted-foreground">Not found.</p>;

  const u = q.data;
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-user", id] });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };
  const wrap = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast.success(ok);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/dashboard/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All users
      </Link>

      <div>
        <h1 className="font-display text-3xl font-bold text-primary">
          {u.profile?.display_name || u.user.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          {u.user.email} · Joined {new Date(u.user.created_at).toLocaleDateString()}
        </p>
      </div>

      {u.bans.find((b: any) => b.active) && (
        <div className="card-surface flex items-start gap-3 border-destructive/50 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-destructive">
              Currently banned{" "}
              {u.bans[0].expires_at
                ? `until ${new Date(u.bans[0].expires_at).toLocaleString()}`
                : "(permanent)"}
            </p>
            {u.bans[0].reason && (
              <p className="text-muted-foreground">Reason: {u.bans[0].reason}</p>
            )}
          </div>
          <button
            onClick={() => wrap(() => unbanFn({ data: { userId: id } }), "Unbanned")}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm hover:bg-muted"
          >
            Unban
          </button>
        </div>
      )}

      <section className="card-surface p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Roles</h2>
        <p className="mt-1 text-sm text-muted-foreground">Assign or remove roles for this user.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_ROLES.map((r) => {
            const has = u.roles.includes(r);
            return (
              <button
                key={r}
                onClick={() =>
                  wrap(
                    () =>
                      has
                        ? removeFn({ data: { userId: id, role: r } })
                        : assignFn({ data: { userId: id, role: r } }),
                    has ? `Removed ${r}` : `Assigned ${r}`,
                  )
                }
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  has
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-surface hover:bg-muted"
                }`}
              >
                {has ? `✓ ${r}` : `+ ${r}`}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Display name" value={displayName} onChange={setDisplayName} />
          <Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} />
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={() =>
            wrap(
              () =>
                updateProfileFn({
                  data: { userId: id, display_name: displayName, avatar_url: avatarUrl, bio },
                }),
              "Profile updated",
            )
          }
          className="mt-4 h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Save profile
        </button>
      </section>

      <section className="card-surface p-6">
        <h2 className="font-display text-lg font-bold text-foreground">Account credentials</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="New password (optional)" value={password} onChange={setPassword} type="password" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() =>
              wrap(
                () =>
                  updateAuthFn({
                    data: {
                      userId: id,
                      email: email || undefined,
                      phone: phone || undefined,
                      password: password || undefined,
                      email_confirm: true,
                    },
                  }).then(() => setPassword("")),
                "Account updated",
              )
            }
            className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <KeyRound className="mr-1 inline h-4 w-4" /> Save credentials
          </button>
          <button
            onClick={() =>
              wrap(
                () => resetPwFn({ data: { email: u.user.email } }),
                "Password reset email sent",
              )
            }
            className="h-10 rounded-md border border-border bg-surface px-4 text-sm hover:bg-muted"
          >
            <Mail className="mr-1 inline h-4 w-4" /> Send reset email
          </button>
        </div>
      </section>

      <section className="card-surface border-destructive/40 p-6">
        <h2 className="font-display text-lg font-bold text-destructive">Ban controls</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Leave duration empty for a permanent ban.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold">Reason</label>
            <input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
              placeholder="Violation of terms…"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Duration (days)</label>
            <input
              type="number"
              min={1}
              value={banDays}
              onChange={(e) => setBanDays(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
              placeholder="Permanent"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() =>
              wrap(
                () =>
                  banFn({
                    data: {
                      userId: id,
                      reason: banReason,
                      durationDays: banDays ? Number(banDays) : null,
                    },
                  }),
                banDays ? `Banned for ${banDays} days` : "Permanently banned",
              )
            }
            className="h-10 rounded-md bg-destructive px-4 text-sm font-semibold text-destructive-foreground"
          >
            {banDays ? "Temporary ban" : "Permanent ban"}
          </button>
          <button
            onClick={() => {
              if (!confirm("Delete this user permanently? This cannot be undone.")) return;
              wrap(async () => {
                await deleteFn({ data: { userId: id } });
                navigate({ to: "/dashboard/users" });
              }, "User deleted");
            }}
            className="h-10 rounded-md border border-destructive/60 px-4 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-1 inline h-4 w-4" /> Delete user
          </button>
        </div>
      </section>

      {u.bans.length > 0 && (
        <section className="card-surface p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Ban history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {u.bans.map((b: any) => (
              <li key={b.id} className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <p className="font-medium text-foreground">
                    {b.expires_at ? "Temporary" : "Permanent"} · {b.active ? "active" : "lifted"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleString()}
                    {b.expires_at && ` → ${new Date(b.expires_at).toLocaleString()}`}
                  </p>
                  {b.reason && <p className="text-xs text-muted-foreground">Reason: {b.reason}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
      />
    </div>
  );
}
