/* === MOTOR.JS - SISTEMA CENTRAL Y MATEMÁTICAS === */

let jugador = {
    nombre: "...", denarios: 0, liderazgoBase: 0, liderazgo: 0,     
    estadoFeActual: "FE FIRME", inventario: [], orden: "", tropas: [], 
    nombresUsados: [], 
    ataqueBase: 0, ataqueReal: 0, defensaBase: 0, defensaReal: 0, vidas: 3,
    
    // FIX TÁCTICO: Memoria para eventos narrativos
    narrativaSacrificioVista: false,
    mercenarioRedimidoId: null 
};

let tribulacionesDisponibles = [];
let inventarioDesbloqueado = false; 
let tiendaDesbloqueada = false; 

const storyArea = document.getElementById("story-area");
const actionArea = document.getElementById("action-area");

let musicaActual = null; let musicaPausada = null; 
let musicaPausadaInventario = null; let musicaPausadaTienda = null; let musicaPausadaCampana = null;

window.onclick = function(event) {
    if (!event.target.closest('#btn-nombre-hud') && !event.target.closest('#dropdown-hud')) {
        let menu = document.getElementById("dropdown-hud");
        if (menu && menu.style.display === "block") menu.style.display = "none";
    }
}

function toggleDropdown() {
    if (!inventarioDesbloqueado) return; 
    let menu = document.getElementById("dropdown-hud");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function reiniciarJugadorBase() {
    jugador.denarios = 0; jugador.liderazgoBase = 0; jugador.liderazgo = 0; 
    jugador.estadoFeActual = "FE FIRME"; jugador.inventario = []; jugador.orden = ""; 
    jugador.tropas = []; jugador.nombresUsados = [];
    jugador.narrativaSacrificioVista = false; jugador.mercenarioRedimidoId = null;
    inventarioDesbloqueado = false; tiendaDesbloqueada = false;
    let flecha = document.getElementById("flecha-inventario"); if(flecha) flecha.style.display = "none";
    let iconoOrden = document.getElementById("icono-orden"); if(iconoOrden) { iconoOrden.style.display = "none"; iconoOrden.src = ""; }
    document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'none');
    
    if (typeof canastaTribulaciones !== 'undefined') { tribulacionesDisponibles = [...canastaTribulaciones]; } else { tribulacionesDisponibles = []; }
    actualizarHUD();
}

function actualizarHUD() {
    document.getElementById("nombre-jugador").innerText = jugador.nombre;
    document.getElementById("stat-denarios").innerText = jugador.denarios;
    let statLiderazgo = document.getElementById("stat-liderazgo");
    if(statLiderazgo) statLiderazgo.innerText = jugador.liderazgo;
    actualizarTooltipFe(); actualizarTooltipOrden(); 
    let infoFe = obtenerEstadoFe();
    if (jugador.estadoFeActual !== infoFe.nombre) {
        mostrarAvisoFe(infoFe); jugador.estadoFeActual = infoFe.nombre; 
    }
}

function actualizarTooltipOrden() {
    const tooltip = document.getElementById("orden-tooltip"); const icono = document.getElementById("icono-orden");
    if (tooltip && icono && icono.style.display !== "none" && jugador.orden !== "") {
        let nombreMostrado = (jugador.nombre === "..." || jugador.nombre === "Recluta Anónimo") ? "Hermano" : jugador.nombre;
        tooltip.innerHTML = `<b class='txt-sagrado'>Orden de la ${jugador.orden}</b><hr style='border-color:#555; margin: 5px 0;'/><i>${nombreMostrado}, ahora sirves como instrumento de la Gracia. ¡Deus lo vult!</i>`;
    }
}

let iconoOrdenElem = document.getElementById("icono-orden");
if (iconoOrdenElem) {
    iconoOrdenElem.onmouseover = () => { if(jugador.orden !== "") document.getElementById("orden-tooltip").style.display = "block"; };
    iconoOrdenElem.onmouseout = () => { document.getElementById("orden-tooltip").style.display = "none"; };
}

document.getElementById("stat-fe-container").onmouseover = () => { document.getElementById("fe-tooltip").style.display = "block"; };
document.getElementById("stat-fe-container").onmouseout = () => { document.getElementById("fe-tooltip").style.display = "none"; };

