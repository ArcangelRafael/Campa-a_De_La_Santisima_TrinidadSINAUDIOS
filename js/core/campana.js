/* === CAMPANA.JS - GESTIÓN DEL EJÉRCITO Y LORE === */

if (typeof jugador !== 'undefined' && !jugador.cementerio) {
    jugador.cementerio = [];
}

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

    let huesteTotal = [...jugador.tropas];
    if (jugador.comandantes) huesteTotal = huesteTotal.concat(jugador.comandantes);

    huesteTotal.forEach(t => {
        if (t.hp > 0) {
            if (t.tipoGeneral === "caballeros") { grupos.caballeros.cantidad++; grupos.caballeros.tropas.push(t); }
            else if (t.tipoGeneral === "ballesteros") { grupos.ballesteros.cantidad++; grupos.ballesteros.tropas.push(t); }
            else if (t.tipoGeneral === "piqueros") { grupos.piqueros.cantidad++; grupos.piqueros.tropas.push(t); }
            else if (t.idTipo === "sacerdote_unico") { grupos.sacerdote_unico.cantidad++; grupos.sacerdote_unico.tropas.push(t); grupos.sacerdote_unico.nombre = t.nombre; }
            else if (t.idTipo === "explorador_unico") { grupos.explorador_unico.cantidad++; grupos.explorador_unico.tropas.push(t); grupos.explorador_unico.nombre = t.nombre; }
        }
    });

    let html = `<div class="grid-items">`;
    for (let key in grupos) {
        let g = grupos[key];
        if (g.cantidad > 0) {
            let textoCantidad = g.unico ? "" : `<div class="txt-comendador" style="font-weight:bold; margin-top:5px; font-size:16px;">x${g.cantidad}</div>`;
            html += `<div class="item-card" onclick="mostrarDetalleGrupo('${key}')"><img src="${g.img}"><div style="font-size:12px; margin-top:5px; text-align:center;">${g.nombre}</div>${textoCantidad}</div>`;
        }
    }

    if (jugador.cementerio && jugador.cementerio.length > 0) {
        html += `
        <div class="item-card" style="border-color:#5a0000; background: linear-gradient(to bottom, #1a0000, #000);" onclick="mostrarDetalleCementerio()">
            <div style="font-size:30px; text-align:center; filter: grayscale(100%); margin:10px 0;">⚰️</div>
            <div style="font-size:12px; margin-top:5px; text-align:center; color:#ff4c4c; font-weight:bold;">Cripta de Mártires</div>
            <div class="txt-hereje" style="font-weight:bold; margin-top:5px; font-size:16px;">x${jugador.cementerio.length}</div>
        </div>`;
    }

    html += `</div>`;
    contenido.innerHTML = html;
    overlay.style.display = "flex";
}

function getBarrasVidaHtml(entidad) {
    if(!entidad || entidad.hp <= 0) return "<b class='txt-hereje' style='font-size:12px;'>MÁRTIR (CAÍDO)</b>";
    
    // Hambre
    let h = entidad.hambre !== undefined ? entidad.hambre : 5;
    let htmlHambre = "";
    let visualHambre = Math.max(0, h);
    for(let i=0; i<5; i++){ htmlHambre += (i < visualHambre) ? "<b style='color:#d4af37;'>I</b> " : "<b style='color:#555;'>I</b> "; }
    
    // Sed
    let s = entidad.sed !== undefined ? entidad.sed : 3;
    let htmlSed = "";
    let visualSed = Math.max(0, s);
    for(let i=0; i<3; i++){ htmlSed += (i < visualSed) ? "<b style='color:#4c88ff;'>I</b> " : "<b style='color:#555;'>I</b> "; }
    
    let html = `🍖 ${htmlHambre} <br> 🍺 ${htmlSed}`;
    if(h <= 0 || s <= 0) html += " <br><span class='txt-hereje' style='font-size:10px;'>(Desmayado)</span>";
    
    return html;
}

