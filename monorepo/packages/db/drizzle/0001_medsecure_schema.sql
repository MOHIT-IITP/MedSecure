ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "age" integer;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "blood_group" varchar(20);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "allergies" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "chronic_diseases" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emergency_contact" varchar(30);

CREATE TABLE IF NOT EXISTS "health_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"blood_pressure" varchar(50),
	"sugar_level" varchar(50),
	"weight" varchar(50),
	"pulse" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"file_url" varchar(1000) NOT NULL,
	"file_type" varchar(100) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "qr_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qr_access_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "qr_access_token_unique" UNIQUE("token")
);

DO $$ BEGIN
 ALTER TABLE "health_records" ADD CONSTRAINT "health_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "qr_access" ADD CONSTRAINT "qr_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
