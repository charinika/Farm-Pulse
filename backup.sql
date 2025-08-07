--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    livestock_id character varying,
    action character varying NOT NULL,
    description text NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: chatbot_conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatbot_conversations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    title character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chatbot_conversations OWNER TO postgres;

--
-- Name: chatbot_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatbot_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    conversation_id character varying NOT NULL,
    role character varying NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chatbot_messages OWNER TO postgres;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseases (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    species character varying[] NOT NULL,
    symptoms text[] NOT NULL,
    treatment text NOT NULL,
    prevention text NOT NULL,
    severity character varying NOT NULL,
    contagious boolean DEFAULT false,
    emergency_protocol text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.diseases OWNER TO postgres;

--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    category character varying NOT NULL,
    tags character varying[],
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_resolved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forum_posts OWNER TO postgres;

--
-- Name: forum_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_replies (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    post_id character varying NOT NULL,
    user_id character varying NOT NULL,
    content text NOT NULL,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_best_answer boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forum_replies OWNER TO postgres;

--
-- Name: health_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_records (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    livestock_id character varying NOT NULL,
    record_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    veterinarian character varying,
    medication character varying,
    dosage character varying,
    cost numeric(10,2),
    record_date timestamp without time zone NOT NULL,
    follow_up_date timestamp without time zone,
    attachments text[],
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.health_records OWNER TO postgres;

--
-- Name: livestock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livestock (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    name character varying NOT NULL,
    species character varying NOT NULL,
    breed character varying,
    gender character varying NOT NULL,
    date_of_birth date,
    weight numeric(10,2),
    status character varying DEFAULT 'healthy'::character varying NOT NULL,
    photo_url character varying,
    tag_number character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.livestock OWNER TO postgres;

--
-- Name: medicine_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicine_reminders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    livestock_id character varying NOT NULL,
    medicine_name character varying NOT NULL,
    dosage character varying NOT NULL,
    frequency character varying NOT NULL,
    start_date date NOT NULL,
    end_date date,
    next_due_date timestamp without time zone NOT NULL,
    is_completed boolean DEFAULT false,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medicine_reminders OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vaccination_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaccination_reminders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    livestock_id character varying NOT NULL,
    vaccine_name character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    is_completed boolean DEFAULT false,
    batch_number character varying,
    veterinarian character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vaccination_reminders OWNER TO postgres;

--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, livestock_id, action, description, metadata, created_at) FROM stdin;
b54bb616-d103-4e78-8f98-9427b4daea42	4de36aed-7f19-4490-bb3f-c16780b89d6d	1481f6b9-f630-488b-b878-fed7fd797dce	animal_added	Added new cattle named Cow	\N	2025-07-31 20:07:45.513591
\.


--
-- Data for Name: chatbot_conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatbot_conversations (id, user_id, title, created_at, updated_at) FROM stdin;
f74447ec-cce9-4ff6-86f6-33bbd1f082d9	4de36aed-7f19-4490-bb3f-c16780b89d6d	New Conversation	2025-07-26 20:11:58.745515	2025-07-26 20:11:58.745515
\.


--
-- Data for Name: chatbot_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatbot_messages (id, conversation_id, role, content, created_at) FROM stdin;
2ee06ac1-14c5-4e1c-a885-d61ce000a663	f74447ec-cce9-4ff6-86f6-33bbd1f082d9	user	"My cow has been limping, what should I check?"	2025-07-26 20:12:15.739356
\.


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseases (id, name, species, symptoms, treatment, prevention, severity, contagious, emergency_protocol, created_at) FROM stdin;
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_posts (id, user_id, title, content, category, tags, upvotes, downvotes, is_resolved, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: forum_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_replies (id, post_id, user_id, content, upvotes, downvotes, is_best_answer, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: health_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.health_records (id, livestock_id, record_type, title, description, veterinarian, medication, dosage, cost, record_date, follow_up_date, attachments, created_at) FROM stdin;
\.


--
-- Data for Name: livestock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livestock (id, user_id, name, species, breed, gender, date_of_birth, weight, status, photo_url, tag_number, notes, created_at, updated_at) FROM stdin;
1481f6b9-f630-488b-b878-fed7fd797dce	4de36aed-7f19-4490-bb3f-c16780b89d6d	Cow	cattle	Sambal	male	2005-11-22	25.00	healthy	/uploads/07baa3838a5b39b7670a34dded462ed5	23	\N	2025-07-31 20:07:45.499031	2025-07-31 20:07:45.499031
\.


--
-- Data for Name: medicine_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicine_reminders (id, livestock_id, medicine_name, dosage, frequency, start_date, end_date, next_due_date, is_completed, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
rKcC7tawDvD0nAcUdNNEVLdkvzsOjlyn	{"cookie":{"originalMaxAge":604800000,"expires":"2025-08-04T05:06:05.740Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":"4de36aed-7f19-4490-bb3f-c16780b89d6d"}}	2025-08-08 11:18:32
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
4de36aed-7f19-4490-bb3f-c16780b89d6d	palaniyammal1125@gmail.com	0c980614f71970f460f3ce1b48b1bae39c0f3468f7f14667cd1768e6df45126aef7e0a8adac29dcc162caf4d4f2b08e6c020d44122f2e0d8b5bffb4947bdb5ae.fec069cf323724c01cb4f6e449dc79ef	palaniyammal	s	\N	2025-07-26 20:01:52.449534	2025-07-26 20:01:52.449534
\.


--
-- Data for Name: vaccination_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaccination_reminders (id, livestock_id, vaccine_name, scheduled_date, is_completed, batch_number, veterinarian, notes, created_at, updated_at) FROM stdin;
\.


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: chatbot_conversations chatbot_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_conversations
    ADD CONSTRAINT chatbot_conversations_pkey PRIMARY KEY (id);


--
-- Name: chatbot_messages chatbot_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_messages
    ADD CONSTRAINT chatbot_messages_pkey PRIMARY KEY (id);


--
-- Name: diseases diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_pkey PRIMARY KEY (id);


--
-- Name: forum_posts forum_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_pkey PRIMARY KEY (id);


--
-- Name: forum_replies forum_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_pkey PRIMARY KEY (id);


--
-- Name: health_records health_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_records
    ADD CONSTRAINT health_records_pkey PRIMARY KEY (id);


--
-- Name: livestock livestock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestock
    ADD CONSTRAINT livestock_pkey PRIMARY KEY (id);


--
-- Name: medicine_reminders medicine_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_reminders
    ADD CONSTRAINT medicine_reminders_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vaccination_reminders vaccination_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccination_reminders
    ADD CONSTRAINT vaccination_reminders_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: activity_logs activity_logs_livestock_id_livestock_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_livestock_id_livestock_id_fk FOREIGN KEY (livestock_id) REFERENCES public.livestock(id) ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chatbot_conversations chatbot_conversations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_conversations
    ADD CONSTRAINT chatbot_conversations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chatbot_messages chatbot_messages_conversation_id_chatbot_conversations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_messages
    ADD CONSTRAINT chatbot_messages_conversation_id_chatbot_conversations_id_fk FOREIGN KEY (conversation_id) REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE;


--
-- Name: forum_posts forum_posts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: forum_replies forum_replies_post_id_forum_posts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_post_id_forum_posts_id_fk FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;


--
-- Name: forum_replies forum_replies_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: health_records health_records_livestock_id_livestock_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_records
    ADD CONSTRAINT health_records_livestock_id_livestock_id_fk FOREIGN KEY (livestock_id) REFERENCES public.livestock(id) ON DELETE CASCADE;


--
-- Name: livestock livestock_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestock
    ADD CONSTRAINT livestock_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: medicine_reminders medicine_reminders_livestock_id_livestock_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_reminders
    ADD CONSTRAINT medicine_reminders_livestock_id_livestock_id_fk FOREIGN KEY (livestock_id) REFERENCES public.livestock(id) ON DELETE CASCADE;


--
-- Name: vaccination_reminders vaccination_reminders_livestock_id_livestock_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccination_reminders
    ADD CONSTRAINT vaccination_reminders_livestock_id_livestock_id_fk FOREIGN KEY (livestock_id) REFERENCES public.livestock(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

