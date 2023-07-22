CREATE TABLE IF NOT EXISTS "ban_registry" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"admin_id" text NOT NULL,
	"second_admin_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trail_contributor" (
	"trail_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trail" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"thumbnail" text DEFAULT 'no_profile_picture.webp' NOT NULL,
	"thumbnail_description" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_key" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" text NOT NULL,
	"primary_key" boolean NOT NULL,
	"expires" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"roles" text[] DEFAULT ARRAY['USER']::text[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"ban_votes" integer DEFAULT 0 NOT NULL,
	"avatar" text DEFAULT 'no_profile_picture.webp' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "trail_contributor_id_key" ON "trail_contributor" ("trail_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "trail_id_key" ON "trail" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "trail_slug_key" ON "trail" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_key_id_key" ON "auth_key" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_key_user_id_idx" ON "auth_key" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_session_id_key" ON "auth_session" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_session_user_id_idx" ON "auth_session" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_email_key" ON "auth_user" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_user_id_key" ON "auth_user" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_admin_id_auth_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_second_admin_id_auth_user_id_fk" FOREIGN KEY ("second_admin_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trail_contributor" ADD CONSTRAINT "trail_contributor_trail_id_trail_id_fk" FOREIGN KEY ("trail_id") REFERENCES "trail"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trail_contributor" ADD CONSTRAINT "trail_contributor_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trail" ADD CONSTRAINT "trail_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