function mostrarDetalleGrupo(grupoKey) {
    document.getElementById("campana-overlay").style.display = "none";
    const overlayDetalle = document.getElementById("detalle-unidad-overlay");
    const contenedor = document.getElementById("campana-jerarquia-container");
    let loreHtml = ""; let tropasHtml = "";
    
    if (grupoKey === "caballeros") {
        let cmd = jugador.comandantes ? jugador.comandantes.find(c => c.idUnico === "cmd_alex") : null;
        let statsCmd = cmd ? `<div style="margin-top:10px; font-size:14px; letter-spacing:2px; background:#000; padding:5px; border-radius:3px; border:1px solid #444;">${getBarrasVidaHtml(cmd)}</div>` : "";
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_caballeros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Sir Alexandro de Cerfroid</div>
                ${statsCmd}
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"La élite de la Orden, listos para clavar sus lanzas en el nombre del Padre."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Caballero noble de rancio abolengo en la Picardía. Abandonó sus tierras, castillos y riquezas seculares tras escuchar el llamado de la Cruz Bicolor. Su fe es tan inquebrantable como el empuje de su caballería pesada. Ostenta el título de Comandante de la Vanguardia, siendo siempre el primero en recibir la sangre enemiga al chocar contra las líneas.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "caballeros"));
    } else if (grupoKey === "ballesteros") {
        let cmd = jugador.comandantes ? jugador.comandantes.find(c => c.idUnico === "cmd_andrew") : null;
        let statsCmd = cmd ? `<div style="margin-top:10px; font-size:14px; letter-spacing:2px; background:#000; padding:5px; border-radius:3px; border:1px solid #444;">${getBarrasVidaHtml(cmd)}</div>` : "";
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_ballesteros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Barón Andrew el Pío</div>
                ${statsCmd}
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"Que el cielo llueva pernos sobre los pecadores y purgue su herejía."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Un antiguo cazador en los fríos bosques del norte, elevado a la nobleza por su precisión letal durante el asedio a los castillos escoceses. Andrew lidera a los saeteros con un ojo frío y calculador. Sus virotes bendecidos han purgado a más herejes que las mismísimas pestes, convirtiéndolo en el custodio indiscutible de la retaguardia de la hueste.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "ballesteros"));
    } else if (grupoKey === "piqueros") {
        let cmd = jugador.comandantes ? jugador.comandantes.find(c => c.idUnico === "cmd_juan") : null;
        let statsCmd = cmd ? `<div style="margin-top:10px; font-size:14px; letter-spacing:2px; background:#000; padding:5px; border-radius:3px; border:1px solid #444;">${getBarrasVidaHtml(cmd)}</div>` : "";
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <img src="assets/img/personajes/aliados/lider_piqueros.webp" class="jerarquia-comandante-img">
                <div class="nombre-comandante-txt">Conde JuanA</div>
                ${statsCmd}
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"Un muro de acero y fe que no retrocederá un solo palmo."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Un líder estoico, forjado en la adversidad y de muy pocas palabras. El Conde JuanA es famoso en toda la cristiandad por haber mantenido la línea de lanceros intacta durante tres días y tres noches en el cruento asedio de Antioquía. Sus hombres forman la verdadera espina dorsal del ejército, alzando un erizo de picas absolutamente impenetrable.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "piqueros"));
    } else if (grupoKey === "sacerdote_unico") {
        let huesteCompleta = [...jugador.tropas];
        if(jugador.comandantes) huesteCompleta = huesteCompleta.concat(jugador.comandantes);
        let fray = huesteCompleta.find(t => t.idTipo === "sacerdote_unico");
        
        loreHtml = `
        <div class="biografia-unica-frame">
            <h4 class="bio-titulo-oro">CAPELLÁN MÁXIMO</h4>
            <img src="${fray.img}" class="img-bio-grande">
            <div class="bio-titulo-oro">Fray Bartolomé</div>
            <div class="mando-directo-txt" style="text-align:center;">"No busquen la gloria del acero, sino la libertad de los oprimidos y encadenados."</div>
            <br>
            <div class="bio-texto-scroll"><b>Biografía Histórica:</b> Fray Bartolomé de las Casas (n. Sevilla, España, 1484), figura histórica real y erudito fraile dominico. Conocido universalmente como el "Protector de los Indios". A lo largo de su vida, combatió incansablemente contra los abusos de la encomienda y la brutal esclavitud, dedicando su existencia a redactar leyes y tratados humanistas para liberar a los pueblos indígenas oprimidos. En esta campaña secular, su espíritu redentor acompaña a la Orden Trinitaria, curando las almas, absolviendo los pecados en la víspera de la batalla y recordando a los soldados el verdadero propósito de la cruzada: la redención y liberación de los cautivos.</div>
        </div>`;
        tropasHtml = generarCartasTropas(fray ? [fray] : []);
    } else if (grupoKey === "explorador_unico") {
        let huesteCompleta = [...jugador.tropas];
        if(jugador.comandantes) huesteCompleta = huesteCompleta.concat(jugador.comandantes);
        let vigia = huesteCompleta.find(t => t.idTipo === "explorador_unico");
        
        loreHtml = `
        <div class="biografia-unica-frame scroll-efecto-verde">
            <h4 class="jerarquia-lore-titulo">VIGÍA MAESTRO</h4>
            <img src="${vigia.img}" class="img-bio-grande" style="border-color:#88ff88;">
            <div class="jerarquia-lore-titulo" style="border:none;">${vigia.nombre}</div>
            <div class="mando-directo-txt" style="text-align:center;">"Mis ojos ven la traición antes de que se desenvaine la espada, y mis oídos captan el engaño antes de que se pronuncie."</div>
            <br>
            <div class="bio-texto-scroll"><b>Biografía:</b> Un antiguo proscrito y rastreador de las estepas orientales que encontró su redención definitiva en el silencio del desierto. Condenado a vagar sin rumbo por crímenes de su juventud, fue salvado de la inanición por un monje trinitario que le ofreció agua y fe. Desde aquel día, juró usar sus inigualables talentos de rastreo, sigilo y supervivencia extrema para guiar a la hueste de Dios. Conoce cada atajo, lee las sombras y anticipa las emboscadas paganas; es el fantasma silencioso que marcha delante del acero pesado de la cruzada.</div>
        </div>`;
        tropasHtml = generarCartasTropas(vigia ? [vigia] : []);
    }

    let tituloExtra = tropasHtml !== "" ? `<h4 class="txt-multitud" style="border-bottom:1px solid #333; padding-bottom:5px; margin-top:20px;">ESTADO VITAL ACTUAL</h4>` : "";
    contenedor.innerHTML = loreHtml + tituloExtra + `<div class="grid-desplegado">` + tropasHtml + `</div>`;
    overlayDetalle.style.display = "flex";
}