async function mostrarAvisoFe(infoFe) {
    const overlay = document.getElementById("fe-overlay"); const titulo = document.getElementById("fe-titulo");
    const texto = document.getElementById("fe-texto"); const efecto = document.getElementById("fe-efecto");
    
    let esPositivo = (infoFe.mod >= 0 || infoFe.nombre === "FE FIRME");
    titulo.innerText = "ESTADO ESPIRITUAL: " + infoFe.nombre; 
    titulo.style.color = esPositivo ? "#ffaa00" : "#ff4c4c"; 
    
    let narrativa = narrativasFe[infoFe.nombre].replace("{nombre}", jugador.nombre);
    
    let boxFeHtml = `
    <div style="display:flex; align-items:center; gap:20px; text-align:left;">
        <img src="assets/img/personajes/aliados/fray.webp" style="height:120px; filter:drop-shadow(0 0 10px #ffaa00);" />
        <div>
            <b class="txt-clerigo">Fray Bartolomé:</b><br>
            <i>"${narrativa}"</i>
        </div>
    </div>`;
    texto.innerHTML = boxFeHtml;
    
    let classEfecto = esPositivo ? "mensaje-sistema" : "txt-hereje";
    efecto.innerHTML = `Efecto en Combate: <span class="${classEfecto}">${infoFe.efecto}</span>`;
    overlay.style.display = "flex";
}

function agregarTexto(texto, clasePersonalizada = "", forzarScroll = true) {
    const parrafo = document.createElement("p"); parrafo.innerHTML = texto;
    if (clasePersonalizada) parrafo.classList.add(clasePersonalizada);
    storyArea.appendChild(parrafo); 
    
    if(forzarScroll) {
        storyArea.scrollTop = storyArea.scrollHeight; 
    }
}

function limpiarBotones() { actionArea.innerHTML = ''; }
function crearBoton(texto, funcionCallback) {
    const boton = document.createElement("button"); boton.innerText = texto;
    boton.onclick = funcionCallback; actionArea.appendChild(boton);
}
function tirarDado() { return Math.floor(Math.random() * 6) + 1; }
function cambiarMusica(idAudio) {
    if (musicaActual) { musicaActual.pause(); musicaActual.currentTime = 0; }
    if (idAudio) { musicaActual = document.getElementById(idAudio); if(musicaActual){ musicaActual.volume = 0.4; musicaActual.play(); } }
}
function iniciarMusicaTribulacion() {
    if (musicaActual) { musicaActual.pause(); musicaPausada = musicaActual; }
    let pistaRandom = Math.floor(Math.random() * 3) + 1;
    let idTribulacion = "bgm-trib" + pistaRandom;
    musicaActual = document.getElementById(idTribulacion);
    if (musicaActual) { musicaActual.currentTime = 0; musicaActual.volume = 0.4; musicaActual.play(); }
}
function detenerMusicaTribulacion() {
    if (musicaActual) { musicaActual.pause(); musicaActual.currentTime = 0; }
    if (musicaPausada) { musicaActual = musicaPausada; musicaActual.play(); musicaPausada = null; }
}

// FIX TÁCTICO: Ahora se lee "hp" de la base de datos, en lugar de quemar siempre un "2".
function agregarTropa(idTipo, cantidad) {
    let tipo = bdTiposTropa[idTipo];
    for(let i=0; i<cantidad; i++){
        let nomFinal = "Soldado";
        if(tipo.clase === "unico") {
            nomFinal = tipo.nombre; 
        } else {
            let intentos = 0;
            do {
                let nRand = nombresMedievalesTRAD[Math.floor(Math.random() * nombresMedievalesTRAD.length)];
                let aRand = apellidosMedievalesTRAD[Math.floor(Math.random() * apellidosMedievalesTRAD.length)];
                nomFinal = `${nRand} ${aRand}`;
                intentos++;
            } while (jugador.nombresUsados.includes(nomFinal) && intentos < 100);
            jugador.nombresUsados.push(nomFinal);
            if (tipo.clase === "unico_random") nomFinal = "Hermano Vigía " + nomFinal;
        }
        
        let vidaBase = tipo.hp || 2; 
        
        jugador.tropas.push({
            idUnico: Math.random().toString(36).substr(2, 9),
            idTipo: idTipo,
            tipoGeneral: tipo.tipoG,
            clase: tipo.clase, 
            nombre: nomFinal,
            hpMax: vidaBase, 
            hp: vidaBase, 
            atkMax: tipo.atk, defMax: tipo.def, img: tipo.img
        });
    }
}

