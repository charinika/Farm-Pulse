-- USERS
CREATE TABLE "users" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "username" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL
);

-- REMINDERS
CREATE TABLE "reminders" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" text NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "note" text,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "created_at" timestamp with time zone DEFAULT now()
);

-- LIVESTOCK
CREATE TABLE "livestock" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "species" varchar(100) NOT NULL,
    "age" integer,
    "owner_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- HEALTH RECORDS
CREATE TABLE "health_records" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "livestock_id" integer NOT NULL REFERENCES "livestock"("id") ON DELETE CASCADE,
    "condition" text NOT NULL,
    "treatment" text,
    "recorded_at" timestamp with time zone DEFAULT now()
);

-- MEDICINE REMINDERS
CREATE TABLE "medicine_reminders" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "livestock_id" integer NOT NULL REFERENCES "livestock"("id") ON DELETE CASCADE,
    "medicine" text NOT NULL,
    "dosage" text,
    "schedule" timestamp with time zone NOT NULL
);

-- VACCINATION REMINDERS
CREATE TABLE "vaccination_reminders" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "livestock_id" integer NOT NULL REFERENCES "livestock"("id") ON DELETE CASCADE,
    "vaccine" text NOT NULL,
    "schedule" timestamp with time zone NOT NULL
);

-- DISEASES
CREATE TABLE "diseases" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "symptoms" text,
    "prevention" text
);

-- FORUM POSTS
CREATE TABLE "forum_posts" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "title" varchar(255) NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- FORUM REPLIES
CREATE TABLE "forum_replies" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "post_id" integer NOT NULL REFERENCES "forum_posts"("id") ON DELETE CASCADE,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- ACTIVITY LOGS
CREATE TABLE "activity_logs" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "activity" text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);

-- CHATBOT CONVERSATIONS
CREATE TABLE "chatbot_conversations" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "started_at" timestamp with time zone DEFAULT now()
);

-- CHATBOT MESSAGES
CREATE TABLE "chatbot_messages" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "conversation_id" integer NOT NULL REFERENCES "chatbot_conversations"("id") ON DELETE CASCADE,
    "sender" varchar(20) NOT NULL,
    "message" text NOT NULL,
    "sent_at" timestamp with time zone DEFAULT now()
);
