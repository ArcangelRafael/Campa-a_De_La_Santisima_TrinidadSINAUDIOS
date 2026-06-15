/* === CAMPANA.JS - GESTIÓN DEL EJÉRCITO Y LORE === */

if (typeof jugador !== 'undefined' && !jugador.cementerio) {
    jugador.cementerio = [];
}

function abrirCampana() {
    const overlay = document.getElementById("campana-overlay");
    const contenido = document.getElementById("campana-contenido");
    contenido.innerHTML = "";

    let grupos = {
        "comandante_supremo": { nombre: "Comendador Supremo", img: "assets/img/personajes/aliados/jugador.webp", cantidad: 0, tropas: [], unico: true },
        "caballeros": { nombre: "Compañía de CABALLEROS", img: "assets/img/personajes/aliados/caballero_noble.webp", cantidad: 0, tropas: [] },
        "ballesteros": { nombre: "Compañía de BALLESTEROS", img: "assets/img/personajes/aliados/ballestero_noble.webp", cantidad: 0, tropas: [] },
        "piqueros": { nombre: "Compañía de PIQUEROS", img: "assets/img/personajes/aliados/piquero_noble.webp", cantidad: 0, tropas: [] },
        "sacerdote_unico": { nombre: "Fray Bartolomé", img: "assets/img/personajes/aliados/fray.webp", cantidad: 0, tropas: [], unico: true },
        "explorador_unico": { nombre: "Hermano Vigía", img: "assets/img/personajes/aliados/vigia.webp", cantidad: 0, tropas: [], unico: true },
        "cautivos": { nombre: "Mártires Rescatados", img: "assets/img/personajes/aliados/cautivo.webp", cantidad: 0, tropas: [] }
    };

    let huesteTotal = [...jugador.tropas];
    if (jugador.comandantes) huesteTotal = huesteTotal.concat(jugador.comandantes);

    huesteTotal.forEach(t => {
        if (t.hp > 0) {
            if (t.idUnico === "cmd_player") { 
                grupos.comandante_supremo.cantidad++; 
                grupos.comandante_supremo.tropas.push(t); 
                let nombreMostrado = (jugador.nombre === "..." || !jugador.nombre) ? "" : jugador.nombre;
                grupos.comandante_supremo.nombre = "Comendador " + nombreMostrado; 
            }
            else if (t.tipoGeneral === "caballeros") { grupos.caballeros.cantidad++; grupos.caballeros.tropas.push(t); }
            else if (t.tipoGeneral === "ballesteros") { grupos.ballesteros.cantidad++; grupos.ballesteros.tropas.push(t); }
            else if (t.tipoGeneral === "piqueros") { grupos.piqueros.cantidad++; grupos.piqueros.tropas.push(t); }
            else if (t.tipoGeneral === "cautivos") { grupos.cautivos.cantidad++; grupos.cautivos.tropas.push(t); }
            else if (t.idTipo === "sacerdote_unico") { grupos.sacerdote_unico.cantidad++; grupos.sacerdote_unico.tropas.push(t); grupos.sacerdote_unico.nombre = t.nombre; }
            else if (t.idTipo === "explorador_unico") { grupos.explorador_unico.cantidad++; grupos.explorador_unico.tropas.push(t); grupos.explorador_unico.nombre = t.nombre; }
        }
    });

    let html = `<div class="grid-items">`;
    for (let key in grupos) {
        let g = grupos[key];
        if (g.cantidad > 0) {
            let textoCantidad = g.unico ? "" : `<div class="txt-comendador" style="font-weight:bold; margin-top:5px; font-size:16px;">x${g.cantidad}</div>`;
            
            let extraStyle = key === "comandante_supremo" ? "border-color: #ffd700; box-shadow: 0 0 10px rgba(255,215,0,0.2);" : "";
            let colorTexto = key === "comandante_supremo" ? "color: #ffd700; font-weight: bold;" : "";
            
            html += `<div class="item-card" style="${extraStyle}" onclick="mostrarDetalleGrupo('${key}')"><img src="${g.img}"><div style="font-size:12px; margin-top:5px; text-align:center; ${colorTexto}">${g.nombre}</div>${textoCantidad}</div>`;
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
    
    let h = entidad.hambre !== undefined ? entidad.hambre : 5;
    let htmlHambre = "";
    let visualHambre = Math.max(0, h);
    for(let i=0; i<5; i++){ htmlHambre += (i < visualHambre) ? "<b style='color:#d4af37;'>I</b> " : "<b style='color:#555;'>I</b> "; }
    
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
    
    if (grupoKey === "comandante_supremo") {
        let cmd = jugador.comandantes ? jugador.comandantes.find(c => c.idUnico === "cmd_player") : null;
        let statsCmd = cmd ? `<div style="margin-top:10px; font-size:14px; letter-spacing:2px; background:#000; padding:5px; border-radius:3px; border:1px solid #444;">${getBarrasVidaHtml(cmd)}</div>` : "";
        let nombreCmd = cmd ? cmd.nombre : "Comendador";
        
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo" style="border-color:#ffd700; box-shadow: 0 0 15px rgba(255,215,0,0.2);">
                <div class="label-puesto-rojo" style="background:#ffd700; color:#000;">COMENDADOR SUPREMO</div>
                <div style="position:relative; display:inline-block; margin: 0 auto;">
                    <img src="assets/img/personajes/aliados/jugador.webp" class="jerarquia-comandante-img" style="border-color:#ffd700;">
                </div>
                <div class="nombre-comandante-txt" style="color:#ffd700;">${nombreCmd}</div>
                ${statsCmd}
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo" style="border-color:#ffd700;">
                <div class="mando-directo-txt" style="color:#ffd700;">"Non nobis, Domine, non nobis, sed nomini tuo da gloriam."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Caballero ungido por la Gracia de Dios y comisionado por mandato inquebrantable del Santo Padre para liderar esta hueste de salvación. Atrás ha dejado los fastos de su feudo y los blasones terrenales para abrazar el áspero madero de la Cruzada. Es el escudo de los débiles, el brazo ejecutor de la Santa Madre Iglesia Católica Apostólica Romana, y el juez severo de quienes profanan y reniegan de la Cruz. Su juramento ante el altar de la Orden de la Santísima Trinidad es absoluto: rescatar a los mártires cautivos de las garras paganas, purificar con acero el suelo manchado y ofrecer cada latido de su corazón para la mayor gloria del Altísimo. ¡Deus lo Vult!</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.comandantes.filter(c => c.idUnico === "cmd_player"));
        
    } else if (grupoKey === "caballeros") {
        let cmd = jugador.comandantes ? jugador.comandantes.find(c => c.idUnico === "cmd_alex") : null;
        
        let isAlexCaptive = (window.parlamento_resuelto_cap1 && window.pagoPlata_cap1 === false);
        let statsCmd = "";
        let overlayCautivo = "";
        let imgStyle = "";

        if (cmd) {
            if (isAlexCaptive) {
                cmd.hambreInamovible = true;
                cmd.sedInamovible = true;
                cmd.hpInamovible = true;
                
                imgStyle = "filter: grayscale(100%) brightness(0.6); border-color: #ff4c4c;";
                overlayCautivo = `
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; z-index:10; pointer-events:none;">
                        <span style="color:#ff4c4c; font-family:'Cinzel', serif; font-size:18px; font-weight:bold; text-shadow:0 0 10px #000, 0 0 20px #ff0000; border: 2px solid #ff4c4c; padding: 2px 8px; background: rgba(0,0,0,0.8); transform: rotate(-15deg); letter-spacing: 2px;">CAUTIVO</span>
                    </div>
                `;
            } else {
                statsCmd = `<div style="margin-top:10px; font-size:14px; letter-spacing:2px; background:#000; padding:5px; border-radius:3px; border:1px solid #444;">${getBarrasVidaHtml(cmd)}</div>`;
            }
        }

        let extraLore = isAlexCaptive ? "<br><br><b class='txt-hereje'>[ESTADO ACTUAL: Cautivo por la horda pagana de JoanJoz. Su sacrificio estoico en el Puente de los Mártires compró la libertad de cinco frailes ancianos y preservó la tesorería de la Orden.]</b>" : "";

        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-rojo">
                <div class="label-puesto-rojo">LUGARTENIENTE</div>
                <div style="position:relative; display:inline-block; margin: 0 auto;">
                    <img src="assets/img/personajes/aliados/lider_caballeros.webp" class="jerarquia-comandante-img" style="${imgStyle}">
                    ${overlayCautivo}
                </div>
                <div class="nombre-comandante-txt">Sir Alexandro de Cerfroid</div>
                ${statsCmd}
            </div>
            <div class="jerarquia-lore-box scroll-efecto-rojo">
                <div class="mando-directo-txt">"La élite de la Orden, listos para clavar sus lanzas en el nombre del Padre."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Caballero noble de rancio abolengo en la Picardía. Abandonó sus tierras, castillos y riquezas seculares tras escuchar el llamado de la Cruz Bicolor. Su fe es tan inquebrantable como el empuje de su caballería pesada. Ostenta el título de Comandante de la Vanguardia, siendo siempre el primero en recibir la sangre enemiga al chocar contra las líneas.${extraLore}</div>
            </div>
        </div>`;

        if (isAlexCaptive && jugador.nuevoLiderCaballeros) {
            let nombreNuevo = jugador.nuevoLiderCaballeros.nombre;
            loreHtml += `
            <div class="jerarquia-vanguardia" style="margin-top: 30px;">
                <div class="jerarquia-comandante-box scroll-efecto-rojo" style="border-color:#ffaa00; box-shadow: 0 0 15px #ffaa00;">
                    <div class="label-puesto-rojo" style="background:#ffaa00; color:#000;">LUGARTENIENTE INTERINO</div>
                    <img src="assets/img/personajes/aliados/lug_cab2.webp" class="jerarquia-comandante-img" style="border-color:#ffaa00;">
                    <div class="nombre-comandante-txt" style="color:#ffaa00;">${nombreNuevo}</div>
                </div>
                <div class="jerarquia-lore-box scroll-efecto-rojo" style="border-color:#ffaa00;">
                    <div class="mando-directo-txt" style="color:#ffaa00;">"Mi acero no descansará hasta purgar esta tierra de herejía."</div>
                    <br>
                    <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Elevado al mando en la hora de mayor tribulación, este valiente caballero demostró una fe inquebrantable en el Desfiladero de las Sombras. Asumió el peso del estandarte tras el doloroso cautiverio de Sir Alexandro. De moral intachable, cuna ilustre y rezo constante, jura ante la Cruz Bicolor no desenvainar su espada por vanagloria, sino como instrumento exclusivo de la voluntad del Cielo. Su presencia inspira a la caballería pesada a cabalgar con el doble de fervor.</div>
                </div>
            </div>`;
        }

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
    } else if (grupoKey === "cautivos") {
        loreHtml = `
        <div class="jerarquia-vanguardia">
            <div class="jerarquia-comandante-box scroll-efecto-verde">
                <div class="label-puesto-verde" style="color:#a3d9a5; border-color:#a3d9a5;">MÁRTIRES BLANCOS</div>
                <img src="assets/img/personajes/aliados/cautivo.webp" class="jerarquia-comandante-img" style="border-color:#a3d9a5; transform:scaleX(-1);">
                <div class="nombre-comandante-txt" style="color:#a3d9a5;">Hermanos Liberados</div>
            </div>
            <div class="jerarquia-lore-box scroll-efecto-verde">
                <div class="mando-directo-txt">"Estuvimos en el valle de la sombra de la muerte, y el Señor nos envió a sus ángeles de acero."</div>
                <br>
                <div class="jerarquia-lore-texto txt-multitud"><b>Biografía:</b> Frailes ancianos y devotos que fueron capturados por la horda impía en la fatídica Batalla de los Cuernos de Hattin. Su fe inquebrantable los mantuvo con vida a pesar de soportar la sed, el hambre extrema y las humillaciones constantes de JoanJoz. Ahora marchan con la hueste trinitaria, sin armas ni armaduras, pero ofreciendo su valiosa penitencia por el éxito de la Cruzada.</div>
            </div>
        </div>`;
        tropasHtml = generarCartasTropas(jugador.tropas.filter(t => t.tipoGeneral === "cautivos"));
        
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

// =========================================================================
// RENDERIZADO TÁCTICO DE CARTAS (CON LECTURA DOD COMPLETA Y TOOLTIP)
// =========================================================================
function generarCartasTropas(listaTropas) {
    let h = "";
    let infoFe = typeof obtenerEstadoFe === 'function' ? obtenerEstadoFe() : { mod: 0, nombre: "Normal" };
    
    listaTropas.forEach(t => {
        let claseBorde = t.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        let etiqueta = t.clase === 'noble' ? "<span class='txt-sagrado' style='font-size:10px;'>(Noble)</span>" : "<span style='color:#888; font-size:10px;'>(Mercenario)</span>";
        
        if (t.idUnico === "cmd_player") {
            claseBorde = "tropa-noble"; // Forzar borde noble
            etiqueta = "<span style='color:#ffd700; font-size:10px;'>👑 (Comendador)</span>";
        } else if (t.idUnico && t.idUnico.startsWith("cmd_")) {
            etiqueta = "<span style='color:#4c88ff; font-size:10px;'>⭐ (Oficial)</span>";
        } else if (t.idTipo === "sacerdote_unico" || t.idTipo === "explorador_unico" || t.idTipo === "fraile_cautivo") {
            etiqueta = "<span style='color:#a3d9a5; font-size:10px;'>(Especial)</span>";
        }
        
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

        // =========================================================
        // LECTURA DOD DE ESTADOS PARA EL TOOLTIP (BENDICIONES Y AFECTACIONES)
        // =========================================================
        let modAtkMochila = 0;
        let modDefMochila = 0;
        let htmlBuffs = "";
        let htmlDebuffs = "";

        // 1. EQUIPAMIENTO
        if (t.mochila && t.mochila.length > 0) {
            t.mochila.forEach(item => {
                if (item.atk) modAtkMochila += item.atk;
                if (item.def) modDefMochila += item.def;
                
                let nombreItem = item.nombre || "Reliquia Bendita";
                let statsItem = [];
                if(item.atk) statsItem.push(`+${item.atk} Atk`);
                if(item.def) statsItem.push(`+${item.def} Def`);
                let turnosInfo = item.duracion ? ` [${item.duracion}T]` : "";
                
                let iconoItem = "🪖";
                if (item.tipoEq === "espada") iconoItem = "⚔️";
                else if (item.tipoEq === "cota") iconoItem = "👕";
                else if (item.tipoEq === "escudo") iconoItem = "🛡️";
                
                htmlBuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">${iconoItem} <b style="color:#ffd700;">${nombreItem}</b><br><span style="color:#d4c4a8;">${statsItem.join(" | ")}${turnosInfo}</span></div>`;
            });
        }

        // 2. FE (MORAL GLOBAL)
        if (infoFe.mod > 0) {
            htmlBuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">🙏 <b style="color:#a3d9a5;">${infoFe.nombre}</b><br><span style="color:#d4c4a8;">+${infoFe.mod} Atk | +${infoFe.mod} Def</span></div>`;
        } else if (infoFe.mod < 0 || infoFe.nombre === "NOCHE OSCURA DEL ALMA") {
            let extraDebuff = (infoFe.nombre === "NOCHE OSCURA DEL ALMA") ? `<br><span style="color:#ff8888; font-weight:bold;">¡Derecho a dado anulado!</span>` : "";
            htmlDebuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">🌑 <b style="color:#ff4c4c;">${infoFe.nombre}</b><br><span style="color:#d4c4a8;">${infoFe.mod} Atk | ${infoFe.mod} Def</span>${extraDebuff}</div>`;
        }

        // 3. HERIDAS
        if (penalizador > 0) {
            htmlDebuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">🩸 <b style="color:#ff4c4c;">Herido</b><br><span style="color:#d4c4a8;">-1 Atk | -1 Def</span></div>`;
        }

        // 4. HAMBRE Y SED
        if (penHambreAtk > 0) {
            htmlDebuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">🍖 <b style="color:#ff4c4c;">Inanición</b><br><span style="color:#d4c4a8;">-${penHambreAtk} Atk</span></div>`;
        }
        if (penSedDef > 0) {
            htmlDebuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2;">🍺 <b style="color:#ff4c4c;">Deshidratación</b><br><span style="color:#d4c4a8;">-${penSedDef} Def</span></div>`;
        }

        // =========================================================
        // CALCULO MATEMÁTICO REAL DE COMBATE
        // =========================================================
        let atkReal = Math.max(0, (t.atkMax || 0) - penalizador - penHambreAtk + infoFe.mod + modAtkMochila);
        let defReal = Math.max(0, (t.defMax || 0) - penalizador - penSedDef + infoFe.mod + modDefMochila);
        
        let isDesmayado = (hambreActual <= 0 || sedActual <= 0);
        let opacidad = "";
        let htmlDesmayado = "";
        
        if (isDesmayado) {
            atkReal = 0;
            defReal = 0;
            claseBorde += " desmayado-card"; 
            opacidad = "opacity: 0.6; filter: grayscale(50%);";
            htmlDesmayado = `<div class="txt-hereje" style="font-size:10px; font-weight:bold; margin-top:2px;">¡DESMAYADO!</div>`;
            htmlDebuffs += `<div style="margin-bottom:4px; font-size:10px; line-height:1.2; border-top:1px dashed #ff4c4c; padding-top:3px; margin-top:5px;">☠️ <b style="color:#ff4c4c;">INCONSCIENTE</b><br><span style="color:#ff8888; font-weight:bold;">Combate Anulado (Atk 0 / Def 0)</span></div>`;
        }

        // CONSTRUCCIÓN DEL TOOLTIP VISUAL DIVIDIDO
        let divTooltip = "";
        let iconoEq = "";

        if (htmlBuffs !== "" || htmlDebuffs !== "") {
            iconoEq = `<div style="position:absolute; top:-5px; right:-5px; font-size:12px; background:#000; border-radius:50%; border:1px solid #ffd700; padding:2px 4px; z-index:5; box-shadow: 0 0 5px #000;">📊</div>`;
            
            let colBuffs = htmlBuffs !== "" ? `<div style="flex:1; min-width:120px;"><b style="color:#a3d9a5; font-size:11px; border-bottom:1px solid #a3d9a5; display:block; margin-bottom:5px; padding-bottom:2px; text-align:center;">✨ BENDICIONES</b>${htmlBuffs}</div>` : "";
            let colDebuffs = htmlDebuffs !== "" ? `<div style="flex:1; min-width:120px;"><b style="color:#ff4c4c; font-size:11px; border-bottom:1px solid #ff4c4c; display:block; margin-bottom:5px; padding-bottom:2px; text-align:center;">🩸 AFECTACIONES</b>${htmlDebuffs}</div>` : "";
            
            let separador = (htmlBuffs !== "" && htmlDebuffs !== "") ? `<div style="width:1px; background:#333; margin: 0 8px;"></div>` : "";

            divTooltip = `<div class="tropa-tooltip" style="visibility:hidden; opacity:0; transition:0.3s; position:absolute; bottom:105%; left:50%; transform:translateX(-50%); background:rgba(15,15,15,0.98); border:1px solid #ffd700; padding:10px; border-radius:4px; width:max-content; z-index:100; display:flex; pointer-events:none; box-shadow:0 0 20px rgba(0,0,0,0.9); text-align:left;">
                ${colBuffs}
                ${separador}
                ${colDebuffs}
            </div>`;
        }
        
        // ESTILIZACIÓN VISUAL (Verde si está bufado)
        let styleAtk = "";
        if (atkReal < (t.atkMax || 0)) styleAtk = "color:#ff4c4c;";
        else if (atkReal > (t.atkMax || 0)) styleAtk = "color:#a3d9a5; font-weight:bold; text-shadow: 0 0 5px #a3d9a5;";
        
        let styleDef = "";
        if (defReal < (t.defMax || 0)) styleDef = "color:#ff4c4c;";
        else if (defReal > (t.defMax || 0)) styleDef = "color:#a3d9a5; font-weight:bold; text-shadow: 0 0 5px #a3d9a5;";
        
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
        <div class="item-card-desplegado ${claseBorde}" style="${opacidad} position:relative;" onmouseenter="this.querySelector('.tropa-tooltip') ? this.querySelector('.tropa-tooltip').style.visibility='visible' : null; this.querySelector('.tropa-tooltip') ? this.querySelector('.tropa-tooltip').style.opacity='1' : null;" onmouseleave="this.querySelector('.tropa-tooltip') ? this.querySelector('.tropa-tooltip').style.visibility='hidden' : null; this.querySelector('.tropa-tooltip') ? this.querySelector('.tropa-tooltip').style.opacity='0' : null;">
            ${iconoEq}
            ${divTooltip}
            <img src="${t.img}">
            <div class="unidad-nombre-aleatorio">${t.nombre}</div>
            ${etiqueta}
            <div class="stats-tropa">⚔️ <span style="${styleAtk}">${atkReal}</span> | 🛡️ <span style="${styleDef}">${defReal}</span></div>
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