import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listAllUsers } from "@/lib/users.functions";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/users/")({
  component: UsersList,
});

function UsersList() {
  const list = useServerFn(listAllUsers);
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "moderator" | "editor" | "user" | "banned">("all");

  const rows = useMemo(() => {
    const all = q.data ?? [];
    return all.filter((u) => {
      if (filter === "banned" && !u.ban) return false;
      if (filter !== "all" && filter !== "banned" && !u.roles.includes(filter)) return false;
      if (search) {
        const s = search.toLowerCase();
        const name = (u.profile?.display_name ?? "").toLowerCase();
        if (!u.email.toLowerCase().includes(s) && !name.includes(s) && !u.id.includes(s)) return false;
      }
      return true;
    });
  }, [q.data, search, filter]);

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Manage members, roles, and bans. {q.data ? `${q.data.length} total.` : ""}
        </p>
      </div>

      <div className="card-surface mt-6 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, name, or id"
            className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
        >
          <option value="all">All users</option>
          <option value="admin">Admins</option>
          <option value="moderator">Moderators</option>
          <option value="editor">Editors</option>
          <option value="user">Users</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="card-surface mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last sign-in</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {q.isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {rows.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {u.profile?.display_name || u.email.split("@")[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.ban ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">
                      <ShieldAlert className="h-3 w-3" />
                      {u.ban.expires_at ? "Temp ban" : "Banned"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                      <ShieldCheck className="h-3 w-3" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/dashboard/users/$id"
                    params={{ id: u.id }}
                    className="text-accent hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {!q.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
