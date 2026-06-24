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
    disponible          BOOLEAN NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.TipoAlimento (
    id       UUID PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    descripcion       TEXT,
    precio            NUMERIC(10,2),
    cantidad_restante NUMERIC(10,2),
    disponible          BOOLEAN NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content.Potrero (
    id  UUID PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    capacidad   INT,
    ubicacion   VARCHAR(200),
    estado      VARCHAR(50) CHECK (estado IN ('Disponible', 'Ocupado', 'En Descanso', 'Inactivo')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Lote (
    id           UUID PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    tipo              VARCHAR(50) CHECK (tipo IN ('Nacimiento','Recria','Engorde')),
    cantidad_animales INT DEFAULT 0,
    fecha_creacion    DATE,
    activo          BOOLEAN NOT NULL,
    id_potrero        UUID REFERENCES content.Potrero(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Bovino (
    id       UUID PRIMARY KEY,
    sexo            VARCHAR(10) CHECK (sexo IN ('Macho','Hembra')),
    raza            VARCHAR(100) CHECK (raza IN ('Nelore','Brangus','Brahman')),
    fecha_nacimiento DATE,
    id_madre        UUID REFERENCES content.Bovino(id),
    id_padre        UUID REFERENCES content.Bovino(id),
    id_lote         UUID REFERENCES content.Lote(id),
    origen          VARCHAR(100) CHECK (origen IN ('Comprado','Nacimiento propio')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE content.Pesaje (
    id    UUID PRIMARY KEY,
    fecha_pesaje DATE NOT NULL,
    peso         NUMERIC(6,2),
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
    estado         VARCHAR(100) NOT NULL CHECK (estado IN ('En observacion','En tratamiento','Fallecido','Sano','Vendido')),
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

INSERT INTO content.Medicamento (id, nombre, dosis_recomendada, descripcion, precio, disponible) VALUES
    ('aaaaaaaa-0000-0000-0000-000000000001', 'Ivermectina 1%',   '1 ml por 50 kg',  'Antiparasitario de amplio espectro',  12500.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'Vacuna FMD',       '2 ml por animal',  'Vacuna contra fiebre aftosa',          8900.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000003', 'Oxitetraciclina',  '10 mg por kg',     'Antibiótico de amplio espectro',      15000.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'Vitamina ADE',     '5 ml por animal',  'Suplemento vitamínico',                6200.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000005', 'Vacuna Brucelosis','2 ml por animal',  'Vacuna contra brucelosis bovina',      9500.00, TRUE);

INSERT INTO content.TipoAlimento (id, nombre, descripcion, precio, cantidad_restante,disponible) VALUES
    ('bbbbbbbb-0000-0000-0000-000000000001', 'Pasto kikuyo',    'Pasto de corte para suplemento',    350.00, 5000.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000002', 'Maíz molido',     'Grano molido para concentrado',    1200.00, 2000.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000003', 'Sal mineralizada','Sal con minerales esenciales',       800.00,  500.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000004', 'Melaza',          'Subproducto de caña para energía',   450.00, 1000.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000005', 'Heno de avena',   'Forraje seco para época seca',       600.00, 3000.00, TRUE);

INSERT INTO content.Potrero (id, nombre, capacidad, ubicacion, estado) VALUES
    ('cccccccc-0000-0000-0000-000000000001', 'Potrero Norte',   30, 'Sector norte de la finca',  'Disponible'),
    ('cccccccc-0000-0000-0000-000000000002', 'Potrero Sur',     25, 'Sector sur de la finca',    'Ocupado'),
    ('cccccccc-0000-0000-0000-000000000003', 'Potrero Centro',  40, 'Zona central',              'Ocupado'),
    ('cccccccc-0000-0000-0000-000000000004', 'Potrero Oriente', 20, 'Colindante con el río',     'Disponible'),
    ('cccccccc-0000-0000-0000-000000000005', 'Potrero Cría',    15, 'Reservado para terneros',   'Ocupado');

INSERT INTO content.Lote (id, nombre, tipo, cantidad_animales, fecha_creacion, activo, id_potrero) VALUES
    ('dddddddd-0000-0000-0000-000000000001', 'Lote Vientres A', 'Nacimiento', 4, '2025-01-10', TRUE, 'cccccccc-0000-0000-0000-000000000002'),
    ('dddddddd-0000-0000-0000-000000000002', 'Lote Levante',    'Recria',     2, '2025-02-15', TRUE, 'cccccccc-0000-0000-0000-000000000003'),
    ('dddddddd-0000-0000-0000-000000000003', 'Lote Terneros',   'Engorde',    2, '2025-03-01', TRUE, 'cccccccc-0000-0000-0000-000000000005'),
    ('dddddddd-0000-0000-0000-000000000004', 'Lote Engorde',    'Engorde',    2, '2025-01-20', TRUE, 'cccccccc-0000-0000-0000-000000000003');

-- bov-1,2,3,10: Comprado (sin madre/padre requeridos)
-- bov-4,5,6,7: Nacimiento propio (madre y padre obligatorios; padres = bov-8 o bov-9)
INSERT INTO content.Bovino (id, sexo, raza, fecha_nacimiento, id_madre, id_padre, id_lote, origen) VALUES
    ('eeeeeeee-0000-0000-0000-000000000001', 'Hembra', 'Brahman', '2020-03-12', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000001', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000002', 'Hembra', 'Brahman', '2019-07-22', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000001', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000003', 'Hembra', 'Brangus', '2021-01-05', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000001', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000008', 'Macho',  'Nelore',  '2022-11-10', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000004', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000009', 'Macho',  'Brahman', '2022-09-05', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000004', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-00000000000a', 'Hembra', 'Brangus', '2020-06-18', NULL,                                   NULL,                                   'dddddddd-0000-0000-0000-000000000001', 'Comprado'),
    ('eeeeeeee-0000-0000-0000-000000000004', 'Macho',  'Brahman', '2023-05-18', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000002', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000005', 'Macho',  'Nelore',  '2023-08-30', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000002', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000006', 'Hembra', 'Brahman', '2024-02-14', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000003', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000007', 'Macho',  'Brangus', '2024-04-01', 'eeeeeeee-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000003', 'Nacimiento propio');

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
    ('22222222-0000-0000-0000-000000000003', 'En observacion',  'Preñez confirmada por palpación',     '2025-03-10', 'eeeeeeee-0000-0000-0000-000000000003'),
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

-- ============================================================
-- DATOS ADICIONALES
-- ============================================================

INSERT INTO content.Medicamento (id, nombre, dosis_recomendada, descripcion, precio, disponible) VALUES
    ('aaaaaaaa-0000-0000-0000-000000000006', 'Closantel 10%', '2.5 ml por 50 kg',  'Antiparasitario selectivo contra fasciola hepática',  18000.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000007', 'Complejo B',    '5 ml por animal',   'Suplemento vitamínico del grupo B para metabolismo',   7500.00, TRUE),
    ('aaaaaaaa-0000-0000-0000-000000000008', 'Vacuna IBR',    '2 ml por animal',   'Vacuna contra rinotraqueitis infecciosa bovina',      11000.00, FALSE);

INSERT INTO content.TipoAlimento (id, nombre, descripcion, precio, cantidad_restante, disponible) VALUES
    ('bbbbbbbb-0000-0000-0000-000000000006', 'Soya desgrasada', 'Harina de soya para aporte proteico en engorde',           1800.00, 1500.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000007', 'Pasto estrella',  'Pasto de corte de alta productividad forrajera',            300.00, 4000.00, TRUE),
    ('bbbbbbbb-0000-0000-0000-000000000008', 'Ensilaje de maíz','Forraje fermentado para suplemento en época seca',          550.00,  200.00, TRUE);

INSERT INTO content.Potrero (id, nombre, capacidad, ubicacion, estado) VALUES
    ('cccccccc-0000-0000-0000-000000000006', 'Potrero Occidente',  35, 'Colindante con bosque nativo al occidente',          'Disponible'),
    ('cccccccc-0000-0000-0000-000000000007', 'Potrero Maternidad', 20, 'Zona protegida para partos y cría temprana',         'Ocupado'),
    ('cccccccc-0000-0000-0000-000000000008', 'Potrero Rotación A', 30, 'Primer cuadro del sistema de pastoreo rotacional',   'En Descanso');

INSERT INTO content.Lote (id, nombre, tipo, cantidad_animales, fecha_creacion, activo, id_potrero) VALUES
    ('dddddddd-0000-0000-0000-000000000005', 'Lote Vientres B',    'Nacimiento', 10, '2025-04-01', TRUE, 'cccccccc-0000-0000-0000-000000000007'),
    ('dddddddd-0000-0000-0000-000000000006', 'Lote Machos Levante','Recria',      5, '2025-03-15', TRUE, 'cccccccc-0000-0000-0000-000000000006'),
    ('dddddddd-0000-0000-0000-000000000007', 'Lote Engorde B',     'Engorde',     5, '2025-02-01', TRUE, 'cccccccc-0000-0000-0000-000000000001'),
    ('dddddddd-0000-0000-0000-000000000008', 'Lote Cría Norte',    'Nacimiento',  5, '2025-05-10', TRUE, 'cccccccc-0000-0000-0000-000000000007'),
    ('dddddddd-0000-0000-0000-000000000009', 'Lote Recría Sur',    'Recria',      5, '2025-04-20', TRUE, 'cccccccc-0000-0000-0000-000000000002');

-- 20 bovinos, todos nacimiento propio (sin NULL en id_madre ni id_padre)
INSERT INTO content.Bovino (id, sexo, raza, fecha_nacimiento, id_madre, id_padre, id_lote, origen) VALUES
    -- Cruce bov-001 (Brahman) × bov-009 (Brahman)
    ('eeeeeeee-0000-0000-0000-000000000010', 'Hembra', 'Brahman', '2023-02-14', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000005', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000011', 'Macho',  'Brahman', '2023-05-20', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000006', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000012', 'Hembra', 'Brahman', '2023-08-10', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000005', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000013', 'Macho',  'Brahman', '2023-11-03', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000006', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000014', 'Hembra', 'Brahman', '2024-02-28', 'eeeeeeee-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000008', 'Nacimiento propio'),
    -- Cruce bov-002 (Brahman) × bov-008 (Nelore)
    ('eeeeeeee-0000-0000-0000-000000000015', 'Macho',  'Brahman', '2023-03-15', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000006', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000016', 'Hembra', 'Brahman', '2023-06-22', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000005', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000017', 'Macho',  'Brahman', '2023-09-12', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000007', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000018', 'Hembra', 'Brahman', '2023-12-05', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000005', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000019', 'Macho',  'Brahman', '2024-04-18', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000009', 'Nacimiento propio'),
    -- Cruce bov-003 (Brangus) × bov-009 (Brahman)
    ('eeeeeeee-0000-0000-0000-00000000001a', 'Hembra', 'Brangus', '2024-01-10', 'eeeeeeee-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000008', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-00000000001b', 'Macho',  'Brangus', '2024-05-25', 'eeeeeeee-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000009', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-00000000001c', 'Hembra', 'Brangus', '2024-08-30', 'eeeeeeee-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000008', 'Nacimiento propio'),
    -- Cruce bov-00a (Brangus) × bov-008 (Nelore)
    ('eeeeeeee-0000-0000-0000-00000000001d', 'Macho',  'Brangus', '2023-04-07', 'eeeeeeee-0000-0000-0000-00000000000a', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000007', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-00000000001e', 'Hembra', 'Brangus', '2023-07-18', 'eeeeeeee-0000-0000-0000-00000000000a', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000005', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-00000000001f', 'Macho',  'Brangus', '2023-10-25', 'eeeeeeee-0000-0000-0000-00000000000a', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000007', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000020', 'Hembra', 'Brangus', '2024-03-12', 'eeeeeeee-0000-0000-0000-00000000000a', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000008', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000021', 'Macho',  'Brangus', '2024-06-20', 'eeeeeeee-0000-0000-0000-00000000000a', 'eeeeeeee-0000-0000-0000-000000000008', 'dddddddd-0000-0000-0000-000000000009', 'Nacimiento propio'),
    -- Cruce bov-002 (Brahman) × bov-009 (Brahman)
    ('eeeeeeee-0000-0000-0000-000000000022', 'Hembra', 'Brahman', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000008', 'Nacimiento propio'),
    ('eeeeeeee-0000-0000-0000-000000000023', 'Macho',  'Brahman', '2024-09-28', 'eeeeeeee-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000009', 'dddddddd-0000-0000-0000-000000000009', 'Nacimiento propio');

INSERT INTO content.Pesaje (id, fecha_pesaje, peso, id_animal) VALUES
    -- 2 pesajes por animal nacido en 2023
    ('ffffffff-0000-0000-0000-00000000000b', '2024-03-14', 198.0, 'eeeeeeee-0000-0000-0000-000000000010'),
    ('ffffffff-0000-0000-0000-00000000000c', '2026-03-14', 274.0, 'eeeeeeee-0000-0000-0000-000000000010'),
    ('ffffffff-0000-0000-0000-00000000000d', '2024-06-20', 260.0, 'eeeeeeee-0000-0000-0000-000000000011'),
    ('ffffffff-0000-0000-0000-00000000000e', '2026-03-14', 385.0, 'eeeeeeee-0000-0000-0000-000000000011'),
    ('ffffffff-0000-0000-0000-00000000000f', '2024-09-10', 205.0, 'eeeeeeee-0000-0000-0000-000000000012'),
    ('ffffffff-0000-0000-0000-000000000010', '2026-04-10', 278.0, 'eeeeeeee-0000-0000-0000-000000000012'),
    ('ffffffff-0000-0000-0000-000000000011', '2024-12-03', 248.0, 'eeeeeeee-0000-0000-0000-000000000013'),
    ('ffffffff-0000-0000-0000-000000000012', '2026-04-10', 368.0, 'eeeeeeee-0000-0000-0000-000000000013'),
    ('ffffffff-0000-0000-0000-000000000013', '2024-04-15', 258.0, 'eeeeeeee-0000-0000-0000-000000000015'),
    ('ffffffff-0000-0000-0000-000000000014', '2026-04-15', 390.0, 'eeeeeeee-0000-0000-0000-000000000015'),
    ('ffffffff-0000-0000-0000-000000000015', '2024-07-22', 212.0, 'eeeeeeee-0000-0000-0000-000000000016'),
    ('ffffffff-0000-0000-0000-000000000016', '2026-04-15', 288.0, 'eeeeeeee-0000-0000-0000-000000000016'),
    ('ffffffff-0000-0000-0000-000000000017', '2024-10-12', 272.0, 'eeeeeeee-0000-0000-0000-000000000017'),
    ('ffffffff-0000-0000-0000-000000000018', '2026-04-15', 402.0, 'eeeeeeee-0000-0000-0000-000000000017'),
    ('ffffffff-0000-0000-0000-000000000019', '2025-01-05', 210.0, 'eeeeeeee-0000-0000-0000-000000000018'),
    ('ffffffff-0000-0000-0000-00000000001a', '2026-04-15', 285.0, 'eeeeeeee-0000-0000-0000-000000000018'),
    ('ffffffff-0000-0000-0000-00000000001b', '2024-05-07', 268.0, 'eeeeeeee-0000-0000-0000-00000000001d'),
    ('ffffffff-0000-0000-0000-00000000001c', '2026-04-15', 395.0, 'eeeeeeee-0000-0000-0000-00000000001d'),
    ('ffffffff-0000-0000-0000-00000000001d', '2024-08-18', 220.0, 'eeeeeeee-0000-0000-0000-00000000001e'),
    ('ffffffff-0000-0000-0000-00000000001e', '2026-04-15', 298.0, 'eeeeeeee-0000-0000-0000-00000000001e'),
    ('ffffffff-0000-0000-0000-00000000001f', '2024-11-25', 280.0, 'eeeeeeee-0000-0000-0000-00000000001f'),
    ('ffffffff-0000-0000-0000-000000000020', '2026-04-15', 410.0, 'eeeeeeee-0000-0000-0000-00000000001f'),
    -- 1 pesaje por animal nacido en 2024
    ('ffffffff-0000-0000-0000-000000000021', '2025-03-28', 158.0, 'eeeeeeee-0000-0000-0000-000000000014'),
    ('ffffffff-0000-0000-0000-000000000022', '2025-04-10', 145.0, 'eeeeeeee-0000-0000-0000-00000000001a'),
    ('ffffffff-0000-0000-0000-000000000023', '2025-06-25', 165.0, 'eeeeeeee-0000-0000-0000-00000000001b');

INSERT INTO content.Vacunacion (id, id_medicamento, fecha_aplicacion, id_animal, dosis, observacion) VALUES
    ('11111111-0000-0000-0000-00000000000b', 'aaaaaaaa-0000-0000-0000-000000000001', '2024-02-15', 'eeeeeeee-0000-0000-0000-000000000010',   4.0, 'Desparasitación preventiva primer año'),
    ('11111111-0000-0000-0000-00000000000c', 'aaaaaaaa-0000-0000-0000-000000000001', '2024-02-15', 'eeeeeeee-0000-0000-0000-000000000011',   5.2, 'Desparasitación preventiva primer año'),
    ('11111111-0000-0000-0000-00000000000d', 'aaaaaaaa-0000-0000-0000-000000000001', '2024-02-15', 'eeeeeeee-0000-0000-0000-000000000012',   4.1, 'Desparasitación preventiva primer año'),
    ('11111111-0000-0000-0000-00000000000e', 'aaaaaaaa-0000-0000-0000-000000000001', '2024-04-20', 'eeeeeeee-0000-0000-0000-000000000015',   4.9, 'Desparasitación preventiva primer año'),
    ('11111111-0000-0000-0000-00000000000f', 'aaaaaaaa-0000-0000-0000-000000000001', '2024-04-20', 'eeeeeeee-0000-0000-0000-00000000001d',   5.4, 'Desparasitación preventiva primer año'),
    ('11111111-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000002', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000010',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000002', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000011',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000002', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000012',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000002', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000016',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000002', '2024-07-15', 'eeeeeeee-0000-0000-0000-000000000017',   2.0, 'Vacunación semestral fiebre aftosa'),
    ('11111111-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000004', '2025-01-15', 'eeeeeeee-0000-0000-0000-000000000014',   5.0, 'Suplemento vitamínico ternera en desarrollo'),
    ('11111111-0000-0000-0000-000000000016', 'aaaaaaaa-0000-0000-0000-000000000004', '2025-01-15', 'eeeeeeee-0000-0000-0000-00000000001a',   5.0, 'Suplemento vitamínico ternera en desarrollo'),
    ('11111111-0000-0000-0000-000000000017', 'aaaaaaaa-0000-0000-0000-000000000004', '2025-03-01', 'eeeeeeee-0000-0000-0000-00000000001b',   5.0, 'Suplemento vitamínico ternero en desarrollo'),
    ('11111111-0000-0000-0000-000000000018', 'aaaaaaaa-0000-0000-0000-000000000006', '2025-05-10', 'eeeeeeee-0000-0000-0000-00000000001f',   8.0, 'Tratamiento preventivo fasciola en potrero nuevo'),
    ('11111111-0000-0000-0000-000000000019', 'aaaaaaaa-0000-0000-0000-000000000006', '2025-05-10', 'eeeeeeee-0000-0000-0000-00000000001d',   8.5, 'Tratamiento preventivo fasciola en potrero nuevo');

INSERT INTO content.EstadoAnimal (id, estado, descripcion, fecha_registro, id_animal) VALUES
    ('22222222-0000-0000-0000-00000000000b', 'Sano',            'Buen desarrollo y ganancia de peso sostenida',          '2024-03-15', 'eeeeeeee-0000-0000-0000-000000000010'),
    ('22222222-0000-0000-0000-00000000000c', 'Sano',            'Buen desarrollo, candidato a reproductor',              '2024-06-20', 'eeeeeeee-0000-0000-0000-000000000011'),
    ('22222222-0000-0000-0000-00000000000d', 'Sano',            'Sin novedad, desarrollo normal',                        '2024-09-10', 'eeeeeeee-0000-0000-0000-000000000012'),
    ('22222222-0000-0000-0000-00000000000e', 'Sano',            'Buen desarrollo, buena conformación corporal',          '2024-12-03', 'eeeeeeee-0000-0000-0000-000000000013'),
    ('22222222-0000-0000-0000-00000000000f', 'Sano',            'Ternera saludable en etapa de crecimiento',             '2025-03-28', 'eeeeeeee-0000-0000-0000-000000000014'),
    ('22222222-0000-0000-0000-000000000010', 'Sano',            'Excelente desarrollo muscular para engorde',            '2024-04-15', 'eeeeeeee-0000-0000-0000-000000000015'),
    ('22222222-0000-0000-0000-000000000011', 'Sano',            'Sin novedad',                                           '2024-07-22', 'eeeeeeee-0000-0000-0000-000000000016'),
    ('22222222-0000-0000-0000-000000000012', 'Sano',            'Buen desarrollo muscular para engorde',                 '2025-01-12', 'eeeeeeee-0000-0000-0000-000000000017'),
    ('22222222-0000-0000-0000-000000000013', 'Sano',            'Sin novedad',                                           '2025-02-01', 'eeeeeeee-0000-0000-0000-000000000018'),
    ('22222222-0000-0000-0000-000000000014', 'Sano',            'Ternero en buen estado general',                        '2025-05-18', 'eeeeeeee-0000-0000-0000-000000000019'),
    ('22222222-0000-0000-0000-000000000015', 'Sano',            'Ternera en etapa de crecimiento',                       '2025-04-10', 'eeeeeeee-0000-0000-0000-00000000001a'),
    ('22222222-0000-0000-0000-000000000016', 'Sano',            'Ternero en buen estado, buen apetito',                  '2025-06-25', 'eeeeeeee-0000-0000-0000-00000000001b'),
    ('22222222-0000-0000-0000-000000000017', 'Sano',            'Animal en óptimas condiciones para engorde',            '2024-05-07', 'eeeeeeee-0000-0000-0000-00000000001d'),
    ('22222222-0000-0000-0000-000000000018', 'Sano',            'Sin novedad',                                           '2024-08-18', 'eeeeeeee-0000-0000-0000-00000000001e'),
    ('22222222-0000-0000-0000-000000000019', 'En tratamiento',  'Parasitosis gastrointestinal moderada en tratamiento',  '2025-02-01', 'eeeeeeee-0000-0000-0000-00000000001f'),
    ('22222222-0000-0000-0000-00000000001a', 'Sano',            'Ternera en buen estado general',                        '2025-10-01', 'eeeeeeee-0000-0000-0000-00000000001c'),
    ('22222222-0000-0000-0000-00000000001b', 'Sano',            'Ternera saludable en desarrollo',                       '2025-04-01', 'eeeeeeee-0000-0000-0000-000000000020'),
    ('22222222-0000-0000-0000-00000000001c', 'Sano',            'Ternero en buen estado general',                        '2025-07-01', 'eeeeeeee-0000-0000-0000-000000000021'),
    ('22222222-0000-0000-0000-00000000001d', 'Sano',            'Ternera sin novedad',                                   '2025-08-01', 'eeeeeeee-0000-0000-0000-000000000022'),
    ('22222222-0000-0000-0000-00000000001e', 'Sano',            'Ternero sin novedad',                                   '2025-11-01', 'eeeeeeee-0000-0000-0000-000000000023');

INSERT INTO content.Alimentacion (id, fecha_alimentacion, id_tipo_alimento, cantidad, observacion, id_lote) VALUES
    -- Lote Vientres B
    ('33333333-0000-0000-0000-00000000000b', '2026-01-10', 'bbbbbbbb-0000-0000-0000-000000000001', 200.0, 'Suministro semanal pasto para vientres en gestación',   'dddddddd-0000-0000-0000-000000000005'),
    ('33333333-0000-0000-0000-00000000000c', '2026-02-10', 'bbbbbbbb-0000-0000-0000-000000000003',  12.0, 'Sal mineralizada quincenal vientres',                   'dddddddd-0000-0000-0000-000000000005'),
    ('33333333-0000-0000-0000-00000000000d', '2026-03-10', 'bbbbbbbb-0000-0000-0000-000000000004',  25.0, 'Suplemento energético melaza para vientres',             'dddddddd-0000-0000-0000-000000000005'),
    ('33333333-0000-0000-0000-00000000000e', '2026-04-10', 'bbbbbbbb-0000-0000-0000-000000000006',  30.0, 'Suplemento proteico soya vientres en producción',        'dddddddd-0000-0000-0000-000000000005'),
    -- Lote Machos Levante
    ('33333333-0000-0000-0000-00000000000f', '2026-01-15', 'bbbbbbbb-0000-0000-0000-000000000002',  60.0, 'Concentrado maíz para ganancia de peso en levante',      'dddddddd-0000-0000-0000-000000000006'),
    ('33333333-0000-0000-0000-000000000010', '2026-02-15', 'bbbbbbbb-0000-0000-0000-000000000007', 180.0, 'Suministro pasto estrella fresco machos levante',         'dddddddd-0000-0000-0000-000000000006'),
    ('33333333-0000-0000-0000-000000000011', '2026-03-15', 'bbbbbbbb-0000-0000-0000-000000000003',   8.0, 'Sal mineralizada machos en levante',                     'dddddddd-0000-0000-0000-000000000006'),
    ('33333333-0000-0000-0000-000000000012', '2026-04-15', 'bbbbbbbb-0000-0000-0000-000000000004',  15.0, 'Melaza energía suplementaria levante',                   'dddddddd-0000-0000-0000-000000000006'),
    -- Lote Engorde B
    ('33333333-0000-0000-0000-000000000013', '2026-01-20', 'bbbbbbbb-0000-0000-0000-000000000002',  90.0, 'Concentrado alto maíz engorde intensivo',                'dddddddd-0000-0000-0000-000000000007'),
    ('33333333-0000-0000-0000-000000000014', '2026-02-20', 'bbbbbbbb-0000-0000-0000-000000000008', 120.0, 'Ensilaje maíz suplemento engorde',                       'dddddddd-0000-0000-0000-000000000007'),
    ('33333333-0000-0000-0000-000000000015', '2026-03-20', 'bbbbbbbb-0000-0000-0000-000000000006',  45.0, 'Soya suplemento proteico engorde',                       'dddddddd-0000-0000-0000-000000000007'),
    ('33333333-0000-0000-0000-000000000016', '2026-04-20', 'bbbbbbbb-0000-0000-0000-000000000005',  80.0, 'Heno avena fibra suplementaria engorde',                 'dddddddd-0000-0000-0000-000000000007'),
    -- Lote Cría Norte
    ('33333333-0000-0000-0000-000000000017', '2026-01-25', 'bbbbbbbb-0000-0000-0000-000000000001',  80.0, 'Suministro pasto kikuyo para terneras en cría',          'dddddddd-0000-0000-0000-000000000008'),
    ('33333333-0000-0000-0000-000000000018', '2026-02-25', 'bbbbbbbb-0000-0000-0000-000000000003',   5.0, 'Sal mineralizada cría norte',                            'dddddddd-0000-0000-0000-000000000008'),
    ('33333333-0000-0000-0000-000000000019', '2026-03-25', 'bbbbbbbb-0000-0000-0000-000000000004',  10.0, 'Melaza suplemento energético terneras',                  'dddddddd-0000-0000-0000-000000000008'),
    ('33333333-0000-0000-0000-00000000001a', '2026-04-25', 'bbbbbbbb-0000-0000-0000-000000000007', 100.0, 'Pasto estrella fresco cría norte',                       'dddddddd-0000-0000-0000-000000000008'),
    -- Lote Recría Sur
    ('33333333-0000-0000-0000-00000000001b', '2026-02-01', 'bbbbbbbb-0000-0000-0000-000000000002',  50.0, 'Concentrado inicio recría sur',                          'dddddddd-0000-0000-0000-000000000009'),
    ('33333333-0000-0000-0000-00000000001c', '2026-03-01', 'bbbbbbbb-0000-0000-0000-000000000005',  70.0, 'Heno avena forraje seco recría',                         'dddddddd-0000-0000-0000-000000000009'),
    ('33333333-0000-0000-0000-00000000001d', '2026-04-01', 'bbbbbbbb-0000-0000-0000-000000000003',   6.0, 'Sal mineralizada recría sur',                            'dddddddd-0000-0000-0000-000000000009'),
    ('33333333-0000-0000-0000-00000000001e', '2026-05-01', 'bbbbbbbb-0000-0000-0000-000000000001', 120.0, 'Suministro pasto verde recría sur',                      'dddddddd-0000-0000-0000-000000000009');