function obtenerEstadoFe() {
    let f = jugador.liderazgo;
    if (f >= 126) return { nombre: "ESTADO DE GRACIA", efecto: "Anulas el dado del oponente", mod: 0, textoCombate: "¡Los ángeles descienden! La furia del enemigo es cegada por la Luz Sagrada." };
    if (f >= 101) return { nombre: "FERVOR CELESTIAL", efecto: "+2 Ataque y Defensa", mod: 2, textoCombate: "Un aura sagrada envuelve vuestras armas. Sentís el poder del Altísimo guiando el golpe." };
    if (f >= 76) return { nombre: "BENDICIÓN DIVINA", efecto: "+1 Ataque y Defensa", mod: 1, textoCombate: "El Señor observa vuestra devoción. Vuestros músculos se tensan con fuerza santa." };
    if (f >= 0) return { nombre: "FE FIRME", efecto: "Fuerza normal, sin bonos ni penas", mod: 0, textoCombate: "Tu estado de FE es FIRME... Sin debilidad en el espíritu, librando la batalla con temple mortal, pero aguardando el favor divino." };
    
    let nivelNegativo = Math.ceil(Math.abs(f) / 10); 
    let penalizador = -nivelNegativo;
    if (f <= -50) return { nombre: "NOCHE OSCURA DEL ALMA", efecto: "Pierdes derecho a dado", mod: penalizador, textoCombate: "Dios parece haber apartado la mirada. La total desesperanza paraliza vuestras almas en combate." };
    return { nombre: "INCERTIDUMBRE", efecto: penalizador + " Ataque/Defensa", mod: penalizador, textoCombate: "Las dudas carcomen la mente de tus hombres. Los brazos pesan y los golpes titubean en el barro." };
}

function actualizarTooltipFe() {
    const infoFe = obtenerEstadoFe(); const tooltip = document.getElementById("fe-tooltip");
    if(tooltip) { tooltip.innerHTML = `<b class='txt-sagrado'>${infoFe.nombre}</b><hr style='border-color:#555; margin: 5px 0;'/><i>Efecto: ${infoFe.efecto}</i>`; }
}

async function dispararTribulacionAleatoria(callbackContinuar) {
    const overlay = document.getElementById("tribulacion-overlay");
    const titulo = document.getElementById("trib-titulo");
    const textoArea = document.getElementById("trib-texto");
    const accionesArea = document.getElementById("trib-acciones");
    iniciarMusicaTribulacion();
    
    if (tribulacionesDisponibles.length === 0) {
        if (typeof canastaTribulaciones !== 'undefined') { tribulacionesDisponibles = [...canastaTribulaciones]; } 
        else { if(callbackContinuar) callbackContinuar(); return; }
    }
    
    const indexRandom = Math.floor(Math.random() * tribulacionesDisponibles.length);
    const tribulacionElegida = tribulacionesDisponibles[indexRandom];
    tribulacionesDisponibles.splice(indexRandom, 1);
    
    titulo.innerText = "TRIBULACIÓN: " + tribulacionElegida.titulo;
    
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scout ? scout.nombre : "El monje explorador";

    let tribHtml = `
    <div style="display:flex; align-items:center; gap:20px; text-align:left;">
        <img src="assets/img/personajes/aliados/vigia.webp" style="height:120px; filter:drop-shadow(0 0 10px #ffaa00);" />
        <div>
            <b class="txt-clerigo">${nombreScout}:</b><br>
            <i>"${tribulacionElegida.texto}"</i>
        </div>
    </div>`;

    textoArea.innerHTML = tribHtml;
    accionesArea.innerHTML = ""; 
    
    let opcionesPagables = tribulacionElegida.opciones.filter(o => jugador.denarios >= (o.costo || 0));
    
    if (opcionesPagables.length === 0) {
        textoArea.innerHTML += "<br><p class='txt-hereje' style='font-style:italic;'>Tu compañía se desmoraliza por no tener recursos y por tu mala administración. La falta de denarios impide cualquier acción digna en esta situación.</p>";
        jugador.liderazgoBase -= 20; jugador.liderazgo -= 20; actualizarHUD();
        const btnFallo = document.createElement("button"); btnFallo.innerText = "Lamentar la carestía y continuar";
        btnFallo.onclick = () => { detenerMusicaTribulacion(); overlay.style.display = "none"; if(callbackContinuar) callbackContinuar(); };
        accionesArea.appendChild(btnFallo);
    } else {
        tribulacionElegida.opciones.forEach(opcion => {
            const btn = document.createElement("button"); btn.innerText = opcion.texto;
            if (jugador.denarios < (opcion.costo || 0)) {
                btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; btn.innerText += " (Oro Insuficiente)";
            }
            btn.onclick = () => {
                const textoResultado = opcion.resultado();
                jugador.liderazgoBase = jugador.liderazgo; 
                textoArea.innerHTML += `<div class='separador'>***</div><p class='txt-sagrado' style='font-style: italic;'>Has escogido: ${opcion.texto}</p><p>${textoResultado}</p>`;
                accionesArea.innerHTML = ""; 
                const btnContinuar = document.createElement("button"); btnContinuar.innerText = "Continuar la Cruzada";
                btnContinuar.onclick = () => { detenerMusicaTribulacion(); overlay.style.display = "none"; if(callbackContinuar) callbackContinuar(); };
                accionesArea.appendChild(btnContinuar);
                document.getElementById("tribulacion-box").scrollTop = document.getElementById("tribulacion-box").scrollHeight;
            };
            accionesArea.appendChild(btn);
        });
    }
    overlay.style.display = "flex";
}

