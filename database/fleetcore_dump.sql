--
-- PostgreSQL database dump
--

\restrict 4rExA1m2Mhspts1pUi7cPkfMcRgVfu9E3NneUMQVrMuXFsF1LKecg30Ncseqz3T

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: maintenances_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.maintenances_status_enum AS ENUM (
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: maintenances_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.maintenances_type_enum AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'TECHNICIAN'
);


--
-- Name: vehicles_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.vehicles_status_enum AS ENUM (
    'AVAILABLE',
    'IN_MAINTENANCE',
    'INACTIVE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: maintenances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    type public.maintenances_type_enum NOT NULL,
    description text NOT NULL,
    mileage integer NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    duration_minutes integer NOT NULL,
    estimated_end_at timestamp with time zone NOT NULL,
    status public.maintenances_status_enum DEFAULT 'SCHEDULED'::public.maintenances_status_enum NOT NULL,
    started_at timestamp with time zone,
    work_performed text,
    final_cost numeric(12,2),
    finished_at timestamp with time zone,
    final_mileage integer,
    vehicle_id uuid NOT NULL,
    mechanic_id uuid NOT NULL,
    workshop_id uuid NOT NULL
);


--
-- Name: mechanics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mechanics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    specialty character varying(80) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    user_id uuid
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying NOT NULL,
    role public.users_role_enum DEFAULT 'TECHNICIAN'::public.users_role_enum NOT NULL
);


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    plate character varying(10) NOT NULL,
    brand character varying(60) NOT NULL,
    model character varying(60) NOT NULL,
    year integer NOT NULL,
    mileage integer DEFAULT 0 NOT NULL,
    status public.vehicles_status_enum DEFAULT 'AVAILABLE'::public.vehicles_status_enum NOT NULL
);


--
-- Name: workshops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workshops (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name character varying(100) NOT NULL,
    address character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Data for Name: maintenances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenances (id, created_at, updated_at, deleted_at, type, description, mileage, scheduled_at, duration_minutes, estimated_end_at, status, started_at, work_performed, final_cost, finished_at, final_mileage, vehicle_id, mechanic_id, workshop_id) FROM stdin;
a8c98f3d-411c-41d9-a928-51cfb6b15c99	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	PREVENTIVE	Cambio de aceite y filtros	45000	2026-09-15 13:00:00+00	180	2026-09-15 16:00:00+00	COMPLETED	2026-09-15 13:05:00+00	Cambio de aceite 15W40, filtro de aceite y filtro de aire	350000.00	2026-09-15 16:30:00+00	45000	b57040f8-44a0-4419-9716-d4038750190e	82a4d168-f439-412c-9e2c-2d92a32c1288	79af9436-f75b-4f17-811f-3c1f85872734
ec485e3d-11ba-43e8-b050-956a4713eef4	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	CORRECTIVE	Reemplazo de pastillas de freno	52300	2026-10-10 12:00:00+00	120	2026-10-10 14:00:00+00	COMPLETED	2026-10-10 12:10:00+00	Reemplazo de pastillas delanteras y rectificación de discos	480000.00	2026-10-10 14:00:00+00	52300	b57040f8-44a0-4419-9716-d4038750190e	60029e44-5c3c-4e1c-a56f-c3b71883c2eb	177d4bde-0f92-416d-9706-9db2f92cb4c3
a2e5d8fc-ea2e-4d9c-b46a-c97ecbbc7eec	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	CORRECTIVE	Falla en el sistema de embrague	80000	2026-10-27 12:30:00+00	240	2026-10-27 16:30:00+00	IN_PROGRESS	2026-10-27 12:40:00+00	\N	\N	\N	\N	c8489242-96d0-4426-aff9-b274e2d7602e	60029e44-5c3c-4e1c-a56f-c3b71883c2eb	177d4bde-0f92-416d-9706-9db2f92cb4c3
56ccad2b-4008-4280-99ef-993a53458d2e	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	PREVENTIVE	Revisión de los 30.000 km	30500	2026-12-01 12:30:00+00	90	2026-12-01 14:00:00+00	SCHEDULED	\N	\N	\N	\N	\N	d6ea5267-a50c-468a-84db-6256c667ab90	82a4d168-f439-412c-9e2c-2d92a32c1288	177d4bde-0f92-416d-9706-9db2f92cb4c3
\.


--
-- Data for Name: mechanics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mechanics (id, created_at, updated_at, deleted_at, name, email, specialty, is_active, user_id) FROM stdin;
82a4d168-f439-412c-9e2c-2d92a32c1288	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Carlos Pérez	carlos.perez@fleetcore.com	Motor y transmisión	t	fc496bca-9026-4f8f-8645-f516c818d302
60029e44-5c3c-4e1c-a56f-c3b71883c2eb	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Laura Gómez	laura.gomez@fleetcore.com	Frenos y suspensión	t	6a382e0b-8c40-4651-9f6f-5a9653adf593
385fd158-3b1a-4792-ba38-69a37b4a41a0	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Pedro Ruiz	pedro.ruiz@fleetcore.com	Sistema eléctrico	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, created_at, updated_at, deleted_at, name, email, password, role) FROM stdin;
6f06c761-9d3c-41d4-94c0-015d99ab167a	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Administrador FleetCore	admin@fleetcore.com	$2b$10$mLBXAmgXhmpAhuw2v5KmAeu32gRSNdkbUmAgnlXWTvfXymnn4x/IO	ADMIN
fc496bca-9026-4f8f-8645-f516c818d302	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Carlos Pérez	carlos.perez@fleetcore.com	$2b$10$p0.7D.ciSr2JXwJYfc8uieygMsh.6y03EfosanduWrH/0S4IdMQFW	TECHNICIAN
6a382e0b-8c40-4651-9f6f-5a9653adf593	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Laura Gómez	laura.gomez@fleetcore.com	$2b$10$CWiEiPa6olg5Lf6R6HwheOpTHJQ0.Z8hshfsGytOxTZrhE9Y0oJUW	TECHNICIAN
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicles (id, created_at, updated_at, deleted_at, plate, brand, model, year, mileage, status) FROM stdin;
b57040f8-44a0-4419-9716-d4038750190e	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	ABC123	Chevrolet	NPR	2020	52300	AVAILABLE
d6ea5267-a50c-468a-84db-6256c667ab90	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	DEF456	Renault	Master	2022	30500	AVAILABLE
c8489242-96d0-4426-aff9-b274e2d7602e	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	GHI789	Hino	Dutro	2019	80000	IN_MAINTENANCE
cc7fc978-ec68-4d3d-8f12-ccad72f0076e	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	JKL012	Foton	Aumark	2015	120000	INACTIVE
\.


