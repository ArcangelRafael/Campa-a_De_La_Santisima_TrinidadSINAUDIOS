/* === DATABASE.JS - BASE DE DATOS Y LORE DEL JUEGO === */

const bdObjetos = {
    "espada_forjada": { id: "espada_forjada", nombre: "Espadas Forjadas", precio: 10, img: "assets/img/items/espada.webp", descTienda: "Forjar nuevas espadas para tus soldados.", lore: "Arma a tu ejército con mejores espadas. Tus soldados se sienten más confiados.", efectoTexto: "+2 Ataque, +5 Fe", efectos: { ataqueReal: 2, liderazgoBase: 5 } }
};

const narrativasFe = {
    "ESTADO DE GRACIA": "¡Vuestra devoción ha conmovido a los cielos, Comendador {nombre}! El Espíritu Santo desciende sobre vuestras filas.",
    "FERVOR CELESTIAL": "¡Alabado sea el Señor, {nombre}! Tus hombres cantan himnos de gloria con lágrimas en los ojos.",
    "BENDICIÓN DIVINA": "¡Bien hecho, Comendador {nombre}! La disciplina y la piedad han fortificado el alma de vuestra hueste.",
    "FE FIRME": "Comendador {nombre}, vuestros hombres han recuperado la templanza. Marchan con la certeza del deber.",
    "INCERTIDUMBRE": "¡Cuidado, Comendador {nombre}! Las sombras de la duda comienzan a nublar el corazón de vuestros hombres.",
    "FATIGA DEL ESPÍRITU": "El peso de la campaña doblega a vuestros hermanos, {nombre}. Han olvidado sus salmos.",
    "DUDA DEL HEREJE": "¡Peligro, Comendador {nombre}! La herejía de la desesperanza se asienta en la tropa.",
    "OSCURIDAD INTERIOR": "Una negra melancolía devora a la hueste, {nombre}. Su voluntad se quiebra.",
    "NOCHE OSCURA DEL ALMA": "¡Misericordia, {nombre}! Vuestra hueste ha caído en el abismo de la desesperación absoluta."
};

const nombresMedievalesTRAD = [
    "Iago", "Esteban", "Mateo", "Bernardo", "Anselmo", "Rodrigo", "Felipe", "Tomás", 
    "Andrés", "Sebastián", "Alonso", "Gonzalo", "Pedro", "Simón", "Rafael", "Ignacio", 
    "Francisco", "Domingo", "Martín", "Vicente", "Jorge", "Mauricio", "Clemente", "Basilio",
    "Guillermo", "Hugo", "Ramiro", "Nuño", "Sancho", "Alvar", "García", "Fernando", 
    "Diego", "Félix", "Baudolino", "Raimundo", "Godefroy", "Balduino", "Tancredo", "Bohemundo", 
    "Rolando", "Odo", "Geraldo", "Lothar", "Gualterio", "Amadeo", "Tristán", "Rogelio"
];

const apellidosMedievalesTRAD = [
    "de Asís", "de Aquino", "de Loyola", "de Tolosa", "de Clairvaux",
    "de Siena", "de Padua", "de Ávila", "de la Cruz", "el Justo",
    "el Fuerte", "el Pío", "de Antioquía", "de Milán", "de Cantórbery",
    "de Tours", "de Gante", "de Nisa", "de Caleruega", "de Nursia",
    "de Bouillon", "de Flandes", "de Normandía", "el Sabio", "el Temerario", 
    "el Cruzado", "de Castilla", "de León", "de Aragón", "de Navarra", 
    "de Borgoña", "de Aquitania", "el Valiente", "Sangre de Hierro", "de Jerusalén", 
    "de Edesa", "de Trípoli", "de los Valles", "del Monte", "Corazón de León", 
    "el Implacable", "de Monfort", "de Taranto", "de Lusignan", "el Mártir"
];

const statsEnemigos = {
    "piquero": { atk: 0, def: 2, nombre: "Piquero Hereje" },
    "cuerpo": { atk: 1, def: 1, nombre: "Soldado Apóstata" },
    "distancia": { atk: 2, def: 0, nombre: "Saetero Oscuro" }
};

