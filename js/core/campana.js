/* === CAMPANA.JS - GESTIÓN DEL EJÉRCITO Y LORE === */

function abrirCampana() {
    const overlay = document.getElementById("campana-overlay");
    const contenido = document.getElementById("campana-contenido");
    contenido.innerHTML = "";

    let grupos = {
        "caballeros": { nombre: "Compañía de CABALLEROS", img: "assets/img/personajes/aliados/caballero_noble.webp", cantidad: 0, tropas: [] },
        "ballesteros": { nombre: "Compañía de BALLESTEROS", img: "assets/img/personajes/aliados/ballestero_noble.webp", cantidad: 0, tropas: [] },
        "piqueros": { nombre: "Compañía de PIQUEROS", img: "assets/img/personajes/aliados/piquero_noble.webp", cantidad: 0, tropas: [] },
        "sacerdote_unico": { nombre: "Fray Bartolomé", img: "assets/img/personajes/aliados/fray.webp", cantidad: 0, tropas: [], unico: true },
        "explorador_unico": { nombre: "Hermano Vigía", img: "assets/img/personajes/aliados/vigia.webp", cantidad: 0, tropas: [], unico: true }
    };

    jugador.tropas.forEach(t => {
        if (t.tipoGeneral === "caballeros") { grupos.caballeros.cantidad++; grupos.caballeros.tropas.push(t); }
        else if (t.tipoGeneral === "ballesteros") { grupos.ballesteros.cantidad++; grupos.ballesteros.tropas.push(t); }
        else if (t.tipoGeneral === "piqueros") { grupos.piqueros.cantidad++; grupos.piqueros.tropas.push(t); }
        else if (t.idTipo === "sacerdote_unico") { grupos.sacerdote_unico.cantidad++; grupos.sacerdote_unico.tropas.push(t); grupos.sacerdote_unico.nombre = t.nombre; }
        else if (t.idTipo === "explorador_unico") { grupos.explorador_unico.cantidad++; grupos.explorador_unico.tropas.push(t); grupos.explorador_unico.nombre = t.nombre; }
    });

    let html = `<div class="grid-items">`;
    for (let key in grupos) {
        let g = grupos[key];
        if (g.cantidad > 0) {
            let textoCantidad = g.unico ? "" : `<div class="txt-comendador" style="font-weight:bold; margin-top:5px; font-size:16px;">x${g.cantidad}</div>`;
            html += `<div class="item-card" onclick="mostrarDetalleGrupo('${key}')"><img src="${g.img}"><div style="font-size:12px; margin-top:5px; text-align:center;">${g.nombre}</div>${textoCantidad}</div>`;
        }
    }
    html += `</div>`;
    contenido.innerHTML = html;
    overlay.style.display = "flex";
}

