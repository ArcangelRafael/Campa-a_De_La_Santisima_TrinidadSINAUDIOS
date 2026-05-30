/* === MOTOR.JS - SISTEMA CENTRAL Y MATEMÁTICAS === */

let jugador = {
    nombre: "...", denarios: 0, liderazgoBase: 0, liderazgo: 0,     
    estadoFeActual: "FE FIRME", inventario: [], orden: "", tropas: [], 
    nombresUsados: [], 
    ataqueBase: 0, ataqueReal: 0, defensaBase: 0, defensaReal: 0, vidas: 3,
    
    narrativaSacrificioVista: false,
    mercenarioRedimidoId: null 
};

let tribulacionesDisponibles = [];
let inventarioDesbloqueado = false; 
let tiendaDesbloqueada = false; 

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
    curarTropa: function(idUnico, cantidad) {
        let tropa = jugador.tropas.find(t => t.idUnico === idUnico);
        if (tropa && tropa.hp > 0) {
            tropa.hp += cantidad;
            let max = tropa.hpMax || 2;
            if (tropa.hp > max) tropa.hp = max; 
            return true;
        }
        return false;
    },
    evaluarPoderTropa: function(tropa, tipoPoder = 'atk') {
        let base = tipoPoder === 'atk' ? (tropa.atkMax || 0) : (tropa.defMax || 0);
        let penalidad = (tropa.hp < (tropa.hpMax || 2) && tropa.hp > 0) ? 1 : 0;
        
        let modificadorMochila = 0;
        if (!tropa.mochila) tropa.mochila = [];
        
        tropa.mochila = tropa.mochila.filter(item => item.duracion === undefined || item.duracion > 0);

        tropa.mochila.forEach(item => {
            if (tipoPoder === 'atk' && item.atk) modificadorMochila += item.atk;
            if (tipoPoder === 'def' && item.def) modificadorMochila += item.def;
        });

        let neto = (base - penalidad) + modificadorMochila;
        
        let stringEfectos = "";
        if (penalidad > 0) stringEfectos += ` <span class="txt-hereje">-1 (Herido)</span>`;
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
    let skipPopups = document.getElementById("ht-disable-popups")?.checked;
    if (skipPopups) return;

    // FIX TÁCTICO: Congelar el reloj en los avisos de Fe para proteger el AFK
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
            atkMax: tipo.atk, 
            defMax: tipo.def, 
            img: tipo.img,
            mochila: [] 
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
    let skipPopups = document.getElementById("ht-disable-popups")?.checked;
    if (skipPopups) {
        if(callbackContinuar) callbackContinuar();
        return;
    }

    // FIX TÁCTICO: Congelar el tiempo litúrgico durante la tribulación
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

    overlay.style.position = "fixed";
    overlay.style.top = "0"; overlay.style.left = "0";
    overlay.style.width = "100vw"; overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.innerHTML = "";

    let dialogContainer = document.createElement("div");
    dialogContainer.style.width = "100%";
    dialogContainer.style.maxWidth = "1000px";
    overlay.appendChild(dialogContainer);

    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq",
        bordeClase: "borde-aliado",
        nombreClase: "nombre-izq-align",
        retratoClase: "retrato-tribulacion",
        texto: `<b style="color:#ffaa00; display:block; margin-bottom:10px; font-size:18px; font-family:'Cinzel', serif;">TRIBULACIÓN: ${tribulacionElegida.titulo}</b>${tribulacionElegida.texto}`,
        claseTexto: "txt-clerigo"
    });

    dialogContainer.innerHTML = "";

    let opcionesPagables = tribulacionElegida.opciones.filter(o => jugador.denarios >= (o.costo || 0));
    
    let opcionSeleccionada = await new Promise((resolve) => {
        let box = document.createElement("div");
        box.className = "dialogo-pergamino borde-comandante";
        box.style.cursor = "default";
        
        let retrato = document.createElement("img");
        retrato.className = "dialogo-retrato retrato-izq retrato-tribulacion";
        retrato.src = "assets/img/personajes/aliados/jugador.webp";
        box.appendChild(retrato);

        let nameTag = document.createElement("div");
        nameTag.className = "dialogo-nombre nombre-comandante";
        nameTag.innerHTML = nombreComandante;
        box.appendChild(nameTag);

        let textContainer = document.createElement("div");
        textContainer.className = "dialogo-texto-container pad-izq";
        
        let textSpan = document.createElement("span");
        textSpan.className = "txt-sagrado";
        textSpan.style.fontSize = "22px";
        textSpan.style.textAlign = "center";
        textSpan.style.display = "block";
        textSpan.innerHTML = ""; 
        textContainer.appendChild(textSpan);
        box.appendChild(textContainer);

        let btnContainer = document.createElement("div");
        btnContainer.style.cssText = "position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: row; gap: 15px; z-index: 25; width: max-content; max-width: 90%; justify-content: center; align-items: center;";
        box.appendChild(btnContainer);

        let btnNext = document.createElement("button");
        btnNext.className = "btn-siguiente-medieval";
        btnNext.innerText = "SIGUIENTE ⮞";
        btnNext.style.display = "none";
        box.appendChild(btnNext);

        dialogContainer.appendChild(box);

        function ejecutarEleccion(opcion) {
            btnContainer.style.display = "none"; 
            
            let textoObj = `"${opcion.texto}"`;
            let i = 0;
            let interval = setInterval(() => {
                textSpan.innerHTML += textoObj.charAt(i);
                i++;
                if (i >= textoObj.length) {
                    clearInterval(interval);
                    btnNext.style.display = "block";
                }
            }, 35); 
            
            btnNext.onclick = (e) => {
                e.stopPropagation();
                resolve(opcion);
            };
        }

        if (opcionesPagables.length === 0) {
            let btn = document.createElement("button");
            btn.className = "btn-siguiente-medieval";
            btn.style.cssText = "position: relative; bottom: auto; left: auto; transform: none; margin: 0; padding: 10px 20px; font-size: 13px; max-width: 280px; white-space: normal; line-height: 1.3;";
            btn.innerText = "Lamentar la carestía y continuar";
            btn.onclick = () => {
                GestorEstado.modificarFe(-20); 
                ejecutarEleccion({
                    texto: "No tenemos el oro suficiente para actuar. Que Dios nos perdone.",
                    consecuencia: () => {
                        return {
                            narrativa: "Tu compañía se desmoraliza al verte atado de manos. La miseria impide cualquier acción digna.",
                            efectos: "<b class='txt-hereje'>[-20 Fe/Liderazgo]</b>"
                        };
                    }
                });
            };
            btnContainer.appendChild(btn);
        } else {
            tribulacionElegida.opciones.forEach(opcion => {
                let btn = document.createElement("button");
                btn.className = "btn-siguiente-medieval";
                btn.style.cssText = "position: relative; bottom: auto; left: auto; transform: none; margin: 0; padding: 10px 20px; font-size: 13px; max-width: 250px; white-space: normal; line-height: 1.3;";
                btn.innerText = opcion.texto;
                if (jugador.denarios < (opcion.costo || 0)) {
                    btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; btn.innerText += " (Oro Insuficiente)";
                } else {
                    btn.onclick = () => ejecutarEleccion(opcion);
                }
                btnContainer.appendChild(btn);
            });
        }
    });

    let resultado = opcionSeleccionada.consecuencia();
    dialogContainer.innerHTML = "";

    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
        personajeImg: "assets/img/personajes/aliados/fray.webp",
        nombrePersonaje: "Fray Bartolomé",
        alineacion: "izq",
        bordeClase: "borde-fray",
        nombreClase: "nombre-fray",
        retratoClase: "retrato-tribulacion retrato-tribulacion-fray",
        texto: resultado.narrativa,
        claseTexto: "txt-clerigo"
    });

    dialogContainer.innerHTML = "";

    await MotorDialogos.mostrarDialogoEnContenedor(dialogContainer, {
        personajeImg: "assets/img/personajes/aliados/vigia.webp",
        nombrePersonaje: nombreScout,
        alineacion: "izq",
        bordeClase: "borde-aliado",
        nombreClase: "nombre-izq-align",
        retratoClase: "retrato-tribulacion",
        texto: `<b style="color:#c0c0c0; font-size:18px; display:block; margin-bottom:10px; font-family:'Cinzel', serif;">REPORTE DE LA HUESTE:</b><div style="font-size:16px;">${resultado.efectos}</div>`,
        claseTexto: "txt-clerigo"
    });

    if(typeof AudioManager !== "undefined" && typeof AudioManager.detenerMusicaTribulacion === 'function') {
        AudioManager.detenerMusicaTribulacion();
    }
    overlay.style.display = "none"; 
    overlay.innerHTML = ""; 

    // FIX TÁCTICO: Reanudar el tiempo litúrgico al salir del evento
    if (typeof RelojDivino !== "undefined") RelojDivino.reanudar();
    
    if(callbackContinuar) callbackContinuar();
}