const requiemsAliados = [
    "¡El Señor ha llamado a {nombre} a su lado! Que su sacrificio no sea en vano.",
    "¡{nombre} ha caído! Los ángeles lloran, pero nosotros cobraremos su sangre en oro y acero.",
    "¡Hermano {nombre}! Que San Juan de Mata te reciba en la gloria eterna.",
    "Una lanza menos en la tierra, una espada más en el cielo. ¡Descansa en paz, {nombre}!",
    "¡Han derribado a {nombre}! ¡Que esta afrenta se pague con la erradicación total de estos herejes!"
];

const gritosGuerraAliados = [
    "¡Al infierno, escoria pagana!",
    "¡Deus lo Vult! ¡Nadie detiene a la Cruz Bicolor!",
    "¡Por el Padre, el Hijo y el Espíritu Santo!",
    "¡Otro más al foso! ¿Quién sigue?",
    "¡El acero bendito no perdona!",
    "¡Vuestra sangre lavará vuestros pecados!"
];

// FIX TÁCTICO: Ballesteros ajustados a 1 Vida (hp: 1) y 2 de Ataque.
const bdTiposTropa = {
    "caballero_noble": { nombre: "Caballero Noble", tipoG: "caballeros", clase: "noble", atk: 3, def: 3, hp: 2, precio: 10, img: "assets/img/personajes/aliados/caballero_noble.webp", desc: "La élite de la Orden. Ofensiva y defensiva impecable." },
    "caballero_mercenario": { nombre: "Caballero", tipoG: "caballeros", clase: "mercenaria", atk: 2, def: 2, hp: 2, precio: 7, img: "assets/img/personajes/aliados/caballero_mercenario.webp", desc: "Guerreros a sueldo." },
    
    "ballestero_noble": { nombre: "Ballestero Noble", tipoG: "ballesteros", clase: "noble", atk: 2, def: 1, hp: 1, precio: 3, img: "assets/img/personajes/aliados/ballestero_noble.webp", desc: "Fuertes a distancia pero letalmente frágiles." },
    "ballestero_mercenario": { nombre: "Ballestero", tipoG: "ballesteros", clase: "mercenaria", atk: 2, def: 0, hp: 1, precio: 1, img: "assets/img/personajes/aliados/ballestero_mercenario.webp", desc: "Tiradores de un solo uso." },
    
    "piquero_noble": { nombre: "Piquero Noble", tipoG: "piqueros", clase: "noble", atk: 1, def: 4, hp: 2, precio: 5, img: "assets/img/personajes/aliados/piquero_noble.webp", desc: "Inquebrantables falanges." },
    "piquero_mercenario": { nombre: "Piquero", tipoG: "piqueros", clase: "mercenaria", atk: 0, def: 3, hp: 2, precio: 3, img: "assets/img/personajes/aliados/piquero_mercenario.webp", desc: "Muro de lanzas a sueldo." },
    
    "sacerdote_unico": { nombre: "Fray Bartolomé", tipoG: "especial", clase: "unico", atk: 0, def: 0, hp: 2, precio: 0, img: "assets/img/personajes/aliados/sacerdote.webp", desc: "Vuestro capellán de campaña." },
    "explorador_unico": { nombre: "Hermano Vigía", tipoG: "especial", clase: "unico_random", atk: 0, def: 0, hp: 2, precio: 0, img: "assets/img/personajes/aliados/explorador.webp", desc: "Un monje explorador." }
};

const bdComandantes = {
    "caballeros": { nombre: "Sir Alexandro de Cerfroid", img: "assets/img/sir_alexandro.webp", descEpica: "Caballero noble de rancio abolengo en la Picardía.", loreTropa: "La élite de la Orden, listos para clavar sus lanzas en el nombre del Padre." },
    "ballesteros": { nombre: "Barón Andrew el Pío", img: "assets/img/baron_andrew.webp", descEpica: "Noble local devoto.", loreTropa: "Nuestras saetas oscurecerán el sol y purgarán a distancia la impiedad." },
    "piqueros": { nombre: "Conde JuanA", img: "assets/img/conde_juana.webp", descEpica: "Veterano de cien batallas.", loreTropa: "Ningún pagano atravesará nuestra falange de lanzas." }
};