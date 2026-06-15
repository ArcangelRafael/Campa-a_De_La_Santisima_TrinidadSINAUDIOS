/* === DATABASE.JS - BASE DE DATOS Y LORE DEL JUEGO === */

const bdObjetos = {
    // ==========================================
    // ARMAS Y ARMADURAS (BOTÍN DE GUERRA)
    // ==========================================
    "espada_forjada": { 
        id: "espada_forjada", nombre: "Espada Larga Pagana", precio: 3, img: "assets/img/items/espada_pag.webp", 
        descTienda: "Espadas de acero sarraceno recién salidas de la forja, sin melladuras. Otorga +1 de Ataque por 2 turnos/combates.", 
        lore: "Una hoja curva y afilada arrebatada a los infieles caídos. Aunque fue forjada en los fuegos de la herejía, el acero no tiene religión. Tras ser bendecida por el capellán, esta espada servirá como el azote del Altísimo contra aquellos que rechazan la Cruz.", 
        efectoTexto: "+1 Ataque (Duración: 2 Combates). No acumulable.", efectos: { ataqueReal: 1 },
        categoria: "arma", tipoEq: "espada", estado: "fresco",
        onEquipar: function(tropa) {
            if (!tropa.mochila) tropa.mochila = [];
            tropa.mochila = tropa.mochila.filter(item => item.tipoEq !== "espada");
            tropa.mochila.push({ id: "espada_forjada", nombre: "Espada Pagana", atk: 1, duracion: 2, tipoEq: "espada" });
            return { status: 'equipado', nombre: tropa.nombre };
        }
    },
    "cota_malla": { 
        id: "cota_malla", nombre: "Cota de Malla Pagana", precio: 2, img: "assets/img/items/cota_pag.webp", 
        descTienda: "Una cota de anillos de acero entrelazados en inmaculadas condiciones.", 
        lore: "Malla de hierro oscuro despojada de los cadáveres enemigos. Ha sido lavada con agua purificada y rezada con salmos de protección. Este manto de metal será un muro inquebrantable que resguardará la carne de nuestros mártires, permitiéndoles derramar más sangre en nombre del Señor.", 
        efectoTexto: "+1 Defensa (Duración: 3 Combates). Acumulable con otros blindajes.", efectos: { defensaReal: 1 },
        categoria: "armadura_cota", tipoEq: "cota", estado: "fresco",
        onEquipar: function(tropa) {
            if (!tropa.mochila) tropa.mochila = [];
            tropa.mochila = tropa.mochila.filter(item => item.tipoEq !== "cota");
            tropa.mochila.push({ id: "cota_malla", nombre: "Cota Pagana", def: 1, duracion: 3, tipoEq: "cota" });
            return { status: 'equipado', nombre: tropa.nombre };
        }
    },
    "yelmo_hierro": { 
        id: "yelmo_hierro", nombre: "Yelmo de Acero Impío", precio: 4, img: "assets/img/items/yelmo_pag.webp", 
        descTienda: "Un yelmo sólido y pesado sin abolladuras.", 
        lore: "Recuperado del lodo del campo de batalla, este casco resguardaba la cabeza de un apóstata que cayó por la gracia de Dios. Purificado de su inmundicia original, ahora protegerá la mente del cruzado tanto del hacha enemiga como de los pérfidos susurros del Maligno. Otorga una firme defensa extra que durará hasta que el rigor del combate lo desgaste.", 
        efectoTexto: "+1 Defensa (Duración: 3 Combates). No acumulable.", efectos: { defensaReal: 1 },
        categoria: "armadura_yelmo", tipoEq: "yelmo", estado: "fresco",
        onEquipar: function(tropa) {
            if (!tropa.mochila) tropa.mochila = [];
            tropa.mochila = tropa.mochila.filter(item => item.tipoEq !== "yelmo");
            tropa.mochila.push({ id: "yelmo_hierro", nombre: "Yelmo de Acero", def: 1, duracion: 3, tipoEq: "yelmo" });
            return { status: 'equipado', nombre: tropa.nombre };
        }
    },
    "escudo_roble": { 
        id: "escudo_roble", nombre: "Escudo de Roble Pagano", precio: 8, img: "assets/img/items/escudo_pag.webp", 
        descTienda: "Escudo grueso de madera de roble, pesado pero increíblemente resistente.", 
        lore: "Un tosco pero imponente tablón de roble envuelto en cuero endurecido. Sostenido con la fe adecuada y un brazo firme, se convierte en una muralla portátil, capaz de frenar las flechas de la perdición y los embates de los jinetes del infierno.", 
        efectoTexto: "+3 Defensa (Duración: 7 Combates). Acumulable con otros blindajes.", efectos: { defensaReal: 3 },
        categoria: "armadura_escudo", tipoEq: "escudo", estado: "fresco",
        onEquipar: function(tropa) {
            if (!tropa.mochila) tropa.mochila = [];
            tropa.mochila = tropa.mochila.filter(item => item.tipoEq !== "escudo");
            tropa.mochila.push({ id: "escudo_roble", nombre: "Escudo Pagano", def: 3, duracion: 7, tipoEq: "escudo" });
            return { status: 'equipado', nombre: tropa.nombre };
        }
    },

    // ==========================================
    // CONSUMIBLES Y RACIONES
    // ==========================================
    "manzana_fresca": { 
        id: "manzana_fresca", nombre: "Manzana del Huerto", precio: 0, img: "assets/img/items/manzana.webp", 
        descTienda: "Fruta madura y dulce en perfecto estado, hallada en los morrales enemigos.", 
        lore: "Un humilde pero invaluable regalo de la Creación de Dios. Su piel carmesí y su pulpa fresca son un verdadero manjar celestial para los gaznates secos y los estómagos vacíos de nuestra hueste. Un recordatorio de que el Señor alimenta a sus siervos incluso en el valle de la muerte.", 
        efectoTexto: "Sacia el hambre levemente.", efectos: {},
        categoria: "comida", estado: "fresco", noVender: true, loteVenta: 5,
        onPasoDelTiempo: function(item) {
            if (item.edad >= 21) { item.id = "manzana_podrida"; return "pudrio_manzana"; }
            return null;
        },
        onConsumir: function(tropa, isComandante) {
            tropa.hambre = (tropa.hambre !== undefined && tropa.hambre <= 0) ? 1 : (tropa.hambre !== undefined ? tropa.hambre : 5) + 1;
            return { status: 'fresco' };
        }
    },
    "manzana_podrida": { 
        id: "manzana_podrida", nombre: "Manzana Agusanada", precio: 0, img: "assets/img/items/manzana_pod.webp", 
        descTienda: "Fruta podrida, blanda y llena de gusanos.", 
        lore: "La dulzura providencial se ha tornado en veneno y putrefacción. Ha sido devorada por la plaga; consumirla es invitar a la fiebre y a la peste a las entrañas del soldado.", 
        efectoTexto: "<span class='txt-hereje'>Peligro de Infección Estomacal Letal</span>", efectos: {},
        categoria: "comida", estado: "riesgo", noVender: true, loteVenta: 5,
        warningTexto: "Esta manzana está putrefacta. Su consumo tiene un alto riesgo de provocar la muerte o severos dolores estomacales a la tropa.",
        onConsumir: function(tropa, isComandante) {
            let h = tropa.hambre !== undefined ? tropa.hambre : 5;
            if (h <= 0 || h <= 2) {
                tropa.hp = 0; tropa.lugarMuerte = "envenenado por manzanas agusanadas";
                if (typeof jugador.cementerio === 'undefined') jugador.cementerio = [];
                jugador.cementerio.push(tropa);
                if (isComandante) jugador.comandantes = jugador.comandantes.filter(c => c.idUnico !== tropa.idUnico);
                else jugador.tropas = jugador.tropas.filter(t => t.idUnico !== tropa.idUnico);
                if (typeof Cronicas !== "undefined") Cronicas.registrar("PAN_PODRIDO_MUERTE", { nombre: tropa.nombre });
                return { status: 'muerte', nombre: tropa.nombre };
            } else {
                let roll = Math.floor(Math.random() * 2) + 1;
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
    "pan_cevada": { 
        id: "pan_cevada", nombre: "Pan de Cevada", precio: 1, img: "assets/img/items/com_panc.webp", 
        descTienda: "Simple pan artesanal que sirve para saciar el hambre de la tropa. 1 Denario por 10 piezas.", 
        lore: "Pan horneado en las abadías. Fuerte, duro y nutritivo. Las provisiones que salvan la vida de la Orden no están a la venta.", 
        efectoTexto: "Sacia el hambre.", efectos: {},
        categoria: "comida", estado: "fresco", noVender: true, loteVenta: 10,
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
        categoria: "comida", estado: "riesgo", noVender: true, loteVenta: 10,
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
        lore: "El agua de los arroyos trae la muerte. Esta cerveza baja en alcohol mantendrá a tus hombres hidratados. La caridad dicta no lucrar con el sustento.", 
        efectoTexto: "Sacia la sed.", efectos: {},
        categoria: "bebida", estado: "fresco", noVender: true, loteVenta: 4,
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
        categoria: "bebida", estado: "riesgo", noVender: true, loteVenta: 4,
        warningTexto: "Esta cerveza está agria. Solo dará asco a la hueste y no los hidratará.",
        onConsumir: function(tropa, isComandante) {
            return { status: 'agria', nombre: tropa.nombre };
        }
    },

    // ==========================================
    // MEDICINAS Y BÁLSAMOS (FARMACIA)
    // ==========================================
    "medicina_basica": { 
        id: "medicina_basica", nombre: "Bálsamo Purificador", precio: 1, img: "assets/img/items/medicina.webp", 
        descTienda: "Ungüento a base de hierbas benditas. Cura instantáneamente una herida de una unidad.", 
        lore: "Preparas este bálsamo mezclando hierbas amargas con aceite de oliva, bendecido en latín por el Capellán. Aunque su ardor al aplicarse es casi tan intenso como el corte de la espada pagana que lo requiere, es la única esperanza para un soldado que se desangra.", 
        efectoTexto: "Restaura 1 Corazón de vida. Solo se puede aplicar UNA VEZ por soldado en toda la campaña.", efectos: {},
        categoria: "medicina", estado: "fresco", noVender: true
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
    
    "sacerdote_unico": { nombre: "Fray Bartolomé", tipoG: "especial", clase: "unico", atk: 0, def: 0, hp: 1, precio: 0, img: "assets/img/personajes/aliados/sacerdote.webp", desc: "Vuestro capellán de campaña." },
    "explorador_unico": { nombre: "Hermano Vigía", tipoG: "especial", clase: "unico_random", atk: 0, def: 0, hp: 1, precio: 0, img: "assets/img/personajes/aliados/explorador.webp", desc: "Un monje explorador." },
    
    "fraile_cautivo": { nombre: "Fraile Cautivo", tipoG: "cautivos", clase: "mercenaria", atk: 0, def: 0, hp: 1, precio: 0, img: "assets/img/personajes/aliados/cautivo.webp", desc: "Mártires ancianos. No pueden combatir, pero su fe inspira a la tropa." }
};

const bdComandantes = {
    "caballeros": { nombre: "Sir Alexandro de Cerfroid", img: "assets/img/sir_alexandro.webp", descEpica: "Caballero noble de rancio abolengo en la Picardía.", loreTropa: "La élite de la Orden, listos para clavar sus lanzas en el nombre del Padre." },
    "ballesteros": { nombre: "Barón Andrew el Pío", img: "assets/img/baron_andrew.webp", descEpica: "Noble local devoto.", loreTropa: "Nuestras saetas oscurecerán el sol y purgarán a distancia la impiedad." },
    "piqueros": { nombre: "Conde JuanA", img: "assets/img/conde_juana.webp", descEpica: "Veterano de cien batallas.", loreTropa: "Ningún pagano atravesará nuestra falange de lanzas." }
};