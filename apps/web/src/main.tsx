import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { useState } from "react";
import type { FormEvent } from "react";

function App() {
  const [view, setView] = useState<"login" | "apply" | "settings" | "admin">("login");
  const [message, setMessage] = useState("Private beta access is being configured. No account or data access is active yet.");

  function unavailable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Access control is not configured yet. No account, email, or data request was created.");
  }

  return (
    <main>
      <h1>Comparative Legislative Data</h1>
      <p className="eyebrow">Private beta foundation</p>
      <p>{message}</p>
      <nav aria-label="Access options">
        <button type="button" onClick={() => setView("login")}>Log in</button>
        <button type="button" onClick={() => setView("apply")}>Apply for beta access</button>
        <button type="button" onClick={() => setView("settings")}>Settings</button>
        <button type="button" onClick={() => setView("admin")}>Superuser review</button>
      </nav>
      {view === "login" && <section aria-labelledby="login-heading"><h2 id="login-heading">Log in</h2><form onSubmit={unavailable}><label>Email or username<input required /></label><label>Password<input type="password" required /></label><button>Log in</button></form><button type="button" onClick={() => setMessage("Magic-link sign-in will be available only after server-side token storage and email delivery are configured.")}>Request magic link</button></section>}
      {view === "apply" && <section aria-labelledby="apply-heading"><h2 id="apply-heading">Apply for beta access</h2><form onSubmit={unavailable}><label>Email<input type="email" required /></label><label>Why would access be useful?<textarea maxLength={2000} required /></label><button>Submit application</button></form></section>}
      {view === "settings" && <section aria-labelledby="settings-heading"><h2 id="settings-heading">Settings</h2><p>Password changes will require an authenticated server-side session. No session exists in this local foundation.</p></section>}
      {view === "admin" && <section aria-labelledby="admin-heading"><h2 id="admin-heading">Superuser review</h2><p>Applicant decisions, guest invitations, and revocations will be available only to an authenticated superuser after the controlled access database package passes.</p></section>}
      <p className="boundary">No direct source relay, DB1 storage, canonical dataset, or research release is available from this application.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