function mostrarDetalleGrupo(grupoKey) {
    document.getElementById("campana-overlay").style.display = "none";
    const overlayDetalle = document.getElementById("detalle-unidad-overlay");
    const contenedor = document.getElementById("campana-jerarquia-container");
    let loreHtml = ""; let tropasHtml = "";
    
    if (grupoKey === "caballeros") {
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_caballeros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Sir Alexandro de Cerfroid</div>
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"La élite de la Orden, listos para clavar sus lanzas en el nombre del Padre."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Caballero noble de rancio abolengo en la Picardía. Abandonó sus tierras, castillos y riquezas seculares tras escuchar el llamado de la Cruz Bicolor. Su fe es tan inquebrantable como el empuje de su caballería pesada. Ostenta el título de Comandante de la Vanguardia, siendo siempre el primero en recibir la sangre enemiga al chocar contra las líneas.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "caballeros"));
    } else if (grupoKey === "ballesteros") {
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_ballesteros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Barón Andrew el Pío</div>
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"Que el cielo llueva pernos sobre los pecadores y purgue su herejía."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Un antiguo cazador en los fríos bosques del norte, elevado a la nobleza por su precisión letal durante el asedio a los castillos escoceses. Andrew lidera a los saeteros con un ojo frío y calculador. Sus virotes bendecidos han purgado a más herejes que las mismísimas pestes, convirtiéndolo en el custodio indiscutible de la retaguardia de la hueste.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "ballesteros"));
    } else if (grupoKey === "piqueros") {
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_piqueros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Conde JuanA</div>
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"Un muro de acero y fe que no retrocederá un solo palmo."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Un líder estoico, forjado en la adversidad y de muy pocas palabras. El Conde JuanA es famoso en toda la cristiandad por haber mantenido la línea de lanceros intacta durante tres días y tres noches en el cruento asedio de Antioquía. Sus hombres forman la verdadera espina dorsal del ejército, alzando un erizo de picas absolutamente impenetrable.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "piqueros"));
    } else if (grupoKey === "sacerdote_unico") {
        let fray = jugador.tropas.find(t => t.idTipo === "sacerdote_unico");
        loreHtml = `
        <div class="biografia-unica-frame">
            <h4 class="bio-titulo-oro">CAPELLÁN MÁXIMO</h4>
            <img src="${fray.img}" class="img-bio-grande">
            <div class="bio-titulo-oro">Fray Bartolomé</div>
            <div class="mando-directo-txt" style="text-align:center;">"No busquen la gloria del acero, sino la libertad de los oprimidos y encadenados."</div>
            <br>
            <div class="bio-texto-scroll"><b>Biografía Histórica:</b> Fray Bartolomé de las Casas (n. Sevilla, España, 1484), figura histórica real y erudito fraile dominico. Conocido universalmente como el "Protector de los Indios". A lo largo de su vida, combatió incansablemente contra los abusos de la encomienda y la brutal esclavitud, dedicando su existencia a redactar leyes y tratados humanistas para liberar a los pueblos indígenas oprimidos. En esta campaña secular, su espíritu redentor acompaña a la Orden Trinitaria, curando las almas, absolviendo los pecados en la víspera de la batalla y recordando a los soldados el verdadero propósito de la cruzada: la redención y liberación de los cautivos.</div>
        </div>`;
        tropasHtml = "";
    } else if (grupoKey === "explorador_unico") {
        let vigia = jugador.tropas.find(t => t.idTipo === "explorador_unico");
        loreHtml = `
        <div class="biografia-unica-frame scroll-efecto-verde">
            <h4 class="jerarquia-lore-titulo">VIGÍA MAESTRO</h4>
            <img src="${vigia.img}" class="img-bio-grande" style="border-color:#88ff88;">
            <div class="jerarquia-lore-titulo" style="border:none;">${vigia.nombre}</div>
            <div class="mando-directo-txt" style="text-align:center;">"Mis ojos ven la traición antes de que se desenvaine la espada, y mis oídos captan el engaño antes de que se pronuncie."</div>
            <br>
            <div class="bio-texto-scroll"><b>Biografía:</b> Un antiguo proscrito y rastreador de las estepas orientales que encontró su redención definitiva en el silencio del desierto. Condenado a vagar sin rumbo por crímenes de su juventud, fue salvado de la inanición por un monje trinitario que le ofreció agua y fe. Desde aquel día, juró usar sus inigualables talentos de rastreo, sigilo y supervivencia extrema para guiar a la hueste de Dios. Conoce cada atajo, lee las sombras y anticipa las emboscadas paganas; es el fantasma silencioso que marcha delante del acero pesado de la cruzada.</div>
        </div>`;
        tropasHtml = "";
    }

    let tituloExtra = tropasHtml !== "" ? `<h4 class="txt-multitud" style="border-bottom:1px solid #333; padding-bottom:5px;">TROPAS DESPLEGADAS</h4>` : "";
    contenedor.innerHTML = loreHtml + tituloExtra + `<div class="grid-desplegado">` + tropasHtml + `</div>`;
    overlayDetalle.style.display = "flex";
}

function generarCartasTropas(listaTropas) {
    let h = "";
    
    // Solicitamos al motor los beneficios actuales de la fe
    let infoFe = typeof obtenerEstadoFe === 'function' ? obtenerEstadoFe() : { mod: 0 };
    
    listaTropas.forEach(t => {
        let claseBorde = t.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        let etiqueta = t.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:10px;'>(Noble)</span>" : "<span style='color:#888; font-size:10px;'>(Mercenario)</span>";
        
        // FIX TÁCTICO: Evaluamos de forma dinámica el límite de vida de cada soldado
        let maxVida = t.hpMax || 2;
        let hpStars = "❤️".repeat(Math.max(0, t.hp)) + "🖤".repeat(maxVida - Math.max(0, t.hp));
        
        // Si tiene solo 1 vida máxima, la penalidad por "herida" no aplica, ya que a 0 de vida el soldado muere instantáneamente.
        let penalizador = (t.hp < maxVida && t.hp > 0) ? 1 : 0;
        
        // Aplicamos la matemática del buff/debuff a la interfaz
        let atkReal = Math.max(0, t.atkMax - penalizador + infoFe.mod);
        let defReal = Math.max(0, t.defMax - penalizador + infoFe.mod);
        
        // Lógica de colores para que el jugador sepa visualmente por qué variaron
        let colorAtk = (atkReal < t.atkMax) ? "txt-hereje" : (atkReal > t.atkMax ? "mensaje-sistema" : "");
        let colorDef = (defReal < t.defMax) ? "txt-hereje" : (defReal > t.defMax ? "mensaje-sistema" : "");
        
        h += `
        <div class="item-card-desplegado ${claseBorde}">
            <img src="${t.img}">
            <div class="unidad-nombre-aleatorio">${t.nombre}</div>
            ${etiqueta}
            <div class="stats-tropa">⚔️ <span class="${colorAtk}">${atkReal}</span> | 🛡️ <span class="${colorDef}">${defReal}</span></div>
            <div class="hp-tropa">${hpStars}</div>
        </div>`;
    });
    return h;
}

function cerrarCampana() { document.getElementById("campana-overlay").style.display = "none"; }
function cerrarDetalleUnidad() { document.getElementById("detalle-unidad-overlay").style.display = "none"; document.getElementById("campana-overlay").style.display = "flex"; }