--
-- Data for Name: workshops; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workshops (id, created_at, updated_at, deleted_at, name, address, is_active) FROM stdin;
177d4bde-0f92-416d-9706-9db2f92cb4c3	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Taller Centro	Calle 50 # 45-20, Medellín	t
79af9436-f75b-4f17-811f-3c1f85872734	2026-10-27 20:26:19.381344+00	2026-10-27 20:26:19.381344+00	\N	Taller Norte	Carrera 65 # 98-10, Medellín	f
\.


--
-- Name: vehicles PK_18d8646b59304dce4af3a9e35b6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY (id);


--
-- Name: mechanics PK_2c0ed23afc0cc7ff361c17e53df; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "PK_2c0ed23afc0cc7ff361c17e53df" PRIMARY KEY (id);


--
-- Name: maintenances PK_62403473bd524a42d58589aa78b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "PK_62403473bd524a42d58589aa78b" PRIMARY KEY (id);


--
-- Name: workshops PK_6d0e82a124f5b53df91c8989848; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT "PK_6d0e82a124f5b53df91c8989848" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: mechanics REL_4e69c5d1d5ef843a571535ccfd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "REL_4e69c5d1d5ef843a571535ccfd" UNIQUE (user_id);


--
-- Name: mechanics UQ_301c3b5fa2d49aab65dcfda36a6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "UQ_301c3b5fa2d49aab65dcfda36a6" UNIQUE (email);


--
-- Name: workshops UQ_84a8c763773a6482ba066f608c3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT "UQ_84a8c763773a6482ba066f608c3" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: vehicles UQ_ec7181ebdab798d97070122a5bf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE (plate);


--
-- Name: IDX_3c1b42caf9098095ac185eaaad; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_3c1b42caf9098095ac185eaaad" ON public.maintenances USING btree (mechanic_id, status);


--
-- Name: mechanics FK_4e69c5d1d5ef843a571535ccfde; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "FK_4e69c5d1d5ef843a571535ccfde" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: maintenances FK_a47e3420d123ccf06ab72e1969c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_a47e3420d123ccf06ab72e1969c" FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE RESTRICT;


--
-- Name: maintenances FK_d501088741618ca66074d85e411; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_d501088741618ca66074d85e411" FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE RESTRICT;


--
-- Name: maintenances FK_f92519be34af2de954da0bd4a47; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_f92519be34af2de954da0bd4a47" FOREIGN KEY (mechanic_id) REFERENCES public.mechanics(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 4rExA1m2Mhspts1pUi7cPkfMcRgVfu9E3NneUMQVrMuXFsF1LKecg30Ncseqz3T

