/* === DATABASE.JS - BASE DE DATOS Y LORE DEL JUEGO === */

const bdObjetos = {
    "espada_forjada": { 
        id: "espada_forjada", nombre: "Espadas Forjadas", precio: 10, img: "assets/img/items/espada.webp", 
        descTienda: "Forjar nuevas espadas para tus soldados.", 
        lore: "Arma a tu ejército con mejores espadas. Tus soldados se sienten más confiados.", 
        efectoTexto: "+2 Ataque, +5 Fe", efectos: { ataqueReal: 2, liderazgoBase: 5 },
        categoria: "arma", estado: "fresco"
    },
    "pan_cevada": { 
        id: "pan_cevada", nombre: "Pan de Cevada", precio: 1, img: "assets/img/items/com_panc.webp", 
        descTienda: "Simple pan artesanal que sirve para saciar el hambre de la tropa. 1 Denario por 10 piezas.", 
        lore: "Pan horneado en las abadías. Fuerte, duro y nutritivo.", 
        efectoTexto: "Sacia el hambre.", efectos: {},
        categoria: "comida", estado: "fresco", loteVenta: 10,
        onPasoDelTiempo: function(item) {
            if (item.edad >= 15) { item.id = "pan_podrido"; return "pudrio_pan"; }
            return null;
        },
        onConsumir: function(tropa, isComandante) {
            tropa.hambre = (tropa.hambre !== undefined && tropa.hambre <= 0) ? 1 : (tropa.hambre !== undefined ? tropa.hambre : 5) + 1;
            return { status: 'fresco' };
        }
    },
    "pan_podrido": { 
        id: "pan_podrido", nombre: "Pan Podrido", precio: 0, img: "assets/img/items/com_pancp.webp", 
        descTienda: "Pan incomible.", 
        lore: "Este pan ha estado demasiado tiempo guardado. Sus hongos podrían ser letales si se consumen.", 
        efectoTexto: "<span class='txt-hereje'>Peligro de Intoxicación Letal</span>", efectos: {},
        categoria: "comida", estado: "riesgo",
        warningTexto: "Este pan está podrido y podría hacerle daño a tu compañía.",
        onConsumir: function(tropa, isComandante) {
            let h = tropa.hambre !== undefined ? tropa.hambre : 5;
            if (h <= 0 || h <= 2) {
                tropa.hp = 0; tropa.lugarMuerte = "envenenado por raciones pútridas";
                if (typeof jugador.cementerio === 'undefined') jugador.cementerio = [];
                jugador.cementerio.push(tropa);
                if (isComandante) jugador.comandantes = jugador.comandantes.filter(c => c.idUnico !== tropa.idUnico);
                else jugador.tropas = jugador.tropas.filter(t => t.idUnico !== tropa.idUnico);
                if (typeof Cronicas !== "undefined") Cronicas.registrar("PAN_PODRIDO_MUERTE", { nombre: tropa.nombre });
                return { status: 'muerte', nombre: tropa.nombre };
            } else {
                let roll = Math.floor(Math.random() * 6) + 1;
                if (roll === 1) {
                    tropa.hambre = Math.min(5, h + 1);
                    return { status: 'salvado', nombre: tropa.nombre };
                } else {
                    tropa.hambre = Math.max(0, h - 2);
                    if (typeof Cronicas !== "undefined") Cronicas.registrar("PAN_PODRIDO_DESMAYO", { nombre: tropa.nombre });
                    return { status: 'enfermo', nombre: tropa.nombre };
                }
            }
        }
    },
    "cerveza_mesa": { 
        id: "cerveza_mesa", nombre: "Cerveza de Mesa", precio: 1, img: "assets/img/items/agu_cerbm.webp", 
        descTienda: "Cerveza floja y aguada, segura para beber en campaña. 1 Denario por 4 barriles.", 
        lore: "El agua de los arroyos trae la muerte. Esta cerveza baja en alcohol mantendrá a tus hombres hidratados sin embriagarlos.", 
        efectoTexto: "Sacia la sed.", efectos: {},
        categoria: "bebida", estado: "fresco", loteVenta: 4,
        onPasoDelTiempo: function(item) {
            if (item.edad >= 21) { item.id = "cerveza_agria"; return "agrio_cerveza"; }
            return null;
        },
        onConsumir: function(tropa, isComandante) {
            tropa.sed = (tropa.sed !== undefined && tropa.sed <= 0) ? 1 : (tropa.sed !== undefined ? tropa.sed : 3) + 1;
            return { status: 'fresco' };
        }
    },
    "cerveza_agria": { 
        id: "cerveza_agria", nombre: "Cerveza Agria", precio: 0, img: "assets/img/items/agu_cerbm.webp", 
        descTienda: "Cerveza echada a perder.", 
        lore: "El barril se ha contaminado y el líquido huele a vinagre rancio.", 
        efectoTexto: "<span class='txt-hereje'>No hidrata. Produce asco.</span>", efectos: {},
        categoria: "bebida", estado: "riesgo",
        warningTexto: "Esta cerveza está agria. Solo dará asco a la hueste y no los hidratará.",
        onConsumir: function(tropa, isComandante) {
            return { status: 'agria', nombre: tropa.nombre };
        }
    }
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

// FIX TÁCTICO: Réquiems exclusivos para inanición y deshidratación
const requiemsHambre = [
    "Que el Señor le brinde en Su mesa celestial el banquete que le fue negado en la tierra.",
    "Cayó sin fuerza para alzar su escudo, devorado por el vacío cruel de sus entrañas.",
    "Su estómago cedió mucho antes que su fe. Que Dios lo reciba como mártir del abandono."
];

const requiemsSed = [
    "Sus labios agrietados y sangrantes ya beben del dulce manantial de la vida eterna.",
    "Cayó como espiga seca al sol abrasador, entregando su último aliento a la tierra árida.",
    "Que la lluvia del Paraíso lave para siempre el insoportable tormento de su garganta marchita."
];

const gritosGuerraAliados = [
    "¡Al infierno, escoria pagana!",
    "¡Deus lo Vult! ¡Nadie detiene a la Cruz Bicolor!",
    "¡Por el Padre, el Hijo y el Espíritu Santo!",
    "¡Otro más al foso! ¿Quién sigue?",
    "¡El acero bendito no perdona!",
    "¡Vuestra sangre lavará vuestros pecados!"
];

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