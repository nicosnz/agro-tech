# AgroTech — Sistema de Gestión Ganadera Bovina

Sistema de administración para el manejo y control sanitario de haciendas ganaderas. Desarrollado con Django y su panel de administración integrado.

## Descripción

AgroTech permite a los administradores de hacienda llevar un registro centralizado del hato bovino: animales, lotes, potreros, alimentación, pesajes, vacunaciones y estado sanitario de cada animal.

## Módulos implementados

### Infraestructura
- **Potreros** — registro de potreros con capacidad, ubicación y estado (`Disponible`, `Ocupado`, `En Descanso`, `Inactivo`). El sistema advierte cuando se supera la capacidad y bloquea la asignación de lotes a potreros inactivos o en descanso.
- **Lotes** — agrupación de animales dentro de un potrero. El conteo de animales se actualiza automáticamente al vincular o desvincular bovinos.

### Animales
- **Bovinos** — registro individual con raza, sexo, origen y vínculos de parentesco (madre/padre). Si el origen es `Nacimiento propio`, los campos de madre y padre son obligatorios.
- **Estados del animal** — historial de estados sanitarios (`Sano`, `En observación`, `En tratamiento`, `Fallecido`, `Vendido`). Al marcar un animal como fallecido o vendido, se desvincula automáticamente de su lote y el registro queda bloqueado para edición.
- **Pesajes** — registro histórico de peso por animal.

### Sanidad
- **Medicamentos** — catálogo de medicamentos con dosis recomendada, precio y disponibilidad.
- **Vacunaciones** — registro de vacunaciones aplicadas por animal. No se permite registrar vacunaciones con medicamentos no disponibles.

### Alimentación
- **Tipos de alimento** — catálogo con stock disponible y precio. El stock se descuenta automáticamente al registrar una alimentación. No se permite registrar si el alimento no está disponible o si la cantidad supera el stock.
- **Alimentación** — registro de suministros por lote.

## Tecnologías

- Python 3.12
- Django
- PostgreSQL
- Django Admin

## Estado del proyecto

En desarrollo. Los módulos descritos están operativos en el panel de administración. Pendiente: interfaz de usuario final con React, api con FastAPI, reportes y módulos adicionales.
