📺 VideoSystem-DWEC
Aplicación web MVC para gestión de un sistema de streaming  
Autor: APLM
Asignatura: DWEC — Desarrollo Web en Entorno Cliente
UT05 + UT06

📌 Descripción del proyecto
VideoSystem-DWEC es una aplicación web desarrollada en JavaScript siguiendo una arquitectura MVC (Modelo–Vista–Controlador).
Permite gestionar un sistema de streaming con:

Categorías

Producciones (películas/series)

Actores

Directores

La aplicación incluye navegación dinámica, ventanas emergentes, historial con pushState, renderizado dinámico del DOM y gestión completa de entidades.

🧱 Arquitectura del proyecto
Modelo (/core y /entities)
Gestiona:

Categorías

Producciones

Actores

Directores

Relaciones entre ellos

Incluye un Singleton (VideoSystem) y un sistema Flyweight para evitar duplicados.

Vista (VideoSystemView.js)
Responsable de:

Renderizar categorías, producciones, actores y directores

Renderizar formularios

Gestionar el DOM

Enlaces y navegación

Scroll automático

Sin lógica de negocio

Controlador (VideoSystemApp.js)
Controla:

Navegación

Eventos

Carga de datos

Ventanas emergentes

Formularios

Validación

Comunicación Modelo ↔ Vista

🎬 Funcionalidades UT05 (ya implementadas)
✔ Mostrar categorías
✔ Mostrar producciones por categoría
✔ Mostrar detalle de producción
✔ Mostrar actores y directores
✔ Ventanas emergentes para detalles
✔ Navegación con pushState
✔ Renderizado dinámico del DOM
✔ Flyweight para evitar duplicados
🧩 Funcionalidades UT06 (añadidas)
1️⃣ Crear una nueva producción
Formulario con:

Título

Año

Director

Actores (múltiple)

Categorías (múltiple)

Incluye:

Validación

Mensajes de éxito/error

Integración con el modelo (addProduction, assignActor, assignDirector, assignCategory)

2️⃣ Eliminar una producción
Incluye:

Selección de producción

Eliminación segura

Mantenimiento de integridad referencial

Se elimina de categorías

Se elimina de actores

Se elimina de directores

Se elimina del sistema

Mensajes de éxito/error

3️⃣ Asignar / desasignar actores y directores
Formulario con:

Selección de producción

Asignar actores

Desasignar actores

Asignar director

Desasignar director

Carga dinámica de asignaciones actuales

Validación + mensajes

🗂️ Estructura del repositorio
Código
VideoSystem-DWEC/
├── index.html
├── css/
└──js/
    │
    ├── core/
    │   └── VideoSystem.js
    │
    ├── entities/
    │   ├── Category.js
    │   ├── Coordinate.js
    │   ├── Resource.js
    │   ├── Resource.js
    │   ├── Serie.js        
    │   ├── User.js
    │   ├── Movie.js
    │   └── Production.js
    │
    ├── exceptions/
    │   └── VideoSystemException.js
    │
    ├── VideoSystemModel.js
    ├── VideoSystemView.js
    ├── VideoSystemApp.js
    │
    └── test/
          └── testVideoSystem.js

🚀 Cómo ejecutar el proyecto
Clona el repositorio:

bash
git clone https://github.com/aplm92/VideoSystem-DWEC.git
Abre index.html en un navegador moderno (Chrome, Firefox, Edge).

Asegúrate de permitir ventanas emergentes para ver los detalles en nuevas ventanas.

🧪 Validación y mensajes
Todos los formularios incluyen:

Validación de campos obligatorios

Mensajes de error

Mensajes de éxito

Actualización dinámica del contenido

🏷️ Versionado
El proyecto está versionado en GitHub y etiquetado según los requisitos de la práctica.

Ejemplo de etiqueta:

Código
v1.0.0-ut06
📄 Licencia
Proyecto académico para la asignatura DWEC.
Uso educativo.