function mostrarDetalleCementerio() {
    document.getElementById("campana-overlay").style.display = "none";
    const overlayDetalle = document.getElementById("detalle-unidad-overlay");
    const contenedor = document.getElementById("campana-jerarquia-container");

    let loreHtml = `
    <div class="biografia-unica-frame" style="border-color:#5a0000; box-shadow: 0 0 20px #5a0000;">
        <h4 class="txt-hereje" style="text-align:center; font-family:'Cinzel', serif; font-size:20px;">LA CRIPTA DE LOS MÁRTIRES</h4>
        <div class="mando-directo-txt" style="text-align:center; color:#a3a3a3; font-style:italic;">"Nadie tiene amor más grande que el que da la vida por sus hermanos."</div>
        <br>
        <div class="bio-texto-scroll" style="color:#c0c0c0; text-align:center;">
            Aquí yacen los nombres de aquellos valientes que derramaron su sangre por la Orden de la Santísima Trinidad. Sus cuerpos abonan la tierra profana, pero sus almas aguardan la gloriosa resurrección.
        </div>
    </div>`;

    let tropasHtml = "";
    jugador.cementerio.forEach(t => {
        let etiqueta = t.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:10px;'>(Noble)</span>" : "<span style='color:#888; font-size:10px;'>(Mercenario)</span>";
        if(t.idTipo === "comandante" || t.idUnico.startsWith("cmd_")) etiqueta = "<span style='color:#4c88ff; font-size:10px;'>⭐ (Oficial)</span>";
        if(t.idTipo === "sacerdote_unico" || t.idTipo === "explorador_unico") etiqueta = "<span style='color:#a3d9a5; font-size:10px;'>(Especial)</span>";
        
        let lugarTexto = t.lugarMuerte ? `Caído ${t.lugarMuerte}` : "Caído en batalla";

        tropasHtml += `
        <div class="item-card-desplegado" style="border-color:#5a0000; filter: grayscale(100%); opacity: 0.7;">
            <img src="${t.img}">
            <div class="unidad-nombre-aleatorio" style="color:#ff4c4c; text-decoration: line-through;">${t.nombre}</div>
            ${etiqueta}
            <div class="hp-tropa" style="font-size:10px; margin-top:5px; color:#aaa; font-style:italic;">${lugarTexto}</div>
        </div>`;
    });

    contenedor.innerHTML = loreHtml + `<h4 class="txt-hereje" style="border-bottom:1px solid #5a0000; padding-bottom:5px; margin-top:15px;">HERMANOS CAÍDOS</h4><div class="grid-desplegado">` + tropasHtml + `</div>`;
    overlayDetalle.style.display = "flex";
}

