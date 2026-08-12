--
-- PostgreSQL database dump
--

\restrict y0O4iJuQzQDjkCnkX4gp90DgxBNplIIoiUyQsMMPRlu8UeZPciOBtdciCHYhMDF

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_log (
    id integer NOT NULL,
    ts timestamp with time zone DEFAULT now(),
    student_id character varying(20),
    action character varying(50) NOT NULL,
    detail text,
    ip character varying(45),
    status character varying(20) DEFAULT 'ok'::character varying
);


ALTER TABLE public.activity_log OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_log_id_seq OWNER TO postgres;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: biasiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biasiswa (
    id_biasiswa character varying(10) NOT NULL,
    nama_biasiswa character varying(200),
    penganjur character varying(150),
    kategori character varying(50),
    peringkat_pengajian character varying(200),
    gp_syarat numeric(4,2),
    cgpa_pajsk_syarat numeric(4,2),
    syarat_bumiputera character varying(100),
    kategori_pendapatan_layak character varying(50),
    bidang_pengajian text,
    kod_holland_sesuai character varying(300),
    tajaan_penuh character varying(300),
    url_permohonan text,
    ipt_kategori character varying(200),
    ipt_senarai text,
    min_a integer DEFAULT 0,
    syarat_tambahan text
);


ALTER TABLE public.biasiswa OWNER TO postgres;

--
-- Name: biasiswa_ipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biasiswa_ipt (
    id integer NOT NULL,
    id_biasiswa character varying(20) NOT NULL,
    id_ipt integer NOT NULL
);


ALTER TABLE public.biasiswa_ipt OWNER TO postgres;

--
-- Name: biasiswa_ipt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.biasiswa_ipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biasiswa_ipt_id_seq OWNER TO postgres;

--
-- Name: biasiswa_ipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.biasiswa_ipt_id_seq OWNED BY public.biasiswa_ipt.id;


--
-- Name: biasiswa_kursus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biasiswa_kursus (
    id integer NOT NULL,
    id_biasiswa character varying(20) NOT NULL,
    id_kursus integer NOT NULL
);


ALTER TABLE public.biasiswa_kursus OWNER TO postgres;

--
-- Name: biasiswa_kursus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.biasiswa_kursus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biasiswa_kursus_id_seq OWNER TO postgres;

--
-- Name: biasiswa_kursus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.biasiswa_kursus_id_seq OWNED BY public.biasiswa_kursus.id;


--
-- Name: dokumen_rujukan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dokumen_rujukan (
    id_dokumen integer NOT NULL,
    kod character varying(20) NOT NULL,
    nama_dokumen character varying(255) NOT NULL,
    penganjur character varying(100),
    kategori character varying(50),
    kandungan text NOT NULL,
    tarikh_kemaskini date DEFAULT CURRENT_DATE
);


ALTER TABLE public.dokumen_rujukan OWNER TO postgres;

--
-- Name: dokumen_rujukan_id_dokumen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dokumen_rujukan_id_dokumen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dokumen_rujukan_id_dokumen_seq OWNER TO postgres;

--
-- Name: dokumen_rujukan_id_dokumen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dokumen_rujukan_id_dokumen_seq OWNED BY public.dokumen_rujukan.id_dokumen;


--
-- Name: imk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imk (
    id character varying(15) NOT NULL,
    r_realistik integer,
    i_investigatif integer,
    a_artistik integer,
    s_sosial integer,
    e_enterprising integer,
    k_konvensional integer,
    jumlah integer,
    kod_holland character varying(10),
    tafsiran_utama text,
    bidang_1 character varying(50),
    bidang_2 character varying(50),
    bidang_3 character varying(50),
    cadangan_kerjaya character varying(150)
);


ALTER TABLE public.imk OWNER TO postgres;

--
-- Name: ipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ipt (
    id integer NOT NULL,
    kategori character varying(100) NOT NULL,
    nama character varying(150) NOT NULL,
    nama_penuh character varying(200)
);


ALTER TABLE public.ipt OWNER TO postgres;

--
-- Name: ipt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ipt_id_seq OWNER TO postgres;

--
-- Name: ipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ipt_id_seq OWNED BY public.ipt.id;


--
-- Name: keputusan_spm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keputusan_spm (
    id character varying(15) NOT NULL,
    password character varying(50),
    bm character varying(3),
    bi character varying(3),
    mm character varying(3),
    sej character varying(3),
    pai character varying(3),
    mt character varying(3),
    bckom character varying(3),
    fizik character varying(3),
    kimia character varying(3),
    bio character varying(3),
    gp numeric(4,2),
    ringkasan_gred character varying(100)
);


ALTER TABLE public.keputusan_spm OWNER TO postgres;

--
-- Name: kursus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kursus (
    id integer NOT NULL,
    kod character varying(20) NOT NULL,
    nama character varying(200) NOT NULL,
    bidang character varying(100),
    holland character varying(20)
);


ALTER TABLE public.kursus OWNER TO postgres;

--
-- Name: kursus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kursus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kursus_id_seq OWNER TO postgres;

--
-- Name: kursus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kursus_id_seq OWNED BY public.kursus.id;


