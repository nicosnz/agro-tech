-- ============================================================
-- Esquema: content
-- Base de datos: control de hato bovino
-- ============================================================

CREATE SCHEMA IF NOT EXISTS content;

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE content.Medicamento (
    id_medicamento  SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    dosis_recomendada VARCHAR(100),
    descripcion     TEXT,
    precio          NUMERIC(10,2)
);

CREATE TABLE content.TipoAlimento (
    id_alimento       SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    descripcion       TEXT,
    precio            NUMERIC(10,2),
    cantidad_restante NUMERIC(10,2)
);

CREATE TABLE content.Potrero (
    id_potrero  SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    capacidad   INT,
    ubicacion   VARCHAR(200),
    estado      VARCHAR(50)
);

CREATE TABLE content.Lote (
    id_lote           SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    tipo              VARCHAR(50),
    cantidad_animales INT DEFAULT 0,
    fecha_creacion    DATE,
    estado            VARCHAR(50),
    id_potrero        INT REFERENCES content.Potrero(id_potrero)
);

CREATE TABLE content.Bovino (
    id_animal       SERIAL PRIMARY KEY,
    sexo            VARCHAR(10),
    raza            VARCHAR(100),
    fecha_nacimiento DATE,
    id_madre        INT REFERENCES content.Bovino(id_animal),
    id_padre        INT REFERENCES content.Bovino(id_animal),
    id_lote         INT REFERENCES content.Lote(id_lote),
    origen          VARCHAR(100)
);

CREATE TABLE content.Pesaje (
    id_pesaje    SERIAL PRIMARY KEY,
    fecha_pesaje DATE NOT NULL,
    peso         NUMERIC(8,2),
    id_animal    INT NOT NULL REFERENCES content.Bovino(id_animal)
);

CREATE TABLE content.Vacunacion (
    id_vacunas        SERIAL PRIMARY KEY,
    id_medicamento    INT NOT NULL REFERENCES content.Medicamento(id_medicamento),
    fecha_aplicacion  DATE NOT NULL,
    id_animal         INT NOT NULL REFERENCES content.Bovino(id_animal),
    dosis             NUMERIC(8,2),
    observacion       TEXT
);

CREATE TABLE content.EstadoAnimal (
    id_estado      SERIAL PRIMARY KEY,
    estado         VARCHAR(100) NOT NULL,
    descripcion    TEXT,
    fecha_registro DATE NOT NULL,
    id_animal      INT NOT NULL REFERENCES content.Bovino(id_animal)
);

CREATE TABLE content.Alimentacion (
    id_alimentacion   SERIAL PRIMARY KEY,
    fecha_alimentacion DATE NOT NULL,
    id_tipo_alimento  INT NOT NULL REFERENCES content.TipoAlimento(id_alimento),
    cantidad          NUMERIC(10,2),
    observacion       TEXT,
    id_lote           INT NOT NULL REFERENCES content.Lote(id_lote)
);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO content.Medicamento (nombre, dosis_recomendada, descripcion, precio) VALUES
    ('Ivermectina 1%',   '1 ml por 50 kg',  'Antiparasitario de amplio espectro',          12500.00),
    ('Vacuna FMD',       '2 ml por animal',  'Vacuna contra fiebre aftosa',                 8900.00),
    ('Oxitetraciclina',  '10 mg por kg',     'Antibiótico de amplio espectro',              15000.00),
    ('Vitamina ADE',     '5 ml por animal',  'Suplemento vitamínico',                        6200.00),
    ('Vacuna Brucelosis','2 ml por animal',  'Vacuna contra brucelosis bovina',              9500.00);

INSERT INTO content.TipoAlimento (nombre, descripcion, precio, cantidad_restante) VALUES
    ('Pasto kikuyo',   'Pasto de corte para suplemento',      350.00,  5000.00),
    ('Maíz molido',    'Grano molido para concentrado',       1200.00, 2000.00),
    ('Sal mineralizada','Sal con minerales esenciales',        800.00,   500.00),
    ('Melaza',         'Subproducto de caña para energía',     450.00,  1000.00),
    ('Heno de avena',  'Forraje seco para época seca',         600.00,  3000.00);

INSERT INTO content.Potrero (nombre, capacidad, ubicacion, estado) VALUES
    ('Potrero Norte',   30, 'Sector norte de la finca',     'disponible'),
    ('Potrero Sur',     25, 'Sector sur de la finca',       'ocupado'),
    ('Potrero Centro',  40, 'Zona central',                 'ocupado'),
    ('Potrero Oriente', 20, 'Colindante con el río',        'disponible'),
    ('Potrero Cría',    15, 'Reservado para terneros',      'ocupado');

INSERT INTO content.Lote (nombre, tipo, cantidad_animales, fecha_creacion, estado, id_potrero) VALUES
    ('Lote Vientres A', 'Hembras reproductoras', 12, '2025-01-10', 'activo', 2),
    ('Lote Levante',    'Machos en levante',     8,  '2025-02-15', 'activo', 3),
    ('Lote Terneros',   'Crías',                 6,  '2025-03-01', 'activo', 5),
    ('Lote Engorde',    'Machos en engorde',     10, '2025-01-20', 'activo', 3);

