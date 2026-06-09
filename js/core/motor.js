/* === MOTOR.JS - SISTEMA CENTRAL Y MATEMÁTICAS === */

let jugador = {
    nombre: "...", denarios: 0, liderazgoBase: 0, liderazgo: 0,     
    estadoFeActual: "FE FIRME", inventario: [], orden: "", tropas: [], 
    comandantes: [], 
    nombresUsados: [], 
    ataqueBase: 0, ataqueReal: 0, defensaBase: 0, defensaReal: 0, vidas: 3,
    
    narrativaSacrificioVista: false,
    mercenarioRedimidoId: null 
};

let tribulacionesDisponibles = [];
let inventarioDesbloqueado = false; 
let tiendaDesbloqueada = false; 
let cronicasDesbloqueado = false;

const storyArea = document.getElementById("story-area");
const actionArea = document.getElementById("action-area");

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

window.GestorEstado = {
    modificarFe: function(cantidad, razon = null) {
        jugador.liderazgoBase = (jugador.liderazgoBase || 0) + cantidad;
        jugador.liderazgo = jugador.liderazgoBase;
        actualizarHUD();
        if (razon && typeof agregarTexto === 'function') {
            let cssClass = cantidad >= 0 ? 'txt-sagrado' : 'txt-hereje';
            let signo = cantidad >= 0 ? '+' : '';
            agregarTexto(`[Fe de Batalla: ${signo}${cantidad} por ${razon}]`, cssClass);
        }
    },
    modificarOro: function(cantidad, razon = null) {
        jugador.denarios = (jugador.denarios || 0) + cantidad;
        actualizarHUD();
        if (razon && typeof agregarTexto === 'function') {
            let cssClass = cantidad >= 0 ? 'mensaje-sistema' : 'txt-hereje';
            let signo = cantidad >= 0 ? '+' : '';
            agregarTexto(`[Tesorería: ${signo}${cantidad} Denarios por ${razon}]`, cssClass);
        }
    },
    modificarAtaque: function(cantidad, razon = null) {
        jugador.ataqueBase = Math.max(0, (jugador.ataqueBase || 0) + cantidad);
        if (razon && typeof agregarTexto === 'function') {
            let cssClass = cantidad >= 0 ? 'txt-sagrado' : 'txt-hereje';
            let signo = cantidad >= 0 ? '+' : '';
            agregarTexto(`[Táctica: ${signo}${cantidad} Ataque Base por ${razon}]`, cssClass);
        }
    },
    modificarDefensa: function(cantidad, razon = null) {
        jugador.defensaBase = Math.max(0, (jugador.defensaBase || 0) + cantidad);
        if (razon && typeof agregarTexto === 'function') {
            let cssClass = cantidad >= 0 ? 'txt-sagrado' : 'txt-hereje';
            let signo = cantidad >= 0 ? '+' : '';
            agregarTexto(`[Táctica: ${signo}${cantidad} Defensa Base por ${razon}]`, cssClass);
        }
    },
    modificarVidas: function(cantidad, razon = null) {
        jugador.vidas = (jugador.vidas || 3) + cantidad;
        actualizarHUD();
        if (razon && typeof agregarTexto === 'function') {
            let cssClass = cantidad >= 0 ? 'txt-sagrado' : 'txt-hereje';
            let signo = cantidad >= 0 ? '+' : '';
            agregarTexto(`[Comendador: ${signo}${cantidad} Vida por ${razon}]`, cssClass);
        }
    },
    recibirDano: function(idUnico, cantidad) {
        let tropa = jugador.tropas.find(t => t.idUnico === idUnico);
        if (!tropa) return false;
        
        if (tropa.hpInamovible) {
            if (typeof logTraza !== "undefined") logTraza(`[ESCUDO DEL TESTER] Herida bloqueada en ${tropa.nombre}`);
            return false; 
        }
        
        tropa.hp -= cantidad;
        return true;
    },
    curarTropa: function(idUnico, cantidad) {
        let tropa = jugador.tropas.find(t => t.idUnico === idUnico);
        if (tropa && tropa.hp > 0) {
            if (tropa.hpInamovible) return false; 
            
            tropa.hp += cantidad;
            let max = tropa.hpMax || 2;
            if (tropa.hp > max) tropa.hp = max; 
            return true;
        }
        return false;
    },
    evaluarPoderTropa: function(tropa, tipoPoder = 'atk') {
        let base = tipoPoder === 'atk' ? (tropa.atkMax || 0) : (tropa.defMax || 0);
        
        if (tipoPoder === 'atk' && tropa.atkInamovible) {
            return { base: base, neto: base, stringEfectos: ` <span class="mensaje-sistema">[Fuerza Inamovible]</span>` };
        }
        if (tipoPoder === 'def' && tropa.defInamovible) {
            return { base: base, neto: base, stringEfectos: ` <span class="mensaje-sistema">[Defensa Inamovible]</span>` };
        }

        let penalidad = (tropa.hp < (tropa.hpMax || 2) && tropa.hp > 0) ? 1 : 0;
        
        let hambre = tropa.hambre !== undefined ? tropa.hambre : 5;
        let penHambreAtk = 0;
        if (hambre === 2) penHambreAtk = 1;
        else if (hambre === 1) penHambreAtk = 2;

        let sed = tropa.sed !== undefined ? tropa.sed : 3;
        let penSedDef = 0;
        if (sed === 1) penSedDef = 2; 

        let modificadorMochila = 0;
        if (!tropa.mochila) tropa.mochila = [];
        
        tropa.mochila = tropa.mochila.filter(item => item.duracion === undefined || item.duracion > 0);

        tropa.mochila.forEach(item => {
            if (tipoPoder === 'atk' && item.atk) modificadorMochila += item.atk;
            if (tipoPoder === 'def' && item.def) modificadorMochila += item.def;
        });

        let neto = (base - penalidad) + modificadorMochila;
        
        if (tipoPoder === 'atk') neto -= penHambreAtk;
        if (tipoPoder === 'def') neto -= penSedDef;
        
        if (hambre <= 0 || sed <= 0) neto = 0; 
        
        neto = Math.max(0, neto);
        
        let stringEfectos = "";
        if (penalidad > 0) stringEfectos += ` <span class="txt-hereje">-1 (Herido)</span>`;
        
        if (hambre <= 0 || sed <= 0) {
            stringEfectos += ` <span class="txt-hereje">(Desmayado)</span>`;
        } else {
            if (tipoPoder === 'atk' && penHambreAtk > 0) stringEfectos += ` <span class="txt-hereje">-${penHambreAtk} (Hambre)</span>`;
            if (tipoPoder === 'def' && penSedDef > 0) stringEfectos += ` <span class="txt-hereje">-${penSedDef} (Sed)</span>`;
        }

        if (modificadorMochila > 0) stringEfectos += ` <span class="mensaje-sistema">+${modificadorMochila} (Buff)</span>`;
        else if (modificadorMochila < 0) stringEfectos += ` <span class="txt-hereje">${modificadorMochila} (Debuff)</span>`;

        return { base: base, neto: neto, stringEfectos: stringEfectos };
    },
    avanzarEfectosTemporales: function() {
        jugador.tropas.forEach(tropa => {
            if (tropa.hp <= 0) {
                tropa.mochila = []; 
            } else if (tropa.mochila) {
                tropa.mochila.forEach(item => {
                    if (item.duracion !== undefined) item.duracion--;
                });
            }
        });
    }
};