--
-- Name: murid_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.murid_status (
    id character varying(20) NOT NULL,
    status character varying(30) DEFAULT 'belum_update'::character varying NOT NULL,
    ipt_id integer,
    bidang character varying(200),
    dapat_biasiswa boolean DEFAULT false,
    nama_biasiswa character varying(200),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.murid_status OWNER TO postgres;

--
-- Name: pajsk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pajsk (
    id character varying(15) NOT NULL,
    jenis_sukan character varying(100),
    jawatan_sukan character varying(100),
    peringkat_sukan character varying(100),
    nama_kelab character varying(150),
    jawatan_kelab character varying(100),
    peringkat_kelab character varying(100),
    nama_badan character varying(150),
    jawatan_bb character varying(100),
    peringkat_bb character varying(100),
    komitmen text,
    khidmat_sumbangan text,
    kehadiran character varying(50),
    tahap_pencapaian character varying(100),
    penyertaan integer,
    prestasi integer,
    tingkatan_1 character varying(50),
    tingkatan_2 character varying(50),
    tingkatan_3 character varying(50),
    tingkatan_4 character varying(50),
    tingkatan_5 character varying(50),
    tingkatan_empat character varying(50),
    gpa_cgpa character varying(50),
    gred_10_peratus character varying(50),
    markah integer,
    peratus numeric(5,2),
    perkhidmatan text,
    anugerah_khas text,
    khidmat_masyarakat text,
    program_nilam character varying(100),
    tims_pisa character varying(50),
    catatan text
);


ALTER TABLE public.pajsk OWNER TO postgres;

--
-- Name: pelajar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pelajar (
    id character varying(15) NOT NULL,
    nama character varying(150) NOT NULL,
    jantina character(1)
);


ALTER TABLE public.pelajar OWNER TO postgres;

--
-- Name: pendapatan_penjaga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pendapatan_penjaga (
    id character varying(15) NOT NULL,
    jumlah_pendapatan numeric(10,2),
    kategori_pendapatan character varying(10)
);


ALTER TABLE public.pendapatan_penjaga OWNER TO postgres;

--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: biasiswa_ipt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_ipt ALTER COLUMN id SET DEFAULT nextval('public.biasiswa_ipt_id_seq'::regclass);


--
-- Name: biasiswa_kursus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_kursus ALTER COLUMN id SET DEFAULT nextval('public.biasiswa_kursus_id_seq'::regclass);


--
-- Name: dokumen_rujukan id_dokumen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dokumen_rujukan ALTER COLUMN id_dokumen SET DEFAULT nextval('public.dokumen_rujukan_id_dokumen_seq'::regclass);


--
-- Name: ipt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ipt ALTER COLUMN id SET DEFAULT nextval('public.ipt_id_seq'::regclass);


--
-- Name: kursus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kursus ALTER COLUMN id SET DEFAULT nextval('public.kursus_id_seq'::regclass);


--
-- Data for Name: activity_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_log (id, ts, student_id, action, detail, ip, status) FROM stdin;
1	2026-07-14 16:21:15.956875+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
2	2026-07-14 16:21:24.872838+05:30	SBP5IK001	SPM_SUBMIT	1 subjek, GP=3	::1	ok
3	2026-07-14 16:21:24.929718+05:30	SBP5IK001	MATCH_START	\N	::1	ok
4	2026-07-14 16:21:34.028937+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
5	2026-07-14 16:21:35.429973+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
6	2026-07-14 16:48:14.44184+05:30	\N	IPT_SEARCH	IPT: Politeknik	::1	ok
7	2026-07-14 16:49:32.971318+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
8	2026-07-14 16:49:41.067307+05:30	SBP5IK001	SPM_SUBMIT	1 subjek, GP=0	::1	ok
9	2026-07-14 16:49:41.114827+05:30	SBP5IK001	MATCH_START	\N	::1	ok
10	2026-07-14 16:49:50.216374+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
11	2026-07-14 16:49:51.763252+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
12	2026-07-14 16:50:04.464241+05:30	SBP5IK001	IPT_SEARCH	IPT: Universiti Awam	::1	ok
13	2026-07-15 15:21:43.540366+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
14	2026-07-15 15:22:42.306053+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2	::1	ok
15	2026-07-15 15:22:42.309269+05:30	SBP5IK001	MATCH_START	\N	::1	ok
16	2026-07-15 15:22:42.615554+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
17	2026-07-15 15:22:43.845901+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
18	2026-07-15 15:23:48.668419+05:30	SBP5IK001	STATUS_UPDATE	sambung_belajar | IPT:16	::1	ok
19	2026-07-15 15:23:48.681402+05:30	SBP5IK001	IPT_SEARCH	IPT: Politeknik	::1	ok
20	2026-07-15 15:35:20.31344+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
21	2026-07-15 15:35:27.948766+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2	::1	ok
22	2026-07-15 15:35:27.996688+05:30	SBP5IK001	MATCH_START	\N	::1	ok
23	2026-07-15 15:35:28.298678+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
24	2026-07-15 15:35:29.488944+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
25	2026-07-15 15:35:57.65807+05:30	SBP5IK001	STATUS_UPDATE	bekerja	::1	ok
26	2026-07-15 16:21:47.290499+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
27	2026-07-15 16:22:29.38439+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=Kejuruteraan Elektrik	::1	ok
28	2026-07-15 16:22:29.38797+05:30	SBP5IK001	MATCH_START	\N	::1	ok
29	2026-07-15 16:22:29.645747+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
30	2026-07-15 16:22:30.856566+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
31	2026-07-15 16:23:17.85442+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
32	2026-07-15 16:23:46.491368+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=mekanikal	::1	ok
33	2026-07-15 16:34:01.9028+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
34	2026-07-15 16:34:22.251494+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=mekanikal	::1	ok
35	2026-07-15 16:34:48.804855+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
36	2026-07-15 16:35:19.716358+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=elektrik	::1	ok
37	2026-07-16 04:28:32.453442+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
38	2026-07-16 04:29:08.950396+05:30	SBP5IK001	MATCH_START	\N	::1	ok
39	2026-07-16 04:29:09.048884+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=mekanikal	::1	ok
40	2026-07-16 04:29:09.315597+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
41	2026-07-16 04:29:10.453169+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
42	2026-07-16 04:43:29.365649+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
43	2026-07-16 04:43:46.95102+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=mekanikal	::1	ok
44	2026-07-16 04:43:46.953868+05:30	SBP5IK001	MATCH_START	\N	::1	ok
45	2026-07-16 04:43:47.206203+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
46	2026-07-16 04:43:48.448035+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
47	2026-07-16 05:02:39.627139+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
48	2026-07-16 05:03:47.674989+05:30	SBP5IK001	MATCH_START	\N	::1	ok
49	2026-07-16 05:03:47.768757+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=mekanikal, ipt=Universiti Swasta/Sunway	::1	ok
50	2026-07-16 05:03:47.93451+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
51	2026-07-16 05:03:49.159126+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
52	2026-07-16 05:08:20.645608+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
53	2026-07-16 19:53:44.881954+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
54	2026-07-16 20:02:09.368857+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=elektrik, ipt=Institut Kemahiran/GiatMARA KL	::1	ok
55	2026-07-16 20:02:09.374981+05:30	SBP5IK001	MATCH_START	\N	::1	ok
56	2026-07-16 20:02:09.998083+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
57	2026-07-16 20:02:10.876203+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
58	2026-07-17 01:36:51.363367+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
59	2026-07-17 01:42:16.70531+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
60	2026-07-17 06:15:45.204789+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
61	2026-07-17 06:16:49.878387+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
62	2026-07-17 06:16:49.881884+05:30	SBP5IK001	MATCH_START	\N	::1	ok
63	2026-07-17 06:16:50.965086+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
64	2026-07-17 06:16:51.383022+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
65	2026-07-17 06:20:28.102459+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
66	2026-07-17 06:21:19.559995+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=Institut Kemahiran/GiatMARA KL	::1	ok
67	2026-07-17 06:24:09.384297+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
68	2026-07-17 06:24:22.248267+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
69	2026-07-17 06:25:10.982486+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
70	2026-07-17 06:25:40.063198+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
71	2026-07-17 06:29:52.715383+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
72	2026-07-17 06:30:01.459311+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
73	2026-07-17 06:30:22.021189+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
74	2026-07-17 06:30:36.633931+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
75	2026-07-17 06:30:43.821574+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
76	2026-07-17 06:30:56.579939+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
77	2026-07-17 06:31:16.158037+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
78	2026-07-17 06:35:22.195146+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
79	2026-07-17 06:35:31.105195+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
80	2026-07-17 06:38:09.654937+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
81	2026-07-17 06:38:16.312994+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
82	2026-07-17 06:42:41.773278+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
83	2026-07-17 06:42:47.774063+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
84	2026-07-17 06:43:08.131575+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=elektronik, ipt=—/—	::1	ok
85	2026-07-17 06:43:13.395229+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
86	2026-07-17 06:49:29.790243+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
87	2026-07-17 06:49:38.788114+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
88	2026-07-17 06:51:50.885631+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
89	2026-07-17 06:51:56.324103+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
90	2026-07-17 06:51:56.359006+05:30	SBP5IK001	MATCH_START	\N	::1	ok
91	2026-07-17 06:51:58.503354+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
92	2026-07-17 06:51:59.355447+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
93	2026-07-17 06:53:33.239571+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
94	2026-07-17 06:53:33.241044+05:30	SBP5IK001	MATCH_START	\N	::1	ok
95	2026-07-17 06:53:35.553372+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
96	2026-07-17 06:57:40.942867+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
97	2026-07-17 06:57:49.832955+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=elektronik, ipt=—/—	::1	ok
98	2026-07-17 06:57:49.869882+05:30	SBP5IK001	MATCH_START	\N	::1	ok
99	2026-07-17 06:57:52.145575+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
100	2026-07-17 08:48:29.619776+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
101	2026-07-17 08:56:59.292116+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
102	2026-07-17 09:48:46.07575+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
103	2026-07-17 09:48:46.076773+05:30	SBP5IK001	MATCH_START	\N	::1	ok
104	2026-07-17 09:48:48.137768+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
105	2026-07-17 09:48:49.088825+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
106	2026-07-17 16:45:58.442753+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
107	2026-07-17 16:55:32.018261+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
108	2026-07-20 07:00:24.733792+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
109	2026-07-20 07:03:02.500991+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
110	2026-07-20 07:09:30.068053+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
111	2026-07-20 07:15:26.980503+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
112	2026-07-20 10:38:37.131958+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
113	2026-07-20 10:40:08.481418+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mechanical, ipt=Matrikulasi/KM Melaka	::1	ok
114	2026-07-20 10:40:08.482629+05:30	SBP5IK001	MATCH_START	\N	::1	ok
115	2026-07-20 10:40:09.890077+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
116	2026-07-20 10:40:09.976113+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
117	2026-07-20 16:15:49.462268+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
118	2026-07-20 16:16:14.576643+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
119	2026-07-20 16:16:14.578974+05:30	SBP5IK001	MATCH_START	\N	::1	ok
120	2026-07-20 16:16:16.717864+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
121	2026-07-20 16:16:17.571773+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
122	2026-07-20 16:16:34.322503+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
123	2026-07-20 16:16:34.327651+05:30	SBP5IK001	MATCH_START	\N	::1	ok
124	2026-07-20 16:16:36.602168+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
125	2026-07-20 16:17:13.295752+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=elektronik, ipt=Institut Kemahiran/GiatMARA KL	::1	ok
126	2026-07-20 16:17:13.297057+05:30	SBP5IK001	MATCH_START	\N	::1	ok
127	2026-07-20 16:17:14.381227+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
128	2026-07-20 19:43:06.938697+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
129	2026-07-20 20:43:35.021381+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
130	2026-07-20 20:44:30.517948+05:30	SBP5IK001	OCR_ERROR	The model `llama-3.2-11b-vision-preview` has been decommissioned and is no longer supported. Please refer to https://console.groq.com/docs/deprecations for a recommendation on which model to use instead.	::ffff:127.0.0.1	fail
131	2026-07-20 20:44:43.831253+05:30	SBP5IK001	OCR_ERROR	The model `llama-3.2-11b-vision-preview` has been decommissioned and is no longer supported. Please refer to https://console.groq.com/docs/deprecations for a recommendation on which model to use instead.	::ffff:127.0.0.1	fail
132	2026-07-20 20:47:25.601396+05:30	SBP5IK001	OCR_ERROR	The model `llama-3.2-11b-vision-preview` has been decommissioned and is no longer supported. Please refer to https://console.groq.com/docs/deprecations for a recommendation on which model to use instead.	::ffff:127.0.0.1	fail
133	2026-07-20 20:51:28.049444+05:30	SBP5IK001	OCR_ERROR	The model `llama-3.2-11b-vision-preview` has been decommissioned and is no longer supported. Please refer to https://console.groq.com/docs/deprecations for a recommendation on which model to use instead.	::ffff:127.0.0.1	fail
134	2026-07-20 20:51:36.001755+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
135	2026-07-20 20:51:41.944498+05:30	SBP5IK001	OCR_ERROR	The model `llama-3.2-11b-vision-preview` has been decommissioned and is no longer supported. Please refer to https://console.groq.com/docs/deprecations for a recommendation on which model to use instead.	::ffff:127.0.0.1	fail
136	2026-07-20 20:52:53.348913+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
137	2026-07-20 20:52:59.10238+05:30	SBP5IK001	OCR_ERROR	The model `meta-llama/llama-4-scout-17b-16e-instruct` does not exist or you do not have access to it.	::ffff:127.0.0.1	fail
138	2026-07-20 20:53:24.995147+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
139	2026-07-20 20:53:31.159307+05:30	SBP5IK001	OCR_ERROR	The model `meta-llama/llama-4-scout-17b-16e-instruct` does not exist or you do not have access to it.	::ffff:127.0.0.1	fail
140	2026-07-20 20:59:42.178512+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
141	2026-07-20 21:01:06.8688+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
142	2026-07-20 21:01:14.629681+05:30	SBP5IK001	OCR_ERROR	You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\nPlease retry in 44.609233439s.	::ffff:127.0.0.1	fail
297	2026-07-27 04:55:11.050617+05:30	SBP5IK010	MATCH_START	\N	::1	ok
143	2026-07-20 21:02:58.923628+05:30	SBP5IK001	OCR_ERROR	You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 348.498066ms.	::ffff:127.0.0.1	fail
144	2026-07-20 21:04:20.229712+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::ffff:127.0.0.1	ok
145	2026-07-20 21:04:27.506742+05:30	SBP5IK001	OCR_ERROR	models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.	::ffff:127.0.0.1	fail
146	2026-07-20 21:05:35.189248+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
147	2026-07-20 21:05:58.995058+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
148	2026-07-20 21:05:58.99579+05:30	SBP5IK001	MATCH_START	\N	::1	ok
149	2026-07-20 21:06:01.707204+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
150	2026-07-20 21:06:01.983536+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
151	2026-07-20 21:06:18.961309+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=ict, ipt=Universiti Awam/UKM	::1	ok
152	2026-07-20 21:06:18.961609+05:30	SBP5IK001	MATCH_START	\N	::1	ok
153	2026-07-20 21:06:20.187677+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
154	2026-07-20 21:07:23.77253+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
155	2026-07-20 21:08:37.155738+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=—, ipt=—/—	::1	ok
156	2026-07-20 21:08:37.157799+05:30	SBP5IK027	MATCH_START	\N	::1	ok
157	2026-07-20 21:08:39.390533+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
158	2026-07-20 21:08:40.151082+05:30	SBP5IK027	REPORT_REQUEST	\N	::1	ok
159	2026-07-20 23:35:10.053335+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=—, ipt=—/—	::1	ok
160	2026-07-20 23:35:10.053251+05:30	SBP5IK027	MATCH_START	\N	::1	ok
161	2026-07-20 23:35:13.449906+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
162	2026-07-21 05:54:11.669055+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
163	2026-07-21 05:57:11.975808+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=—, ipt=—/—	::1	ok
164	2026-07-21 05:57:12.080649+05:30	SBP5IK027	MATCH_START	\N	::1	ok
165	2026-07-21 05:57:14.266157+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
166	2026-07-21 05:57:14.954556+05:30	SBP5IK027	REPORT_REQUEST	\N	::1	ok
167	2026-07-21 05:57:34.641325+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=mekanikal, ipt=—/—	::1	ok
168	2026-07-21 05:57:34.644511+05:30	SBP5IK027	MATCH_START	\N	::1	ok
169	2026-07-21 05:57:36.952378+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
170	2026-07-21 05:57:57.62347+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=bahasa melayu, ipt=IPG/IPG Kampus Bahasa Melayu	::1	ok
171	2026-07-21 05:57:57.627101+05:30	SBP5IK027	MATCH_START	\N	::1	ok
172	2026-07-21 05:57:58.580301+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
173	2026-07-21 06:00:42.912143+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
174	2026-07-21 06:01:02.559172+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=bahasa melayu, ipt=IPG/IPG Kampus Bahasa Melayu	::1	ok
175	2026-07-21 06:01:02.56163+05:30	SBP5IK027	MATCH_START	\N	::1	ok
176	2026-07-21 06:01:03.427588+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
177	2026-07-21 06:01:09.759628+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=bahasa melayu, ipt=IPG/IPG Kampus Bahasa Melayu	::1	ok
178	2026-07-21 06:01:09.75975+05:30	SBP5IK027	MATCH_START	\N	::1	ok
179	2026-07-21 06:01:10.637222+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
180	2026-07-21 06:01:18.216716+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=bahasa melayu, ipt=IPG/IPG Kampus Bahasa Melayu	::1	ok
181	2026-07-21 06:01:18.216746+05:30	SBP5IK027	MATCH_START	\N	::1	ok
182	2026-07-21 06:01:19.193797+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
183	2026-07-21 06:01:28.631781+05:30	SBP5IK027	SPM_SUBMIT	8 subjek, GP=4, bidang=—, kos=—, ipt=—/—	::1	ok
184	2026-07-21 06:01:28.666999+05:30	SBP5IK027	MATCH_START	\N	::1	ok
185	2026-07-21 06:01:30.683524+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
186	2026-07-21 06:01:53.68689+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
187	2026-07-21 06:02:13.820753+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=ict, ipt=Kolej Komuniti/KK Kuala Langat	::1	ok
188	2026-07-21 06:02:13.822431+05:30	SBP5IK001	MATCH_START	\N	::1	ok
189	2026-07-21 06:02:14.828711+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
190	2026-07-21 06:02:15.308267+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
191	2026-07-21 19:16:48.852539+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
192	2026-07-21 19:24:10.239329+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=—, ipt=—/—	::1	ok
193	2026-07-21 19:24:10.241208+05:30	SBP5IK001	MATCH_START	\N	::1	ok
194	2026-07-21 19:24:12.520605+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
195	2026-07-21 19:24:56.475998+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=mechanical, ipt=—/—	::1	ok
196	2026-07-21 19:24:56.477391+05:30	SBP5IK001	MATCH_START	\N	::1	ok
197	2026-07-21 19:24:58.880859+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
198	2026-07-21 19:25:36.482565+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=2, bidang=—, kos=ict, ipt=Universiti Awam/UiTM	::1	ok
199	2026-07-21 19:25:36.488314+05:30	SBP5IK001	MATCH_START	\N	::1	ok
200	2026-07-21 19:25:37.750581+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
201	2026-07-22 06:52:20.239364+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
202	2026-07-22 06:53:32.297902+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
203	2026-07-22 06:56:33.68875+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=2.8, bidang=—, kos=—, ipt=—/—	::1	ok
204	2026-07-22 06:56:33.692629+05:30	SBP5IK001	MATCH_START	\N	::1	ok
205	2026-07-22 06:56:35.889875+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
206	2026-07-22 06:57:14.9205+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=2.8, bidang=—, kos=ict, ipt=Kolej Komuniti/KK Hulu Langat	::1	ok
207	2026-07-22 06:57:14.924445+05:30	SBP5IK001	MATCH_START	\N	::1	ok
208	2026-07-22 06:57:15.863312+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
209	2026-07-22 06:57:33.608084+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
210	2026-07-22 06:57:46.751637+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=2.8, bidang=—, kos=ict, ipt=Kolej Komuniti/KK Banting	::1	ok
211	2026-07-22 06:57:46.756876+05:30	SBP5IK001	MATCH_START	\N	::1	ok
212	2026-07-22 06:57:47.692823+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
213	2026-07-22 06:58:03.597632+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=2.8, bidang=—, kos=electronics, ipt=Kolej Komuniti/KK Banting	::1	ok
214	2026-07-22 06:58:03.599914+05:30	SBP5IK001	MATCH_START	\N	::1	ok
215	2026-07-22 06:58:04.663448+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
216	2026-07-22 06:58:23.446339+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=2.8, bidang=—, kos=mekanikal, ipt=Universiti Awam/UiTM	::1	ok
217	2026-07-22 06:58:23.449468+05:30	SBP5IK001	MATCH_START	\N	::1	ok
218	2026-07-22 06:58:24.306874+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
219	2026-07-22 07:33:32.943433+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
220	2026-07-22 07:52:08.559292+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=IT, ipt=—/—	::1	ok
221	2026-07-22 07:52:08.5682+05:30	SBP5IK001	MATCH_START	\N	::1	ok
222	2026-07-22 07:52:11.091405+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
223	2026-07-22 07:52:19.988818+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=—, ipt=—/—	::1	ok
224	2026-07-22 07:52:20.030923+05:30	SBP5IK001	MATCH_START	\N	::1	ok
225	2026-07-22 07:52:22.092537+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
226	2026-07-22 07:53:00.001261+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=elektronik, ipt=Kolej Komuniti/KK Hulu Langat	::1	ok
227	2026-07-22 07:53:00.006977+05:30	SBP5IK001	MATCH_START	\N	::1	ok
228	2026-07-22 07:53:01.182125+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
229	2026-07-22 07:53:20.590667+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
230	2026-07-22 07:53:33.698743+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=elektronik, ipt=Kolej Komuniti/KK Banting	::1	ok
231	2026-07-22 07:53:33.702104+05:30	SBP5IK001	MATCH_START	\N	::1	ok
232	2026-07-22 07:53:34.697152+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
233	2026-07-22 07:53:51.162665+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=ict, ipt=Kolej Komuniti/KK Banting	::1	ok
234	2026-07-22 07:53:51.163362+05:30	SBP5IK001	MATCH_START	\N	::1	ok
235	2026-07-22 07:53:52.137495+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
236	2026-07-22 07:54:07.277375+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
237	2026-07-22 07:54:23.576302+05:30	SBP5IK001	SPM_SUBMIT	8 subjek, GP=3.75, bidang=—, kos=mekanikal, ipt=Institut Kemahiran/IKBN Dusun Tua	::1	ok
238	2026-07-22 07:54:23.578803+05:30	SBP5IK001	MATCH_START	\N	::1	ok
239	2026-07-22 07:54:24.765472+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
240	2026-07-22 09:47:21.714497+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
241	2026-07-22 09:50:14.633437+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=ict, ipt=Kolej Komuniti/KK Banting	::1	ok
242	2026-07-22 09:50:14.638737+05:30	SBP5IK001	MATCH_START	\N	::1	ok
243	2026-07-22 09:50:16.161846+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
244	2026-07-22 09:50:28.451113+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=mekanikal, ipt=Kolej Komuniti/KK Banting	::1	ok
245	2026-07-22 09:50:28.462791+05:30	SBP5IK001	MATCH_START	\N	::1	ok
246	2026-07-22 09:50:29.957972+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
247	2026-07-22 09:50:38.988021+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
248	2026-07-22 09:51:00.328807+05:30	SBP5IK001	MATCH_START	\N	::1	ok
249	2026-07-22 09:51:00.329324+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=elektronic, ipt=Politeknik/Politeknik Muadzam Shah	::1	ok
250	2026-07-22 09:51:01.943892+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
251	2026-07-22 09:51:17.38779+05:30	SBP5IK001	MATCH_START	\N	::1	ok
252	2026-07-22 09:51:17.420844+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=elektronic, ipt=Institut Kemahiran/IKBN Dusun Tua	::1	ok
253	2026-07-22 09:51:18.348057+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=elektronic, ipt=Institut Kemahiran/IKBN Dusun Tua	::1	ok
254	2026-07-22 09:51:18.862453+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
255	2026-07-22 09:52:13.846983+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
256	2026-07-22 09:52:31.323968+05:30	SBP5IK001	SPM_SUBMIT	5 subjek, GP=4.4, bidang=—, kos=ict, ipt=Universiti Awam/UiTM	::1	ok
257	2026-07-22 09:52:31.329718+05:30	SBP5IK001	MATCH_START	\N	::1	ok
258	2026-07-22 09:52:32.916546+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
259	2026-07-24 14:40:37.779429+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
260	2026-07-24 14:42:28.446761+05:30	SBP5IK001	SPM_SUBMIT	10 subjek, GP=0.7, bidang=—, kos=mechanical, ipt=Universiti Awam/UKM	::1	ok
261	2026-07-24 14:42:28.453697+05:30	SBP5IK001	MATCH_START	\N	::1	ok
262	2026-07-24 14:42:30.759072+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
263	2026-07-24 14:42:31.454307+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
264	2026-07-24 23:51:54.19884+05:30	SBP5IK001	LOGIN_SUCCESS	AHMAD FARIS BIN MOHD AZRI	::1	ok
265	2026-07-24 23:52:04.263612+05:30	SBP5IK001	MATCH_START	\N	::1	ok
266	2026-07-24 23:52:04.263292+05:30	SBP5IK001	SPM_SUBMIT	10 subjek, GP=0.7, bidang=—, kos=—, ipt=—/—	::1	ok
267	2026-07-24 23:52:06.903288+05:30	SBP5IK001	MATCH_DONE	tiada padanan	\N	ok
268	2026-07-24 23:52:07.283987+05:30	SBP5IK001	REPORT_REQUEST	\N	::1	ok
269	2026-07-24 23:52:28.714952+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
270	2026-07-24 23:53:55.663877+05:30	SBP5IK027	SPM_SUBMIT	10 subjek, GP=0.2, bidang=—, kos=kejuruteraan, ipt=—/—	::1	ok
271	2026-07-24 23:53:55.666254+05:30	SBP5IK027	MATCH_START	\N	::1	ok
272	2026-07-24 23:53:58.2833+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
273	2026-07-24 23:53:58.669472+05:30	SBP5IK027	REPORT_REQUEST	\N	::1	ok
274	2026-07-24 23:59:37.028542+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
275	2026-07-24 23:59:51.172913+05:30	SBP5IK027	SPM_SUBMIT	10 subjek, GP=0.2, bidang=—, kos=kejuruteraan, ipt=—/—	::1	ok
276	2026-07-24 23:59:51.173857+05:30	SBP5IK027	MATCH_START	\N	::1	ok
277	2026-07-24 23:59:53.7493+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
278	2026-07-24 23:59:54.18054+05:30	SBP5IK027	REPORT_REQUEST	\N	::1	ok
279	2026-07-25 00:00:42.367677+05:30	SBP5IK027	SPM_SUBMIT	10 subjek, GP=0.2, bidang=—, kos=—, ipt=—/—	::1	ok
280	2026-07-25 00:00:42.37149+05:30	SBP5IK027	MATCH_START	\N	::1	ok
281	2026-07-25 00:00:44.996617+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
282	2026-07-27 04:22:11.020787+05:30	SBP5IK027	LOGIN_SUCCESS	SITI NURFATIN BINTI MOHD HELMI	::1	ok
283	2026-07-27 04:22:39.415719+05:30	SBP5IK027	SPM_SUBMIT	10 subjek, GP=0.2, bidang=—, kos=—, ipt=—/—	::1	ok
284	2026-07-27 04:22:39.420529+05:30	SBP5IK027	MATCH_START	\N	::1	ok
285	2026-07-27 04:22:42.102322+05:30	SBP5IK027	MATCH_DONE	tiada padanan	\N	ok
286	2026-07-27 04:22:42.423562+05:30	SBP5IK027	REPORT_REQUEST	\N	::1	ok
287	2026-07-27 04:34:54.775104+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
288	2026-07-27 04:36:58.189647+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=—, ipt=—/—	::1	ok
289	2026-07-27 04:36:58.193345+05:30	SBP5IK010	MATCH_START	\N	::1	ok
290	2026-07-27 04:37:00.770016+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
291	2026-07-27 04:37:01.170537+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
292	2026-07-27 04:51:06.302036+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
293	2026-07-27 04:51:15.235092+05:30	SBP5IK010	MATCH_START	\N	::1	ok
294	2026-07-27 04:51:15.234971+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=—, ipt=—/—	::1	ok
295	2026-07-27 04:51:17.600074+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
296	2026-07-27 04:54:59.763225+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
298	2026-07-27 04:55:11.050384+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=—, ipt=—/—	::1	ok
299	2026-07-27 04:55:13.318229+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
300	2026-07-27 05:33:16.451366+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
302	2026-07-27 05:33:23.142465+05:30	SBP5IK010	MATCH_START	\N	::1	ok
301	2026-07-27 05:33:23.142065+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=—, ipt=—/—	::1	ok
303	2026-07-27 05:33:25.602315+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
304	2026-07-27 05:33:26.173214+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
305	2026-07-27 05:34:08.881491+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=kejuruteraan, ipt=Institut Kemahiran/GiatMARA KL	::1	ok
306	2026-07-27 05:34:08.887051+05:30	SBP5IK010	MATCH_START	\N	::1	ok
307	2026-07-27 05:34:10.122923+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
308	2026-07-27 05:34:10.390702+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
309	2026-07-27 05:34:32.639666+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
310	2026-07-27 05:34:39.084149+05:30	SBP5IK010	MATCH_START	\N	::1	ok
311	2026-07-27 05:34:39.083573+05:30	SBP5IK010	SPM_SUBMIT	10 subjek, GP=0.8, bidang=—, kos=—, ipt=—/—	::1	ok
312	2026-07-27 05:34:41.879189+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
313	2026-07-27 05:34:42.139522+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
314	2026-07-27 07:06:31.981107+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
315	2026-07-27 07:07:20.875824+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
316	2026-07-27 07:07:20.875932+05:30	SBP5IK010	MATCH_START	\N	::1	ok
317	2026-07-27 07:07:23.575779+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
318	2026-07-27 07:07:23.902017+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
319	2026-07-27 09:00:16.446505+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
320	2026-07-27 09:00:44.502148+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
321	2026-07-27 09:00:44.502532+05:30	SBP5IK010	MATCH_START	\N	::1	ok
322	2026-07-27 09:00:47.274576+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
323	2026-07-27 09:00:47.567651+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
324	2026-07-27 09:05:16.095545+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
325	2026-07-27 09:05:23.865991+05:30	SBP5IK010	MATCH_START	\N	::1	ok
326	2026-07-27 09:05:23.865646+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
327	2026-07-27 09:05:26.317012+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
328	2026-07-27 09:05:26.897121+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
329	2026-07-27 14:35:04.543048+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
330	2026-07-27 14:48:07.475049+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=engineering, ipt=Universiti Luar Negara/Carl Duisberg	::1	ok
331	2026-07-27 14:48:07.481339+05:30	SBP5IK010	MATCH_START	\N	::1	ok
332	2026-07-27 14:48:09.53003+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
333	2026-07-27 14:48:10.473263+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
334	2026-07-27 15:08:42.598999+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
335	2026-07-27 15:15:10.894089+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
336	2026-07-27 15:29:41.852046+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
337	2026-07-27 15:29:51.484683+05:30	SBP5IK010	MATCH_START	\N	::1	ok
338	2026-07-27 15:29:51.484612+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
339	2026-07-27 15:29:54.191461+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
340	2026-07-27 15:29:54.530918+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
341	2026-07-27 16:15:28.581157+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
342	2026-07-27 16:16:21.617507+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
343	2026-07-27 16:16:44.193137+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
344	2026-07-27 16:19:29.978352+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
345	2026-07-27 16:20:54.571588+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
346	2026-07-27 16:21:33.64377+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
347	2026-07-27 16:21:33.648545+05:30	SBP5IK010	MATCH_START	\N	::1	ok
348	2026-07-27 16:21:36.118403+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
349	2026-07-27 16:21:36.641046+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
350	2026-07-27 16:30:19.046104+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
351	2026-07-27 16:30:57.725756+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
352	2026-07-27 16:31:09.597298+05:30	SBP5IK010	MATCH_START	\N	::1	ok
353	2026-07-27 16:31:09.597132+05:30	SBP5IK010	SPM_SUBMIT	8 subjek, GP=0.5, bidang=—, kos=—, ipt=—/—	::1	ok
354	2026-07-27 16:31:12.189897+05:30	SBP5IK010	MATCH_DONE	tiada padanan	\N	ok
355	2026-07-27 16:31:12.661601+05:30	SBP5IK010	REPORT_REQUEST	\N	::1	ok
356	2026-07-27 16:32:18.333025+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
357	2026-07-27 16:37:35.390082+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
358	2026-07-27 16:43:37.675514+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::ffff:10.151.40.163	ok
359	2026-07-30 09:18:37.266803+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
360	2026-07-30 09:22:11.447977+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::ffff:127.0.0.1	ok
361	2026-07-30 14:46:16.802178+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::ffff:127.0.0.1	ok
362	2026-08-11 20:25:58.102645+05:30	SBP5IK010	LOGIN_SUCCESS	MOHAMAD AIMAN BIN NORDIN	::1	ok
\.


--
-- Data for Name: biasiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.biasiswa (id_biasiswa, nama_biasiswa, penganjur, kategori, peringkat_pengajian, gp_syarat, cgpa_pajsk_syarat, syarat_bumiputera, kategori_pendapatan_layak, bidang_pengajian, kod_holland_sesuai, tajaan_penuh, url_permohonan, ipt_kategori, ipt_senarai, min_a, syarat_tambahan) FROM stdin;
BIA006	Shell Malaysia Scholarship	Shell Malaysia	Korporat	A-Level → Degree (Dalam & Luar Negara: universiti prestij)	1.22	8.00	Tidak	B40, M40, T20	Kejuruteraan / Geosains / Data Science / Pengurusan Perniagaan / Pemasaran Digital	RIE / IRE / RIA / EKS	Ya (Tajaan Penuh)	https://www.shell.com.my/careers/students-and-graduates/scholarships.html	Universiti Awam, Universiti Luar Negara	UM, UTM, UPM, UKM, UiTM, Oxford, Cambridge, Imperial College, universiti prestij pilihan luar negara	8	\N
BIA007	Khazanah Watan Scholarship Programme	Yayasan Khazanah	Korporat / GLC	Foundation / Pra-Universiti → Degree (Dalam Negara)	2.11	6.82	Ya (keutamaan)	B40, M40, T20	Semua Bidang	Semua	Ya (Tajaan Penuh)	https://apply.yayasankhazanah.com.my/Account/Login	Universiti Awam	UM, UKM, UPM, UTM, UiTM, USM, UIAM, UUM, UNIMAS, UMS, UniMAP, UPSI, UTHM, UTeM, UMT, UMK	7	\N
BIA008	Yayasan Tenaga Nasional (YTN) – TNB Prime Scholarship	Yayasan Tenaga Nasional (TNB)	Korporat / GLC	Degree (Dalam & Luar Negara)	3.11	6.82	Tidak	B40, M40, T20	Kejuruteraan Elektrik / Mekanikal / Awam / IT / Pengurusan	RIE / IRK / EKS	Ya (Tajaan Penuh)	https://ytn.tnb.com.my/	Universiti Awam, Universiti Luar Negara	UM, UTM, UPM, UKM, UiTM, USM, universiti kejuruteraan & teknologi pilihan luar negara	6	\N
BIA009	Biasiswa Yayasan Pahang	Yayasan Pahang	Kerajaan Negeri	Diploma / Degree (Dalam Negara)	9.00	0.00	Tidak (keutamaan anak Pahang)	B40	Semua Bidang	Semua	Tidak (Bantuan Kewangan Sebahagian)	https://bit.ly/Apply-YP-Scholarship	Universiti Awam, Politeknik	UM, UKM, UPM, UTM, UiTM, USM, UIAM, UUM, Politeknik Sultan Ahmad Shah, Politeknik Muadzam Shah, Politeknik dalam negara	5	\N
BIA010	Biasiswa Yayasan UEM Scholarship	Yayasan UEM	Korporat / GLC	Degree (Dalam & Luar Negara)	3.11	6.82	Tidak	B40, M40, T20	Kejuruteraan / Sains Komputer / Pengurusan Projek / Alam Sekitar	RIE / IRK / EKS	Ya (Tajaan Penuh)	https://bit.ly/Apply-UEM-Scholarship	Universiti Awam, Universiti Luar Negara	UTM, UM, UKM, UPM, UiTM, universiti kejuruteraan & pembinaan pilihan luar negara (UK/Aus/NZ)	6	\N
BIA012	Tan Sri Teh Hong Piow Legacy Scholarship	THP Foundation / Public Bank Berhad	Korporat	Ijazah Sarjana Muda	\N	\N	\N	B40, M40, T20	Semua bidang dibenarkan	Semua	Tajaan Penuh - Ada Bond (wajib kerja dengan Public Bank Group)	https://apply.pbebank.com/scholarship	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	5	\N
BIA013	YTL Cement BUILDS Scholarship Programme	YTL Cement (BUILDS)	Korporat	Ijazah Sarjana Muda	\N	\N	\N	B40, M40, T20	Bachelor of Mechanical Engineering;Bachelor of Electrical/Electronic Engineering;Bachelor of Chemical Engineering;Bachelor of Civil Engineering;Bachelor of Science (Chemistry)	RIC; RIC; IRC; RIC; IRC	Tajaan Penuh - Ada Bond (wajib kerja dengan YTL Cement)	https://sg1.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhA7eJQoFl0TlBPQ2b2NlssDOsw7FfI6HyCUKRNaQ22g99U2CVkXUt3J7VluVlXRXWE*	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	7	\N
BIA014	BNM Kijang Pre-University Scholarship	Bank Negara Malaysia	Kerajaan	Pra-Universiti	\N	\N	\N	B40, M40, T20	Economics;Accounting;Finance;Actuarial Science;Mathematics;Statistics;Data Science;Law;Computer Science	Semua	Tajaan Penuh - Ada Bond (1 tahun belajar = 2 tahun khidmat)	https://www.bnm.gov.my/careers/scholarships	Universiti Awam, Universiti Luar Negara	\N	8	\N
BIA015	BNM Kijang Undergraduate Scholarship	Bank Negara Malaysia	Kerajaan	Ijazah Sarjana Muda	\N	\N	\N	B40, M40, T20	Economics;Accounting;Finance;Actuarial Science;Mathematics;Statistics;Data Science;Law;Computer Science	Semua	Tajaan Penuh - Ada Bond (1 tahun belajar = 2 tahun khidmat)	https://www.bnm.gov.my/careers/scholarships	Universiti Awam, Universiti Luar Negara	\N	0	\N
BIA016	APU Scholarships & Merit Awards	Asia Pacific University (APU/APIIT)	Institusi Pendidikan Swasta	Foundation	\N	\N	\N	B40, M40, T20	Computing & Technology; Business, Finance & Social Sciences; Architecture & Design; Engineering (Electrical/Electronic/Mechanical/Mechatronic/Computer/Petroleum); ICT; Design & Media; Accounting; Hospitality & Tourism Management; Psychology; International Studies/International Relations	IRC; ECS; ARI; RIC; IRC; ARE; CIE; SEC; SIA; SEA	TIDAK - diskaun yuran sahaja	scholarships@apu.edu.my	Asia Pacific University (APU/APIIT)	\N	4	\N
BIA001	JPA – Program Penajaan Nasional (PPN)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Pra-Universiti → Degree (Luar Negara: USA / UK)	0.00	8.18	Tidak	B40, M40, T20	Sains & Teknologi / Kejuruteraan / Perubatan / Undang-undang / Perakaunan	IRA / IRE / ESA / EKS	Ya (Pinjaman Boleh Ubah)	https://esilav2.jpa.gov.my/online_progs/epermohonan/index.php?program=PPN	Universiti Luar Negara	Harvard, MIT, Oxford, Cambridge, Imperial College, NUS, universiti Top 50 dunia (QS Ranking)	9	\N
BIA002	JPA – Program Khas Lepasan SPM Dalam Negara (LSPM)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Pra-Universiti → Degree (Dalam Negara: UA / GLU / IPTS)	0.00	8.00	Tidak	B40, M40, T20	Semua Bidang	Semua	Ya (Pinjaman Boleh Ubah)	http://esilav2.jpa.gov.my/online_progs/epermohonan/index.php?program=KSPM	Universiti Awam, Universiti Swasta	UM, UKM, UPM, UTM, UiTM, USM, UIAM, UUM, UNIMAS, UMS, UniMAP, UPSI, UTHM, UTeM, UMT, UMK, Taylors, HELP, MMU, Sunway	7	\N
BIA003	JPA – Program Khas JPA MARA (PKJM)	JPA & MARA	Kerajaan	Pra-Universiti → Degree (Dalam & Luar Negara)	9.00	0.00	Ya (keutamaan)	B40, M40, T20	Semua Bidang	Semua	Ya (Pinjaman Boleh Ubah)	https://esilav2.jpa.gov.my/online_progs/epermohonan/index.php?program=PKJM	Universiti Awam, Universiti Luar Negara	UM, UKM, UPM, UTM, UiTM, USM, UIAM, UUM, Harvard, Oxford, Cambridge, MIT, universiti pilihan luar negara	8	\N
BIA004	MARA – Young Talent Development Programme (YTP)	MARA	Kerajaan	Pra-Universiti → Degree (Dalam & Luar Negara: Top 10/30 Universiti Dunia)	1.56	6.82	Ya (wajib — pemohon & ibu/bapa Bumiputera)	B40	Computing / Health Science & Medicine / Engineering / Arts & Design / Social Science	IRE / IRA / ASE / SIA / RIE	Ya (Tajaan Penuh)	https://educationloan.mara.gov.my/	Universiti Luar Negara	Top 10 & Top 30 universiti dunia (QS Ranking) - Oxford, Cambridge, Imperial, UCL, LSE, MIT, Harvard, NUS, NTU	8	\N
BIA005	PETRONAS Powering Knowledge Education Sponsorship (PESP)	PETRONAS	Korporat	A-Level → Degree (Lokal: UTP; Luar Negara: US/UK/Aus/NZ/China/Japan/Korea)	1.22	8.18	Tidak	B40, M40, T20	Kejuruteraan / Geosains / Data Science / Perniagaan / Pemasaran Digital	RIE / IRE / RIA / EKS	Ya (Tajaan Penuh)	https://educationsponsorship.petronas.com.my/OAS/Applicant/Applicant/Login	Universiti Awam, Universiti Swasta, Universiti Luar Negara	UTP, MIT, Imperial College London, University of Manchester, NUS, universiti teknikal pilihan (US/UK/Aus/NZ/China/Japan/Korea)	8	\N
BIA011	PPBU - Yayasan Bank Rakyat	Yayasan Bank Rakyat	Korporat	Diploma	\N	\N	\N	B40, M40, T20	Pengajian Islam;Pengurusan & Perniagaan;Perakaunan;Komunikasi & Media;Teknologi Maklumat;Pendidikan;Sains Sosial	SAI; ECS; CIE; ASE; IRC; SAI; SIA	Tajaan Boleh Ubah (ada bayaran balik ikut CGPA)	https://application.yayasanbankrakyat.com.my/	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	5	\N
BIA017	Sunway Merit Scholarship (Pre-University/ACCA FIA/CFAB)	Sunway University/College	Institusi Pendidikan Swasta	Pra-Universiti	\N	\N	\N	B40, M40, T20	A-Level;AUSMAT;CIMP;MUFY;ACCA FIA;CFAB	IAC; IAC; IAC; IAC; CIE; CIE	Sebahagian TIDAK - tier tertinggi (9A+) = Full Scholarship	https://my.sunway.edu.my/scholarships/	Sunway University/College	\N	3	\N
BIA018	Genting Malaysia Scholarship (GENM)	Genting Malaysia Berhad	Korporat	Ijazah Sarjana Muda	\N	\N	\N	B40, M40	Hospitality & Tourism Management;Culinary Arts;Parks and Recreation;Finance/Accounting;MORSE/Mathematics;Actuarial Science/Data Analytics/Statistics;Economics;Engineering;IT/Computer Science/AI;Business/Marketing;Human Resources	SEC; RAE; SRE; CIE; ICR; ICE; IEC; RIC; IRC; ESA; SEC	Tidak dinyatakan jelas (nampak penuh dari testimoni)	https://bpm.rwgenting.com/GentingScholarship/ScholarshipLocal.aspx	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	0	\N
BIA019	Cagamas Undergraduate Scholarship Programme	Cagamas Berhad	Korporat	Ijazah Sarjana Muda	\N	\N	\N	B40	Banking & Finance;Islamic Banking/Finance;Human Resource;Business Administration;Risk Management;Economics;Law/Shariah Law;Statistics;Actuarial Science;Mathematics;Accounting;Computer Science/IT	CEI; SEC; ECS; ICE; IEC; ESI; ICR; ICE; ICR; CIE; IRC	Tajaan Penuh - Tiada Bond (RM20,000/tahun)	https://scholarship.cagamas.com.my/applications/create	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	0	\N
BIA020	Sunway Merit Scholarship (Diploma)	Sunway University/College	Institusi Pendidikan Swasta	Diploma	\N	\N	\N	B40, M40, T20	Semua program Diploma Sunway (tidak dispesifikkan dalam popup)	N/A - perlu senarai program spesifik untuk generate	TIDAK - diskaun yuran sahaja	https://my.sunway.edu.my/scholarships/	Sunway University/College	\N	3	\N
BIA021	PPBU - Yayasan Bank Rakyat	Yayasan Bank Rakyat	Korporat	Ijazah Sarjana Muda	\N	\N	\N	B40, M40, T20	Pengajian Islam;Pengurusan & Perniagaan;Perakaunan;Komunikasi & Media;Teknologi Maklumat;Pendidikan;Sains Sosial	SAI; ECS; CIE; ASE; IRC; SAI; SIA	Tajaan Boleh Ubah (ada bayaran balik ikut CGPA)	https://application.yayasanbankrakyat.com.my/	Universiti Awam, Universiti Swasta, Universiti Luar Negara	\N	0	\N
BIA022	APU Scholarships & Merit Awards	Asia Pacific University (APU/APIIT)	Institusi Pendidikan Swasta	Diploma	\N	\N	\N	B40, M40, T20	Computing & Technology; Business, Finance & Social Sciences; Architecture & Design; Engineering (Electrical/Electronic/Mechanical/Mechatronic/Computer/Petroleum); ICT; Design & Media; Accounting; Hospitality & Tourism Management; Psychology; International Studies/International Relations	IRC; ECS; ARI; RIC; IRC; ARE; CIE; SEC; SIA; SEA	TIDAK - diskaun yuran sahaja	scholarships@apu.edu.my	Asia Pacific University (APU/APIIT)	\N	4	\N
BIA023	APU Scholarships & Merit Awards	Asia Pacific University (APU/APIIT)	Institusi Pendidikan Swasta	Ijazah Sarjana Muda	\N	\N	\N	B40, M40, T20	Computing & Technology;Business, Finance & Social Sciences;Architecture & Design;Engineering (Electrical/Electronic/Mechanical/Mechatronic/Computer/Petroleum);ICT;Design & Media;Accounting;Hospitality & Tourism Management;Psychology;International Studies/International Relations	IRC; ECS; ARI; RIC; IRC; ARE; CIE; SEC; SIA; SEA	TIDAK - diskaun yuran sahaja	scholarships@apu.edu.my	Asia Pacific University (APU/APIIT)	\N	4	\N
BIA024	JPA - Program Khas JPA-MARA (PKJM) - Luar Negara (Jepun/UK/NZ)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi; Perakaunan; Ekonomi; Kewangan	RIC/IRC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	Kolej/Universiti di Jepun; UK; New Zealand; INTEC Education College	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA025	JPA - Program Khas JPA-MARA (PKJM) - Dalam Negara (UTP/UNITEN/MMU/UniKL)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Dalam Negara)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi	RIC	\N	https://penajaan.jpa.gov.my	Universiti Swasta	UTP; UNITEN; MMU; UniKL	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA026	JPA - JKPJ Kejuruteraan/S&T Jepun (JKPJ 001/002)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi	RIC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	INTEC Education College; Universiti di Jepun (KOSEN); Colleges of Technology	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA027	JPA - JKPJ Kejuruteraan/S&T Korea (JKPJ 003/004/005/006)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi	RIC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	INTEC Education College; UniKL-MIIT; Seoul National University; Universiti di Korea	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA028	JPA - JKPJ Kejuruteraan/S&T Perancis (JKPJ 007/008)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi	RIC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	INTEC Education College; Grand Ecole Perancis; Instituts Universitaire de Technologie (IUT)	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA029	JPA - JKPJ Sains Sosial Perancis (JKPJ 009)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Sains Sosial; Hubungan Antarabangsa; Ekonomi; Sains Politik; Perniagaan	ESA	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	UniKL-MFI; Sciences Po; Grenoble Ecole de Management; SKEMA Business School	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA030	JPA - JKPJ Sains & Teknologi Jerman (JKPJ 010)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Luar Negara)	\N	\N	\N	B40, M40, T20	Sains dan Teknologi; Kejuruteraan	RIC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	Sunway College; Carl Duisberg GmbH Jerman; Universiti di Jerman	7	{"jpa": true, "min_grade_by_subject": {"A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"], "A-": ["bahasa inggeris", "sejarah"]}}
BIA031	JPA - Program Penajaan Nasional (PPN) - Kejuruteraan/S&T	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Universiti Terkemuka Dunia QS Top 20)	\N	\N	\N	B40, M40, T20	Kejuruteraan; Sains dan Teknologi; Sains Semula Jadi	RIC/IRC	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	MIT; Stanford; Oxford; Cambridge; Imperial College; ETH Zurich; Harvard; UCL; Caltech	9	{"jpa": true, "min_a_plus_count": 9, "required_A_plus": ["bahasa melayu", "bahasa inggeris", "matematik", "sejarah", "matematik tambahan", "fizik", "kimia"]}
BIA032	JPA - Program Penajaan Nasional (PPN) - Lain-Lain Bidang	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Universiti Terkemuka Dunia QS Top 20)	\N	\N	\N	B40, M40, T20	Sains Sosial; Pengurusan; Ekonomi; Perniagaan; Sains Hayat; Kemanusiaan	ESA/SAI	\N	https://penajaan.jpa.gov.my	Universiti Luar Negara	MIT; Stanford; Oxford; Cambridge; LSE; Harvard; UCL; Yale; Columbia; Cornell	8	{"jpa": true, "min_a_plus_count": 8, "required_A_plus": ["bahasa melayu", "bahasa inggeris", "matematik", "sejarah"]}
BIA033	JPA - Program Khas Lepasan SPM Dalam Negara (LSPM)	Jabatan Perkhidmatan Awam (JPA)	Kerajaan	Ijazah Pertama (Dalam Negara)	\N	\N	\N	B40, M40, T20	Semua Bidang	Semua	\N	https://penajaan.jpa.gov.my	Universiti Awam, Universiti Swasta	UM; UKM; UPM; UTM; USM; UMPSA; UUM; UIAM; UiTM; UNIMAS; USIM; UniMAP; UTP; MMU; UNITEN; UniKL; Taylor's; UCSI; Sunway; UTAR	9	{"jpa": true, "min_a_plus_count": 9}
\.


