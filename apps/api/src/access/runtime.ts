import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";
import { Resend } from "resend";
import { createLogoutProof, createOpaqueToken, digestOpaqueValue, hashPassword, verifyLogoutProof, verifyPassword } from "./crypto.js";

const ACCESS_LAYER = "synthetic-access-foundation";
const SESSION_DAYS = 14;
const TOKEN_MINUTES = 30;

export type MembershipRole = "SUPERUSER" | "BETA_USER" | "GUEST";

export interface AccessRuntimeConfig {
  databaseUrl: string;
  pepper: string;
  resendKey: string;
  fromEmail: string;
  initialSuperuserEmail: string;
  publicOrigin: string;
}

export interface SessionIdentity {
  userId: string;
  email: string;
  roles: MembershipRole[];
  logoutProof: string;
}

export interface ApplicationRecord {
  id: string;
  email: string;
  requestText: string;
  createdAt: string;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing required access configuration: ${name}`);
  return value;
}

export function loadAccessRuntimeConfig(): AccessRuntimeConfig | undefined {
  const names = ["CLD_ACCESS_DB", "CLD_ACCESS_PEPPER", "CLD_RESEND_KEY", "CLD_ACCESS_FROM", "CLD_INITIAL_SUPERUSER"];
  const present = names.filter((name) => Boolean(process.env[name]?.trim()));
  if (present.length === 0) return undefined;
  if (present.length !== names.length) throw new Error("partial access runtime configuration is not permitted");
  return {
    databaseUrl: requiredEnvironment("CLD_ACCESS_DB"),
    pepper: requiredEnvironment("CLD_ACCESS_PEPPER"),
    resendKey: requiredEnvironment("CLD_RESEND_KEY"),
    fromEmail: requiredEnvironment("CLD_ACCESS_FROM"),
    initialSuperuserEmail: normalizeEmail(requiredEnvironment("CLD_INITIAL_SUPERUSER")),
    publicOrigin: process.env.CLD_PUBLIC_ORIGIN?.trim() || "https://legislativedata.org"
  };
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function future(minutes: number): Date {
  return new Date(Date.now() + minutes * 60_000);
}

export class AccessRuntime {
  private readonly pool: Pool;
  private readonly email: Resend;

  constructor(private readonly config: AccessRuntimeConfig) {
    this.pool = new Pool({ connectionString: config.databaseUrl, max: 4, idleTimeoutMillis: 10_000 });
    this.email = new Resend(config.resendKey);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async bootstrapInitialSuperuser(): Promise<void> {
    const existing = await this.pool.query<{ id: string }>(
      "select id from access_control.users where email_normalized = $1", [this.config.initialSuperuserEmail]
    );
    if (existing.rowCount) return;
    const userId = randomUUID();
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query(
        "insert into access_control.users (id, email_normalized, state) values ($1, $2, 'BETA_PENDING')",
        [userId, this.config.initialSuperuserEmail]
      );
      await client.query(
        "insert into access_control.memberships (id, user_id, role, layer_id) values ($1, $2, 'SUPERUSER', $3)",
        [randomUUID(), userId, ACCESS_LAYER]
      );
      const token = await this.createToken(userId, "ACTIVATION", client);
      await this.sendActivation(this.config.initialSuperuserEmail, token);
      await this.audit(null, "INITIAL_SUPERUSER_INVITED", userId, "SENT", client);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async resendPendingInitialSuperuserActivation(): Promise<boolean> {
    const result = await this.pool.query<{ id: string }>(
      "select u.id from access_control.users u where u.email_normalized = $1 and u.state = 'BETA_PENDING' and exists (select 1 from access_control.memberships m where m.user_id = u.id and m.role = 'SUPERUSER' and m.revoked_at is null) and not exists (select 1 from access_control.credentials c where c.user_id = u.id and c.revoked_at is null)",
      [this.config.initialSuperuserEmail]
    );
    const user = result.rows[0];
    if (!user) return false;
    const token = await this.createToken(user.id, "ACTIVATION");
    try {
      await this.sendActivation(this.config.initialSuperuserEmail, token);
      await this.audit(null, "INITIAL_SUPERUSER_ACTIVATION_RESENT", user.id, "SENT");
      return true;
    } catch (error) {
      await this.pool.query("delete from access_control.one_time_tokens where token_digest = $1", [this.digest(token)]);
      throw error;
    }
  }

  async submitApplication(email: string, requestText: string): Promise<void> {
    const normalized = normalizeEmail(email);
    await this.pool.query(
      "insert into access_control.beta_applications (id, applicant_email_normalized, request_text) values ($1, $2, $3)",
      [randomUUID(), normalized, requestText.trim()]
    );
  }

  async login(identifier: string, password: string): Promise<string | undefined> {
    const result = await this.pool.query<{ id: string; password_hash: string }>(
      "select u.id, c.password_hash from access_control.users u join access_control.credentials c on c.user_id = u.id where (u.email_normalized = $1 or u.username = $1) and u.state = 'ACTIVE' and c.revoked_at is null",
      [identifier.trim().toLowerCase()]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(user.password_hash, password))) return undefined;
    return this.createSession(user.id);
  }

  async requestMagicLink(email: string): Promise<void> {
    const result = await this.pool.query<{ id: string }>(
      "select id from access_control.users where email_normalized = $1 and state = 'ACTIVE'", [normalizeEmail(email)]
    );
    const user = result.rows[0];
    if (!user) return;
    const token = await this.createToken(user.id, "MAGIC_LINK");
    try {
      await this.sendMagicLink(normalizeEmail(email), token);
      await this.audit(user.id, "MAGIC_LINK_REQUESTED", user.id, "SENT");
    } catch (error) {
      await this.pool.query("delete from access_control.one_time_tokens where token_digest = $1", [this.digest(token)]);
      throw error;
    }
  }

  async consumeMagicLink(token: string): Promise<string | undefined> {
    const userId = await this.consumeToken(token, ["MAGIC_LINK", "GUEST_INVITE"]);
    if (!userId) return undefined;
    return this.createSession(userId);
  }

  async setPassword(token: string, password: string): Promise<string | undefined> {
    const userId = await this.consumeToken(token, ["ACTIVATION"]);
    if (!userId) return undefined;
    const passwordHash = await hashPassword(password);
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query(
        "insert into access_control.credentials (user_id, password_hash) values ($1, $2) on conflict (user_id) do update set password_hash = excluded.password_hash, changed_at = now(), revoked_at = null",
        [userId, passwordHash]
      );
      await client.query("update access_control.users set state = 'ACTIVE', activated_at = coalesce(activated_at, now()), updated_at = now() where id = $1", [userId]);
      await this.audit(userId, "PASSWORD_SET", userId, "SUCCESS", client);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
    return this.createSession(userId);
  }

  async changePassword(userId: string, password: string): Promise<void> {
    const passwordHash = await hashPassword(password);
    await this.pool.query("update access_control.credentials set password_hash = $2, changed_at = now(), revoked_at = null where user_id = $1", [userId, passwordHash]);
    await this.audit(userId, "PASSWORD_CHANGED", userId, "SUCCESS");
  }

  async identity(sessionToken: string | undefined): Promise<SessionIdentity | undefined> {
    if (!sessionToken) return undefined;
    const result = await this.pool.query<{ id: string; session_id: string; email: string; role: MembershipRole }>(
      "select u.id, s.id as session_id, u.email_normalized as email, m.role from access_control.sessions s join access_control.users u on u.id = s.user_id join access_control.memberships m on m.user_id = u.id where s.session_digest = $1 and s.revoked_at is null and s.expires_at > now() and u.state = 'ACTIVE' and m.revoked_at is null and (m.expires_at is null or m.expires_at > now())",
      [this.digest(sessionToken)]
    );
    const first = result.rows[0];
    if (!first) return undefined;
    return { userId: first.id, email: first.email, roles: [...new Set(result.rows.map((row) => row.role))], logoutProof: createLogoutProof(first.session_id, this.config.pepper) };
  }

  async revokeSession(sessionToken: string | undefined, logoutProof: string | undefined): Promise<boolean> {
    const sessionDigest = sessionToken ? this.digest(sessionToken) : undefined;
    const sessionId = logoutProof ? verifyLogoutProof(logoutProof, this.config.pepper) : undefined;
    if (!sessionDigest && !sessionId) return false;
    const result = await this.pool.query("update access_control.sessions set revoked_at = now() where revoked_at is null and (session_digest = $1 or id = $2)", [sessionDigest, sessionId]);
    return result.rowCount === 1;
  }

  async applications(): Promise<ApplicationRecord[]> {
    const result = await this.pool.query<{ id: string; email: string; request_text: string; created_at: Date }>(
      "select id, applicant_email_normalized as email, request_text, created_at from access_control.beta_applications where decision is null order by created_at asc"
    );
    return result.rows.map((row) => ({ id: row.id, email: row.email, requestText: row.request_text, createdAt: row.created_at.toISOString() }));
  }

  async approveApplication(actorId: string, applicationId: string): Promise<boolean> {
    const application = await this.pool.query<{ email: string }>(
      "select applicant_email_normalized as email from access_control.beta_applications where id = $1 and decision is null", [applicationId]
    );
    const item = application.rows[0];
    if (!item) return false;
    let user = await this.pool.query<{ id: string; state: string }>("select id, state from access_control.users where email_normalized = $1", [item.email]);
    const userId = user.rows[0]?.id ?? randomUUID();
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      if (!user.rowCount) await client.query("insert into access_control.users (id, email_normalized, state) values ($1, $2, 'BETA_PENDING')", [userId, item.email]);
      await client.query("insert into access_control.memberships (id, user_id, role, layer_id) values ($1, $2, 'BETA_USER', $3) on conflict (user_id, role, layer_id) do update set revoked_at = null", [randomUUID(), userId, ACCESS_LAYER]);
      await client.query("update access_control.beta_applications set decision = 'APPROVED', decided_at = now() where id = $1", [applicationId]);
      const token = await this.createToken(userId, "ACTIVATION", client);
      await this.sendActivation(item.email, token);
      await this.audit(actorId, "BETA_APPLICATION_APPROVED", userId, "SENT", client);
      await client.query("commit");
      return true;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  private digest(value: string): string {
    return digestOpaqueValue(value, this.config.pepper);
  }

  private async createToken(userId: string, purpose: "ACTIVATION" | "MAGIC_LINK" | "GUEST_INVITE", client: Pool | PoolClient = this.pool): Promise<string> {
    const token = createOpaqueToken();
    await client.query(
      "insert into access_control.one_time_tokens (id, user_id, purpose, token_digest, expires_at) values ($1, $2, $3, $4, $5)",
      [randomUUID(), userId, purpose, this.digest(token), future(TOKEN_MINUTES)]
    );
    return token;
  }

  private async consumeToken(token: string, purposes: Array<"ACTIVATION" | "MAGIC_LINK" | "GUEST_INVITE">): Promise<string | undefined> {
    const result = await this.pool.query<{ user_id: string }>(
      "update access_control.one_time_tokens set consumed_at = now() where token_digest = $1 and purpose = any($2::access_control.token_purpose[]) and consumed_at is null and revoked_at is null and expires_at > now() returning user_id",
      [this.digest(token), purposes]
    );
    return result.rows[0]?.user_id;
  }

  private async createSession(userId: string): Promise<string> {
    const token = createOpaqueToken();
    await this.pool.query(
      "insert into access_control.sessions (id, user_id, session_digest, expires_at) values ($1, $2, $3, $4)",
      [randomUUID(), userId, this.digest(token), future(SESSION_DAYS * 24 * 60)]
    );
    return token;
  }

  private async audit(actorId: string | null, action: string, targetId: string, result: string, client: Pool | PoolClient = this.pool): Promise<void> {
    await client.query(
      "insert into access_control.access_audit (id, actor_user_id, action, target_user_id, result) values ($1, $2, $3, $4, $5)",
      [randomUUID(), actorId, action, targetId, result]
    );
  }

  private async sendActivation(email: string, token: string): Promise<void> {
    await this.sendEmail(email, "Set your Legislative Data password", `${this.config.publicOrigin}/?activate=${encodeURIComponent(token)}`, "Set your password");
  }

  private async sendMagicLink(email: string, token: string): Promise<void> {
    await this.sendEmail(email, "Your Legislative Data sign-in link", `${this.config.publicOrigin}/?magic=${encodeURIComponent(token)}`, "Sign in");
  }

  private async sendEmail(to: string, subject: string, link: string, action: string): Promise<void> {
    const result = await this.email.emails.send({
      from: this.config.fromEmail,
      to,
      subject,
      html: `<p>Use the secure link below within ${TOKEN_MINUTES} minutes.</p><p><a href="${link}">${action}</a></p>`
    });
    if (result.error) throw new Error("email delivery failed");
  }
}

export const accessLayer = ACCESS_LAYER;
export const sessionDays = SESSION_DAYS;
