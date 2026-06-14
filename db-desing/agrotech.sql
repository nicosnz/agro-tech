-- ============================================================
-- Esquema: content
-- Base de datos: control de hato bovino
-- ============================================================

CREATE SCHEMA IF NOT EXISTS content;

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE content.Medicamento (
    id  UUID PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    dosis_recomendada VARCHAR(100),
    descripcion     TEXT,
    precio          NUMERIC(10,2),
    activo          BOOLEAN NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.TipoAlimento (
    id       UUID PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    descripcion       TEXT,
    precio            NUMERIC(10,2),
    cantidad_restante NUMERIC(10,2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Potrero (
    id  UUID PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    capacidad   INT,
    ubicacion   VARCHAR(200),
    estado      VARCHAR(50),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Lote (
    id           UUID PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    tipo              VARCHAR(50),
    cantidad_animales INT DEFAULT 0,
    fecha_creacion    DATE,
    estado            VARCHAR(50),
    id_potrero        UUID REFERENCES content.Potrero(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Bovino (
    id       UUID PRIMARY KEY,
    sexo            VARCHAR(10),
    raza            VARCHAR(100),
    fecha_nacimiento DATE,
    id_madre        UUID REFERENCES content.Bovino(id),
    id_padre        UUID REFERENCES content.Bovino(id),
    id_lote         UUID REFERENCES content.Lote(id),
    origen          VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Pesaje (
    id    UUID PRIMARY KEY,
    fecha_pesaje DATE NOT NULL,
    peso         NUMERIC(8,2),
    id_animal    UUID NOT NULL REFERENCES content.Bovino(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Vacunacion (
    id        UUID PRIMARY KEY,
    id_medicamento    UUID NOT NULL REFERENCES content.Medicamento(id),
    fecha_aplicacion  DATE NOT NULL,
    id_animal         UUID NOT NULL REFERENCES content.Bovino(id),
    dosis             NUMERIC(8,2),
    observacion       TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.EstadoAnimal (
    id      UUID PRIMARY KEY,
    estado         VARCHAR(100) NOT NULL,
    descripcion    TEXT,
    fecha_registro DATE NOT NULL,
    id_animal      UUID NOT NULL REFERENCES content.Bovino(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Alimentacion (
    id  UUID PRIMARY KEY,
    fecha_alimentacion DATE NOT NULL,
    id_tipo_alimento  UUID NOT NULL REFERENCES content.TipoAlimento(id),
    cantidad          NUMERIC(10,2),
    observacion       TEXT,
    id_lote           UUID NOT NULL REFERENCES content.Lote(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO content.Medicamento (id, nombre, dosis_recomendada, descripcion, precio, activo) VALUES
    ('aaaaaaaa-0000-0000-0000-000000000001', 'Ivermectina 1%',   '1 ml por 50 kg',  'Antiparasitario de amplio espectro',  12500.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'Vacuna FMD',       '2 ml por animal',  'Vacuna contra fiebre aftosa',          8900.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000003', 'Oxitetraciclina',  '10 mg por kg',     'Antibiótico de amplio espectro',      15000.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'Vitamina ADE',     '5 ml por animal',  'Suplemento vitamínico',                6200.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000005', 'Vacuna Brucelosis','2 ml por animal',  'Vacuna contra brucelosis bovina',      9500.00, TRUE);

INSERT INTO content.TipoAlimento (id, nombre, descripcion, precio, cantidad_restante) VALUES
    ('bbbbbbbb-0000-0000-0000-000000000001', 'Pasto kikuyo',    'Pasto de corte para suplemento',    350.00, 5000.00),
    ('bbbbbbbb-0000-0000-0000-000000000002', 'Maíz molido',     'Grano molido para concentrado',    1200.00, 2000.00),
    ('bbbbbbbb-0000-0000-0000-000000000003', 'Sal mineralizada','Sal con minerales esenciales',       800.00,  500.00),
    ('bbbbbbbb-0000-0000-0000-000000000004', 'Melaza',          'Subproducto de caña para energía',   450.00, 1000.00),
    ('bbbbbbbb-0000-0000-0000-000000000005', 'Heno de avena',   'Forraje seco para época seca',       600.00, 3000.00);

INSERT INTO content.Potrero (id, nombre, capacidad, ubicacion, estado) VALUES
    ('cccccccc-0000-0000-0000-000000000001', 'Potrero Norte',   30, 'Sector norte de la finca',  'disponible'),
    ('cccccccc-0000-0000-0000-000000000002', 'Potrero Sur',     25, 'Sector sur de la finca',    'ocupado'),
    ('cccccccc-0000-0000-0000-000000000003', 'Potrero Centro',  40, 'Zona central',              'ocupado'),
    ('cccccccc-0000-0000-0000-000000000004', 'Potrero Oriente', 20, 'Colindante con el río',     'disponible'),
    ('cccccccc-0000-0000-0000-000000000005', 'Potrero Cría',    15, 'Reservado para terneros',   'ocupado');

INSERT INTO content.Lote (id, nombre, tipo, cantidad_animales, fecha_creacion, estado, id_potrero) VALUES
    ('dddddddd-0000-0000-0000-000000000001', 'Lote Vientres A', 'Hembras reproductoras', 12, '2025-01-10', 'activo', 'cccccccc-0000-0000-0000-000000000002'),
    ('dddddddd-0000-0000-0000-000000000002', 'Lote Levante',    'Machos en levante',      8, '2025-02-15', 'activo', 'cccccccc-0000-0000-0000-000000000003'),
    ('dddddddd-0000-0000-0000-000000000003', 'Lote Terneros',   'Crías',                  6, '2025-03-01', 'activo', 'cccccccc-0000-0000-0000-000000000005'),
    ('dddddddd-0000-0000-0000-000000000004', 'Lote Engorde',    'Machos en engorde',     10, '2025-01-20', 'activo', 'cccccccc-0000-0000-0000-000000000003');

INSERT INTO content.Bovino (id, sexo, raza, fecha_nacimiento, id_madre, id_padre, id_lote, origen) VALUES
    ('eeeeeeee-0000-0000-0000-000000000001', 'Hembra', 'Brahman',   '2020-03-12', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000001', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000002', 'Hembra', 'Brahman',   '2019-07-22', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000001', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000003', 'Hembra', 'Simmental', '2021-01-05', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000001', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000004', 'Macho',  'Brahman',   '2023-05-18', 'eeeeeeee-0000-0000-0000-000000000001', NULL, 'dddddddd-0000-0000-0000-000000000002', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000005', 'Macho',  'Cebú',      '2023-08-30', 'eeeeeeee-0000-0000-0000-000000000002', NULL, 'dddddddd-0000-0000-0000-000000000002', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000006', 'Hembra', 'Brahman',   '2024-02-14', 'eeeeeeee-0000-0000-0000-000000000001', NULL, 'dddddddd-0000-0000-0000-000000000003', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000007', 'Macho',  'Simmental', '2024-04-01', 'eeeeeeee-0000-0000-0000-000000000003', NULL, 'dddddddd-0000-0000-0000-000000000003', 'Nacido en finca'),
    ('eeeeeeee-0000-0000-0000-000000000008', 'Macho',  'Cebú',      '2022-11-10', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000004', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000009', 'Macho',  'Brahman',   '2022-09-05', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000004', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-00000000000a', 'Hembra', 'Holstein',  '2020-06-18', NULL,                                   NULL, 'dddddddd-0000-0000-0000-000000000001', 'Comprado');

INSERT INTO content.Pesaje (id, fecha_pesaje, peso, id_animal) VALUES
    ('ffffffff-0000-0000-0000-000000000001', '2025-01-15', 380.5, 'eeeeeeee-0000-0000-0000-000000000001'),
    ('ffffffff-0000-0000-0000-000000000002', '2025-04-15', 395.0, 'eeeeeeee-0000-0000-0000-000000000001'),
    ('ffffffff-0000-0000-0000-000000000003', '2025-01-15', 410.0, 'eeeeeeee-0000-0000-0000-000000000002'),
    ('ffffffff-0000-0000-0000-000000000004', '2025-04-15', 418.5, 'eeeeeeee-0000-0000-0000-000000000002'),
    ('ffffffff-0000-0000-0000-000000000005', '2025-02-01', 145.0, 'eeeeeeee-0000-0000-0000-000000000004'),
    ('ffffffff-0000-0000-0000-000000000006', '2025-05-01', 198.0, 'eeeeeeee-0000-0000-0000-000000000004'),
    ('ffffffff-0000-0000-0000-000000000007', '2025-02-01', 138.5, 'eeeeeeee-0000-0000-0000-000000000005'),
    ('ffffffff-0000-0000-0000-000000000008', '2025-05-01', 185.0, 'eeeeeeee-0000-0000-0000-000000000005'),
    ('ffffffff-0000-0000-0000-000000000009', '2025-03-10', 320.0, 'eeeeeeee-0000-0000-0000-000000000008'),
    ('ffffffff-0000-0000-0000-00000000000a', '2025-06-10', 375.5, 'eeeeeeee-0000-0000-0000-000000000008');

INSERT INTO content.Vacunacion (id, id_medicamento, fecha_aplicacion, id_animal, dosis, observacion) VALUES
    ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', '2025-01-20', 'eeeeeeee-0000-0000-0000-000000000001',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', '2025-01-20', 'eeeeeeee-0000-0000-0000-000000000002',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', '2025-01-20', 'eeeeeeee-0000-0000-0000-000000000003',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', '2025-02-10', 'eeeeeeee-0000-0000-0000-000000000004',   3.0, 'Desparasitación de ingreso al lote'),
    ('11111111-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', '2025-02-10', 'eeeeeeee-0000-0000-0000-000000000005',   2.8, 'Desparasitación de ingreso al lote'),
    ('11111111-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000005', '2025-03-05', 'eeeeeeee-0000-0000-0000-000000000001',   2.0, 'Vacuna brucelosis anual'),
    ('11111111-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000005', '2025-03-05', 'eeeeeeee-0000-0000-0000-000000000002',   2.0, 'Vacuna brucelosis anual'),
    ('11111111-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000004', '2025-04-01', 'eeeeeeee-0000-0000-0000-000000000006',   5.0, 'Suplemento vitamínico ternero'),
    ('11111111-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000004', '2025-04-01', 'eeeeeeee-0000-0000-0000-000000000007',   5.0, 'Suplemento vitamínico ternero'),
    ('11111111-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-000000000003', '2025-05-15', 'eeeeeeee-0000-0000-0000-000000000008', 350.0, 'Tratamiento infección respiratoria');

INSERT INTO content.EstadoAnimal (id, estado, descripcion, fecha_registro, id_animal) VALUES
    ('22222222-0000-0000-0000-000000000001', 'Sano',           'Sin novedad',                         '2025-01-15', 'eeeeeeee-0000-0000-0000-000000000001'),
    ('22222222-0000-0000-0000-000000000002', 'Sano',           'Sin novedad',                         '2025-01-15', 'eeeeeeee-0000-0000-0000-000000000002'),
    ('22222222-0000-0000-0000-000000000003', 'Gestante',       'Preñez confirmada por palpación',     '2025-03-10', 'eeeeeeee-0000-0000-0000-000000000003'),
    ('22222222-0000-0000-0000-000000000004', 'Sano',           'Sin novedad, buen desarrollo',        '2025-02-01', 'eeeeeeee-0000-0000-0000-000000000004'),
    ('22222222-0000-0000-0000-000000000005', 'Sano',           'Sin novedad, buen desarrollo',        '2025-02-01', 'eeeeeeee-0000-0000-0000-000000000005'),
    ('22222222-0000-0000-0000-000000000006', 'Sano',           'Ternero saludable',                   '2025-03-10', 'eeeeeeee-0000-0000-0000-000000000006'),
    ('22222222-0000-0000-0000-000000000007', 'Sano',           'Ternero saludable',                   '2025-03-10', 'eeeeeeee-0000-0000-0000-000000000007'),
    ('22222222-0000-0000-0000-000000000008', 'En tratamiento', 'Infección respiratoria leve',         '2025-05-15', 'eeeeeeee-0000-0000-0000-000000000008'),
    ('22222222-0000-0000-0000-000000000009', 'Sano',           'Sin novedad',                         '2025-01-15', 'eeeeeeee-0000-0000-0000-000000000009'),
    ('22222222-0000-0000-0000-00000000000a', 'Sano',           'Sin novedad',                         '2025-01-15', 'eeeeeeee-0000-0000-0000-00000000000a');

INSERT INTO content.Alimentacion (id, fecha_alimentacion, id_tipo_alimento, cantidad, observacion, id_lote) VALUES
    ('33333333-0000-0000-0000-000000000001', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000001', 150.0, 'Suministro diario pasto',          'dddddddd-0000-0000-0000-000000000001'),
    ('33333333-0000-0000-0000-000000000002', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000003',  10.0, 'Sal mineralizada semanal',         'dddddddd-0000-0000-0000-000000000001'),
    ('33333333-0000-0000-0000-000000000003', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000002',  40.0, 'Concentrado maíz lote levante',    'dddddddd-0000-0000-0000-000000000002'),
    ('33333333-0000-0000-0000-000000000004', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000004',  20.0, 'Melaza para energía',              'dddddddd-0000-0000-0000-000000000002'),
    ('33333333-0000-0000-0000-000000000005', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000001',  60.0, 'Pasto para terneros',              'dddddddd-0000-0000-0000-000000000003'),
    ('33333333-0000-0000-0000-000000000006', '2025-06-01', 'bbbbbbbb-0000-0000-0000-000000000004',  10.0, 'Melaza para terneros',             'dddddddd-0000-0000-0000-000000000003'),
    ('33333333-0000-0000-0000-000000000007', '2025-06-02', 'bbbbbbbb-0000-0000-0000-000000000002',  80.0, 'Concentrado maíz engorde',         'dddddddd-0000-0000-0000-000000000004'),
    ('33333333-0000-0000-0000-000000000008', '2025-06-02', 'bbbbbbbb-0000-0000-0000-000000000005', 100.0, 'Heno suplemento engorde',          'dddddddd-0000-0000-0000-000000000004'),
    ('33333333-0000-0000-0000-000000000009', '2025-06-02', 'bbbbbbbb-0000-0000-0000-000000000003',   8.0, 'Sal mineralizada lote engorde',    'dddddddd-0000-0000-0000-000000000004'),
    ('33333333-0000-0000-0000-00000000000a', '2025-06-02', 'bbbbbbbb-0000-0000-0000-000000000001', 150.0, 'Suministro diario pasto vientres', 'dddddddd-0000-0000-0000-000000000001');