--
-- Data for Name: biasiswa_ipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.biasiswa_ipt (id, id_biasiswa, id_ipt) FROM stdin;
1	BIA001	67
2	BIA001	69
3	BIA001	59
4	BIA001	60
5	BIA001	61
6	BIA002	1
7	BIA002	2
8	BIA002	3
9	BIA002	4
10	BIA002	5
11	BIA002	6
12	BIA002	7
13	BIA002	8
14	BIA002	9
15	BIA002	10
16	BIA002	11
17	BIA002	12
18	BIA002	33
19	BIA002	37
20	BIA002	38
21	BIA002	39
22	BIA002	35
23	BIA002	41
24	BIA003	1
25	BIA003	2
26	BIA003	3
27	BIA003	4
28	BIA003	5
29	BIA003	6
30	BIA003	7
31	BIA003	8
32	BIA003	67
33	BIA003	69
34	BIA003	59
35	BIA003	60
36	BIA004	67
37	BIA004	69
38	BIA004	59
39	BIA004	60
40	BIA004	61
41	BIA004	62
42	BIA004	63
43	BIA005	64
44	BIA005	42
45	BIA005	67
46	BIA005	61
47	BIA006	1
48	BIA006	2
49	BIA006	3
50	BIA006	4
51	BIA006	6
52	BIA006	59
53	BIA006	60
54	BIA006	61
55	BIA007	1
56	BIA007	2
57	BIA007	3
58	BIA007	4
59	BIA007	5
60	BIA007	6
61	BIA007	7
62	BIA007	8
63	BIA007	33
64	BIA007	35
65	BIA007	37
66	BIA007	38
67	BIA007	39
68	BIA007	41
69	BIA008	1
70	BIA008	2
71	BIA008	3
72	BIA008	4
73	BIA008	5
74	BIA008	6
75	BIA009	1
76	BIA009	2
77	BIA009	3
78	BIA009	4
79	BIA009	5
80	BIA009	6
81	BIA009	7
82	BIA009	8
83	BIA009	16
84	BIA010	1
85	BIA010	2
86	BIA010	3
87	BIA010	4
88	BIA010	6
89	BIA011	1
90	BIA011	2
91	BIA011	3
92	BIA011	4
93	BIA011	5
94	BIA011	6
95	BIA011	7
96	BIA011	8
97	BIA011	9
98	BIA011	10
99	BIA011	11
100	BIA011	12
101	BIA011	32
102	BIA011	33
103	BIA011	34
104	BIA011	35
105	BIA011	36
106	BIA011	37
107	BIA011	38
108	BIA011	39
109	BIA011	40
110	BIA011	41
111	BIA011	42
112	BIA011	43
113	BIA011	44
114	BIA011	45
115	BIA011	46
116	BIA011	47
117	BIA011	48
118	BIA011	49
119	BIA011	50
120	BIA011	51
121	BIA011	59
122	BIA011	60
123	BIA011	61
124	BIA011	62
125	BIA011	63
126	BIA011	64
127	BIA011	65
128	BIA011	66
129	BIA011	67
130	BIA011	68
131	BIA011	69
132	BIA011	70
133	BIA011	71
134	BIA011	72
135	BIA011	73
136	BIA011	74
137	BIA011	75
138	BIA011	76
139	BIA011	77
140	BIA011	78
141	BIA011	79
142	BIA011	80
143	BIA011	81
144	BIA011	82
145	BIA011	83
146	BIA011	84
147	BIA011	85
148	BIA011	86
149	BIA011	87
150	BIA011	88
151	BIA011	89
152	BIA011	90
153	BIA011	91
154	BIA011	92
155	BIA011	93
156	BIA011	94
157	BIA011	95
158	BIA012	1
159	BIA012	2
160	BIA012	3
161	BIA012	4
162	BIA012	5
163	BIA012	6
164	BIA012	7
165	BIA012	8
166	BIA012	9
167	BIA012	10
168	BIA012	11
169	BIA012	12
170	BIA012	32
171	BIA012	33
172	BIA012	34
173	BIA012	35
174	BIA012	36
175	BIA012	37
176	BIA012	38
177	BIA012	39
178	BIA012	40
179	BIA012	41
180	BIA012	42
181	BIA012	43
182	BIA012	44
183	BIA012	45
184	BIA012	46
185	BIA012	47
186	BIA012	48
187	BIA012	49
188	BIA012	50
189	BIA012	51
190	BIA012	59
191	BIA012	60
192	BIA012	61
193	BIA012	62
194	BIA012	63
195	BIA012	64
196	BIA012	65
197	BIA012	66
198	BIA012	67
199	BIA012	68
200	BIA012	69
201	BIA012	70
202	BIA012	71
203	BIA012	72
204	BIA012	73
205	BIA012	74
206	BIA012	75
207	BIA012	76
208	BIA012	77
209	BIA012	78
210	BIA012	79
211	BIA012	80
212	BIA012	81
213	BIA012	82
214	BIA012	83
215	BIA012	84
216	BIA012	85
217	BIA012	86
218	BIA012	87
219	BIA012	88
220	BIA012	89
221	BIA012	90
222	BIA012	91
223	BIA012	92
224	BIA012	93
225	BIA012	94
226	BIA012	95
227	BIA013	1
228	BIA013	2
229	BIA013	3
230	BIA013	4
231	BIA013	5
232	BIA013	6
233	BIA013	7
234	BIA013	8
235	BIA013	9
236	BIA013	10
237	BIA013	11
238	BIA013	12
239	BIA013	32
240	BIA013	33
241	BIA013	34
242	BIA013	35
243	BIA013	36
244	BIA013	37
245	BIA013	38
246	BIA013	39
247	BIA013	40
248	BIA013	41
249	BIA013	42
250	BIA013	43
251	BIA013	44
252	BIA013	45
253	BIA013	46
254	BIA013	47
255	BIA013	48
256	BIA013	49
257	BIA013	50
258	BIA013	51
259	BIA013	59
260	BIA013	60
261	BIA013	61
262	BIA013	62
263	BIA013	63
264	BIA013	64
265	BIA013	65
266	BIA013	66
267	BIA013	67
268	BIA013	68
269	BIA013	69
270	BIA013	70
271	BIA013	71
272	BIA013	72
273	BIA013	73
274	BIA013	74
275	BIA013	75
276	BIA013	76
277	BIA013	77
278	BIA013	78
279	BIA013	79
280	BIA013	80
281	BIA013	81
282	BIA013	82
283	BIA013	83
284	BIA013	84
285	BIA013	85
286	BIA013	86
287	BIA013	87
288	BIA013	88
289	BIA013	89
290	BIA013	90
291	BIA013	91
292	BIA013	92
293	BIA013	93
294	BIA013	94
295	BIA013	95
296	BIA014	1
297	BIA014	2
298	BIA014	3
299	BIA014	4
300	BIA014	5
301	BIA014	6
302	BIA014	7
303	BIA014	8
304	BIA014	32
305	BIA014	33
306	BIA014	34
307	BIA014	35
308	BIA014	36
309	BIA014	37
310	BIA014	38
311	BIA014	39
312	BIA014	40
313	BIA014	41
314	BIA014	59
315	BIA014	60
316	BIA014	61
317	BIA014	62
318	BIA014	63
319	BIA014	64
320	BIA014	65
321	BIA014	66
322	BIA014	67
323	BIA014	68
324	BIA014	69
325	BIA014	70
326	BIA014	71
327	BIA014	72
328	BIA014	73
329	BIA014	74
330	BIA014	75
331	BIA014	76
332	BIA014	77
333	BIA014	78
334	BIA014	79
335	BIA014	80
336	BIA014	81
337	BIA014	82
338	BIA014	83
339	BIA014	84
340	BIA014	85
341	BIA014	86
342	BIA014	87
343	BIA014	88
344	BIA014	89
345	BIA014	90
346	BIA014	91
347	BIA014	92
348	BIA014	93
349	BIA014	94
350	BIA014	95
351	BIA015	1
352	BIA015	2
353	BIA015	3
354	BIA015	4
355	BIA015	5
356	BIA015	6
357	BIA015	7
358	BIA015	8
359	BIA015	32
360	BIA015	33
361	BIA015	34
362	BIA015	35
363	BIA015	36
364	BIA015	37
365	BIA015	38
366	BIA015	39
367	BIA015	40
368	BIA015	41
369	BIA015	59
370	BIA015	60
371	BIA015	61
372	BIA015	62
373	BIA015	63
374	BIA015	64
375	BIA015	65
376	BIA015	66
377	BIA015	67
378	BIA015	68
379	BIA015	69
380	BIA015	70
381	BIA015	71
382	BIA015	72
383	BIA015	73
384	BIA015	74
385	BIA015	75
386	BIA015	76
387	BIA015	77
388	BIA015	78
389	BIA015	79
390	BIA015	80
391	BIA015	81
392	BIA015	82
393	BIA015	83
394	BIA015	84
395	BIA015	85
396	BIA015	86
397	BIA015	87
398	BIA015	88
399	BIA015	89
400	BIA015	90
401	BIA015	91
402	BIA015	92
403	BIA015	93
404	BIA015	94
405	BIA015	95
406	BIA018	1
407	BIA018	2
408	BIA018	3
409	BIA018	4
410	BIA018	5
411	BIA018	6
412	BIA018	7
413	BIA018	8
414	BIA018	9
415	BIA018	10
416	BIA018	11
417	BIA018	12
418	BIA018	32
419	BIA018	33
420	BIA018	34
421	BIA018	35
422	BIA018	36
423	BIA018	37
424	BIA018	38
425	BIA018	39
426	BIA018	40
427	BIA018	41
428	BIA018	42
429	BIA018	43
430	BIA018	44
431	BIA018	45
432	BIA018	46
433	BIA018	47
434	BIA018	48
435	BIA018	49
436	BIA018	50
437	BIA018	51
438	BIA018	59
439	BIA018	60
440	BIA018	61
441	BIA018	62
442	BIA018	63
443	BIA018	64
444	BIA018	65
445	BIA018	66
446	BIA018	67
447	BIA018	68
448	BIA018	69
449	BIA018	70
450	BIA018	71
451	BIA018	72
452	BIA018	73
453	BIA018	74
454	BIA018	75
455	BIA018	76
456	BIA018	77
457	BIA018	78
458	BIA018	79
459	BIA018	80
460	BIA018	81
461	BIA018	82
462	BIA018	83
463	BIA018	84
464	BIA018	85
465	BIA018	86
466	BIA018	87
467	BIA018	88
468	BIA018	89
469	BIA018	90
470	BIA018	91
471	BIA018	92
472	BIA018	93
473	BIA018	94
474	BIA018	95
475	BIA019	1
476	BIA019	2
477	BIA019	3
478	BIA019	4
479	BIA019	5
480	BIA019	6
481	BIA019	7
482	BIA019	8
483	BIA019	9
484	BIA019	10
485	BIA019	11
486	BIA019	12
487	BIA019	32
488	BIA019	33
489	BIA019	34
490	BIA019	35
491	BIA019	36
492	BIA019	37
493	BIA019	38
494	BIA019	39
495	BIA019	40
496	BIA019	41
497	BIA019	42
498	BIA019	43
499	BIA019	44
500	BIA019	45
501	BIA019	46
502	BIA019	47
503	BIA019	48
504	BIA019	49
505	BIA019	50
506	BIA019	51
507	BIA019	59
508	BIA019	60
509	BIA019	61
510	BIA019	62
511	BIA019	63
512	BIA019	64
513	BIA019	65
514	BIA019	66
515	BIA019	67
516	BIA019	68
517	BIA019	69
518	BIA019	70
519	BIA019	71
520	BIA019	72
521	BIA019	73
522	BIA019	74
523	BIA019	75
524	BIA019	76
525	BIA019	77
526	BIA019	78
527	BIA019	79
528	BIA019	80
529	BIA019	81
530	BIA019	82
531	BIA019	83
532	BIA019	84
533	BIA019	85
534	BIA019	86
535	BIA019	87
536	BIA019	88
537	BIA019	89
538	BIA019	90
539	BIA019	91
540	BIA019	92
541	BIA019	93
542	BIA019	94
543	BIA019	95
544	BIA021	1
545	BIA021	2
546	BIA021	3
547	BIA021	4
548	BIA021	5
549	BIA021	6
550	BIA021	7
551	BIA021	8
552	BIA021	9
553	BIA021	10
554	BIA021	11
555	BIA021	12
556	BIA021	32
557	BIA021	33
558	BIA021	34
559	BIA021	35
560	BIA021	36
561	BIA021	37
562	BIA021	38
563	BIA021	39
564	BIA021	40
565	BIA021	41
566	BIA021	42
567	BIA021	43
568	BIA021	44
569	BIA021	45
570	BIA021	46
571	BIA021	47
572	BIA021	48
573	BIA021	49
574	BIA021	50
575	BIA021	51
576	BIA021	59
577	BIA021	60
578	BIA021	61
579	BIA021	62
580	BIA021	63
581	BIA021	64
582	BIA021	65
583	BIA021	66
584	BIA021	67
585	BIA021	68
586	BIA021	69
587	BIA021	70
588	BIA021	71
589	BIA021	72
590	BIA021	73
591	BIA021	74
592	BIA021	75
593	BIA021	76
594	BIA021	77
595	BIA021	78
596	BIA021	79
597	BIA021	80
598	BIA021	81
599	BIA021	82
600	BIA021	83
601	BIA021	84
602	BIA021	85
603	BIA021	86
604	BIA021	87
605	BIA021	88
606	BIA021	89
607	BIA021	90
608	BIA021	91
609	BIA021	92
610	BIA021	93
611	BIA021	94
612	BIA021	95
613	BIA024	64
614	BIA024	65
615	BIA024	66
616	BIA024	52
617	BIA024	94
618	BIA024	59
619	BIA024	60
620	BIA024	61
621	BIA024	62
622	BIA024	95
623	BIA025	10
624	BIA025	42
625	BIA025	43
626	BIA025	44
627	BIA026	82
628	BIA026	83
629	BIA026	52
630	BIA026	85
631	BIA026	84
632	BIA026	86
633	BIA027	89
634	BIA027	52
635	BIA027	87
636	BIA027	88
637	BIA027	57
638	BIA027	90
639	BIA027	91
640	BIA028	80
641	BIA028	52
642	BIA028	79
643	BIA029	80
644	BIA029	58
645	BIA029	78
646	BIA029	79
647	BIA030	81
648	BIA030	11
649	BIA030	77
650	BIA031	67
651	BIA031	68
652	BIA031	69
653	BIA031	70
654	BIA031	71
655	BIA031	72
656	BIA031	73
657	BIA031	74
658	BIA031	75
659	BIA031	76
660	BIA031	59
661	BIA031	60
662	BIA031	61
663	BIA031	62
664	BIA032	67
665	BIA032	68
666	BIA032	69
667	BIA032	71
668	BIA032	72
669	BIA032	73
670	BIA032	74
671	BIA032	75
672	BIA032	59
673	BIA032	60
674	BIA032	62
675	BIA032	63
676	BIA033	1
677	BIA033	2
678	BIA033	3
679	BIA033	4
680	BIA033	5
681	BIA033	6
682	BIA033	7
683	BIA033	8
684	BIA033	9
685	BIA033	10
686	BIA033	11
687	BIA033	32
688	BIA033	33
689	BIA033	34
690	BIA033	35
691	BIA033	42
692	BIA033	43
693	BIA033	44
694	BIA033	45
695	BIA033	46
\.


