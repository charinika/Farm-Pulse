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
    id integer NOT NULL,
    user_id integer NOT NULL,
    activity text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: chatbot_conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatbot_conversations (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    started_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.chatbot_conversations OWNER TO postgres;

--
-- Name: chatbot_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatbot_messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    sender character varying(20) NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.chatbot_messages OWNER TO postgres;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseases (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    symptoms text,
    prevention text
);


ALTER TABLE public.diseases OWNER TO postgres;

--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forum_posts OWNER TO postgres;

--
-- Name: forum_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_replies (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forum_replies OWNER TO postgres;

--
-- Name: health_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_records (
    id integer NOT NULL,
    livestock_id integer NOT NULL,
    condition text NOT NULL,
    treatment text,
    recorded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.health_records OWNER TO postgres;

--
-- Name: livestock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livestock (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    species character varying(100) NOT NULL,
    age integer,
    owner_id integer NOT NULL
);


ALTER TABLE public.livestock OWNER TO postgres;

--
-- Name: medicine_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicine_reminders (
    id integer NOT NULL,
    livestock_id integer NOT NULL,
    medicine text NOT NULL,
    dosage text,
    schedule timestamp with time zone NOT NULL
);


ALTER TABLE public.medicine_reminders OWNER TO postgres;

--
-- Name: reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminders (
    id integer NOT NULL,
    title text NOT NULL,
    date timestamp with time zone NOT NULL,
    note text,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reminders OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vaccination_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaccination_reminders (
    id integer NOT NULL,
    livestock_id integer NOT NULL,
    vaccine text NOT NULL,
    schedule timestamp with time zone NOT NULL
);


ALTER TABLE public.vaccination_reminders OWNER TO postgres;

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, activity, "timestamp") FROM stdin;
\.


--
-- Data for Name: chatbot_conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatbot_conversations (id, user_id, started_at) FROM stdin;
\.


--
-- Data for Name: chatbot_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatbot_messages (id, conversation_id, sender, message, sent_at) FROM stdin;
\.


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseases (id, name, symptoms, prevention) FROM stdin;
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_posts (id, user_id, title, content, created_at) FROM stdin;
\.


--
-- Data for Name: forum_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_replies (id, post_id, user_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: health_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.health_records (id, livestock_id, condition, treatment, recorded_at) FROM stdin;
\.


--
-- Data for Name: livestock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livestock (id, name, species, age, owner_id) FROM stdin;
\.


--
-- Data for Name: medicine_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicine_reminders (id, livestock_id, medicine, dosage, schedule) FROM stdin;
\.


--
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminders (id, title, date, note, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password) FROM stdin;
1	praveena	$2b$10$JB/CWlikp5JbtoWPFuF41.jOWTNv0kMdPOgONhNli7I7/HLhmGCia
2	rithik	$2b$10$TL4Bsq20HY0WUESquN662uGMZGsn3gqjExuAHrNhE2JP8/bh2Cse2
\.


--
-- Data for Name: vaccination_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaccination_reminders (id, livestock_id, vaccine, schedule) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


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
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


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
-- Name: chatbot_messages chatbot_messages_conversation_id_chatbot_conversations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_messages
    ADD CONSTRAINT chatbot_messages_conversation_id_chatbot_conversations_id_fk FOREIGN KEY (conversation_id) REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE;


--
-- Name: forum_replies forum_replies_post_id_forum_posts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_post_id_forum_posts_id_fk FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;


--
-- Name: health_records health_records_livestock_id_livestock_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_records
    ADD CONSTRAINT health_records_livestock_id_livestock_id_fk FOREIGN KEY (livestock_id) REFERENCES public.livestock(id) ON DELETE CASCADE;


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