INSERT INTO content.Bovino (sexo, raza, fecha_nacimiento, id_madre, id_padre, id_lote, origen) VALUES
    ('Hembra', 'Brahman',       '2020-03-12', NULL, NULL, 1, 'Nacido en finca'),
    ('Hembra', 'Brahman',       '2019-07-22', NULL, NULL, 1, 'Comprado'),
    ('Hembra', 'Simmental',     '2021-01-05', NULL, NULL, 1, 'Nacido en finca'),
    ('Macho',  'Brahman',       '2023-05-18', 1,    NULL, 2, 'Nacido en finca'),
    ('Macho',  'Cebú',          '2023-08-30', 2,    NULL, 2, 'Nacido en finca'),
    ('Hembra', 'Brahman',       '2024-02-14', 1,    NULL, 3, 'Nacido en finca'),
    ('Macho',  'Simmental',     '2024-04-01', 3,    NULL, 3, 'Nacido en finca'),
    ('Macho',  'Cebú',          '2022-11-10', NULL, NULL, 4, 'Comprado'),
    ('Macho',  'Brahman',       '2022-09-05', NULL, NULL, 4, 'Comprado'),
    ('Hembra', 'Holstein',      '2020-06-18', NULL, NULL, 1, 'Comprado');

INSERT INTO content.Pesaje (fecha_pesaje, peso, id_animal) VALUES
    ('2025-01-15', 380.5, 1),
    ('2025-04-15', 395.0, 1),
    ('2025-01-15', 410.0, 2),
    ('2025-04-15', 418.5, 2),
    ('2025-02-01', 145.0, 4),
    ('2025-05-01', 198.0, 4),
    ('2025-02-01', 138.5, 5),
    ('2025-05-01', 185.0, 5),
    ('2025-03-10', 320.0, 8),
    ('2025-06-10', 375.5, 8);

INSERT INTO content.Vacunacion (id_medicamento, fecha_aplicacion, id_animal, dosis, observacion) VALUES
    (2, '2025-01-20',  1,  2.0, 'Vacunación semestral fiebre aftosa'),
    (2, '2025-01-20',  2,  2.0, 'Vacunación semestral fiebre aftosa'),
    (2, '2025-01-20',  3,  2.0, 'Vacunación semestral fiebre aftosa'),
    (1, '2025-02-10',  4,  3.0, 'Desparasitación de ingreso al lote'),
    (1, '2025-02-10',  5,  2.8, 'Desparasitación de ingreso al lote'),
    (5, '2025-03-05',  1,  2.0, 'Vacuna brucelosis anual'),
    (5, '2025-03-05',  2,  2.0, 'Vacuna brucelosis anual'),
    (4, '2025-04-01',  6,  5.0, 'Suplemento vitamínico ternero'),
    (4, '2025-04-01',  7,  5.0, 'Suplemento vitamínico ternero'),
    (3, '2025-05-15',  8,  350.0, 'Tratamiento infección respiratoria');

INSERT INTO content.EstadoAnimal (estado, descripcion, fecha_registro, id_animal) VALUES
    ('Sano',        'Sin novedad',                             '2025-01-15', 1),
    ('Sano',        'Sin novedad',                             '2025-01-15', 2),
    ('Gestante',    'Preñez confirmada por palpación',         '2025-03-10', 3),
    ('Sano',        'Sin novedad, buen desarrollo',            '2025-02-01', 4),
    ('Sano',        'Sin novedad, buen desarrollo',            '2025-02-01', 5),
    ('Sano',        'Ternero saludable',                       '2025-03-10', 6),
    ('Sano',        'Ternero saludable',                       '2025-03-10', 7),
    ('En tratamiento', 'Infección respiratoria leve',          '2025-05-15', 8),
    ('Sano',        'Sin novedad',                             '2025-01-15', 9),
    ('Sano',        'Sin novedad',                             '2025-01-15', 10);

INSERT INTO content.Alimentacion (fecha_alimentacion, id_tipo_alimento, cantidad, observacion, id_lote) VALUES
    ('2025-06-01', 1,  150.0, 'Suministro diario pasto',              1),
    ('2025-06-01', 3,   10.0, 'Sal mineralizada semanal',             1),
    ('2025-06-01', 2,   40.0, 'Concentrado maíz lote levante',        2),
    ('2025-06-01', 4,   20.0, 'Melaza para energía',                  2),
    ('2025-06-01', 1,   60.0, 'Pasto para terneros',                  3),
    ('2025-06-01', 4,   10.0, 'Melaza para terneros',                 3),
    ('2025-06-02', 2,   80.0, 'Concentrado maíz engorde',             4),
    ('2025-06-02', 5,  100.0, 'Heno suplemento engorde',              4),
    ('2025-06-02', 3,    8.0, 'Sal mineralizada lote engorde',        4),
    ('2025-06-02', 1,  150.0, 'Suministro diario pasto vientres',     1);