--
-- Data for Name: biasiswa_kursus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.biasiswa_kursus (id, id_biasiswa, id_kursus) FROM stdin;
1	BIA001	1
2	BIA001	2
3	BIA001	3
4	BIA001	4
5	BIA001	5
6	BIA001	6
7	BIA001	7
8	BIA001	8
9	BIA001	13
10	BIA001	14
11	BIA001	15
12	BIA001	16
13	BIA001	19
14	BIA001	20
15	BIA001	22
16	BIA001	34
17	BIA001	36
18	BIA001	43
19	BIA001	50
20	BIA002	1
21	BIA002	2
22	BIA002	3
23	BIA002	4
24	BIA002	5
25	BIA002	6
26	BIA002	7
27	BIA002	8
28	BIA002	9
29	BIA002	10
30	BIA002	11
31	BIA002	12
32	BIA002	13
33	BIA002	14
34	BIA002	15
35	BIA002	16
36	BIA002	17
37	BIA002	18
38	BIA002	19
39	BIA002	20
40	BIA002	21
41	BIA002	22
42	BIA002	23
43	BIA002	24
44	BIA002	25
45	BIA002	26
46	BIA002	27
47	BIA002	28
48	BIA002	29
49	BIA002	30
50	BIA002	31
51	BIA002	32
52	BIA002	33
53	BIA002	34
54	BIA002	35
55	BIA002	36
56	BIA002	37
57	BIA002	38
58	BIA002	39
59	BIA002	40
60	BIA002	41
61	BIA002	42
62	BIA002	43
63	BIA002	44
64	BIA002	45
65	BIA002	46
66	BIA002	47
67	BIA002	48
68	BIA002	49
69	BIA002	50
70	BIA002	51
71	BIA002	52
72	BIA002	53
73	BIA002	54
74	BIA002	55
75	BIA002	56
76	BIA002	57
77	BIA002	58
78	BIA002	59
79	BIA002	60
80	BIA002	61
81	BIA002	62
82	BIA002	63
83	BIA003	1
84	BIA003	2
85	BIA003	3
86	BIA003	4
87	BIA003	5
88	BIA003	6
89	BIA003	7
90	BIA003	8
91	BIA003	13
92	BIA003	14
93	BIA003	34
94	BIA003	35
95	BIA003	36
96	BIA004	1
97	BIA004	2
98	BIA004	3
99	BIA004	4
100	BIA004	5
101	BIA004	13
102	BIA004	14
103	BIA004	15
104	BIA004	34
105	BIA004	36
106	BIA005	1
107	BIA005	2
108	BIA005	3
109	BIA005	4
110	BIA005	5
111	BIA005	6
112	BIA005	13
113	BIA005	19
114	BIA006	1
115	BIA006	2
116	BIA006	3
117	BIA006	4
118	BIA006	5
119	BIA006	6
120	BIA006	13
121	BIA006	19
122	BIA006	34
123	BIA006	36
124	BIA007	1
125	BIA007	2
126	BIA007	3
127	BIA007	4
128	BIA007	5
129	BIA007	6
130	BIA007	7
131	BIA007	8
132	BIA007	9
133	BIA007	10
134	BIA007	11
135	BIA007	12
136	BIA007	13
137	BIA007	14
138	BIA007	15
139	BIA007	16
140	BIA007	17
141	BIA007	18
142	BIA007	19
143	BIA007	20
144	BIA007	21
145	BIA007	22
146	BIA007	23
147	BIA007	24
148	BIA007	25
149	BIA007	26
150	BIA007	27
151	BIA007	28
152	BIA007	29
153	BIA007	30
154	BIA007	31
155	BIA007	32
156	BIA007	33
157	BIA007	34
158	BIA007	35
159	BIA007	36
160	BIA007	37
161	BIA007	38
162	BIA007	39
163	BIA007	40
164	BIA007	41
165	BIA007	42
166	BIA007	43
167	BIA007	44
168	BIA007	45
169	BIA007	46
170	BIA007	47
171	BIA007	48
172	BIA007	49
173	BIA007	50
174	BIA007	51
175	BIA007	52
176	BIA007	53
177	BIA007	54
178	BIA007	55
179	BIA007	56
180	BIA007	57
181	BIA007	58
182	BIA007	59
183	BIA007	60
184	BIA007	61
185	BIA007	62
186	BIA007	63
187	BIA008	1
188	BIA008	2
189	BIA008	3
190	BIA008	4
191	BIA008	7
192	BIA008	13
193	BIA009	1
194	BIA009	2
195	BIA009	3
196	BIA009	4
197	BIA009	5
198	BIA009	6
199	BIA009	7
200	BIA009	8
201	BIA009	9
202	BIA009	10
203	BIA009	11
204	BIA009	12
205	BIA009	13
206	BIA009	14
207	BIA009	15
208	BIA009	16
209	BIA009	17
210	BIA009	18
211	BIA009	19
212	BIA009	20
213	BIA009	21
214	BIA009	22
215	BIA009	23
216	BIA009	24
217	BIA009	25
218	BIA009	26
219	BIA009	27
220	BIA009	28
221	BIA009	29
222	BIA009	30
223	BIA009	31
224	BIA009	32
225	BIA009	33
226	BIA009	34
227	BIA009	35
228	BIA009	36
229	BIA009	37
230	BIA009	38
231	BIA009	39
232	BIA009	40
233	BIA009	41
234	BIA009	42
235	BIA009	43
236	BIA009	44
237	BIA009	45
238	BIA009	46
239	BIA009	47
240	BIA009	48
241	BIA009	49
242	BIA009	50
243	BIA009	51
244	BIA009	52
245	BIA009	53
246	BIA009	54
247	BIA009	55
248	BIA009	56
249	BIA009	57
250	BIA009	58
251	BIA009	59
252	BIA009	60
253	BIA009	61
254	BIA009	62
255	BIA009	63
256	BIA010	1
257	BIA010	2
258	BIA010	3
259	BIA010	4
260	BIA010	5
261	BIA010	13
262	BIA010	53
263	BIA011	1
264	BIA011	2
265	BIA011	3
266	BIA011	4
267	BIA011	5
268	BIA011	6
269	BIA011	7
270	BIA011	8
271	BIA011	9
272	BIA011	10
273	BIA011	11
274	BIA011	12
275	BIA011	13
276	BIA011	14
277	BIA011	15
278	BIA011	16
279	BIA011	17
280	BIA011	18
281	BIA011	19
282	BIA011	20
283	BIA011	21
284	BIA011	22
285	BIA011	23
286	BIA011	24
287	BIA011	25
288	BIA011	26
289	BIA011	27
290	BIA011	28
291	BIA011	29
292	BIA011	30
293	BIA011	31
294	BIA011	32
295	BIA011	33
296	BIA011	34
297	BIA011	35
298	BIA011	36
299	BIA011	37
300	BIA011	38
301	BIA011	39
302	BIA011	40
303	BIA011	41
304	BIA011	42
305	BIA011	43
306	BIA011	44
307	BIA011	45
308	BIA011	46
309	BIA011	47
310	BIA011	48
311	BIA011	49
312	BIA011	50
313	BIA011	51
314	BIA011	52
315	BIA011	53
316	BIA011	54
317	BIA011	55
318	BIA011	56
319	BIA011	57
320	BIA011	58
321	BIA011	59
322	BIA011	60
323	BIA011	61
324	BIA011	62
325	BIA011	63
326	BIA012	1
327	BIA012	2
328	BIA012	3
329	BIA012	4
330	BIA012	5
331	BIA012	6
332	BIA012	7
333	BIA012	8
334	BIA012	9
335	BIA012	10
336	BIA012	11
337	BIA012	12
338	BIA012	13
339	BIA012	14
340	BIA012	15
341	BIA012	16
342	BIA012	17
343	BIA012	18
344	BIA012	19
345	BIA012	20
346	BIA012	21
347	BIA012	22
348	BIA012	23
349	BIA012	24
350	BIA012	25
351	BIA012	26
352	BIA012	27
353	BIA012	28
354	BIA012	29
355	BIA012	30
356	BIA012	31
357	BIA012	32
358	BIA012	33
359	BIA012	34
360	BIA012	35
361	BIA012	36
362	BIA012	37
363	BIA012	38
364	BIA012	39
365	BIA012	40
366	BIA012	41
367	BIA012	42
368	BIA012	43
369	BIA012	44
370	BIA012	45
371	BIA012	46
372	BIA012	47
373	BIA012	48
374	BIA012	49
375	BIA012	50
376	BIA012	51
377	BIA012	52
378	BIA012	53
379	BIA012	54
380	BIA012	55
381	BIA012	56
382	BIA012	57
383	BIA012	58
384	BIA012	59
385	BIA012	60
386	BIA012	61
387	BIA012	62
388	BIA012	63
389	BIA013	1
390	BIA013	2
391	BIA013	3
392	BIA013	4
393	BIA013	5
394	BIA013	12
395	BIA013	13
396	BIA014	34
397	BIA014	35
398	BIA014	36
399	BIA014	41
400	BIA014	37
401	BIA014	40
402	BIA015	34
403	BIA015	35
404	BIA015	36
405	BIA015	41
406	BIA015	37
407	BIA015	40
408	BIA015	50
409	BIA015	43
410	BIA016	13
411	BIA016	14
412	BIA016	15
413	BIA016	16
414	BIA016	17
415	BIA016	37
416	BIA016	38
417	BIA016	54
418	BIA016	56
419	BIA017	1
420	BIA017	2
421	BIA017	3
422	BIA017	4
423	BIA017	5
424	BIA017	6
425	BIA017	7
426	BIA017	8
427	BIA017	9
428	BIA017	10
429	BIA017	11
430	BIA017	12
431	BIA017	13
432	BIA017	14
433	BIA017	15
434	BIA017	16
435	BIA017	17
436	BIA017	18
437	BIA017	19
438	BIA017	20
439	BIA017	21
440	BIA017	22
441	BIA017	23
442	BIA017	24
443	BIA017	25
444	BIA017	26
445	BIA017	27
446	BIA017	28
447	BIA017	29
448	BIA017	30
449	BIA017	31
450	BIA017	32
451	BIA017	33
452	BIA017	34
453	BIA017	35
454	BIA017	36
455	BIA017	37
456	BIA017	38
457	BIA017	39
458	BIA017	40
459	BIA017	41
460	BIA017	42
461	BIA017	43
462	BIA017	44
463	BIA017	45
464	BIA017	46
465	BIA017	47
466	BIA017	48
467	BIA017	49
468	BIA017	50
469	BIA017	51
470	BIA017	52
471	BIA017	53
472	BIA017	54
473	BIA017	55
474	BIA017	56
475	BIA017	57
476	BIA017	58
477	BIA017	59
478	BIA017	60
479	BIA017	61
480	BIA017	62
481	BIA017	63
482	BIA018	34
483	BIA018	35
484	BIA018	36
485	BIA018	37
486	BIA018	38
487	BIA018	39
488	BIA018	13
489	BIA018	14
490	BIA019	34
491	BIA019	35
492	BIA019	36
493	BIA019	41
494	BIA019	50
495	BIA020	1
496	BIA020	2
497	BIA020	3
498	BIA020	4
499	BIA020	5
500	BIA020	6
501	BIA020	7
502	BIA020	8
503	BIA020	9
504	BIA020	10
505	BIA020	11
506	BIA020	12
507	BIA020	13
508	BIA020	14
509	BIA020	15
510	BIA020	16
511	BIA020	17
512	BIA020	18
513	BIA020	19
514	BIA020	20
515	BIA020	21
516	BIA020	22
517	BIA020	23
518	BIA020	24
519	BIA020	25
520	BIA020	26
521	BIA020	27
522	BIA020	28
523	BIA020	29
524	BIA020	30
525	BIA020	31
526	BIA020	32
527	BIA020	33
528	BIA020	34
529	BIA020	35
530	BIA020	36
531	BIA020	37
532	BIA020	38
533	BIA020	39
534	BIA020	40
535	BIA020	41
536	BIA020	42
537	BIA020	43
538	BIA020	44
539	BIA020	45
540	BIA020	46
541	BIA020	47
542	BIA020	48
543	BIA020	49
544	BIA020	50
545	BIA020	51
546	BIA020	52
547	BIA020	53
548	BIA020	54
549	BIA020	55
550	BIA020	56
551	BIA020	57
552	BIA020	58
553	BIA020	59
554	BIA020	60
555	BIA020	61
556	BIA020	62
557	BIA020	63
558	BIA021	1
559	BIA021	2
560	BIA021	3
561	BIA021	4
562	BIA021	5
563	BIA021	6
564	BIA021	7
565	BIA021	8
566	BIA021	9
567	BIA021	10
568	BIA021	11
569	BIA021	12
570	BIA021	13
571	BIA021	14
572	BIA021	15
573	BIA021	16
574	BIA021	17
575	BIA021	18
576	BIA021	19
577	BIA021	20
578	BIA021	21
579	BIA021	22
580	BIA021	23
581	BIA021	24
582	BIA021	25
583	BIA021	26
584	BIA021	27
585	BIA021	28
586	BIA021	29
587	BIA021	30
588	BIA021	31
589	BIA021	32
590	BIA021	33
591	BIA021	34
592	BIA021	35
593	BIA021	36
594	BIA021	37
595	BIA021	38
596	BIA021	39
597	BIA021	40
598	BIA021	41
599	BIA021	42
600	BIA021	43
601	BIA021	44
602	BIA021	45
603	BIA021	46
604	BIA021	47
605	BIA021	48
606	BIA021	49
607	BIA021	50
608	BIA021	51
609	BIA021	52
610	BIA021	53
611	BIA021	54
612	BIA021	55
613	BIA021	56
614	BIA021	57
615	BIA021	58
616	BIA021	59
617	BIA021	60
618	BIA021	61
619	BIA021	62
620	BIA021	63
621	BIA022	13
622	BIA022	14
623	BIA022	15
624	BIA022	16
625	BIA022	17
626	BIA022	37
627	BIA022	38
628	BIA022	54
629	BIA022	56
630	BIA023	13
631	BIA023	14
632	BIA023	15
633	BIA023	16
634	BIA023	17
635	BIA023	37
636	BIA023	38
637	BIA023	54
638	BIA023	56
639	BIA024	1
640	BIA024	2
641	BIA024	3
642	BIA024	4
643	BIA024	5
644	BIA024	6
645	BIA024	7
646	BIA024	8
647	BIA024	13
648	BIA024	34
649	BIA024	35
650	BIA024	36
651	BIA025	1
652	BIA025	2
653	BIA025	3
654	BIA025	4
655	BIA025	5
656	BIA025	7
657	BIA025	13
658	BIA026	1
659	BIA026	2
660	BIA026	3
661	BIA026	4
662	BIA026	5
663	BIA026	7
664	BIA026	8
665	BIA026	13
666	BIA026	19
667	BIA026	25
668	BIA027	1
669	BIA027	2
670	BIA027	3
671	BIA027	4
672	BIA027	5
673	BIA027	7
674	BIA027	13
675	BIA027	19
676	BIA028	1
677	BIA028	2
678	BIA028	3
679	BIA028	4
680	BIA028	5
681	BIA028	7
682	BIA028	8
683	BIA028	13
684	BIA029	43
685	BIA029	44
686	BIA029	36
687	BIA029	39
688	BIA029	37
689	BIA029	50
690	BIA030	1
691	BIA030	2
692	BIA030	3
693	BIA030	4
694	BIA030	5
695	BIA030	13
696	BIA030	18
697	BIA030	19
698	BIA030	25
699	BIA031	1
700	BIA031	2
701	BIA031	3
702	BIA031	4
703	BIA031	5
704	BIA031	6
705	BIA031	7
706	BIA031	8
707	BIA031	13
708	BIA031	18
709	BIA031	19
710	BIA031	20
711	BIA031	22
712	BIA031	23
713	BIA031	25
714	BIA031	26
715	BIA032	34
716	BIA032	35
717	BIA032	36
718	BIA032	37
719	BIA032	39
720	BIA032	41
721	BIA032	43
722	BIA032	44
723	BIA032	45
724	BIA032	46
725	BIA032	47
726	BIA032	50
727	BIA032	51
728	BIA032	22
729	BIA032	23
730	BIA033	1
731	BIA033	2
732	BIA033	3
733	BIA033	4
734	BIA033	5
735	BIA033	6
736	BIA033	7
737	BIA033	8
738	BIA033	9
739	BIA033	10
740	BIA033	11
741	BIA033	12
742	BIA033	13
743	BIA033	14
744	BIA033	15
745	BIA033	16
746	BIA033	17
747	BIA033	18
748	BIA033	19
749	BIA033	20
750	BIA033	21
751	BIA033	22
752	BIA033	23
753	BIA033	24
754	BIA033	25
755	BIA033	26
756	BIA033	27
757	BIA033	28
758	BIA033	29
759	BIA033	30
760	BIA033	31
761	BIA033	32
762	BIA033	33
763	BIA033	34
764	BIA033	35
765	BIA033	36
766	BIA033	37
767	BIA033	38
768	BIA033	39
769	BIA033	40
770	BIA033	41
771	BIA033	42
772	BIA033	43
773	BIA033	44
774	BIA033	45
775	BIA033	46
776	BIA033	47
777	BIA033	48
778	BIA033	49
779	BIA033	50
780	BIA033	51
781	BIA033	52
782	BIA033	53
783	BIA033	54
784	BIA033	55
785	BIA033	56
786	BIA033	57
787	BIA033	58
788	BIA033	59
789	BIA033	60
790	BIA033	61
791	BIA033	62
792	BIA033	63
\.


