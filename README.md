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


📌 Descripción general
Esta práctica amplía el proyecto desarrollado en UT06, añadiendo:

Persistencia en el navegador (cookies y LocalStorage)

Autenticación mediante login

Carga inicial de datos desde un fichero JSON

Generación de backups en el servidor mediante PHP

Integración de mapas interactivos con Leaflet y Esri Geocoder

Nuevas vistas y opciones de navegación

El resultado es una SPA completamente funcional, con persistencia, autenticación, peticiones asíncronas y componentes interactivos.

🧩 Funcionalidades implementadas
1. Uso de cookies
✔ Se muestra un banner informativo al cargar la página.
✔ Si el usuario acepta, se guarda una cookie cookiesAccepted=yes.
✔ El banner no vuelve a mostrarse mientras exista la cookie.

2. Login con cookies
✔ Se añade un formulario de login.
✔ Usuario obligatorio:

Usuario: admin

Contraseña: admin

✔ Si el login es correcto:

Se guarda la cookie userLogged=admin.

Se oculta el formulario.

Se muestra “Hola admin” con botón de desconexión.

Se habilitan las opciones de administración.

3. Lectura de cookie al cargar
✔ Si existe userLogged, el usuario entra directamente sin mostrar el login.

4. Logout
✔ El botón “Salir” elimina la cookie y recarga la página.

5. Favoritos (LocalStorage)
✔ Cada producción tiene un botón “⭐ Añadir a favoritos”.
✔ Se guarda en localStorage.favorites.
✔ Se añade una nueva vista “Favoritos” en el menú.
✔ Solo accesible si el usuario está logueado.

6. Mostrar producciones favoritas
✔ Nueva vista que muestra las producciones guardadas en LocalStorage.
✔ Se renderizan igual que en el resto de la aplicación.

7. Opciones de administración solo para usuarios logueados
✔ Crear producción
✔ Eliminar producción
✔ Asignar / Desasignar
✔ Crear backup

Estas opciones se ocultan automáticamente si no hay cookie de login.

🌐 Peticiones asíncronas (Fetch)
8. Carga inicial desde JSON
✔ Se crea el archivo server/data.json con todas las entidades del sistema.
✔ En DOMContentLoaded, el modelo carga los datos mediante fetch().
✔ Se reconstruyen categorías, actores, directores, producciones y relaciones.

9. Generación de backups
✔ Nueva opción “Crear Backup” en el menú.
✔ Se genera un JSON con todos los datos actuales del sistema.
✔ Se envía al servidor mediante fetch() (POST).
✔ El servidor guarda el archivo en /server/backup/backup_YYYYMMDD_HHMMSS.json.
✔ Se muestra un mensaje de confirmación.

🗺️ Componentes: Mapas y geolocalización
10. Selección de ubicación en creación de producción
✔ Se integra Leaflet en el formulario.
✔ Al hacer clic en el mapa, se guarda latitud y longitud.
✔ Se almacenan en la producción.

11. Mapa en el detalle de producción
✔ Cada producción muestra un mapa con su ubicación.
✔ Se coloca un marcador en la posición guardada.

12. Geocoder
✔ Se integra Esri Leaflet Geocoder para facilitar la búsqueda de ubicaciones.
✔ Permite localizar ciudades, direcciones o lugares.

13. Mapa global con todas las producciones
✔ Nueva vista “Mapa Producciones”.
✔ Muestra un mapa con un marcador por cada producción que tenga lat/lng.
✔ Cada marcador incluye un popup con el título.

📁 Estructura del proyecto
Código
/css
  styles.css

/js
  VideoSystemApp.js
  VideoSystemView.js
  VideoSystemModel.js
  /core
  /entities
  /exceptions

/server
  data.json
  writeJSONBackup.php
  /backup

index.html
README.md
🛠️ Tecnologías utilizadas
JavaScript ES Modules

SPA con History API

Cookies y LocalStorage

Fetch API

Leaflet.js

Esri Leaflet Geocoder

PHP para persistencia en servidor

HTML5 + CSS3

✔ Conclusión
Esta práctica implementa todos los requisitos de UT07:

Persistencia en navegador

Autenticación

Carga y guardado de datos

Mapas interactivos

Componentes reutilizables

SPA completamente funcional

El proyecto queda preparado para futuras ampliaciones y cumple todos los criterios de evaluación.