function combateAtaqueVsAtaque(enemigoAtk, callbackVictoria, callbackDerrota) {
    agregarTexto("⚔--- CHOQUE DE FUERZAS ---⚔", "separador");
    limpiarBotones();
    crearBoton("⚔️ 'Señor, adiestra mis manos para el combate'", () => {
        limpiarBotones(); 
        agregarTexto("[Elevando una plegaria silenciosa mientras la muerte se abalanza...]", "txt-accion");
        setTimeout(() => {
            let infoFe = obtenerEstadoFe();
            let dadoJugador = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoEnemigo = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            let poderJugador = jugador.ataqueBase + dadoJugador + infoFe.mod;
            let poderEnemigo = enemigoAtk + dadoEnemigo;
            
            let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
            
            let classMod = "txt-sagrado";
            if (infoFe.mod > 0) classMod = "mensaje-sistema";
            if (infoFe.mod < 0) classMod = "txt-hereje";
            
            let avisoNoDadoJugador = (jugador.liderazgo <= -50) ? "" : ` + ✝${dadoJugador}`;
            let avisoNoDadoEnemigo = (jugador.liderazgo >= 126) ? " (Furia Anulada)" : ` + 🗡️${dadoEnemigo}`;
            
            agregarTexto(infoFe.textoCombate, "txt-sagrado");
            agregarTexto(`Tu Ataque Global: ${jugador.ataqueBase} (Base)${avisoNoDadoJugador} <span class="${classMod}"> ${signoMod} (${infoFe.nombre})</span> = <b>${poderJugador}</b>`);
            agregarTexto(`Ataque Enemigo: ${enemigoAtk} (Base)${avisoNoDadoEnemigo} = <b>${poderEnemigo}</b>`);
            
            if (poderJugador > poderEnemigo) {
                agregarTexto(`🏆 ¡Tu fuerza de empuje rompe sus líneas!`, "mensaje-sistema");
                crearBoton("Continuar", callbackVictoria);
            } else {
                jugador.vidas -= 1;
                actualizarHUD();
                agregarTexto(`💀 El enemigo soporta tu embate y contraataca ferozmente. La campaña sufre daños.`, "txt-hereje");
                crearBoton("Continuar", callbackDerrota);
            }
        }, 1500); 
    });
}

function combateDefensaVsAtaque(enemigoAtk, callbackVictoria, callbackDerrota) {
    agregarTexto("🛡️--- RESISTENCIA EN EL MURO ---⚔️", "separador");
    limpiarBotones();
    crearBoton("🛡️ 'Espíritu Santo, sé mi escudo'", () => {
        limpiarBotones(); 
        agregarTexto("[Elevando una plegaria silenciosa mientras la muerte se abalanza...]", "txt-accion");
        setTimeout(() => {
            let infoFe = obtenerEstadoFe();
            let dadoJugador = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoEnemigo = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            let poderJugador = jugador.defensaBase + dadoJugador + infoFe.mod;
            let poderEnemigo = enemigoAtk + dadoEnemigo;
            
            let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
            
            let classMod = "txt-sagrado";
            if (infoFe.mod > 0) classMod = "mensaje-sistema";
            if (infoFe.mod < 0) classMod = "txt-hereje";
            
            let avisoNoDadoJugador = (jugador.liderazgo <= -50) ? "" : ` + ✝${dadoJugador}`;
            let avisoNoDadoEnemigo = (jugador.liderazgo >= 126) ? " (Furia Anulada)" : ` + 🗡️${dadoEnemigo}`;
            
            agregarTexto(infoFe.textoCombate, "txt-sagrado");
            agregarTexto(`Tu Defensa Global: ${jugador.defensaBase} (Base)${avisoNoDadoJugador} <span class="${classMod}"> ${signoMod} (${infoFe.nombre})</span> = <b>${poderJugador}</b>`);
            agregarTexto(`Ataque Enemigo: ${enemigoAtk} (Base)${avisoNoDadoEnemigo} = <b>${poderEnemigo}</b>`);
            
            if (poderJugador > poderEnemigo) {
                agregarTexto(`🏆 ¡Vuestro muro de escudos resiste estoico el embate!`, "mensaje-sistema");
                crearBoton("Continuar", callbackVictoria);
            } else {
                jugador.vidas -= 1;
                actualizarHUD();
                agregarTexto(`💀 La línea se quiebra bajo la furia enemiga. La campaña sufre daños.`, "txt-hereje");
                crearBoton("Continuar", callbackDerrota);
            }
        }, 1500); 
    });
}