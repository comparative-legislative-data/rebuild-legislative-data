import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { FormEvent } from "react";
import "./styles.css";

type View = "login" | "apply" | "settings" | "admin";
type Identity = { authenticated: boolean; email: string | null; roles: string[]; data_layers_available: false };

async function request(path: string, init: RequestInit = {}) {
  return fetch(`/api${path}`, { ...init, credentials: "same-origin", headers: { "content-type": "application/json", ...init.headers } });
}

function App() {
  const [view, setView] = useState<View>("login");
  const [message, setMessage] = useState("Private beta access is available. Research data is not available from this application.");
  const [identity, setIdentity] = useState<Identity>({ authenticated: false, email: null, roles: [], data_layers_available: false });
  const [activationToken, setActivationToken] = useState<string | undefined>();
  const [applications, setApplications] = useState<Array<{ id: string; email: string; requestText: string; createdAt: string }>>([]);

  async function refreshIdentity() {
    const response = await request("/auth/me");
    if (response.ok) setIdentity(await response.json());
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const magic = query.get("magic");
    const activation = query.get("activate");
    if (activation) {
      setActivationToken(activation);
      setMessage("Choose a password to activate your account.");
      return;
    }
    if (magic) {
      void request("/auth/magic-link/consume", { method: "POST", body: JSON.stringify({ token: magic }) }).then(async () => {
        await refreshIdentity();
        setMessage("If the link was valid, you are now signed in.");
        window.history.replaceState({}, "", "/");
      });
      return;
    }
    void refreshIdentity();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>, path: string, values: Record<string, string>, success: string) {
    event.preventDefault();
    await request(path, { method: "POST", body: JSON.stringify(values) });
    setMessage(success);
    await refreshIdentity();
  }

  async function loadApplications() {
    const response = await request("/auth/admin/applications");
    if (response.ok) setApplications((await response.json()).applications);
  }

  async function approve(id: string) {
    await request(`/auth/admin/applications/${id}/approve`, { method: "POST" });
    await loadApplications();
    setMessage("The applicant has been sent an activation invitation.");
  }

  if (activationToken) {
    return <main><h1>Comparative Legislative Data</h1><p className="eyebrow">Private beta</p><p>{message}</p><section aria-labelledby="password-heading"><h2 id="password-heading">Set password</h2><form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password", { token: activationToken, password }, "Your password has been set and you are signed in."); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Set password</button></form></section></main>;
  }

  return (
    <main>
      <h1>Comparative Legislative Data</h1>
      <p className="eyebrow">Private beta</p>
      <p>{message}</p>
      {identity.authenticated ? <p className="identity">Signed in as {identity.email}.</p> : null}
      <nav aria-label="Access options">
        <button type="button" onClick={() => setView("login")}>Log in</button>
        <button type="button" onClick={() => setView("apply")}>Apply for beta access</button>
        {identity.authenticated ? <button type="button" onClick={() => setView("settings")}>Settings</button> : null}
        {identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); void loadApplications(); }}>Superuser review</button> : null}
      </nav>
      {view === "login" && !identity.authenticated ? <section aria-labelledby="login-heading"><h2 id="login-heading">Log in</h2><form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/login", { identifier: String(data.get("identifier") ?? ""), password: String(data.get("password") ?? "") }, "If the details were valid, you are signed in."); }}><label>Email or username<input name="identifier" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label><button>Log in</button></form><form onSubmit={(event) => { const email = new FormData(event.currentTarget).get("email"); void submit(event, "/auth/magic-link", { email: String(email ?? "") }, "If an eligible account exists, a sign-in link will arrive shortly."); }}><label>Email for magic link<input name="email" type="email" required autoComplete="email" /></label><button>Request magic link</button></form></section> : null}
      {view === "apply" ? <section aria-labelledby="apply-heading"><h2 id="apply-heading">Apply for beta access</h2><form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/applications", { email: String(data.get("email") ?? ""), requestText: String(data.get("requestText") ?? "") }, "Your request has been received. If approved, you will receive an activation link."); }}><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Why would access be useful?<textarea name="requestText" maxLength={2000} required /></label><button>Submit application</button></form></section> : null}
      {view === "settings" && identity.authenticated ? <section aria-labelledby="settings-heading"><h2 id="settings-heading">Settings</h2><form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password/change", { password }, "Your password has been changed."); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Change password</button></form><button type="button" onClick={() => { void request("/auth/logout", { method: "POST" }).then(async () => { await refreshIdentity(); setView("login"); setMessage("You are signed out."); }); }}>Log out</button></section> : null}
      {view === "admin" && identity.roles.includes("SUPERUSER") ? <section aria-labelledby="admin-heading"><h2 id="admin-heading">Superuser review</h2>{applications.length === 0 ? <p>No pending applications.</p> : <ul>{applications.map((application) => <li key={application.id}><p>{application.email}</p><p>{application.requestText}</p><button type="button" onClick={() => void approve(application.id)}>Approve</button></li>)}</ul>}</section> : null}
      <p className="boundary">No direct source relay, DB1 storage, canonical dataset, chart, export, or research release is available from this application.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
