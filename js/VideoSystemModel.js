/* Alberto Pérez López-Menchero
   DWEC 06 - VideoSystemModel.js
   Funciones de gestión del modelo, creación de datos iniciales, etc.
   Se añade soporte para creación/eliminación de producciones y
   asignación/desasignación de actores y directores.
*/

import { VideoSystem } from './core/VideoSystem.js';
import { Category } from './entities/Category.js';
import { Person } from './entities/Person.js';
import { Movie } from './entities/Movie.js';
import { Production } from './entities/Production.js';
import { VideoSystemException } from './exceptions/VideoSystemException.js';

export const Model = (() => {

  const vs = VideoSystem.getInstance('MiVideo');

  /* ============================
     CREACIÓN DE DATOS INICIALES
  ============================ */
  function createInitialData() {

    // Categorías
    const cat1 = new Category('Acción', 'Películas de acción');
    const cat2 = new Category('Drama', 'Dramas intensos');
    const cat3 = new Category('Comedia', 'Risas aseguradas');

    // Directores
    const d1 = new Person('James', 'Cameron', new Date(1954, 7, 16));
    const d2 = new Person('Patty', 'Jenkins', new Date(1971, 6, 24));
    const d3 = new Person('Greta', 'Gerwig', new Date(1983, 8, 4));

    // Actores
    const a1 = new Person('Chris', 'Evans', new Date(1981, 6, 13));
    const a2 = new Person('Scarlett', 'Johansson', new Date(1984, 11, 22));
    const a3 = new Person('Tom', 'Hanks', new Date(1956, 6, 9));
    const a4 = new Person('Emma', 'Stone', new Date(1988, 11, 6));
    const a5 = new Person('Ryan', 'Gosling', new Date(1980, 11, 12));
    const a6 = new Person('Zendaya', 'Coleman', new Date(1996, 9, 1));

    // Producciones
    const p1 = new Movie('Furia Roja', new Date(2020, 4, 1));
    const p2 = new Movie('Noche Eterna', new Date(2019, 2, 10));
    const p3 = new Movie('Riesgo Mortal', new Date(2021, 8, 5));
    const p4 = new Movie('Último Asalto', new Date(2018, 10, 20));

    const p5 = new Movie('Lágrimas', new Date(2017, 3, 12));
    const p6 = new Movie('Camino', new Date(2016, 5, 22));
    const p7 = new Movie('Horizonte', new Date(2015, 1, 15));
    const p8 = new Movie('El Peso', new Date(2014, 11, 2));

    const p9 = new Movie('Risas en la Ciudad', new Date(2022, 6, 18));
    const p10 = new Movie('Bromas', new Date(2020, 7, 7));
    const p11 = new Movie('Plan A', new Date(2019, 9, 9));
    const p12 = new Movie('Vacaciones', new Date(2018, 12, 25));

    // Asignación de categorías
    vs.assignCategory(cat1, p1, p2, p3, p4);
    vs.assignCategory(cat2, p5, p6, p7, p8);
    vs.assignCategory(cat3, p9, p10, p11, p12);

    // Directores
    vs.assignDirector(d1, p1, p2, p5);
    vs.assignDirector(d2, p3, p4, p6);
    vs.assignDirector(d3, p7, p8, p9);

    // Actores
    vs.assignActor(a1, p1, 'Protagonista');
    vs.assignActor(a2, p1, 'Secundario');

    vs.assignActor(a3, p2, 'Protagonista');
    vs.assignActor(a4, p2, 'Secundario');

    vs.assignActor(a5, p3, 'Protagonista');
    vs.assignActor(a6, p3, 'Secundario');

    vs.assignActor(a1, p4, 'Protagonista');
    vs.assignActor(a2, p4, 'Secundario');

    vs.assignActor(a3, p5, 'Protagonista');
    vs.assignActor(a4, p5, 'Secundario');

    vs.assignActor(a5, p6, 'Protagonista');
    vs.assignActor(a6, p6, 'Secundario');

    vs.assignActor(a1, p7, 'Protagonista');
    vs.assignActor(a2, p7, 'Secundario');

    vs.assignActor(a3, p8, 'Protagonista');
    vs.assignActor(a4, p8, 'Secundario');

    vs.assignActor(a5, p9, 'Protagonista');
    vs.assignActor(a6, p9, 'Secundario');

    vs.assignActor(a1, p10, 'Protagonista');
    vs.assignActor(a2, p10, 'Secundario');

    vs.assignActor(a3, p11, 'Protagonista');
    vs.assignActor(a4, p11, 'Secundario');

    vs.assignActor(a5, p12, 'Protagonista');
    vs.assignActor(a6, p12, 'Secundario');

    return { vs, categories: [cat1, cat2, cat3] };
  }

  /* ============================
     API PÚBLICA DEL MODELO
  ============================ */
  return {
    createInitialData
  };

})();