--
-- Data for Name: dokumen_rujukan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dokumen_rujukan (id_dokumen, kod, nama_dokumen, penganjur, kategori, kandungan, tarikh_kemaskini) FROM stdin;
1	DOK_JPA_001	Ringkasan Lengkap Program Penajaan JPA 2025/2026	Jabatan Perkhidmatan Awam (JPA)	JPA	# RINGKASAN LENGKAP — PROGRAM PENAJAAN JPA 2025/2026\n**Jabatan Perkhidmatan Awam (JPA) Malaysia**\nURL Permohonan: https://penajaan.jpa.gov.my\n\n---\n\n## GAMBARAN KESELURUHAN\n\nJPA menawarkan **4 program penajaan utama** untuk lepasan SPM yang cemerlang:\n\n| Program | Kod | Peringkat | Destinasi | Bilangan |\n|---------|-----|-----------|-----------|----------|\n| Program Khas JPA-MARA | PKJM | Ijazah Pertama | Luar & Dalam Negara | Tidak dinyatakan |\n| Program Khas Jepun, Korea, Perancis, Jerman | JKPJ | Ijazah Pertama | Luar Negara | Tidak dinyatakan |\n| Program Penajaan Nasional | PPN | Ijazah Pertama (QS Top 20) | Luar Negara | 30 pelajar sahaja |\n| Program Khas Lepasan SPM Dalam Negara | LSPM | Ijazah Pertama | Dalam Negara | Tidak dinyatakan |\n\n**Semua program JPA menggunakan Pinjaman Boleh Ubah (PBU)** — bukan biasiswa penuh. Jumlah yang perlu dibayar balik bergantung kepada PNGK semasa pengajian.\n\n---\n\n## STRUKTUR PINJAMAN BOLEH UBAH (PBU) — SEMUA PROGRAM JPA\n\n| PNGK Semasa Pengajian | Peratusan Yang Perlu Dibayar Balik |\n|-----------------------|------------------------------------|\n| 3.75 – 4.00 | 5% sahaja |\n| 3.50 – 3.74 | 10% sahaja |\n| 3.00 – 3.49 | 15% sahaja |\n| 3.00+ dengan lanjutan pengajian | 20% |\n| Di bawah 3.00 | 100% (bayar balik penuh) |\n\n> **Nota penting:** PBU bermaksud penerima WAJIB mengekalkan PNGK tinggi sepanjang pengajian untuk mengurangkan jumlah bayaran balik. Jika PNGK jatuh di bawah 3.00, keseluruhan pinjaman mesti dibayar balik.\n\n---\n\n## 1. PROGRAM KHAS JPA-MARA (PKJM)\n\n### Latar Belakang\n- Kerjasama JPA dengan MARA\n- Terbuka kepada SEMUA kaum warganegara Malaysia\n- Kategori pendapatan: B40, M40, T20\n\n### Sub-Program\n\n#### A) PKJM Luar Negara\n- **Destinasi:** Jepun, United Kingdom (UK), New Zealand\n- **Persediaan:** INTEC Education College (sebelum ke luar negara)\n- **Bidang:** Kejuruteraan, Sains dan Teknologi, Perakaunan, Ekonomi, Kewangan\n\n#### B) PKJM Dalam Negara\n- **IPT:** UTP, UNITEN, MMU, UniKL\n- **Bidang:** Kejuruteraan, Sains dan Teknologi\n\n### Syarat Kelayakan SPM\n\n**Minimum gred A (A+, A):**\n- Bahasa Melayu\n- Matematik\n- Matematik Tambahan\n- Fizik\n- Kimia\n\n**Minimum gred A- :**\n- Bahasa Inggeris\n- Sejarah\n\n**Minimum jumlah A keseluruhan:** 7A\n\n### Syarat Tambahan\n- Warganegara Malaysia\n- Lepasan SPM terkini\n- Tiada rekod jenayah\n- Sihat jasmani dan rohani\n\n---\n\n## 2. PROGRAM KHAS JEPUN, KOREA, PERANCIS, JERMAN (JKPJ)\n\n### Latar Belakang\n- Program pengajian ke negara-negara maju dengan kepakaran teknikal tinggi\n- Terbuka kepada SEMUA kaum warganegara Malaysia\n- Kategori pendapatan: B40, M40, T20\n\n### Senarai Sub-Program (JKPJ 001–010)\n\n| Kod | Negara | Bidang | IPT/Destinasi |\n|-----|--------|--------|---------------|\n| JKPJ 001 | Jepun | Kejuruteraan | INTEC → KOSEN (Colleges of Technology) Jepun |\n| JKPJ 002 | Jepun | Sains & Teknologi | INTEC → Universiti Jepun |\n| JKPJ 003 | Korea | Kejuruteraan | INTEC → Universiti Korea |\n| JKPJ 004 | Korea | Sains & Teknologi | UniKL-MIIT → Universiti Korea |\n| JKPJ 005 | Korea | Kejuruteraan (lanjutan) | Seoul National University |\n| JKPJ 006 | Korea | Pelbagai | Universiti Korea terpilih |\n| JKPJ 007 | Perancis | Kejuruteraan | INTEC → Grand Ecole Perancis |\n| JKPJ 008 | Perancis | Teknologi | INTEC → Instituts Universitaire de Technologie (IUT) |\n| JKPJ 009 | Perancis | Sains Sosial | UniKL-MFI → Sciences Po / Grenoble / SKEMA |\n| JKPJ 010 | Jerman | Sains & Teknologi | Sunway College → Carl Duisberg GmbH → Universiti Jerman |\n\n### Syarat Kelayakan SPM\n\n#### JKPJ 001–008 & 010 (STEM):\n**Minimum gred A (A+, A):**\n- Bahasa Melayu\n- Matematik\n- Matematik Tambahan\n- Fizik\n- Kimia\n\n**Minimum gred A-:**\n- Bahasa Inggeris\n- Sejarah\n\n#### JKPJ 009 (Sains Sosial Perancis):\n**Minimum gred A:**\n- Bahasa Melayu\n- Matematik\n- (Ditambah 3 mata pelajaran terbaik lain)\n\n**Minimum gred A-:**\n- Bahasa Inggeris\n- Sejarah\n\n**Minimum jumlah A keseluruhan:** 7A (semua sub-program)\n\n### Keistimewaan Program\n- Pelajar akan mempelajari bahasa negara tuan rumah (Jepun/Korea/Perancis/Jerman) sebelum ke luar negara\n- Persediaan bahasa dan akademik di Malaysia (biasanya 1-2 tahun) sebelum berangkat\n- Pendedahan kepada budaya dan industri negara maju\n\n---\n\n## 3. PROGRAM PENAJAAN NASIONAL (PPN)\n\n### Latar Belakang\n- Program PALING PRESTIJ JPA — hanya untuk 30 pelajar terbaik seluruh Malaysia setiap tahun\n- Universiti sasaran: QS World University Rankings Top 20\n- Terbuka kepada SEMUA kaum warganegara Malaysia\n- Kategori pendapatan: B40, M40, T20\n\n### Senarai Universiti Layak (QS Top 20)\nMIT, Stanford University, University of Oxford, University of Cambridge, Imperial College London, ETH Zurich, Harvard University, University College London (UCL), California Institute of Technology (Caltech), Yale University, London School of Economics (LSE), Columbia University, Cornell University, University of Chicago, Princeton University, dan lain-lain universiti dalam ranking QS Top 20 semasa permohonan.\n\n### Sub-Program & Syarat Kelayakan SPM\n\n#### A) PPN Kejuruteraan / Sains & Teknologi\n**Minimum:** 9A+ (sembilan A+)\n\n**Mata pelajaran WAJIB A+:**\n- Bahasa Melayu\n- Bahasa Inggeris\n- Matematik\n- Sejarah\n- Matematik Tambahan\n- Fizik\n- Kimia\n\n**Bidang:** Kejuruteraan, Sains dan Teknologi, Sains Semula Jadi\n\n#### B) PPN Lain-Lain Bidang\n**Minimum:** 8A+ (lapan A+)\n\n**Mata pelajaran WAJIB A+:**\n- Bahasa Melayu\n- Bahasa Inggeris\n- Matematik\n- Sejarah\n\n**Bidang:** Sains Sosial, Pengurusan, Ekonomi, Perniagaan, Sains Hayat, Kemanusiaan, dan lain-lain\n\n### Penting Tentang PPN\n- Hanya **30 tempat** tersedia seluruh Malaysia setiap tahun — persaingan SANGAT ketat\n- Calon dijangka mempunyai rekod kokurikulum dan kepimpinan yang cemerlang\n- Temu duga panel diperlukan\n- Pelajar perlu menguruskan tawaran universiti sendiri sebelum disahkan penajaan\n\n---\n\n## 4. PROGRAM KHAS LEPASAN SPM DALAM NEGARA (LSPM)\n\n### Latar Belakang\n- Khusus untuk lepasan **SPM 2024** (bukan 2025 atau tahun lain)\n- Pengajian di universiti DALAM NEGARA sahaja\n- Terbuka kepada SEMUA kaum warganegara Malaysia\n- Kategori pendapatan: B40, M40, T20\n\n### Syarat Kelayakan SPM\n**Minimum:** 9A+ dalam mana-mana mata pelajaran SPM\n\nTiada syarat mata pelajaran spesifik — asalkan capaian keseluruhan 9A+.\n\n### Senarai IPT Layak\n**Universiti Awam:**\nUM, UKM, UPM, UTM, USM, UMPSA, UUM, UIAM, UiTM, UNIMAS, USIM, UniMAP\n\n**Universiti Swasta:**\nUTP, MMU, UNITEN, UniKL, Taylor's University, UCSI University, Sunway University, UTAR\n\n### Bidang Pengajian\nSemua bidang — tiada sekatan bidang khusus\n\n### Penting Tentang LSPM\n- LSPM 2025 adalah untuk pelajar yang menduduki SPM pada tahun **2024**\n- Pelajar SPM 2025 perlu tunggu LSPM 2026\n- Pengajian mesti diselesaikan di dalam negara — tiada pilihan luar negara\n\n---\n\n## PERBANDINGAN RINGKAS SEMUA PROGRAM JPA\n\n| Faktor | PKJM | JKPJ | PPN | LSPM |\n|--------|------|------|-----|------|\n| Destinasi | Luar & Dalam | Luar Negara | Luar Negara (QS Top 20) | Dalam Negara |\n| Min gred A | 7A | 7A | 9A+ (STEM) / 8A+ (lain) | 9A+ |\n| Syarat subjek khusus | Ya (STEM) | Ya (STEM/Sosial) | Ya (STEM wajib 7 subjek A+) | Tidak |\n| Bilangan tempat | Tidak dinyatakan | Tidak dinyatakan | 30 sahaja | Tidak dinyatakan |\n| Tahun SPM | Terkini | Terkini | Terkini | 2024 sahaja |\n| Semua kaum | Ya | Ya | Ya | Ya |\n| Struktur pembiayaan | PBU | PBU | PBU | PBU |\n\n---\n\n## MATA PELAJARAN SPM DAN KEPENTINGANNYA\n\n### Mata Pelajaran Wajib (Semua Program STEM JPA)\n1. **Bahasa Melayu** — Min A (PKJM/JKPJ), Min A+ (PPN STEM)\n2. **Bahasa Inggeris** — Min A- (PKJM/JKPJ), Min A+ (PPN)\n3. **Matematik** — Min A (PKJM/JKPJ), Min A+ (PPN)\n4. **Matematik Tambahan** — Min A (PKJM/JKPJ STEM), Min A+ (PPN STEM)\n5. **Fizik** — Min A (PKJM/JKPJ STEM), Min A+ (PPN STEM)\n6. **Kimia** — Min A (PKJM/JKPJ STEM), Min A+ (PPN STEM)\n7. **Sejarah** — Min A- (PKJM/JKPJ), Min A+ (PPN)\n\n### Hierarki Gred SPM\n```\nA+ > A > A- > B+ > B > C+ > C > D > E > G\n```\n\n---\n\n## CARA PERMOHONAN (SEMUA PROGRAM JPA)\n\n1. Layari portal rasmi: **https://penajaan.jpa.gov.my**\n2. Daftar akaun dengan nombor MyKad\n3. Pilih program yang ingin dipohon\n4. Isi borang permohonan dalam talian\n5. Muat naik dokumen yang diperlukan:\n   - Slip keputusan SPM\n   - Salinan MyKad\n   - Sijil kokurikulum/aktiviti luar\n   - Penyata pendapatan ibu bapa/penjaga\n6. Hantar permohonan sebelum tarikh tutup\n7. Tunggu keputusan tapisan dan temu duga (jika dipanggil)\n\n### Dokumen Biasanya Diperlukan\n- Keputusan SPM (slip rasmi)\n- Kad Pengenalan (MyKad)\n- Sijil kelahiran\n- Sijil kokurikulum, kepimpinan, sukan\n- Penyata pendapatan keluarga (slip gaji / e-Kasih / LHDN)\n- Surat akuan ibu bapa / penjaga\n\n---\n\n## NOTA UNTUK SISTEM AI (AGENT)\n\n### Bagaimana Menentukan Kelayakan JPA\n\n**Langkah 1:** Semak jumlah gred A pelajar (A+, A, A-)\n- PKJM/JKPJ: perlu sekurang-kurangnya 7A\n- PPN STEM: perlu sekurang-kurangnya 9A+\n- PPN Lain: perlu sekurang-kurangnya 8A+\n- LSPM: perlu sekurang-kurangnya 9A+\n\n**Langkah 2:** Semak gred mata pelajaran spesifik (untuk PKJM/JKPJ STEM)\n- Bahasa Melayu ≥ A\n- Matematik ≥ A\n- Matematik Tambahan ≥ A\n- Fizik ≥ A\n- Kimia ≥ A\n- Bahasa Inggeris ≥ A-\n- Sejarah ≥ A-\n\n**Langkah 3:** Semak bidang minat pelajar\n- Pelajar berminat STEM → PKJM/JKPJ STEM/PPN STEM\n- Pelajar berminat Sains Sosial → JKPJ 009 (Perancis)/PPN Lain\n- Pelajar ingin dalam negara → PKJM Dalam Negara/LSPM\n\n**Langkah 4:** Semak prestasi kokurikulum (Holland Code / PAJSK)\n- PPN memerlukan rekod kokurikulum dan kepimpinan yang sangat cemerlang\n- PKJM/JKPJ/LSPM — kokurikulum sebagai faktor sokongan\n\n### Keutamaan Saranan\n1. Jika ≥ 9A+ dan minat STEM → PPN STEM (paling prestij)\n2. Jika ≥ 9A+ dan minat lain → PPN Lain / LSPM\n3. Jika 7–8A dengan STEM kuat → PKJM / JKPJ\n4. Jika 9A+ tapi nak dalam negara → LSPM\n5. Jika minat negara tertentu (Jepun/Korea/Perancis/Jerman) → JKPJ berkaitan\n\n---\n\n*Dokumen ini dijana berdasarkan iklan rasmi JPA 2025/2026. Semak portal https://penajaan.jpa.gov.my untuk maklumat terkini.*\n	2026-07-24
\.


--
-- Data for Name: imk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imk (id, r_realistik, i_investigatif, a_artistik, s_sosial, e_enterprising, k_konvensional, jumlah, kod_holland, tafsiran_utama, bidang_1, bidang_2, bidang_3, cadangan_kerjaya) FROM stdin;
SBP5IK001	44	18	48	22	25	38	195	ARK	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	REALISTIK	KONVENSIONAL	Pelbagai Bidang Profesional
SBP5IK002	42	41	19	47	40	28	217	SRI	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	REALISTIK	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK003	41	38	36	26	48	12	201	ERI	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	REALISTIK	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK004	27	34	27	41	39	11	179	SEI	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	ENTERPRISING	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK005	46	35	25	28	43	23	200	REI	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	ENTERPRISING	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK006	15	11	28	26	21	12	113	ASE	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	SOSIAL	ENTERPRISING	Pelakon, Pengarah, Wartawan
SBP5IK007	31	15	28	23	40	25	162	ERA	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	REALISTIK	ARTISTIK	Pelbagai Bidang Profesional
SBP5IK008	28	8	30	41	27	43	177	KSA	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	SOSIAL	ARTISTIK	Pelbagai Bidang Profesional
SBP5IK009	33	32	19	15	10	31	140	RIK	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	INVESTIGATIF	KONVENSIONAL	Jurutera Komputer, Penganalisis Sistem, Ahli Statistik
SBP5IK010	48	43	15	12	17	13	148	RIE	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	INVESTIGATIF	ENTERPRISING	Jurutera, Arkitek, Juruteknik
SBP5IK011	15	28	8	11	34	25	121	EIK	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	INVESTIGATIF	KONVENSIONAL	Pengurus Perniagaan, Usahawan, Pegawai Pemasaran
SBP5IK012	30	20	20	32	37	46	185	KES	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	ENTERPRISING	SOSIAL	Akauntan, Juruaudit, Pegawai Bank
SBP5IK013	38	30	45	42	37	27	219	ASR	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	SOSIAL	REALISTIK	Pelakon, Pengarah, Wartawan
SBP5IK014	39	12	8	38	32	32	161	RSE	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	SOSIAL	ENTERPRISING	Pelbagai Bidang Profesional
SBP5IK015	31	15	23	8	42	48	167	KER	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	ENTERPRISING	REALISTIK	Akauntan, Juruaudit, Pegawai Bank
SBP5IK016	36	28	18	39	47	38	206	ESK	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	SOSIAL	KONVENSIONAL	Peguam, Ahli Politik, Pengurus Projek
SBP5IK017	10	13	46	26	37	25	157	AES	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	ENTERPRISING	SOSIAL	Pelbagai Bidang Profesional
SBP5IK018	35	40	34	24	38	47	218	KIE	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	INVESTIGATIF	ENTERPRISING	Penganalisis Data, Pengaturcara, Pegawai Perangkaan
SBP5IK019	38	32	9	33	28	28	168	RSI	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	SOSIAL	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK020	18	14	19	28	47	26	152	ESK	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	SOSIAL	KONVENSIONAL	Peguam, Ahli Politik, Pengurus Projek
SBP5IK021	47	19	30	35	35	29	195	RSE	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	SOSIAL	ENTERPRISING	Pelbagai Bidang Profesional
SBP5IK022	31	45	40	10	48	8	182	EIA	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	INVESTIGATIF	ARTISTIK	Pengurus Perniagaan, Usahawan, Pegawai Pemasaran
SBP5IK023	22	38	13	25	45	13	156	EIS	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	INVESTIGATIF	SOSIAL	Pengurus Perniagaan, Usahawan, Pegawai Pemasaran
SBP5IK024	44	15	20	20	20	46	165	KRA	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	REALISTIK	ARTISTIK	Juruteknik, Pengurus Operasi, Pegawai Pentadbir
SBP5IK025	12	12	8	44	35	41	152	SKE	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	KONVENSIONAL	ENTERPRISING	Pelbagai Bidang Profesional
SBP5IK026	31	8	17	34	9	13	112	SRA	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	REALISTIK	ARTISTIK	Pelbagai Bidang Profesional
SBP5IK027	16	37	10	9	45	21	138	EIK	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	INVESTIGATIF	KONVENSIONAL	Pengurus Perniagaan, Usahawan, Pegawai Pemasaran
SBP5IK028	43	22	15	29	31	13	153	RES	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	ENTERPRISING	SOSIAL	Pelbagai Bidang Profesional
SBP5IK029	39	27	9	9	8	39	131	RKI	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	KONVENSIONAL	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK030	26	47	29	28	41	16	187	IEA	Gemar menyelidik, menganalisis dan menyelesaikan masalah kompleks. Sesuai dengan bidang sains dan penyelidikan.	INVESTIGATIF	ENTERPRISING	ARTISTIK	Pelbagai Bidang Profesional
SBP5IK031	29	14	29	32	39	36	179	EKS	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	KONVENSIONAL	SOSIAL	Akauntan, Pengurus Kewangan, Perancang Kewangan
SBP5IK032	25	20	13	41	20	16	135	SRI	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	REALISTIK	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK033	24	14	19	34	41	16	148	ESR	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	SOSIAL	REALISTIK	Peguam, Ahli Politik, Pengurus Projek
SBP5IK034	16	38	42	37	37	28	198	AIS	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	INVESTIGATIF	SOSIAL	Penulis, Guru Seni, Penggubah Muzik
SBP5IK035	48	23	8	9	9	13	110	RIK	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	INVESTIGATIF	KONVENSIONAL	Jurutera Komputer, Penganalisis Sistem, Ahli Statistik
SBP5IK036	17	29	19	31	24	23	143	SIE	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	INVESTIGATIF	ENTERPRISING	Pengurus Sumber Manusia, Pekerja Sosial, Pegawai Kebajikan
SBP5IK037	27	47	8	39	36	46	203	IKS	Gemar menyelidik, menganalisis dan menyelesaikan masalah kompleks. Sesuai dengan bidang sains dan penyelidikan.	INVESTIGATIF	KONVENSIONAL	SOSIAL	Pelbagai Bidang Profesional
SBP5IK038	32	44	26	25	22	10	159	IRA	Gemar menyelidik, menganalisis dan menyelesaikan masalah kompleks. Sesuai dengan bidang sains dan penyelidikan.	INVESTIGATIF	REALISTIK	ARTISTIK	Doktor Perubatan, Penyelidik, Ahli Kimia
SBP5IK039	26	18	33	9	30	13	129	AER	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	ENTERPRISING	REALISTIK	Pelbagai Bidang Profesional
SBP5IK040	15	20	32	29	23	32	151	AKS	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	KONVENSIONAL	SOSIAL	Pelbagai Bidang Profesional
SBP5IK041	10	23	16	41	18	32	140	SKI	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	KONVENSIONAL	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK042	47	12	47	39	20	20	185	RAS	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	ARTISTIK	SOSIAL	Pelbagai Bidang Profesional
SBP5IK043	35	26	26	32	27	48	194	KRS	Teliti, teratur dan suka bekerja dengan data dan sistem. Sesuai dengan bidang perakaunan dan pentadbiran.	KONVENSIONAL	REALISTIK	SOSIAL	Juruteknik, Pengurus Operasi, Pegawai Pentadbir
SBP5IK044	35	23	45	32	37	36	208	AEK	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	ENTERPRISING	KONVENSIONAL	Pelbagai Bidang Profesional
SBP5IK045	48	33	14	31	36	18	180	REI	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	ENTERPRISING	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK046	25	21	10	14	18	19	107	RIK	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	INVESTIGATIF	KONVENSIONAL	Jurutera Komputer, Penganalisis Sistem, Ahli Statistik
SBP5IK047	32	29	38	19	35	16	169	AER	Berbakat dalam kreativiti, seni dan ekspresi diri. Sesuai dengan bidang seni, muzik dan penulisan.	ARTISTIK	ENTERPRISING	REALISTIK	Pelbagai Bidang Profesional
SBP5IK048	23	14	16	41	34	17	145	SER	Suka membantu, mengajar dan berinteraksi dengan orang lain. Sesuai dengan bidang pendidikan dan perkhidmatan.	SOSIAL	ENTERPRISING	REALISTIK	Pelbagai Bidang Profesional
SBP5IK049	44	40	13	33	14	44	188	RKI	Meminati kerja-kerja hands-on, teknikal dan fizikal. Sesuai dengan bidang kejuruteraan dan teknikal.	REALISTIK	KONVENSIONAL	INVESTIGATIF	Pelbagai Bidang Profesional
SBP5IK050	41	36	32	8	45	14	176	ERI	Berjiwa kepimpinan, persuasif dan berorientasikan perniagaan. Sesuai dengan bidang pengurusan dan keusahawanan.	ENTERPRISING	REALISTIK	INVESTIGATIF	Pelbagai Bidang Profesional
\.


