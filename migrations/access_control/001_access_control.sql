-- DEC-0058 local artefact only. This file has not been applied to any database.
-- The later controlled database package must prove access_control-only grants
-- and denial of DB1/research-schema access before applying this migration.

CREATE SCHEMA IF NOT EXISTS access_control;

CREATE TYPE access_control.account_state AS ENUM ('BETA_PENDING', 'ACTIVE', 'REVOKED');
CREATE TYPE access_control.membership_role AS ENUM ('SUPERUSER', 'BETA_USER', 'GUEST');
CREATE TYPE access_control.token_purpose AS ENUM ('ACTIVATION', 'MAGIC_LINK', 'GUEST_INVITE');

CREATE TABLE access_control.users (
  id uuid PRIMARY KEY,
  email_normalized text NOT NULL UNIQUE,
  username text UNIQUE,
  state access_control.account_state NOT NULL,
  activated_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE access_control.memberships (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES access_control.users(id),
  role access_control.membership_role NOT NULL,
  layer_id text NOT NULL,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, layer_id)
);

CREATE TABLE access_control.credentials (
  user_id uuid PRIMARY KEY REFERENCES access_control.users(id),
  password_hash text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE access_control.one_time_tokens (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES access_control.users(id),
  purpose access_control.token_purpose NOT NULL,
  token_digest char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE access_control.sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES access_control.users(id),
  session_digest char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  rotated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE access_control.beta_applications (
  id uuid PRIMARY KEY,
  applicant_email_normalized text NOT NULL,
  request_text text NOT NULL CHECK (char_length(request_text) <= 2000),
  decision text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