function reiniciarJugadorBase() {
    jugador.denarios = 0; jugador.liderazgoBase = 0; jugador.liderazgo = 0; 
    jugador.estadoFeActual = "FE FIRME"; jugador.inventario = []; jugador.orden = ""; 
    jugador.tropas = []; jugador.nombresUsados = [];
    jugador.narrativaSacrificioVista = false; jugador.mercenarioRedimidoId = null;
    inventarioDesbloqueado = false; tiendaDesbloqueada = false; cronicasDesbloqueado = false;
    
    jugador.comandantes = [
        { idUnico: "cmd_player", idTipo: "comandante", nombre: "Comendador", img: "assets/img/personajes/aliados/jugador.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
        { idUnico: "cmd_alex", idTipo: "comandante", nombre: "Sir Alexandro", img: "assets/img/personajes/aliados/lider_caballeros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
        { idUnico: "cmd_andrew", idTipo: "comandante", nombre: "Barón Andrew", img: "assets/img/personajes/aliados/lider_ballesteros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
        { idUnico: "cmd_juan", idTipo: "comandante", nombre: "Conde JuanA", img: "assets/img/personajes/aliados/lider_piqueros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
        { idUnico: "cmd_fray", idTipo: "sacerdote_unico", nombre: "Fray Bartolomé", img: "assets/img/personajes/aliados/fray.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 }
    ];

    let flecha = document.getElementById("flecha-inventario"); if(flecha) flecha.style.display = "none";
    let iconoOrden = document.getElementById("icono-orden"); if(iconoOrden) { iconoOrden.style.display = "none"; iconoOrden.src = ""; }
    document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'none');
    
    let btnCronicas = document.getElementById("btn-cronicas-hud");
    if (btnCronicas) btnCronicas.style.display = "none";

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

    let btnCronicas = document.getElementById("btn-cronicas-hud");
    if (btnCronicas) {
        btnCronicas.style.display = cronicasDesbloqueado ? "block" : "none";
    }

    if (!jugador.comandantes || jugador.comandantes.length === 0) {
        jugador.comandantes = [
            { idUnico: "cmd_player", idTipo: "comandante", nombre: "Comendador", img: "assets/img/personajes/aliados/jugador.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
            { idUnico: "cmd_alex", idTipo: "comandante", nombre: "Sir Alexandro", img: "assets/img/personajes/aliados/lider_caballeros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
            { idUnico: "cmd_andrew", idTipo: "comandante", nombre: "Barón Andrew", img: "assets/img/personajes/aliados/lider_ballesteros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
            { idUnico: "cmd_juan", idTipo: "comandante", nombre: "Conde JuanA", img: "assets/img/personajes/aliados/lider_piqueros.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 },
            { idUnico: "cmd_fray", idTipo: "sacerdote_unico", nombre: "Fray Bartolomé", img: "assets/img/personajes/aliados/fray.webp", hp: 1, hpMax: 1, hambre: 5, sed: 3, saltoHambre: true, inicioSed: 0 }
        ];
    }
    
    let cmdPlayer = jugador.comandantes.find(c => c.idUnico === "cmd_player");
    if (cmdPlayer && jugador.nombre && jugador.nombre !== "...") {
        cmdPlayer.nombre = "Comendador " + jugador.nombre;
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
    let skipPopups = document.getElementById("ht-disable-popups")?.checked;
    if (skipPopups) return;

    if (typeof RelojDivino !== "undefined") RelojDivino.pausar();

    let esPositivo = (infoFe.mod >= 0 || infoFe.nombre === "FE FIRME");
    let colorTitulo = esPositivo ? "#ffd700" : "#ff4c4c"; 
    let classEfecto = esPositivo ? "mensaje-sistema" : "txt-hereje";
    
    let narrativa = "";
    if (typeof narrativasFe !== 'undefined' && narrativasFe[infoFe.nombre]) {
        narrativa = narrativasFe[infoFe.nombre].replace(/{nombre}/g, jugador.nombre);
    } else {
        narrativa = infoFe.textoCombate;
    }

    const overlay = document.getElementById("fe-overlay"); 
    if(overlay) {
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
        overlay.style.zIndex = "9999"; 
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        
        overlay.innerHTML = `
            <div class="dialogo-pergamino borde-fray" style="margin: 0 !important; width: 700px; max-width: 90%; transform: translateY(50px);">
                <div class="dialogo-nombre nombre-fray">FRAY BARTOLOMÉ</div>
                <img src="assets/img/personajes/aliados/fray.webp" class="dialogo-retrato retrato-izq" style="left: -140px;">
                <div class="dialogo-texto-container pad-izq">
                    <b style="color:${colorTitulo}; font-size: 18px; display:block; margin-bottom:10px; text-align:center; font-family:'Cinzel', serif; letter-spacing: 1px;">ESTADO ESPIRITUAL: ${infoFe.nombre}</b>
                    <span class="txt-clerigo" style="font-size: 17px;">"${narrativa}"</span><br><br>
                    <div style="text-align:center; width:100%;">
                        <span style="font-size: 15px; color: #c0c0c0;">Efecto en Combate: <b class="${classEfecto}">${infoFe.efecto}</b></span>
                    </div>
                </div>
                <button class="btn-siguiente-medieval" onclick="document.getElementById('fe-overlay').style.display='none'; if(typeof RelojDivino !== 'undefined') RelojDivino.reanudar();">SIGUIENTE ⮞</button>
            </div>
        `;
    }
}

window.mostrarNotificacionFlotante = function(mensaje) {
    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }
    
    let notif = document.createElement("div");
    notif.className = "floating-notification";
    notif.innerHTML = mensaje;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        if (notif && notif.parentElement) notif.remove();
    }, 10000);
};

window.mostrarRequiemEnTablero = function(mensaje, x, y) {
    let notif = document.createElement("div");
    notif.className = "in-board-requiem";
    notif.innerHTML = mensaje;
    
    notif.style.left = x + "px";
    notif.style.top = y + "px";
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        if (notif && notif.parentNode) notif.remove();
    }, 3600);
};

function agregarTexto(texto, clasePersonalizada = "", forzarScroll = true) {
    const parrafo = document.createElement("p"); parrafo.innerHTML = texto;
    if (clasePersonalizada) parrafo.classList.add(clasePersonalizada);
    storyArea.appendChild(parrafo); 
    if(forzarScroll) { storyArea.scrollTop = storyArea.scrollHeight; }
}

function limpiarBotones() { actionArea.innerHTML = ''; }
function crearBoton(texto, funcionCallback) {
    const boton = document.createElement("button"); boton.innerText = texto;
    boton.onclick = funcionCallback; actionArea.appendChild(boton);
}
function tirarDado() { return Math.floor(Math.random() * 6) + 1; }

function agregarTropa(idTipo, cantidad) {
    let tipo = bdTiposTropa[idTipo];
    let horaRelojBase = (typeof RelojDivino !== 'undefined' && RelojDivino.indiceActual !== -1) ? RelojDivino.indiceActual : 0;
    
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
            idUnico: Math.random().toString(36).substr(2, 9), idTipo: idTipo, tipoGeneral: tipo.tipoG, clase: tipo.clase, nombre: nomFinal,
            hpMax: vidaBase, hp: vidaBase, atkMax: tipo.atk, defMax: tipo.def, img: tipo.img, mochila: [], hambre: 5, sed: 3, saltoHambre: true, inicioSed: horaRelojBase
        });

        let singularMap = { "caballeros": "caballero", "piqueros": "piquero", "ballesteros": "ballestero" };
        let tipoDisplay = singularMap[tipo.tipoG] || "soldado";
        if (tipo.clase === "unico_random") tipoDisplay = "vigía";
        if (tipo.clase === "unico") tipoDisplay = "héroe";

        mostrarNotificacionFlotante(`Hey! el ${tipoDisplay} <b>${nomFinal}</b> se ha unido al estandarte DEUS LO VULT !!`);
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
    let skipPopups = document.getElementById("ht-disable-popups")?.checked;
    if (skipPopups) {
        if(callbackContinuar) callbackContinuar();
        return;
    }

    if (typeof RelojDivino !== "undefined") RelojDivino.pausar();

    const overlay = document.getElementById("tribulacion-overlay");
    if(typeof AudioManager !== "undefined" && typeof AudioManager.iniciarMusicaTribulacion === 'function') {
        AudioManager.iniciarMusicaTribulacion();
    }
    
    if (tribulacionesDisponibles.length === 0) {
        if (typeof canastaTribulaciones !== 'undefined') { 
            tribulacionesDisponibles = [...canastaTribulaciones]; 
        } 
        else { 
            if(typeof RelojDivino !== "undefined") RelojDivino.reanudar();
            if(callbackContinuar) callbackContinuar(); 
            return; 
        }
    }
    
    const indexRandom = Math.floor(Math.random() * tribulacionesDisponibles.length);
    const tribulacionElegida = tribulacionesDisponibles[indexRandom];
    tribulacionesDisponibles.splice(indexRandom, 1);
    
    let scout = jugador.tropas.find(t => t.idTipo === "explorador_unico"); 
    let nombreScout = scout ? scout.nombre : "Hermano Vigía";
    let nombreComandante = jugador.nombre !== "..." ? jugador.nombre : "Comendador";

    overlay.style.position = "fixed"; overlay.style.top = "0"; overlay.style.left = "0"; overlay.style.width = "100vw"; overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)"; overlay.style.zIndex = "9999"; overlay.style.display = "flex"; overlay.style.justifyContent = "center"; overlay.style.alignItems = "center"; overlay.innerHTML = "";

    let dialogContainer = document.createElement("div"); dialogContainer.style.width = "100%"; dialogContainer.style.maxWidth = "1000px"; overlay.appendChild(dialogContainer);

    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
        personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align", retratoClase: "retrato-tribulacion",
        texto: `<b style="color:#ffaa00; display:block; margin-bottom:10px; font-size:18px; font-family:'Cinzel', serif;">TRIBULACIÓN: ${tribulacionElegida.titulo}</b>${tribulacionElegida.texto}`, claseTexto: "txt-clerigo"
    });

    dialogContainer.innerHTML = "";

    let opcionesPagables = tribulacionElegida.opciones.filter(o => jugador.denarios >= (o.costo || 0));
    
    let opcionSeleccionada = await new Promise((resolve) => {
        let box = document.createElement("div"); box.className = "dialogo-pergamino borde-comandante"; box.style.cursor = "default";
        let retrato = document.createElement("img"); retrato.className = "dialogo-retrato retrato-izq retrato-tribulacion"; retrato.src = "assets/img/personajes/aliados/jugador.webp"; box.appendChild(retrato);
        let nameTag = document.createElement("div"); nameTag.className = "dialogo-nombre nombre-comandante"; nameTag.innerHTML = nombreComandante; box.appendChild(nameTag);
        let textContainer = document.createElement("div"); textContainer.className = "dialogo-texto-container pad-izq";
        let textSpan = document.createElement("span"); textSpan.className = "txt-sagrado"; textSpan.style.fontSize = "22px"; textSpan.style.textAlign = "center"; textSpan.style.display = "block"; textSpan.innerHTML = ""; textContainer.appendChild(textSpan); box.appendChild(textContainer);
        let btnContainer = document.createElement("div"); btnContainer.style.cssText = "position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: row; gap: 15px; z-index: 25; width: max-content; max-width: 90%; justify-content: center; align-items: center;"; box.appendChild(btnContainer);
        let btnNext = document.createElement("button"); btnNext.className = "btn-siguiente-medieval"; btnNext.innerText = "SIGUIENTE ⮞"; btnNext.style.display = "none"; box.appendChild(btnNext);
        dialogContainer.appendChild(box);

        function ejecutarEleccion(opcion) {
            btnContainer.style.display = "none"; 
            let textoObj = `"${opcion.texto}"`; let i = 0;
            let interval = setInterval(() => { textSpan.innerHTML += textoObj.charAt(i); i++; if (i >= textoObj.length) { clearInterval(interval); btnNext.style.display = "block"; } }, 35); 
            btnNext.onclick = (e) => { e.stopPropagation(); resolve(opcion); };
        }

        if (opcionesPagables.length === 0) {
            let btn = document.createElement("button"); btn.className = "btn-siguiente-medieval"; btn.style.cssText = "position: relative; bottom: auto; left: auto; transform: none; margin: 0; padding: 10px 20px; font-size: 13px; max-width: 280px; white-space: normal; line-height: 1.3;"; btn.innerText = "Lamentar la carestía y continuar";
            btn.onclick = () => { GestorEstado.modificarFe(-20); ejecutarEleccion({ texto: "No tenemos el oro suficiente para actuar. Que Dios nos perdone.", consecuencia: () => { return { narrativa: "Tu compañía se desmoraliza al verte atado de manos. La miseria impide cualquier acción digna.", efectos: "<b class='txt-hereje'>[-20 Fe/Liderazgo]</b>" }; } }); };
            btnContainer.appendChild(btn);
        } else {
            tribulacionElegida.opciones.forEach(opcion => {
                let btn = document.createElement("button"); btn.className = "btn-siguiente-medieval"; btn.style.cssText = "position: relative; bottom: auto; left: auto; transform: none; margin: 0; padding: 10px 20px; font-size: 13px; max-width: 250px; white-space: normal; line-height: 1.3;"; btn.innerText = opcion.texto;
                if (jugador.denarios < (opcion.costo || 0)) { btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; btn.innerText += " (Oro Insuficiente)"; } else { btn.onclick = () => ejecutarEleccion(opcion); }
                btnContainer.appendChild(btn);
            });
        }
    });

    let resultado = opcionSeleccionada.consecuencia(); dialogContainer.innerHTML = "";
    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/fray.webp", nombrePersonaje: "Fray Bartolomé", alineacion: "izq", bordeClase: "borde-fray", nombreClase: "nombre-fray", retratoClase: "retrato-tribulacion retrato-tribulacion-fray", texto: resultado.narrativa, claseTexto: "txt-clerigo" });
    dialogContainer.innerHTML = "";
    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, { personajeImg: "assets/img/personajes/aliados/vigia.webp", nombrePersonaje: nombreScout, alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align", retratoClase: "retrato-tribulacion", texto: `<b style="color:#c0c0c0; font-size:18px; display:block; margin-bottom:10px; font-family:'Cinzel', serif;">REPORTE DE LA HUESTE:</b><div style="font-size:16px;">${resultado.efectos}</div>`, claseTexto: "txt-clerigo" });

    if(typeof AudioManager !== "undefined" && typeof AudioManager.detenerMusicaTribulacion === 'function') AudioManager.detenerMusicaTribulacion();
    overlay.style.display = "none"; overlay.innerHTML = ""; 
    if (typeof RelojDivino !== "undefined") RelojDivino.reanudar();
    if(callbackContinuar) callbackContinuar();
}