--
-- Data for Name: ipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ipt (id, kategori, nama, nama_penuh) FROM stdin;
1	Universiti Awam	UM	Universiti Malaya
2	Universiti Awam	UiTM	Universiti Teknologi MARA
3	Universiti Awam	UTM	Universiti Teknologi Malaysia
4	Universiti Awam	UKM	Universiti Kebangsaan Malaysia
5	Universiti Awam	USM	Universiti Sains Malaysia
6	Universiti Awam	UPM	Universiti Putra Malaysia
7	Universiti Awam	UIAM	Universiti Islam Antarabangsa Malaysia
8	Universiti Awam	UUM	Universiti Utara Malaysia
9	Universiti Swasta	Taylors	Taylor's University
10	Universiti Swasta	MMU	Multimedia University
11	Universiti Swasta	Sunway	Sunway University
12	Universiti Swasta	HELP	HELP University
13	Politeknik	Politeknik Sultan Salahuddin Shah	Politeknik Sultan Salahuddin Shah, Shah Alam
14	Politeknik	Politeknik Metro KL	Politeknik Metro Kuala Lumpur
15	Politeknik	Politeknik Ungku Omar	Politeknik Ungku Omar, Ipoh
16	Politeknik	Politeknik Muadzam Shah	Politeknik Muadzam Shah, Pahang
17	Kolej Komuniti	KK Hulu Langat	Kolej Komuniti Hulu Langat
18	Kolej Komuniti	KK Banting	Kolej Komuniti Banting
19	Kolej Komuniti	KK Kuala Langat	Kolej Komuniti Kuala Langat
20	Matrikulasi	KM Selangor	Kolej Matrikulasi Selangor
21	Matrikulasi	KM Melaka	Kolej Matrikulasi Melaka
22	Matrikulasi	KM Johor	Kolej Matrikulasi Johor
23	Matrikulasi	KM Pahang	Kolej Matrikulasi Pahang
24	Form Six	Form 6 SBP	Tingkatan 6 — Sekolah Berasrama Penuh
25	Form Six	Form 6 Sekolah Harian	Tingkatan 6 — Sekolah Menengah Harian
26	IPG	IPG Kampus Ilmu Khas	Institut Pendidikan Guru Kampus Ilmu Khas, KL
27	IPG	IPG Kampus Bahasa Melayu	Institut Pendidikan Guru Kampus Bahasa Melayu, KL
28	IPG	IPG Kampus Raja Melewar	Institut Pendidikan Guru Kampus Raja Melewar, NS
29	Institut Kemahiran	IKM Shah Alam	Institut Kemahiran MARA Shah Alam
30	Institut Kemahiran	IKBN Dusun Tua	Institut Kemahiran Belia Negara Dusun Tua
31	Institut Kemahiran	GiatMARA KL	Pusat GiatMARA Kuala Lumpur
32	Universiti Awam	UMPSA	Universiti Malaysia Pahang Al-Sultan Abdullah
33	Universiti Awam	UNIMAS	Universiti Malaysia Sarawak
34	Universiti Awam	USIM	Universiti Sains Islam Malaysia
35	Universiti Awam	UniMAP	Universiti Malaysia Perlis
36	Universiti Awam	UMP	Universiti Malaysia Pahang
37	Universiti Awam	UPSI	Universiti Pendidikan Sultan Idris
38	Universiti Awam	UMT	Universiti Malaysia Terengganu
39	Universiti Awam	UMS	Universiti Malaysia Sabah
40	Universiti Awam	UniSZA	Universiti Sultan Zainal Abidin
41	Universiti Awam	UNIMAP	Universiti Malaysia Perlis
42	Universiti Swasta	UTP	Universiti Teknologi PETRONAS
43	Universiti Swasta	UNITEN	Universiti Tenaga Nasional
44	Universiti Swasta	UniKL	Universiti Kuala Lumpur
45	Universiti Swasta	UCSI	UCSI University
46	Universiti Swasta	UTAR	Universiti Tunku Abdul Rahman
47	Universiti Swasta	INTI	INTI International University
48	Universiti Swasta	APU	Asia Pacific University of Technology & Innovation
49	Universiti Swasta	MAHSA	MAHSA University
50	Universiti Swasta	LUCT	Limkokwing University of Creative Technology
51	Universiti Swasta	XMUM	Xiamen University Malaysia
52	Kolej Persediaan	INTEC	INTEC Education College, Shah Alam
53	Kolej Persediaan	Asasi UM	Pusat Asasi Sains Universiti Malaya
54	Kolej Persediaan	Asasi UiTM	Pusat Asasi UiTM
55	Kolej Persediaan	Asasi UPM	Pusat Asasi Sains Pertanian UPM
56	Kolej Persediaan	PASUM	Pusat Asasi Sains Universiti Malaya
57	Kolej Persediaan	UniKL-MIIT	Universiti Kuala Lumpur — Malaysian Institute of Information Technology
58	Kolej Persediaan	UniKL-MFI	Universiti Kuala Lumpur — Malaysian French Institute
59	Universiti Luar Negara	Oxford	University of Oxford, United Kingdom
60	Universiti Luar Negara	Cambridge	University of Cambridge, United Kingdom
61	Universiti Luar Negara	Imperial	Imperial College London, United Kingdom
62	Universiti Luar Negara	UCL	University College London, United Kingdom
63	Universiti Luar Negara	LSE	London School of Economics and Political Science, United Kingdom
64	Universiti Luar Negara	Manchester	University of Manchester, United Kingdom
65	Universiti Luar Negara	Edinburgh	University of Edinburgh, United Kingdom
66	Universiti Luar Negara	Nottingham	University of Nottingham, United Kingdom
67	Universiti Luar Negara	MIT	Massachusetts Institute of Technology, USA
68	Universiti Luar Negara	Stanford	Stanford University, USA
69	Universiti Luar Negara	Harvard	Harvard University, USA
70	Universiti Luar Negara	Caltech	California Institute of Technology, USA
71	Universiti Luar Negara	Yale	Yale University, USA
72	Universiti Luar Negara	Columbia	Columbia University, USA
73	Universiti Luar Negara	Cornell	Cornell University, USA
74	Universiti Luar Negara	Princeton	Princeton University, USA
75	Universiti Luar Negara	UChicago	University of Chicago, USA
76	Universiti Luar Negara	ETH Zurich	ETH Zurich — Swiss Federal Institute of Technology, Switzerland
77	Universiti Luar Negara	TU Munich	Technical University of Munich, Germany
78	Universiti Luar Negara	Sciences Po	Sciences Po Paris, France
79	Universiti Luar Negara	Grenoble EM	Grenoble Ecole de Management, France
80	Universiti Luar Negara	SKEMA	SKEMA Business School, France
81	Universiti Luar Negara	Carl Duisberg	Carl Duisberg Centren GmbH, Germany
82	Universiti Luar Negara	UTokyo	University of Tokyo, Japan
83	Universiti Luar Negara	Osaka Univ	Osaka University, Japan
84	Universiti Luar Negara	Tohoku Univ	Tohoku University, Japan
85	Universiti Luar Negara	KOSEN	National Institute of Technology (KOSEN), Japan
86	Universiti Luar Negara	Nagoya Univ	Nagoya University, Japan
87	Universiti Luar Negara	Seoul Nat'l	Seoul National University, South Korea
88	Universiti Luar Negara	KAIST	Korea Advanced Institute of Science and Technology, South Korea
89	Universiti Luar Negara	POSTECH	Pohang University of Science and Technology, South Korea
90	Universiti Luar Negara	Yonsei	Yonsei University, South Korea
91	Universiti Luar Negara	Korea Univ	Korea University, South Korea
92	Universiti Luar Negara	ANU	Australian National University, Australia
93	Universiti Luar Negara	Melbourne	University of Melbourne, Australia
94	Universiti Luar Negara	Auckland	University of Auckland, New Zealand
95	Universiti Luar Negara	Otago	University of Otago, New Zealand
\.


--
-- Data for Name: keputusan_spm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.keputusan_spm (id, password, bm, bi, mm, sej, pai, mt, bckom, fizik, kimia, bio, gp, ringkasan_gred) FROM stdin;
SBP5IK001	1IJUY0A6	A+	A+	A+	A+	A+	A+	-	A+	A+	A+	0.00	10A+
SBP5IK002	QH9HATVX	A+	A+	A+	A+	A+	A+	-	A+	A+	A+	0.00	10A+
SBP5IK003	BMYNMD5J	B+	A+	A	A	A+	A-	-	A	A+	A+	1.00	4A+, 3A, 2A-, 1B+
SBP5IK004	3BZCKSII	A-	B	E	C	A-	B	-	A-	A	A+	3.30	1A+, 1A, 3A-, 3B, 1C, 1E
SBP5IK005	IYZC4WTG	B+	B+	A-	C	A-	B+	-	A	A-	A-	2.60	1A, 5A-, 3B+, 1C
SBP5IK006	O6ZUCH02	B+	A-	B+	A+	A+	A	-	B+	A	A	1.90	2A+, 3A, 1A-, 3B+, 1C+
SBP5IK007	TP0HNV98	A	B+	A-	D	A	C+	-	A-	D	A+	2.90	1A+, 3A, 2A-, 1B+, 1C+, 2D
SBP5IK008	ZQJTVN6V	B	B+	D	A-	E	A+	-	B	C+	B+	3.70	1A+, 1A, 1A-, 2B+, 2B, 1C+, 1D, 1E
SBP5IK009	68ZF1JAZ	A	C+	A-	A	A+	A-	-	A	A+	C	1.90	2A+, 4A, 2A-, 1C+, 1C
SBP5IK010	R8RNEV97	A	A	A	A+	D	D	-	A+	B	B+	2.40	3A+, 3A, 1B+, 1B, 2D
SBP5IK011	J8R51TEY	A+	B	E	A	A	C	-	A+	C+	A+	2.80	3A+, 2A, 1B+, 1B, 1C+, 1C, 1E
SBP5IK012	7VIQHMEI	A-	E	C+	C+	A	B	-	A+	A+	A-	3.00	2A+, 1A, 2A-, 1B+, 1B, 2C+, 1E
SBP5IK013	U8YE7CIH	B+	A+	A+	A	B+	A+	-	A+	A	A+	0.80	6A+, 2A, 2B+
SBP5IK014	XXL6BC5O	D	B+	A+	B+	A+	B	-	A-	A	B	2.80	2A+, 1A, 1A-, 2B+, 3B, 1D
SBP5IK015	NP7T5IK2	A+	C+	A+	A	A+	B+	-	B+	B+	A+	1.50	5A+, 1A, 3B+, 1C+
SBP5IK016	JHOCNP97	A+	B	A-	B+	A-	A	-	B	A	B+	2.10	1A+, 3A, 2A-, 2B+, 2B
SBP5IK017	UG0V0CST	A	C+	B+	C+	B+	A	-	B	C	E	3.80	2A, 1A-, 2B+, 1B, 2C+, 1C, 1E
SBP5IK018	B71CXUUM	B+	B	A-	B	B	G	-	A+	A+	A	2.90	2A+, 1A, 2A-, 1B+, 3B, 1G
SBP5IK019	4V7UQWA7	A-	A-	E	B	A-	A	-	C+	G	A-	3.60	2A, 4A-, 1B, 1C+, 1E, 1G
SBP5IK020	HKTK3P59	A-	A+	A+	A	A+	A+	-	A	A+	A	0.70	5A+, 3A, 2A-
SBP5IK021	4FDMK8HY	B+	A	C+	C	A-	C+	-	C+	A	C	3.90	2A, 1A-, 1B+, 4C+, 2C
SBP5IK022	2TA0KPJW	B	A+	C+	B+	B	A	-	C+	B+	A+	2.70	2A+, 1A, 1A-, 2B+, 2B, 2C+
SBP5IK023	64ELH260	B+	A	A+	A+	A	A+	-	A+	A+	A+	0.50	7A+, 2A, 1B+
SBP5IK024	A52F20L7	A+	A	C+	A-	A	A	-	B	A	B+	1.80	2A+, 4A, 1A-, 1B+, 1B, 1C+
SBP5IK025	5XGMO37I	A+	B+	A	A+	A+	A+	-	A	A-	A+	0.80	5A+, 3A, 1A-, 1B+
SBP5IK026	9V5JA1UB	D	A+	E	B+	E	A	-	C	B+	G	4.50	2A+, 1A, 2B+, 1C, 1D, 2E, 1G
SBP5IK027	Z7BAT0Y6	A	C+	A-	E	C	A	-	E	A+	D	4.40	1A+, 2A, 1A-, 1C+, 2C, 1D, 2E
SBP5IK028	GTX4YZQL	C+	A	G	B	D	B	-	G	D	B+	5.30	1A, 1B+, 3B, 1C+, 2D, 2G
SBP5IK029	M400K3FC	C	E	A	C	A	G	-	A	A-	B	4.60	3A, 1A-, 1B, 2C, 2E, 1G
SBP5IK030	D33LLYO7	D	G	B	A-	B+	C+	-	B+	C	C+	4.90	1A-, 2B+, 1B, 3C+, 1C, 1D, 1G
SBP5IK031	VZECL4CJ	C+	C+	B	A+	B	C	-	E	C	D	5.20	1A+, 2B, 2C+, 2C, 2D, 1E
SBP5IK032	MQA6YLR8	B+	A	C	E	E	C	-	A+	C	C	4.80	1A+, 1A, 1B+, 1B, 4C, 2E
SBP5IK033	PBK265U8	C+	A	B	C	B+	C+	-	B	D	C	4.70	1A, 1B+, 2B, 2C+, 3C, 1D
SBP5IK034	03J4RX4N	E	A-	A	C+	C+	A	-	D	B+	B+	4.00	2A, 1A-, 2B+, 3C+, 1D, 1E
SBP5IK035	YRJTOYS8	B+	E	C+	C	B+	B	-	D	A+	B	4.20	1A+, 1A-, 2B+, 2B, 1C+, 1C, 1D, 1E
SBP5IK036	2O3PCLER	B	G	B	D	C	G	-	C	C	B	5.90	4B, 3C, 1D, 2G
SBP5IK037	L7WDUVK0	E	B	C+	B	C	E	-	C+	B+	C	5.60	1B+, 2B, 2C+, 2C, 1D, 2E
SBP5IK038	A8VRXAIC	C	G	D	B	A-	E	-	A-	C	E	5.50	2A-, 1B+, 1B, 2C, 1D, 2E, 1G
SBP5IK039	W21IK8Z1	C	E	E	E	D	C+	-	C+	A+	B	5.20	1A+, 1A, 1B, 2C+, 1C, 1D, 3E
SBP5IK040	BQI74XO4	C+	C	D	D	C	C+	-	B	A	D	5.20	1A, 2B, 2C+, 2C, 3D
SBP5IK041	J9JOV33Y	E	C+	A+	G	A+	B+	-	A	B+	E	4.10	2A+, 1A, 2B+, 1B, 1C+, 2E, 1G
SBP5IK042	HWGE3DZT	G	B	A-	A+	C+	C+	-	C+	A	C+	4.30	1A+, 1A, 1A-, 1B, 4C+, 1D, 1G
SBP5IK043	WHTW62GH	C	B	B	D	D	E	-	E	B+	A+	5.10	1A+, 1B+, 3B, 1C, 2D, 2E
SBP5IK044	L3J83MA6	E	B	C	D	C+	A+	-	A-	C	B	4.80	1A+, 1A-, 2B, 1C+, 3C, 1D, 1E
SBP5IK045	D7P3IPR1	C+	C+	B	C+	C+	C+	-	A-	A-	D	4.10	1A, 2A-, 1B, 5C+, 1D
SBP5IK046	4GEF2B18	D	C	C+	D	G	C	-	E	E	C	6.60	1B, 1C+, 3C, 2D, 2E, 1G
SBP5IK047	7630D5HZ	C+	A	B	A+	G	E	-	C	C+	B+	4.80	1A+, 1A, 1B+, 1B, 2C+, 1C, 1D, 1E, 1G
SBP5IK048	L3SI647J	C	D	D	D	E	C+	-	C+	A	D	5.90	1A, 2C+, 2C, 4D, 1E
SBP5IK049	SVSQZYT3	C	C	E	B	B+	B+	-	B	A	B+	4.20	1A, 3B+, 3B, 2C, 1E
SBP5IK050	XF4VO4SX	A-	E	C	D	G	D	-	G	G	C+	6.80	1A-, 1C+, 2C, 2D, 1E, 3G
\.


--
-- Data for Name: kursus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kursus (id, kod, nama, bidang, holland) FROM stdin;
1	K001	Kejuruteraan Awam	Kejuruteraan	RIC
2	K002	Kejuruteraan Elektrik	Kejuruteraan	RIC
3	K003	Kejuruteraan Elektronik	Kejuruteraan	RIC
4	K004	Kejuruteraan Mekanikal	Kejuruteraan	RIC
5	K005	Kejuruteraan Kimia	Kejuruteraan	RIC
6	K006	Kejuruteraan Petroleum	Kejuruteraan	RIC
7	K007	Kejuruteraan Komputer	Kejuruteraan	RIC
8	K008	Kejuruteraan Aeroangkasa	Kejuruteraan	RIC
9	K009	Kejuruteraan Bioperubatan	Kejuruteraan	RIC
10	K010	Kejuruteraan Industri	Kejuruteraan	RIC
11	K011	Kejuruteraan Struktur	Kejuruteraan	RIC
12	K012	Kejuruteraan Alam Sekitar	Kejuruteraan	RIC
13	K013	Sains Komputer	Sains & Teknologi	IRC
14	K014	Teknologi Maklumat	Sains & Teknologi	IRC
15	K015	Kecerdasan Buatan (AI)	Sains & Teknologi	IRC
16	K016	Sains Data	Sains & Teknologi	IRC
17	K017	Keselamatan Siber	Sains & Teknologi	IRC
18	K018	Sains Fizik	Sains & Teknologi	IRC
19	K019	Sains Kimia	Sains & Teknologi	IRC
20	K020	Sains Matematik	Sains & Teknologi	IRC
21	K021	Statistik	Sains & Teknologi	IRC
22	K022	Bioteknologi	Sains & Teknologi	IRC
23	K023	Sains Hayat	Sains & Teknologi	IRC
24	K024	Sains Alam Sekitar	Sains & Teknologi	IRC
25	K025	Fizik Gunaan	Sains & Teknologi	IRC
26	K026	Nanoteknologi	Sains & Teknologi	IRC
27	K027	Perubatan (MBBS)	Perubatan & Kesihatan	ISA
28	K028	Pergigian	Perubatan & Kesihatan	ISA
29	K029	Farmasi	Perubatan & Kesihatan	ISA
30	K030	Kejururawatan	Perubatan & Kesihatan	ISA
31	K031	Sains Bioperubatan	Perubatan & Kesihatan	ISA
32	K032	Fisioterapi	Perubatan & Kesihatan	ISA
33	K033	Pemakanan & Dietetik	Perubatan & Kesihatan	ISA
34	K034	Perakaunan	Perniagaan & Ekonomi	CSE
35	K035	Kewangan	Perniagaan & Ekonomi	CSE
36	K036	Ekonomi	Perniagaan & Ekonomi	CSE
37	K037	Pentadbiran Perniagaan (BBA)	Perniagaan & Ekonomi	CSE
38	K038	Pemasaran	Perniagaan & Ekonomi	CSE
39	K039	Pengurusan	Perniagaan & Ekonomi	CSE
40	K040	Perbankan & Kewangan Islam	Perniagaan & Ekonomi	CSE
41	K041	Actuarial Science	Perniagaan & Ekonomi	CSE
42	K042	Logistik & Pengurusan Rantaian	Perniagaan & Ekonomi	CSE
43	K043	Hubungan Antarabangsa	Sains Sosial	ESA
44	K044	Sains Politik	Sains Sosial	ESA
45	K045	Sosiologi	Sains Sosial	ESA
46	K046	Psikologi	Sains Sosial	ESA
47	K047	Komunikasi & Media	Sains Sosial	ESA
48	K048	Pengajian Bahasa Inggeris	Sains Sosial	ASE
49	K049	Pengajian Bahasa Melayu	Sains Sosial	ASE
50	K050	Undang-Undang	Sains Sosial	ESA
51	K051	Pendidikan	Sains Sosial	SAI
52	K052	Sejarah	Sains Sosial	ASE
53	K053	Seni Bina (Architecture)	Seni & Reka Bentuk	ARI
54	K054	Reka Bentuk Grafik	Seni & Reka Bentuk	AER
55	K055	Reka Bentuk Dalaman	Seni & Reka Bentuk	AER
56	K056	Animasi & Multimedia	Seni & Reka Bentuk	AER
57	K057	Muzik	Seni & Reka Bentuk	AES
58	K058	Filem & Televisyen	Seni & Reka Bentuk	AES
59	K059	Sains Pertanian	Pertanian	RIA
60	K060	Agroteknologi	Pertanian	RIA
61	K061	Sains Perhutanan	Pertanian	RIA
62	K062	Sains Perikanan & Akuakultur	Pertanian	RIA
63	K063	Pengurusan Alam Sekitar	Pertanian	RIA
\.


--
-- Data for Name: murid_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.murid_status (id, status, ipt_id, bidang, dapat_biasiswa, nama_biasiswa, updated_at) FROM stdin;
SBP5IK001	bekerja	\N	\N	f	\N	2026-07-15 15:35:57.654766+05:30
\.


