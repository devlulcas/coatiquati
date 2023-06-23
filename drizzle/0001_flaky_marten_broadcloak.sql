CREATE TABLE IF NOT EXISTS "ban_registry" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"admin_id" text NOT NULL,
	"second_admin_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "auth_user" ADD COLUMN "ban_votes" integer DEFAULT 0 NOT NULL;
DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_admin_id_auth_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ban_registry" ADD CONSTRAINT "ban_registry_second_admin_id_auth_user_id_fk" FOREIGN KEY ("second_admin_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