// =========================================================================
// SISTEMA CENTRAL DE MÁRTIRES Y CAÍDOS (HALOS VISUALES)
// =========================================================================
window.crearMarcadorMuerteDOM = function(tipo) {
    let mk = document.createElement("div");
    mk.className = tipo === 'skull' ? "marcador-batalla skull-icon" : "marcador-batalla cross-icon";
    mk.innerHTML = tipo === 'skull' ? "☠️" : "✝";
    
    // Inyección de CSS agresivo inline para que ningún contenedor lo sobreescriba
    if (tipo === 'skull') {
        mk.style.cssText = "position:absolute; font-size:45px; z-index:250; pointer-events:none; top:50%; left:50%; transform:translate(-50%, -50%); opacity: 0.95; color: #ffffff !important; text-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000 !important;";
    } else {
        // Posicionamiento neutral base
        mk.style.cssText = "position:absolute; font-size:45px; z-index:250; pointer-events:none; top:50%; left:50%; transform:translate(-50%, -50%); opacity: 0.95; color: #ffd700 !important; text-shadow: 0 0 15px #ffaa00, 0 0 30px #ffaa00, 0 0 40px #ffaa00 !important;";
    }
    return mk;
};

window.dibujarMarcadorMuerte = function(slotElement, tipo) {
    if (!slotElement) return null;
    
    // Purga de marcadores previos para evitar doble icono
    let existente = slotElement.querySelector('.marcador-batalla');
    if (existente) existente.remove();

    let mk = window.crearMarcadorMuerteDOM(tipo);
    slotElement.appendChild(mk);
    return mk;
};

window.forzarHalosCinematicas = function(contenedor) {
    if(!contenedor) return;
    setTimeout(() => {
        contenedor.querySelectorAll('.marcador-batalla, div').forEach(el => {
            if(el.innerHTML.includes('☠️')) {
                el.style.setProperty('color', '#ffffff', 'important');
                el.style.setProperty('text-shadow', '0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000', 'important');
                el.style.setProperty('z-index', '250', 'important');
            }
            if(el.innerHTML.includes('✝')) {
                el.style.setProperty('color', '#ffd700', 'important');
                el.style.setProperty('text-shadow', '0 0 15px #ffaa00, 0 0 30px #ffaa00, 0 0 40px #ffaa00', 'important');
                el.style.setProperty('z-index', '250', 'important');
            }
        });
    }, 150);
};