function generarCartasTropas(listaTropas) {
    let h = "";
    let infoFe = typeof obtenerEstadoFe === 'function' ? obtenerEstadoFe() : { mod: 0 };
    
    listaTropas.forEach(t => {
        let claseBorde = t.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        let etiqueta = t.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:10px;'>(Noble)</span>" : "<span style='color:#888; font-size:10px;'>(Mercenario)</span>";
        
        if (t.idUnico && t.idUnico.startsWith("cmd_")) etiqueta = "<span style='color:#4c88ff; font-size:10px;'>⭐ (Oficial)</span>";
        if (t.idTipo === "sacerdote_unico" || t.idTipo === "explorador_unico") etiqueta = "<span style='color:#a3d9a5; font-size:10px;'>(Especial)</span>";
        
        let maxVida = t.hpMax || 2;
        let hpStars = "❤️".repeat(Math.max(0, t.hp)) + "🖤".repeat(maxVida - Math.max(0, t.hp));
        
        let penalizador = (t.hp < maxVida && t.hp > 0) ? 1 : 0;
        
        // HAMBRE
        let hambreActual = t.hambre !== undefined ? t.hambre : 5;
        let penHambreAtk = 0;
        if (hambreActual === 2) penHambreAtk = 1;
        else if (hambreActual === 1) penHambreAtk = 2;
        
        // SED
        let sedActual = t.sed !== undefined ? t.sed : 3;
        let penSedDef = 0;
        if (sedActual === 1) penSedDef = 2;

        let atkReal = Math.max(0, (t.atkMax || 0) - penalizador - penHambreAtk + infoFe.mod);
        let defReal = Math.max(0, (t.defMax || 0) - penalizador - penSedDef + infoFe.mod);
        
        let isDesmayado = (hambreActual <= 0 || sedActual <= 0);
        let opacidad = "";
        let htmlDesmayado = "";
        
        if (isDesmayado) {
            atkReal = 0;
            defReal = 0;
            claseBorde += " desmayado-card"; 
            opacidad = "opacity: 0.6; filter: grayscale(50%);";
            htmlDesmayado = `<div class="txt-hereje" style="font-size:10px; font-weight:bold; margin-top:2px;">¡DESMAYADO!</div>`;
        }
        
        let colorAtk = (atkReal < (t.atkMax || 0)) ? "txt-hereje" : (atkReal > (t.atkMax || 0) ? "mensaje-sistema" : "");
        let colorDef = (defReal < (t.defMax || 0)) ? "txt-hereje" : (defReal > (t.defMax || 0) ? "mensaje-sistema" : "");
        
        // Pintar Barras Hambre
        let barrasHambre = "";
        let hambreVisual = Math.max(0, hambreActual); 
        for (let i = 0; i < 5; i++) {
            barrasHambre += (i < hambreVisual) ? "<b style='color:#d4af37;'>I</b> " : "<b style='color:#555;'>I</b> ";
        }
        
        // Pintar Barras Sed
        let barrasSed = "";
        let sedVisual = Math.max(0, sedActual);
        for (let i = 0; i < 3; i++) {
            barrasSed += (i < sedVisual) ? "<b style='color:#4c88ff;'>I</b> " : "<b style='color:#555;'>I</b> ";
        }
        
        h += `
        <div class="item-card-desplegado ${claseBorde}" style="${opacidad}">
            <img src="${t.img}">
            <div class="unidad-nombre-aleatorio">${t.nombre}</div>
            ${etiqueta}
            <div class="stats-tropa">⚔️ <span class="${colorAtk}">${atkReal}</span> | 🛡️ <span class="${colorDef}">${defReal}</span></div>
            <div style="font-size:10px; margin-top:3px; letter-spacing: 1px;">🍖 ${barrasHambre}</div>
            <div style="font-size:10px; margin-top:1px; letter-spacing: 1px;">🍺 ${barrasSed}</div>
            ${htmlDesmayado}
            <div class="hp-tropa">${hpStars}</div>
        </div>`;
    });
    return h;
}

function cerrarCampana() { document.getElementById("campana-overlay").style.display = "none"; }
function cerrarDetalleUnidad() { document.getElementById("detalle-unidad-overlay").style.display = "none"; document.getElementById("campana-overlay").style.display = "flex"; }