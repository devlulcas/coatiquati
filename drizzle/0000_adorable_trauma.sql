CREATE TABLE IF NOT EXISTS "auth_key" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" text NOT NULL,
	"primary_key" boolean NOT NULL,
	"expires" bigint
);

CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"roles" text[] DEFAULT USER NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"avatar" text DEFAULT 'no_profile_picture.webp' NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "auth_key_id_key" ON "auth_key" ("id");
CREATE INDEX IF NOT EXISTS "auth_key_user_id_idx" ON "auth_key" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_session_id_key" ON "auth_session" ("id");
CREATE INDEX IF NOT EXISTS "auth_session_user_id_idx" ON "auth_session" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_email_key" ON "auth_user" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_id_key" ON "auth_user" ("id");
DO $$ BEGIN
 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