--
-- Data for Name: pajsk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pajsk (id, jenis_sukan, jawatan_sukan, peringkat_sukan, nama_kelab, jawatan_kelab, peringkat_kelab, nama_badan, jawatan_bb, peringkat_bb, komitmen, khidmat_sumbangan, kehadiran, tahap_pencapaian, penyertaan, prestasi, tingkatan_1, tingkatan_2, tingkatan_3, tingkatan_4, tingkatan_5, tingkatan_empat, gpa_cgpa, gred_10_peratus, markah, peratus, perkhidmatan, anugerah_khas, khidmat_masyarakat, program_nilam, tims_pisa, catatan) FROM stdin;
SBP5IK001	SILAT (SR)	BENDAHARI (6)	NEGERI (14)	KELAB KOMPUTER ICT (SR)	NAIB PENGERUSI (8)	KEBANGSAAN (15)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	KOPERAL (5)	ZON/DAERAH (11)	MENGEMAS PERALATAN (2), MENEPATI WAKTU (2), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [NEGERI]	12	40	67.38 / 64.65	80.52 / 77.46	63.05 / 62.92	68.39 / 66.82	80.77 / 77.36	68.77 / 62.82	7.26 / A	\N	77	70.00	\N	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)(8)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(2 BINTANG)(7)	10	\N
SBP5IK002	HOKI (SR)	AHLI AKTIF (4)	DAERAH (8)	PERSATUAN BAHASA ARAB (SR)	NAIB PENGERUSI (8)	ANTARABANGSA (20)	PERSEKUTUAN PENGAKAP MALAYSIA (SR)	BENDAHARI (6)	ZON/DAERAH (9)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [SEKOLAH]	12	40	65.51 / 62.54	64.94 / 63.86	81.91 / 62.33	78.46 / 74.34	82.43 / 62.72	96.66 / 62.07	9.53 / A	\N	77	70.00	\N	ANUGERAH REMAJA PERDANA (EMAS)(10)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(5 BINTANG)(10)	10	\N
SBP5IK003	TENIS MEJA (SR)	KAPTEN (7)	ANTARABANGSA (20)	KELAB SENI VISUAL (SR)	PENGERUSI (10)	ANTARABANGSA (20)	KADET REMAJA SEKOLAH (KRS) (SR)	KOPERAL (5)	ZON/DAERAH (9)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [KEBANGSAAN]	12	40	90.13 / 73.04	71.47 / 65.78	82.82 / 71.16	86.07 / 81.45	86.22 / 63.87	81.65 / 60.37	8.46 / A	\N	73	66.36	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	\N	AKTIVITI INSANIAH(10)	-(1 BINTANG)(6)	10	\N
SBP5IK004	SEPAK TAKRAW (SR)	BENDAHARI (6)	KEBANGSAAN (17)	KELAB FIZIK (SR)	AHLI AKTIF (4)	ANTARABANGSA (20)	KOR KADET POLIS (SR)	SARJAN (6)	NEGERI (14)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	70.86 / 62.28	92.99 / 65.33	67.52 / 60.38	94.09 / 82.85	90.48 / 89.47	83.33 / 77.08	8.25 / A	\N	65	59.09	TIMBALAN/PENOLONG KETUA MURID (8)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)(8)	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(4 BINTANG)(9)	10	\N
SBP5IK005	RAGBI (SR)	AHLI JAWATANKUASA (5)	NEGERI (14)	KELAB SEJARAH (SR)	PENGERUSI (10)	ZON/DAERAH (11)	KOR KADET TENTERA UDARA (SR)	KOPERAL (5)	ANTARABANGSA (20)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [SEKOLAH]	12	40	89.2 / 60.26	86.37 / 62.88	69.55 / 60.79	77.73 / 61.92	86.57 / 67.54	94.46 / 78.35	9.45 / A	\N	83	75.45	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH REMAJA PERDANA (PERAK)(8)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(1 BINTANG)(6)	10	\N
SBP5IK006	TAEKWONDO (SR)	NAIB BENDAHARI (5)	ZON/DAERAH (11)	KELAB KEUSAHAWANAN (SR)	AHLI AKTIF (4)	DAERAH (8)	KOR KADET TENTERA LAUT (SR)	AHLI JAWATANKUASA (5)	NEGERI (14)	MENUNJUKKAN KEPIMPINAN (3), MENEPATI WAKTU (2), MEMBERSIH KAWASAN (2), MENYEDIA PERALATAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	LULUS	12	40	76.82 / 74.61	76.01 / 71.95	82.79 / 76.11	73.44 / 61.06	86.98 / 63.91	75.3 / 71.96	7.15 / A	\N	77	70.00	\N	\N	\N	-(5 BINTANG)(10)	10	\N
SBP5IK007	BOLA SEPAK (SR)	NAIB PENGERUSI (8)	KEBANGSAAN (15)	KELAB GEOGRAFI (SR)	BENDAHARI (6)	SEKOLAH (5)	KOR KADET TENTERA DARAT (SR)	SETIAUSAHA (7)	ZON/DAERAH (9)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [SEKOLAH]	12	40	87.08 / 79.83	83.57 / 68.88	94.55 / 70.38	75.3 / 69.9	89.26 / 60.15	78.64 / 75.72	8.49 / A	\N	102	92.73	\N	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2 (PENERIMA)(4)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(1 BINTANG)(6)	10	\N
SBP5IK008	BADMINTON (SR)	PENGERUSI (10)	NEGERI (12)	PERSATUAN BAHASA INGGERIS (SR)	BENDAHARI (6)	DAERAH (8)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	SETIAUSAHA (7)	ZON/DAERAH (11)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [SEKOLAH]	12	40	63.67 / 63.67	89.0 / 74.84	64.65 / 63.43	69.55 / 65.42	89.28 / 69.51	70.5 / 65.1	8.31 / A	\N	73	66.36	\N	ANUGERAH REMAJA PERDANA (EMAS)(10)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(1 BINTANG)(6)	10	\N
SBP5IK009	CATUR (SR)	KAPTEN (7)	NEGERI (14)	KELAB MUZIK (SR)	NAIB BENDAHARI (5)	SEKOLAH (5)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	BENDAHARI (6)	KEBANGSAAN (15)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [NEGERI]	12	40	96.73 / 72.66	67.38 / 61.95	97.33 / 70.92	80.23 / 74.08	65.48 / 63.22	64.51 / 61.3	9.89 / A	\N	86	78.18	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)(10)	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(5 BINTANG)(10)	10	\N
SBP5IK010	MEMANAH (SR)	AHLI JAWATANKUASA (5)	ZON/DAERAH (11)	KELAB PERTANIAN (SR)	AHLI AKTIF (4)	NEGERI (14)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	SARJAN (6)	KEBANGSAAN (17)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [KEBANGSAAN]	12	40	94.09 / 74.64	89.81 / 60.72	84.0 / 82.72	78.23 / 75.87	87.18 / 60.56	64.83 / 61.6	9.91 / A	\N	71	64.55	TIMBALAN/PENOLONG KETUA MURID (8)	ANUGERAH REMAJA PERDANA (GANGSA)(6)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(2 BINTANG)(7)	10	\N
SBP5IK011	BOLA KERANJANG (SR)	PENGERUSI (10)	DAERAH (8)	KELAB REKA BENTUK DAN TEKNOLOGI (SR)	BENDAHARI (6)	KEBANGSAAN (15)	KOR KADET TENTERA DARAT (SR)	SARJAN MEJAR (7)	ANTARABANGSA (20)	MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	68.4 / 63.58	62.9 / 61.71	80.86 / 69.0	69.41 / 66.01	63.32 / 63.1	79.87 / 72.14	8.27 / A-	\N	75	68.18	KETUA PENGAWAS/PENGAWAS SEKOLAH (8)	AKTIVITI INSANIAH(10)	\N	-(3 BINTANG)(8)	10	\N
SBP5IK012	RENANG (SR)	AHLI AKTIF (4)	KEBANGSAAN (17)	KELAB KOPERASI SEKOLAH (SM)	NAIB SETIAUSAHA (6)	ZON/DAERAH (11)	KOR KADET TENTERA UDARA (SR)	SARJAN MEJAR (7)	ZON/DAERAH (11)	MENGEMAS PERALATAN (2), MEMBERSIH KAWASAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	LULUS	12	40	94.58 / 84.28	86.52 / 81.05	97.24 / 86.79	68.62 / 64.83	69.88 / 63.46	73.26 / 69.84	8.61 / A	\N	90	81.82	AHLI LEMBAGA PENGARAH KOPERASI SEKOLAH (6)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)(8)	\N	-(4 BINTANG)(9)	10	\N
SBP5IK013	OLAHRAGA (SR)	KAPTEN (7)	ZON/DAERAH (9)	KELAB SAINS (SR)	AHLI AKTIF (4)	ANTARABANGSA (20)	KADET REMAJA SEKOLAH (KRS) (SR)	SARJAN MEJAR (7)	KEBANGSAAN (17)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ANTARABANGSA]	12	40	70.64 / 68.58	80.78 / 66.5	71.74 / 71.05	75.52 / 64.88	95.39 / 61.05	62.99 / 62.85	7.75 / A	\N	93	84.55	KETUA PENGAWAS/PENGAWAS SEKOLAH (8)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)(10)	AKTIVITI INSANIAH(10)	-(2 BINTANG)(7)	10	\N
SBP5IK014	SKUASY (SR)	NAIB BENDAHARI (5)	ZON/DAERAH (11)	KELAB BIOLOGI (SR)	NAIB SETIAUSAHA (6)	SEKOLAH (5)	KADET REMAJA SEKOLAH (KRS) (SR)	NAIB PENGERUSI (8)	ZON/DAERAH (9)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ANTARABANGSA]	12	40	84.0 / 71.92	97.11 / 77.95	77.14 / 63.21	92.21 / 61.61	62.59 / 60.95	91.78 / 68.09	8.4 / A-	\N	80	72.73	KETUA ASRAMA/PENGAWAS ASRAMA (7)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)(10)	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(1 BINTANG)(6)	10	\N
SBP5IK015	BOLA TAMPAR (SR)	AHLI JAWATANKUASA (5)	KEBANGSAAN (15)	PERSATUAN BAHASA MELAYU (SR)	NAIB PENGERUSI (8)	SEKOLAH (5)	PENGAKAP PUTERI (SR)	SETIAUSAHA (7)	ZON/DAERAH (11)	MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [NEGERI]	12	40	96.17 / 64.15	87.72 / 86.68	81.3 / 60.33	72.73 / 65.63	77.27 / 72.51	68.43 / 60.06	8.97 / A	\N	88	80.00	PEMIMPIN RUMAH SUKAN (6)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1 (PENERIMA)(6)	\N	-(1 BINTANG)(6)	10	\N
SBP5IK016	BOLA JARING (SR)	KAPTEN (7)	KEBANGSAAN (15)	PERSATUAN EKONOMI (SR)	NAIB PENGERUSI (8)	KEBANGSAAN (15)	PANDU PUTERI MALAYSIA (SR)	NAIB PENGERUSI (8)	DAERAH (8)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [NEGERI]	12	40	70.08 / 65.98	95.47 / 79.28	87.21 / 62.85	86.7 / 60.69	80.97 / 60.58	73.4 / 61.47	7.83 / A-	\N	78	70.91	\N	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1 (PENERIMA)(6)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(1 BINTANG)(6)	10	\N
SBP5IK017	SILAT (SR)	KAPTEN (7)	ZON/DAERAH (9)	KELAB PENDIDIKAN ISLAM (SR)	AHLI JAWATANKUASA (5)	ANTARABANGSA (20)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	BENDAHARI (6)	KEBANGSAAN (17)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KEEMPAT [ZON/DAERAH]	12	40	76.53 / 67.05	65.54 / 60.85	94.37 / 87.51	75.25 / 73.96	83.15 / 77.33	67.67 / 67.34	8.36 / A-	\N	92	83.64	TIMBALAN/PENOLONG KETUA MURID (8)	ANUGERAH-ANUGERAH LAIN/PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)(10)	AKTIVITI INSANIAH(10)	-(1 BINTANG)(6)	10	\N
SBP5IK018	BOLA JARING (SR)	NAIB BENDAHARI (5)	KEBANGSAAN (15)	KELAB DEBAT (SR)	NAIB SETIAUSAHA (6)	DAERAH (8)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	KOPERAL (5)	DAERAH (8)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KEEMPAT [KEBANGSAAN]	12	40	93.54 / 73.63	71.42 / 69.78	94.68 / 61.4	92.83 / 67.58	64.11 / 62.54	65.59 / 61.68	7.88 / A	\N	90	81.82	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH REMAJA PERDANA (EMAS)(10)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(3 BINTANG)(8)	10	\N
SBP5IK019	BADMINTON (SR)	KETUA PASUKAN (8)	NEGERI (12)	KELAB MATEMATIK (SR)	BENDAHARI (6)	ANTARABANGSA (20)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	KETUA PASUKAN (8)	ZON/DAERAH (9)	MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [KEBANGSAAN]	12	40	65.17 / 61.05	94.66 / 91.22	80.41 / 69.71	87.56 / 69.46	76.25 / 72.68	86.67 / 83.68	8.71 / A	\N	92	83.64	KETUA ASRAMA/PENGAWAS ASRAMA (7)	ANUGERAH REMAJA PERDANA (EMAS)(10)	\N	-(5 BINTANG)(10)	10	\N
SBP5IK020	SILAT (SR)	KAPTEN (7)	DAERAH (8)	KELAB ROBOTIK (SM)	PENGERUSI (10)	NEGERI (14)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	SARJAN (6)	KEBANGSAAN (15)	MENGEMAS PERALATAN (2), MENEPATI WAKTU (2), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [NEGERI]	12	40	65.05 / 65.05	81.66 / 78.88	76.16 / 73.89	95.55 / 68.87	75.68 / 70.69	92.86 / 71.25	9.24 / A	\N	65	59.09	\N	\N	AKTIVITI INSANIAH(10)	-(4 BINTANG)(9)	10	\N
SBP5IK021	MEMANAH (SR)	BENDAHARI (6)	ANTARABANGSA (20)	KELAB ASTRONOMI (SR)	PENGERUSI (10)	ANTARABANGSA (20)	KOR KADET TENTERA UDARA (SR)	NAIB PENGERUSI (8)	DAERAH (8)	MENGURUS AKTIVITI (3), MEMBERI KERJASAMA (2), MENUNJUKKAN MINAT (2), MEMBANTU GURU/RAKAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [NEGERI]	12	40	69.49 / 63.24	70.12 / 65.54	68.58 / 68.33	90.74 / 71.36	84.43 / 81.96	67.87 / 61.05	8.14 / A	\N	92	83.64	KETUA PENGAWAS/PENGAWAS SEKOLAH (8)	\N	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(1 BINTANG)(6)	10	\N
SBP5IK022	BOLA KERANJANG (SR)	AHLI AKTIF (4)	KEBANGSAAN (15)	KELAB ALAM SEKITAR (SR)	SETIAUSAHA (7)	NEGERI (14)	KOR KADET POLIS (SR)	NAIB PENGERUSI (8)	ZON/DAERAH (9)	MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	LULUS	12	40	62.63 / 60.92	85.62 / 66.05	62.76 / 60.14	93.41 / 80.66	87.54 / 84.03	81.15 / 70.39	7.33 / A	\N	78	70.91	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)(8)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(1 BINTANG)(6)	10	\N
SBP5IK023	BOLA JARING (SR)	NAIB PENGERUSI (8)	ZON/DAERAH (11)	KELAB KIMIA (SR)	BENDAHARI (6)	ANTARABANGSA (20)	KOR KADET POLIS (SR)	SARJAN (6)	ANTARABANGSA (20)	MENUNJUKKAN KEPIMPINAN (3), MENEPATI WAKTU (2), MEMBERSIH KAWASAN (2), MENYEDIA PERALATAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [NEGERI]	12	40	67.11 / 60.79	75.05 / 61.71	71.32 / 70.65	73.78 / 69.64	86.31 / 77.71	78.81 / 68.29	8.95 / A-	\N	95	86.36	KETUA PENGAWAS/PENGAWAS SEKOLAH (8)	ANUGERAH REMAJA PERDANA (PERAK)(8)	AKTIVITI INSANIAH(10)	-(1 BINTANG)(6)	10	\N
SBP5IK024	BOLA JARING (SR)	NAIB PENGERUSI (8)	DAERAH (8)	KELAB NASYID (SR)	NAIB SETIAUSAHA (6)	ZON/DAERAH (11)	KOR KADET TENTERA DARAT (SR)	BENDAHARI (6)	KEBANGSAAN (15)	MENGURUS AKTIVITI (3), MEMBERI KERJASAMA (2), MENUNJUKKAN MINAT (2), MEMBANTU GURU/RAKAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	LULUS	12	40	78.02 / 61.94	95.71 / 86.62	67.6 / 61.4	66.92 / 63.46	86.95 / 75.29	97.53 / 92.73	7.6 / A	\N	91	82.73	KETUA ASRAMA/PENGAWAS ASRAMA (7)	AKTIVITI INSANIAH(10)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(1 BINTANG)(6)	10	\N
SBP5IK025	TENIS MEJA (SR)	NAIB PENGERUSI (8)	NEGERI (14)	KELAB INOVASI DAN REKACIPTA (SR)	PENGERUSI (10)	DAERAH (8)	KADET REMAJA SEKOLAH (KRS) (SR)	SARJAN MEJAR (7)	NEGERI (14)	MENGEMAS PERALATAN (2), MEMBERSIH KAWASAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KELIMA [NEGERI]	12	40	64.71 / 61.51	86.42 / 61.17	90.21 / 60.03	68.52 / 67.46	63.57 / 63.1	67.98 / 63.05	7.9 / A	\N	76	69.09	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2 (PENERIMA)(4)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(4 BINTANG)(9)	10	\N
SBP5IK026	BADMINTON (SR)	AHLI AKTIF (4)	KEBANGSAAN (15)	KELAB KOMPUTER ICT (SR)	PENGERUSI (10)	SEKOLAH (5)	KOR KADET TENTERA DARAT (SR)	KOPERAL (5)	NEGERI (14)	MENUNJUKKAN KEPIMPINAN (3), MENEPATI WAKTU (2), MEMBERSIH KAWASAN (2), MENYEDIA PERALATAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [ZON/DAERAH]	12	40	95.71 / 77.25	95.66 / 76.44	94.66 / 92.03	81.98 / 67.98	84.02 / 69.58	98.64 / 77.04	9.01 / A	\N	106	96.36	\N	ANUGERAH-ANUGERAH LAIN/PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)(10)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(4 BINTANG)(9)	10	\N
SBP5IK027	TENIS MEJA (SR)	SETIAUSAHA (7)	DAERAH (8)	KELAB ALAM SEKITAR (SR)	NAIB BENDAHARI (5)	KEBANGSAAN (17)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	KETUA PASUKAN (8)	NEGERI (14)	MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ANTARABANGSA]	12	40	83.26 / 67.38	84.13 / 60.56	90.76 / 68.84	76.67 / 69.91	96.43 / 80.51	81.39 / 61.87	7.49 / A-	\N	106	96.36	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	AKTIVITI INSANIAH(10)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(2 BINTANG)(7)	10	\N
SBP5IK028	TAEKWONDO (SR)	KETUA PASUKAN (8)	KEBANGSAAN (15)	KELAB SENI VISUAL (SR)	NAIB BENDAHARI (5)	ZON/DAERAH (11)	KOR KADET TENTERA UDARA (SR)	SETIAUSAHA (7)	NEGERI (14)	MENGURUS AKTIVITI (3), MEMBERI KERJASAMA (2), MENUNJUKKAN MINAT (2), MEMBANTU GURU/RAKAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [KEBANGSAAN]	12	40	62.2 / 62.15	74.45 / 68.38	96.28 / 82.75	96.84 / 87.2	94.98 / 86.95	80.84 / 64.89	8.91 / A	\N	89	80.91	KETUA PENGAWAS/PENGAWAS SEKOLAH (8)	ANUGERAH REMAJA PERDANA (EMAS)(10)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(2 BINTANG)(7)	10	\N
SBP5IK029	HOKI (SR)	KETUA PASUKAN (8)	KEBANGSAAN (15)	KELAB PERTANIAN (SR)	PENGERUSI (10)	ZON/DAERAH (11)	PERSEKUTUAN PENGAKAP MALAYSIA (SR)	SARJAN MEJAR (7)	ZON/DAERAH (9)	MENGURUS AKTIVITI (3), MEMBERI KERJASAMA (2), MENUNJUKKAN MINAT (2), MEMBANTU GURU/RAKAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	70.29 / 69.8	87.47 / 76.53	78.35 / 65.94	78.13 / 65.54	66.44 / 65.31	74.48 / 62.21	9.84 / A	\N	90	81.82	PENOLONG KETUA ASRAMA/AHLI KETUA BADAR (6)	ANUGERAH REMAJA PERDANA (EMAS)(10)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(1 BINTANG)(6)	10	\N
SBP5IK030	SKUASY (SR)	AHLI AKTIF (4)	DAERAH (8)	KELAB NASYID (SR)	PENGERUSI (10)	SEKOLAH (5)	KADET REMAJA SEKOLAH (KRS) (SR)	SARJAN (6)	ZON/DAERAH (11)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ANTARABANGSA]	12	40	80.55 / 70.09	76.15 / 62.24	77.85 / 65.55	93.54 / 60.69	66.92 / 63.83	65.16 / 61.47	9.12 / A	\N	80	72.73	AHLI LEMBAGA PENGARAH KOPERASI SEKOLAH (6)	ANUGERAH-ANUGERAH LAIN/PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)(10)	AKTIVITI INSANIAH(10)	-(4 BINTANG)(9)	10	\N
SBP5IK031	SEPAK TAKRAW (SR)	KETUA PASUKAN (8)	ZON/DAERAH (9)	KELAB FIZIK (SR)	NAIB BENDAHARI (5)	KEBANGSAAN (15)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	AHLI JAWATANKUASA (5)	DAERAH (8)	MENGEMAS PERALATAN (2), MENEPATI WAKTU (2), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KELIMA [NEGERI]	12	40	77.26 / 60.77	73.07 / 65.67	70.26 / 64.23	74.99 / 60.76	98.33 / 79.71	87.76 / 81.74	7.85 / A	\N	87	79.09	KETUA ASRAMA/PENGAWAS ASRAMA (7)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1 (PENERIMA)(6)	AKTIVITI INSANIAH(10)	-(3 BINTANG)(8)	10	\N
SBP5IK032	HOKI (SR)	BENDAHARI (6)	ANTARABANGSA (20)	KELAB KEUSAHAWANAN (SR)	AHLI AKTIF (4)	KEBANGSAAN (17)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	PENGERUSI (10)	ZON/DAERAH (9)	MENUNJUKKAN KEPIMPINAN (3), MENEPATI WAKTU (2), MEMBERSIH KAWASAN (2), MENYEDIA PERALATAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	89.46 / 82.92	79.87 / 73.48	84.91 / 62.24	87.75 / 74.67	82.83 / 70.04	71.93 / 60.02	9.61 / A-	\N	100	90.91	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	\N	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(4 BINTANG)(9)	10	\N
SBP5IK033	MEMANAH (SR)	KAPTEN (7)	ZON/DAERAH (9)	KELAB BIOLOGI (SR)	PENGERUSI (10)	KEBANGSAAN (15)	KADET BOMBA DAN PENYELAMAT MALAYSIA (SR)	SARJAN MEJAR (7)	NEGERI (14)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [KEBANGSAAN]	12	40	78.38 / 72.65	76.88 / 73.67	74.33 / 65.65	73.51 / 65.04	68.81 / 62.66	74.01 / 73.61	9.21 / A	\N	98	89.09	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH REMAJA PERDANA (EMAS)(10)	AKTIVITI INSANIAH(10)	-(3 BINTANG)(8)	10	\N
SBP5IK034	BOLA SEPAK (SR)	SETIAUSAHA (7)	KEBANGSAAN (17)	KELAB DEBAT (SR)	AHLI AKTIF (4)	NEGERI (14)	KOR KADET TENTERA UDARA (SR)	BENDAHARI (6)	KEBANGSAAN (15)	MENGURUS AKTIVITI (3), MEMBERI KERJASAMA (2), MENUNJUKKAN MINAT (2), MEMBANTU GURU/RAKAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	79.69 / 64.75	90.43 / 89.11	87.0 / 64.43	74.38 / 70.4	63.76 / 61.15	64.76 / 61.08	8.7 / A	\N	73	66.36	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH REMAJA PERDANA (PERAK)(8)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(2 BINTANG)(7)	10	\N
SBP5IK035	OLAHRAGA (SR)	KAPTEN (7)	ANTARABANGSA (20)	KELAB ROBOTIK (SM)	NAIB SETIAUSAHA (6)	SEKOLAH (5)	KOR KADET TENTERA DARAT (SR)	NAIB PENGERUSI (8)	NEGERI (14)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [SEKOLAH]	12	40	92.58 / 85.54	73.68 / 62.82	91.22 / 73.03	89.6 / 81.68	78.32 / 67.86	70.24 / 64.25	9.27 / A	\N	89	80.91	PENOLONG KETUA ASRAMA/AHLI KETUA BADAR (6)	ANUGERAH REMAJA PERDANA (PERAK)(8)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(3 BINTANG)(8)	10	\N
SBP5IK036	TAEKWONDO (SR)	KETUA PASUKAN (8)	KEBANGSAAN (17)	KELAB FIZIK (SR)	NAIB BENDAHARI (5)	SEKOLAH (5)	KADET REMAJA SEKOLAH (KRS) (SR)	AHLI AKTIF (4)	KEBANGSAAN (17)	MENGEMAS PERALATAN (2), MENEPATI WAKTU (2), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KELIMA [NEGERI]	12	40	98.54 / 63.29	87.58 / 74.65	84.97 / 70.06	76.19 / 72.76	66.32 / 61.79	78.45 / 70.72	9.0 / A	\N	83	75.45	KETUA ASRAMA/PENGAWAS ASRAMA (7)	ANUGERAH REMAJA PERDANA (GANGSA)(6)	AKTIVITI INSANIAH(10)	-(4 BINTANG)(9)	10	\N
SBP5IK037	RENANG (SR)	PENGERUSI (10)	ZON/DAERAH (11)	KELAB INOVASI DAN REKACIPTA (SR)	BENDAHARI (6)	ZON/DAERAH (11)	KOR KADET TENTERA DARAT (SR)	AHLI JAWATANKUASA (5)	ZON/DAERAH (11)	MEMBERSIH KAWASAN (2), MENEPATI WAKTU (2), MENUNJUKKAN MINAT (2), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [NEGERI]	12	40	62.57 / 60.95	75.72 / 68.04	85.47 / 79.22	68.14 / 65.38	69.86 / 60.33	73.12 / 66.11	8.15 / A-	\N	77	70.00	TIMBALAN/PENOLONG KETUA MURID (8)	ANUGERAH-ANUGERAH LAIN/PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)(10)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(4 BINTANG)(9)	10	\N
SBP5IK038	BOLA KERANJANG (SR)	SETIAUSAHA (7)	DAERAH (8)	KELAB BIOLOGI (SR)	BENDAHARI (6)	SEKOLAH (5)	KADET REMAJA SEKOLAH (KRS) (SR)	BENDAHARI (6)	NEGERI (14)	MENGEMAS PERALATAN (2), MEMBERSIH KAWASAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [SEKOLAH]	12	40	95.37 / 68.97	71.75 / 63.01	83.62 / 61.99	74.64 / 65.04	75.0 / 67.22	76.95 / 68.61	9.9 / A	\N	88	80.00	PENOLONG KETUA ASRAMA/AHLI KETUA BADAR (6)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1 (PENERIMA)(6)	\N	-(2 BINTANG)(7)	10	\N
SBP5IK039	CATUR (SR)	AHLI JAWATANKUASA (5)	NEGERI (14)	KELAB MUZIK (SR)	PENGERUSI (10)	ANTARABANGSA (20)	PENGAKAP PUTERI (SR)	KOPERAL (5)	ZON/DAERAH (9)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	86.29 / 70.47	71.0 / 67.51	65.08 / 61.02	81.45 / 77.54	91.08 / 65.14	86.97 / 78.1	8.24 / A	\N	93	84.55	AHLI LEMBAGA PENGARAH KOPERASI SEKOLAH (6)	AKTIVITI INSANIAH(10)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(4 BINTANG)(9)	10	\N
SBP5IK040	CATUR (SR)	AHLI AKTIF (4)	ZON/DAERAH (11)	KELAB ALAM SEKITAR (SR)	AHLI JAWATANKUASA (5)	NEGERI (14)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	PENGERUSI (10)	ANTARABANGSA (20)	MENUNJUKKAN KEPIMPINAN (3), MENEPATI WAKTU (2), MEMBERSIH KAWASAN (2), MENYEDIA PERALATAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KEEMPAT [KEBANGSAAN]	12	40	68.15 / 66.18	73.84 / 66.78	69.98 / 67.47	77.62 / 76.29	88.18 / 73.83	63.7 / 62.18	8.86 / A-	\N	95	86.36	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)(10)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(2 BINTANG)(7)	10	\N
SBP5IK041	SKUASY (SR)	NAIB BENDAHARI (5)	ANTARABANGSA (20)	KELAB MATEMATIK (SR)	NAIB SETIAUSAHA (6)	SEKOLAH (5)	KOR KADET TENTERA UDARA (SR)	PENGERUSI (10)	KEBANGSAAN (15)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [ZON/DAERAH]	12	40	86.27 / 65.12	71.1 / 60.43	92.11 / 69.08	71.52 / 60.32	92.79 / 74.57	90.49 / 67.34	9.12 / A-	\N	103	93.64	\N	ANUGERAH REMAJA PERDANA (GANGSA)(6)	KHIDMAT MASYARAKAT PERINGKAT KEBANGSAAN(10)	-(2 BINTANG)(7)	10	\N
SBP5IK042	BADMINTON (SR)	NAIB PENGERUSI (8)	ANTARABANGSA (20)	KELAB PENDIDIKAN ISLAM (SR)	NAIB BENDAHARI (5)	KEBANGSAAN (15)	KOR KADET POLIS (SR)	BENDAHARI (6)	ANTARABANGSA (20)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	64.28 / 62.19	68.96 / 65.98	64.68 / 62.64	83.53 / 74.22	74.99 / 71.92	97.26 / 66.57	7.08 / A	\N	80	72.73	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	AKTIVITI INSANIAH(10)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(1 BINTANG)(6)	10	\N
SBP5IK043	BOLA JARING (SR)	NAIB BENDAHARI (5)	DAERAH (8)	KELAB SENI VISUAL (SR)	NAIB PENGERUSI (8)	SEKOLAH (5)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	AHLI JAWATANKUASA (5)	ZON/DAERAH (11)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	JOHAN [ZON/DAERAH]	12	40	72.53 / 67.0	74.15 / 66.69	86.88 / 69.21	75.18 / 68.5	89.74 / 72.21	64.97 / 63.38	8.3 / A	\N	96	87.27	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2 (PENERIMA)(4)	\N	-(3 BINTANG)(8)	10	\N
SBP5IK044	SILAT (SR)	KAPTEN (7)	KEBANGSAAN (17)	KELAB NASYID (SR)	NAIB SETIAUSAHA (6)	NEGERI (14)	KADET REMAJA SEKOLAH (KRS) (SR)	AHLI JAWATANKUASA (5)	KEBANGSAAN (15)	MENGURUS AKTIVITI (3), MENYEDIA PERALATAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	LULUS	12	40	97.4 / 79.96	78.8 / 62.24	73.91 / 68.01	80.33 / 60.03	91.28 / 60.31	81.07 / 71.15	7.45 / A	\N	94	85.45	PENOLONG KETUA ASRAMA/AHLI KETUA BADAR (6)	\N	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(2 BINTANG)(7)	10	\N
SBP5IK045	OLAHRAGA (SR)	AHLI JAWATANKUASA (5)	DAERAH (8)	KELAB ROBOTIK (SM)	NAIB PENGERUSI (8)	SEKOLAH (5)	KOR KADET TENTERA DARAT (SR)	SARJAN (6)	NEGERI (14)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [NEGERI]	12	40	67.53 / 64.27	79.69 / 65.39	89.76 / 80.91	84.57 / 62.02	88.87 / 76.54	87.87 / 84.5	7.66 / A	\N	88	80.00	PEMIMPIN RUMAH SUKAN (6)	ANUGERAH REMAJA PERDANA (GANGSA)(6)	KHIDMAT MASYARAKAT PERINGKAT ZON/DAERAH(6)	-(5 BINTANG)(10)	10	\N
SBP5IK046	SEPAK TAKRAW (SR)	NAIB BENDAHARI (5)	ZON/DAERAH (9)	KELAB PENDIDIKAN ISLAM (SR)	BENDAHARI (6)	KEBANGSAAN (15)	PENGAKAP PUTERI (SR)	SARJAN (6)	DAERAH (8)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [SEKOLAH]	12	40	70.07 / 69.36	77.5 / 69.71	73.97 / 67.55	96.55 / 76.3	74.14 / 67.87	98.59 / 95.99	9.15 / A	\N	75	68.18	KUARTERMASTER/PENGERUSI BADAN PERKHIDMATAN SEKOLAH (7)	\N	\N	-(4 BINTANG)(9)	10	\N
SBP5IK047	SKUASY (SR)	KAPTEN (7)	DAERAH (8)	KELAB PERTANIAN (SR)	AHLI AKTIF (4)	ANTARABANGSA (20)	KOR KADET TENTERA DARAT (SR)	KOPERAL (5)	ZON/DAERAH (11)	MEMBERSIH KAWASAN (2), MENGURUS AKTIVITI (3), MENUNJUKKAN KEPIMPINAN (3), MENUNJUKKAN MINAT (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [ZON/DAERAH]	12	40	95.23 / 83.47	85.9 / 69.0	93.51 / 78.32	92.98 / 67.62	92.6 / 86.27	96.34 / 87.82	8.8 / A-	\N	66	60.00	\N	\N	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(2 BINTANG)(7)	10	\N
SBP5IK048	OLAHRAGA (SR)	PENGERUSI (10)	NEGERI (12)	KELAB NASYID (SR)	NAIB BENDAHARI (5)	KEBANGSAAN (17)	KOR KADET POLIS (SR)	PENGERUSI (10)	DAERAH (8)	MENGEMAS PERALATAN (2), MEMBERSIH KAWASAN (2), MEMBANTU GURU/RAKAN (2), MENUNJUKKAN KEPIMPINAN (3)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [SEKOLAH]	12	40	81.44 / 60.88	84.87 / 80.0	71.96 / 70.72	86.02 / 80.45	86.76 / 67.24	88.1 / 70.72	8.29 / A	\N	88	80.00	TIMBALAN/PENOLONG KETUA MURID (8)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2 (PENERIMA)(4)	\N	-(3 BINTANG)(8)	10	\N
SBP5IK049	MEMANAH (SR)	PENGERUSI (10)	NEGERI (14)	PERSATUAN BAHASA ARAB (SR)	PENGERUSI (10)	ZON/DAERAH (11)	BULAN SABIT MERAH MALAYSIA (BSMM) (SR)	SARJAN MEJAR (7)	NEGERI (14)	MENGEMAS PERALATAN (2), MENEPATI WAKTU (2), MENUNJUKKAN KEPIMPINAN (3), MEMBERI KERJASAMA (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	KETIGA [ZON/DAERAH]	12	40	82.18 / 66.27	68.53 / 64.15	78.47 / 67.07	85.51 / 70.21	88.2 / 69.69	62.3 / 60.14	9.56 / A	\N	97	88.18	PEMIMPIN RUMAH SUKAN (6)	AKTIVITI INSANIAH(10)	PROGRAM GOTONG-ROYONG KOMUNITI(5)	-(1 BINTANG)(6)	10	\N
SBP5IK050	SKUASY (SR)	NAIB PENGERUSI (8)	KEBANGSAAN (15)	PERSATUAN BAHASA ARAB (SR)	NAIB SETIAUSAHA (6)	NEGERI (14)	KADET REMAJA SEKOLAH (KRS) (SR)	AHLI JAWATANKUASA (5)	DAERAH (8)	MENYEDIA PERALATAN (2), MENEPATI WAKTU (2), MENGURUS AKTIVITI (3), MENGIKUT ARAHAN (2)	MURID YANG DIDAFTARKAN SEBAGAI ATLET/PESERTA PROGRAM/PERTANDINGAN/KARNIVAL/KURSUS (10)	12 (40)	NAIB JOHAN [KEBANGSAAN]	12	40	81.31 / 80.23	78.04 / 73.29	76.84 / 76.1	90.93 / 70.58	66.0 / 63.99	82.77 / 77.11	9.97 / A	\N	106	96.36	PENGAWAS/PENGAWAS PUSAT PRS/KETUA SUMBER (7)	PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2 (PENERIMA)(4)	KHIDMAT MASYARAKAT PERINGKAT NEGERI(8)	-(4 BINTANG)(9)	10	\N
\.


--
-- Data for Name: pelajar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pelajar (id, nama, jantina) FROM stdin;
SBP5IK001	AHMAD FARIS BIN MOHD AZRI	L
SBP5IK002	MUHAMMAD HAFIZUDDIN BIN AHMAD FAUZI	L
SBP5IK003	MUHAMMAD QUSYAIRI BIN ABDUL HALIM	L
SBP5IK004	AHMAD DANIAL BIN ZAINUDIN	L
SBP5IK005	MUHAMMAD QUSYAIRI BIN MOHD ZULKIFLI	L
SBP5IK006	AHMAD FARIS BIN MOHD ZULKIFLI	L
SBP5IK007	MUHAMMAD QUSYAIRI BIN ABDUL RAZAK	L
SBP5IK008	MUHAMMAD AZFAR BIN NORDIN	L
SBP5IK009	MUHAMMAD QUSYAIRI BIN MOHD AZRI	L
SBP5IK010	MOHAMAD AIMAN BIN NORDIN	L
SBP5IK011	MOHAMAD SYAFIQ BIN MOHD REDZUAN	L
SBP5IK012	MOHAMAD SYAFIQ BIN MOHD SHAHRUL	L
SBP5IK013	AHMAD DANIAL BIN MOHD ROSLI	L
SBP5IK014	MUHAMMAD AZFAR BIN ABDUL WAHAB	L
SBP5IK015	SITI HAJAR BINTI MOHD HELMI	P
SBP5IK016	NURUL LIYANA BINTI ZULKARNAIN	P
SBP5IK017	NUR FARHANA BINTI MOHD ARIFFIN	P
SBP5IK018	NUR IZZATI BINTI NORHAIZAM	P
SBP5IK019	NURUL SYAFIQAH BINTI ZULKARNAIN	P
SBP5IK020	NUR SYAZWANI BINTI ABDUL KADIR	P
SBP5IK021	NUR FARHANA BINTI ZULKARNAIN	P
SBP5IK022	SITI HAJAR BINTI ROSLAN	P
SBP5IK023	SITI MAISARAH BINTI ABDUL KADIR	P
SBP5IK024	NUR SYAZWANI BINTI MOHD HELMI	P
SBP5IK025	NUR AISYAH BINTI MOHD FADZILLAH	P
SBP5IK026	NUR IZZATI BINTI MOHD FADZILLAH	P
SBP5IK027	SITI NURFATIN BINTI MOHD HELMI	P
SBP5IK028	NURUL AIN BINTI NORHAIZAM	P
SBP5IK029	MUHAMMAD IRFAN BIN ZULKIFLI	L
SBP5IK030	ADAM HARRIS BIN MOHD NOOR	L
SBP5IK031	IZZUL HAKIM BIN ROSLAN	L
SBP5IK032	MUHAMMAD SYAHMI BIN OMAR	L
SBP5IK033	ARIF DANISH BIN ZAINUDIN	L
SBP5IK034	MUHAMMAD HARITH BIN ABD RAHMAN	L
SBP5IK035	LUQMANUL HAKIM BIN IBRAHIM	L
SBP5IK036	DANISH AQIL BIN MOHD FADZIL	L
SBP5IK037	NUR BATRISYIA BINTI HASSAN	P
SBP5IK038	AMIRAH HUMAIRA BINTI RAZALI	P
SBP5IK039	NURUL HUSNA BINTI MOHD YUSOF	P
SBP5IK040	SITI ZULAIKHA BINTI ZAINAL	P
SBP5IK041	FARAH DIYANA BINTI OTHMAN	P
SBP5IK042	NUR ATHIRAH BINTI KAMARUDIN	P
SBP5IK043	AISYAH NUR BINTI MOHD SABRI	P
SBP5IK044	NURUL AIN BINTI AHMAD FAUZI	P
SBP5IK045	SITI HAFSAH BINTI MOHD SALLEH	P
SBP5IK046	NUR IMAN BINTI ZULKARNAIN	P
SBP5IK047	FARIDAH HANUM BINTI RAZAK	P
SBP5IK048	NUR SAFIYYAH BINTI ABD HALIM	P
SBP5IK049	ZULAIKHA BINTI MOHD ZAIN	P
SBP5IK050	NURUL HIDAYAH BINTI NORDIN	P
\.


--
-- Data for Name: pendapatan_penjaga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pendapatan_penjaga (id, jumlah_pendapatan, kategori_pendapatan) FROM stdin;
SBP5IK001	621.12	B40
SBP5IK002	631.87	B40
SBP5IK003	1034.78	B40
SBP5IK004	3670.05	M40
SBP5IK005	9711.79	T20
SBP5IK006	1599.81	M40
SBP5IK007	1403.45	M40
SBP5IK008	362.04	B40
SBP5IK009	2708.24	M40
SBP5IK010	2944.73	M40
SBP5IK011	14788.98	T20
SBP5IK012	1053.12	B40
SBP5IK013	3512.06	M40
SBP5IK014	6681.43	T20
SBP5IK015	668.00	B40
SBP5IK016	482.09	B40
SBP5IK017	1092.72	B40
SBP5IK018	13706.47	T20
SBP5IK019	2534.36	M40
SBP5IK020	591.03	B40
SBP5IK021	314.21	B40
SBP5IK022	2563.97	M40
SBP5IK023	3053.52	M40
SBP5IK024	1022.05	B40
SBP5IK025	2776.41	M40
SBP5IK026	555.56	B40
SBP5IK027	14644.89	T20
SBP5IK028	1089.30	B40
SBP5IK029	13152.56	T20
SBP5IK030	1070.17	B40
SBP5IK031	2709.63	M40
SBP5IK032	700.66	B40
SBP5IK033	479.32	B40
SBP5IK034	8125.02	T20
SBP5IK035	8369.22	T20
SBP5IK036	585.59	B40
SBP5IK037	348.99	B40
SBP5IK038	3510.42	M40
SBP5IK039	907.08	B40
SBP5IK040	1506.06	M40
SBP5IK041	880.08	B40
SBP5IK042	13158.94	T20
SBP5IK043	1393.49	M40
SBP5IK044	1379.22	M40
SBP5IK045	1468.59	M40
SBP5IK046	9567.51	T20
SBP5IK047	295.96	B40
SBP5IK048	882.46	B40
SBP5IK049	276.13	B40
SBP5IK050	1734.83	M40
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 362, true);


--
-- Name: biasiswa_ipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.biasiswa_ipt_id_seq', 695, true);


--
-- Name: biasiswa_kursus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.biasiswa_kursus_id_seq', 792, true);


--
-- Name: dokumen_rujukan_id_dokumen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dokumen_rujukan_id_dokumen_seq', 1, true);


--
-- Name: ipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ipt_id_seq', 95, true);


--
-- Name: kursus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kursus_id_seq', 63, true);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: biasiswa_ipt biasiswa_ipt_id_biasiswa_id_ipt_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_ipt
    ADD CONSTRAINT biasiswa_ipt_id_biasiswa_id_ipt_key UNIQUE (id_biasiswa, id_ipt);


--
-- Name: biasiswa_ipt biasiswa_ipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_ipt
    ADD CONSTRAINT biasiswa_ipt_pkey PRIMARY KEY (id);


--
-- Name: biasiswa_kursus biasiswa_kursus_id_biasiswa_id_kursus_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_kursus
    ADD CONSTRAINT biasiswa_kursus_id_biasiswa_id_kursus_key UNIQUE (id_biasiswa, id_kursus);


--
-- Name: biasiswa_kursus biasiswa_kursus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_kursus
    ADD CONSTRAINT biasiswa_kursus_pkey PRIMARY KEY (id);


--
-- Name: biasiswa biasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa
    ADD CONSTRAINT biasiswa_pkey PRIMARY KEY (id_biasiswa);


--
-- Name: dokumen_rujukan dokumen_rujukan_kod_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dokumen_rujukan
    ADD CONSTRAINT dokumen_rujukan_kod_key UNIQUE (kod);


--
-- Name: dokumen_rujukan dokumen_rujukan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dokumen_rujukan
    ADD CONSTRAINT dokumen_rujukan_pkey PRIMARY KEY (id_dokumen);


--
-- Name: imk imk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imk
    ADD CONSTRAINT imk_pkey PRIMARY KEY (id);


--
-- Name: ipt ipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ipt
    ADD CONSTRAINT ipt_pkey PRIMARY KEY (id);


--
-- Name: keputusan_spm keputusan_spm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keputusan_spm
    ADD CONSTRAINT keputusan_spm_pkey PRIMARY KEY (id);


--
-- Name: kursus kursus_kod_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kursus
    ADD CONSTRAINT kursus_kod_key UNIQUE (kod);


--
-- Name: kursus kursus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kursus
    ADD CONSTRAINT kursus_pkey PRIMARY KEY (id);


--
-- Name: murid_status murid_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.murid_status
    ADD CONSTRAINT murid_status_pkey PRIMARY KEY (id);


--
-- Name: pajsk pajsk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pajsk
    ADD CONSTRAINT pajsk_pkey PRIMARY KEY (id);


--
-- Name: pelajar pelajar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pelajar
    ADD CONSTRAINT pelajar_pkey PRIMARY KEY (id);


--
-- Name: pendapatan_penjaga pendapatan_penjaga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendapatan_penjaga
    ADD CONSTRAINT pendapatan_penjaga_pkey PRIMARY KEY (id);


--
-- Name: biasiswa_ipt biasiswa_ipt_id_biasiswa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_ipt
    ADD CONSTRAINT biasiswa_ipt_id_biasiswa_fkey FOREIGN KEY (id_biasiswa) REFERENCES public.biasiswa(id_biasiswa) ON DELETE CASCADE;


--
-- Name: biasiswa_ipt biasiswa_ipt_id_ipt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_ipt
    ADD CONSTRAINT biasiswa_ipt_id_ipt_fkey FOREIGN KEY (id_ipt) REFERENCES public.ipt(id) ON DELETE CASCADE;


--
-- Name: biasiswa_kursus biasiswa_kursus_id_biasiswa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_kursus
    ADD CONSTRAINT biasiswa_kursus_id_biasiswa_fkey FOREIGN KEY (id_biasiswa) REFERENCES public.biasiswa(id_biasiswa) ON DELETE CASCADE;


--
-- Name: biasiswa_kursus biasiswa_kursus_id_kursus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biasiswa_kursus
    ADD CONSTRAINT biasiswa_kursus_id_kursus_fkey FOREIGN KEY (id_kursus) REFERENCES public.kursus(id) ON DELETE CASCADE;


--
-- Name: imk imk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imk
    ADD CONSTRAINT imk_id_fkey FOREIGN KEY (id) REFERENCES public.pelajar(id);


--
-- Name: keputusan_spm keputusan_spm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keputusan_spm
    ADD CONSTRAINT keputusan_spm_id_fkey FOREIGN KEY (id) REFERENCES public.pelajar(id);


--
-- Name: murid_status murid_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.murid_status
    ADD CONSTRAINT murid_status_id_fkey FOREIGN KEY (id) REFERENCES public.pelajar(id);


--
-- Name: murid_status murid_status_ipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.murid_status
    ADD CONSTRAINT murid_status_ipt_id_fkey FOREIGN KEY (ipt_id) REFERENCES public.ipt(id);


--
-- Name: pajsk pajsk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pajsk
    ADD CONSTRAINT pajsk_id_fkey FOREIGN KEY (id) REFERENCES public.pelajar(id);


--
-- Name: pendapatan_penjaga pendapatan_penjaga_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendapatan_penjaga
    ADD CONSTRAINT pendapatan_penjaga_id_fkey FOREIGN KEY (id) REFERENCES public.pelajar(id);


--
-- PostgreSQL database dump complete
--

\unrestrict y0O4iJuQzQDjkCnkX4gp90DgxBNplIIoiUyQsMMPRlu8UeZPciOBtdciCHYhMDF

