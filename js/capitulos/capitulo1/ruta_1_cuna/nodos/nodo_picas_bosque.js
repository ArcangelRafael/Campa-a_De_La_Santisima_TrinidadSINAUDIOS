/* === NODO_PICAS_BOSQUE.JS - LÓGICA EXCLUSIVA DEL MURO DE PICAS (BOSQUE) === */

window.iniciarRadarTactico = function() {
    console.log("📡 RADAR TÁCTICO INICIADO: Escaneando zona de batalla en el bosque...");
    if(window.radarInterval) clearInterval(window.radarInterval);

    window.radarInterval = setInterval(() => {
        let contenedor = document.getElementById("zona-batalla-picas-anim");
        let zA = document.getElementById("zona-aliada-picas");
        let zE = document.getElementById("zona-enemiga-picas");

        if(contenedor && zA && zE) {
            // Silenciado para no saturar, pero el radar sigue activo.
        }
    }, 2000);
};

// =========================================================================
// REGISTRO INMORTAL DE CAÍDOS Y NOMBRES
// =========================================================================
window.registrarMarcadorPersistente = function(slotPos, tipo, nombre = null) {
    if (!window.marcadoresBosquePersistentes) window.marcadoresBosquePersistentes = [];
    let existe = window.marcadoresBosquePersistentes.find(m => m.slotPos === slotPos && m.tipo === tipo);
    if (!existe) {
        window.marcadoresBosquePersistentes.push({ slotPos, tipo, nombre });
    }
};

window.dibujarMarcadorMuerte = function(slot, tipo) {
    if(!slot) return;
    
    let card = slot.querySelector('.tropa-draggable') || slot.firstElementChild;
    
    if(card && card.id && card.id.startsWith('drag-')) {
        let idUnico = card.id.split('-')[1];
        let tropa = jugador.tropas.find(t => t.idUnico == idUnico);
        
        if(tropa && tropa.hp <= 0 && !card.classList.contains('marcador-batalla')) {
            card.style.transition = "filter 1s ease-out";
            card.style.filter = "grayscale(100%) sepia(30%) brightness(0.4)";
            card.style.opacity = "1"; 
        }
    }
    
    if (slot.querySelector(`.${tipo}-icon.persistent-death-mark`)) return;

    let cross = document.createElement("div");
    cross.innerHTML = tipo === 'cross' ? "✝" : "💀";
    cross.className = `marcador-batalla ${tipo}-icon persistent-death-mark`; 
    
    let fontSize = tipo === 'cross' ? '65px' : '20px';
    let leftPos = tipo === 'cross' ? '50%' : '140%';

    cross.style.cssText = `position:absolute; font-size:${fontSize}; z-index:1 !important; pointer-events:none; opacity: 1; top: 50%; left: ${leftPos}; transform: translate(-50%, -50%);`;
    
    if (tipo === 'cross') {
        cross.style.color = "#ffd700";
        cross.style.textShadow = "0 0 15px #ffaa00, 0 0 40px #ffaa00, 0 0 60px #ffaa00";
    } else {
        cross.style.color = "#ffffff";
        cross.style.textShadow = "0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff0000";
    }
    slot.appendChild(cross);
};

// =========================================================================
// RENDERIZADOR TÁCTICO DE ENEMIGOS EN COMBATE (AHORA INFALIBLE)
// =========================================================================
window.actualizarGrillaEnemigosBosque = function(isAttacking) {
    let zonaEne = document.getElementById("zona-enemiga-picas");
    if (!zonaEne) return;
    zonaEne.innerHTML = ""; 
    
    let gridEne = document.createElement("div");
    gridEne.style.display = "grid";
    gridEne.style.gridTemplateColumns = "repeat(3, 75px)";
    gridEne.style.gridTemplateRows = "repeat(3, 75px)";
    gridEne.style.gap = "5px 10px";
    gridEne.style.direction = "ltr";

    const ordenAsalto = [
        {r: 1, c: 0}, {r: 0, c: 0}, {r: 2, c: 0}, 
        {r: 1, c: 1}, {r: 0, c: 1}, {r: 2, c: 1}, 
        {r: 1, c: 2}, {r: 0, c: 2}, {r: 2, c: 2}  
    ];

    let bajasBallestas = window.bajasBallesterosEsteTurno || 0;
    
    let muertosPicas = 0;
    if (typeof EstadoBatalla !== 'undefined' && EstadoBatalla.enemigosCaidosEnMuro) {
        muertosPicas = EstadoBatalla.enemigosCaidosEnMuro.length;
    }
    
    let muertosOficiales = Math.min(9, bajasBallestas + muertosPicas);

    let atacantes = isAttacking && EstadoBatalla.accionesPendientes ? EstadoBatalla.accionesPendientes.length : 0;
    
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let posIndex = ordenAsalto.findIndex(pos => pos.r === r && pos.c === c);
            
            let slotDiv = document.createElement("div");
            slotDiv.style.width = "75px";
            slotDiv.style.height = "75px";
            slotDiv.style.boxSizing = "border-box";
            slotDiv.style.borderRadius = "4px";
            
            if (posIndex >= muertosOficiales && posIndex < muertosOficiales + atacantes) {
                // Hueco del atacante que saltó a golpear a tus piqueros
                slotDiv.style.border = "1px dashed rgba(255, 76, 76, 0.4)";
                slotDiv.style.background = "rgba(255, 0, 0, 0.05)";
            } else if (posIndex >= muertosOficiales + atacantes) {
                // Enemigo vivo esperando en la grilla
                let imgE = (r + c) % 2 === 0 ? "enemigo_piquero.webp" : "enemigo.webp";
                slotDiv.innerHTML = `<img src="assets/img/personajes/enemigos/${imgE}" style="width:100%;height:100%;object-fit:cover; transform:scaleX(-1); border-radius:2px;">`;
                slotDiv.style.border = "2px solid #ff4c4c";
                slotDiv.style.background = "#1a1a1a";
                slotDiv.style.boxShadow = "-5px 0 15px rgba(255,0,0,0.3)";
            }
            
            gridEne.appendChild(slotDiv);
        }
    }
    zonaEne.appendChild(gridEne);
};

window.actualizarGrillaEnemigosPicas = window.actualizarGrillaEnemigosBosque;

async function iniciarCombatePicasBosque(formacion, callbackFinalizar, metaPP, turnosFase) {
    EstadoBatalla.limpiar(); 
    EstadoBatalla.tipoCombate = "picas_bosque";
    
    if (!window.marcadoresBosquePersistentes) window.marcadoresBosquePersistentes = []; 
    
    EstadoBatalla.caidosEnMuro = []; 
    EstadoBatalla.enemigosCaidosEnMuro = []; 
    EstadoBatalla.hordaMuertosActuales = 0; 
    EstadoBatalla.bajasEnemigas = EstadoBatalla.bajasEnemigas || 0;

    let styleId = "picas-bosque-override";
    if (!document.getElementById(styleId)) {
        let style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            .modo-combate #zona-reservas-picas { display: none !important; }
            .zona-batalla-anim { display: flex !important; justify-content: center !important; align-items: center !important; gap: 80px !important; }
            .modo-combate #zona-aliada-picas { position: absolute !important; left: 32% !important; margin: 0 !important; transform: scale(0.95) !important; }
            .modo-combate #zona-enemiga-picas { position: absolute !important; right: 25% !important; margin: 0 !important; transform: scale(0.95) !important; }
            .modo-combate #zona-enemiga-picas > div { display: grid !important; grid-template-columns: repeat(3, 75px) !important; grid-template-rows: repeat(3, 75px) !important; gap: 5px 10px !important; direction: ltr !important; }
            .modo-combate #zona-enemiga-picas div[style*="dashed"]:empty, .modo-combate #zona-enemiga-picas .slot-formacion:empty { border: none !important; background: transparent !important; box-shadow: none !important; }
        `;
        document.head.appendChild(style);
    }
    
    EstadoBatalla.metaProgresoMuro = metaPP;
    EstadoBatalla.turnosFaseBosque = turnosFase;
    if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosFase; 

    EstadoBatalla.reservas = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0 && !Object.values(formacion.slots).includes(t.idUnico));
    EstadoBatalla.maxTurnos = turnosFase;
    EstadoBatalla.callback = callbackFinalizar;

    EstadoBatalla.tropasVivas = [
        { idUnico: formacion.slots["pica-1"], posNombre: "el flanco izquierdo de picas", slotPos: "pica-1" },
        { idUnico: formacion.slots["pica-2"], posNombre: "el centro izquierdo de picas", slotPos: "pica-2" },
        { idUnico: formacion.slots["pica-3"], posNombre: "el centro derecho de picas", slotPos: "pica-3" },
        { idUnico: formacion.slots["pica-4"], posNombre: "el flanco derecho de picas", slotPos: "pica-4" }
    ];

    storyArea.innerHTML = "";
    prepararBotonTurno();
    animarDialogoAvancePicasBosque();

    setTimeout(() => { if(typeof storyArea !== 'undefined') storyArea.scrollTop = 0; window.scrollTo(0, 0); }, 50);
}

async function animarDialogoAvancePicasBosque() {
    jugador.tropas.forEach(t => {
        if (t.hp > 0) {
            let el = document.getElementById("drag-" + t.idUnico);
            if (el) { el.style.filter = "none"; el.style.opacity = "1"; }
        }
    });

    let divDialogo = document.createElement("div");
    storyArea.appendChild(divDialogo);

    let crucesMuro = window.marcadoresBosquePersistentes ? window.marcadoresBosquePersistentes.filter(m => m.tipo === 'cross').length : 0;

    if (crucesMuro > 0 && EstadoBatalla.turnoActual > 1) {
        let divSep = document.createElement("div");
        divSep.innerHTML = "<div class='separador'>***</div><h4 class='txt-sagrado' style='text-align:center;'>RÉQUIEM EN LA LÍNEA</h4>";
        storyArea.appendChild(divSep);

        await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
            personajeImg: "assets/img/personajes/aliados/multipiq.webp", 
            nombrePersonaje: "Hueste de Piqueros", alineacion: "izq", 
            bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡Requiem aeternam dona eis, Domine! ¡Ni un paso atrás! ¡Que la sangre de nuestros mártires ahogue a estos herejes!"`, 
            claseTexto: "txt-multitud"
        });
    } else {
        await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
            personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", 
            nombrePersonaje: "Conde JuanA", alineacion: "izq", 
            bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
            texto: `"¡CUBRID A LOS TIRADORES! Turno ${EstadoBatalla.turnoActual}... La horda acecha. ¡Firmeza ante todo!"`, 
            claseTexto: "txt-lugarteniente"
        });
    }
    animarAvancePicasBosque();
}

function animarAvancePicasBosque() {
    document.querySelectorAll('.video-zona').forEach(vz => vz.innerHTML = '');

    requestAnimationFrame(() => {
        document.getElementById("formacion-overlay").style.display = "flex"; 
        let tablero = document.getElementById("formacion-picas-tablero");
        tablero.style.display = "flex"; 
        tablero.classList.add("modo-combate");
        tablero.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/img/fondos/puentepiso.webp')";
        tablero.style.backgroundSize = "160%";
        tablero.style.backgroundPosition = "left center";

        let zonaBatalla = document.getElementById("zona-batalla-picas-anim");
        if (!zonaBatalla) {
            zonaBatalla = document.createElement("div");
            zonaBatalla.id = "zona-batalla-picas-anim";
            zonaBatalla.className = "zona-batalla-anim";
            let zonaRes = document.getElementById("zona-reservas-picas");
            let zonaAli = document.getElementById("zona-aliada-picas");
            let zonaEne = document.getElementById("zona-enemiga-picas");
            
            if (zonaRes) { zonaRes.style.setProperty("display", "none", "important"); zonaRes.innerHTML = ""; zonaBatalla.appendChild(zonaRes); }
            if (zonaAli) zonaBatalla.appendChild(zonaAli);
            if (zonaEne) zonaBatalla.appendChild(zonaEne);
            tablero.appendChild(zonaBatalla);
        }

        if (!document.getElementById("niebla-combate-picas")) {
            let nieblaCombat = document.createElement("div");
            nieblaCombat.id = "niebla-combate-picas";
            nieblaCombat.className = "efecto-neblina";
            nieblaCombat.style.cssText = "z-index: 800 !important; pointer-events: none; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; opacity: 0.85;";
            zonaBatalla.appendChild(nieblaCombat);
        }

        let labelTurnos = document.getElementById("label-turnos-picas");
        if(labelTurnos) labelTurnos.style.display = "none";

        document.getElementById("btn-iniciar-formacion-picas").style.display = "none";
        document.getElementById("btn-iniciar-formacion").style.display = "none"; 
        document.getElementById("btn-ver-reporte").style.display = "none";
        document.getElementById("titulo-formacion").innerText = `🛡️ PROTEGIENDO RETAGUARDIA: TURNO ${EstadoBatalla.turnoActual} 🛡️`;

        restaurarVisualesCombate();

        if (window.marcadoresBosquePersistentes && window.marcadoresBosquePersistentes.length > 0) {
            window.marcadoresBosquePersistentes.forEach(m => {
                let slotPica = document.getElementById(`pica-slot-${m.slotPos.split("-")[1]}`);
                if(slotPica) window.dibujarMarcadorMuerte(slotPica, m.tipo);
            });
        }

        EstadoBatalla.logTurnoGlobal = [];
        EstadoBatalla.logTurnoGlobal.push(RenderCombate.htmlCabeceraTurno(EstadoBatalla.turnoActual));
        EstadoBatalla.accionesPendientes = [];

        EstadoBatalla.tropasVivas.forEach(pos => {
            if(pos.idUnico) {
                let tropa = jugador.tropas.find(tr => tr.idUnico === pos.idUnico);
                if(tropa && tropa.hp > 0 && !pos.ignorarMuerto) {
                    let enemigo = GeneradorHordas.obtenerEnemigoPicas(); 
                    EstadoBatalla.accionesPendientes.push({ tropa, pos, enemigo });
                    
                    let slotPica = document.getElementById(`pica-slot-${pos.slotPos.split("-")[1]}`);
                    if(slotPica) {
                        let divEnemigo = document.createElement("div");
                        divEnemigo.className = "enemigo-atacando-pica";
                        divEnemigo.style.cssText = "position:absolute; top:0px; right:-70px; width:75px; height:75px; border:2px solid #ff4c4c; background:#1a1a1a; z-index:150; transform:translateX(60px); transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius:4px; box-shadow: -5px 0 15px rgba(255,0,0,0.8); display:flex; justify-content:center; align-items:center;";
                        divEnemigo.innerHTML = `<img src="assets/img/personajes/enemigos/enemigo.webp" style="width:100%;height:100%;object-fit:cover; transform:scaleX(-1); border-radius:2px;">`;
                        slotPica.appendChild(divEnemigo);
                        setTimeout(() => divEnemigo.style.transform = "translateX(0)", 100);
                    }
                }
            }
        });
        
        window.actualizarGrillaEnemigosBosque(true);
        
        document.getElementById("btn-tirar-dados").onclick = resolverDadosVisualesPicasBosque;
        document.getElementById("btn-tirar-dados").style.display = "inline-block";
        window.iniciarRadarTactico();
    });
}

function resolverDadosVisualesPicasBosque() {
    document.getElementById("btn-tirar-dados").style.display = "none";
    let infoFe = obtenerEstadoFe();

    let picasParticipantes = EstadoBatalla.accionesPendientes.length;
    let puntosGanados = {1:3, 2:6, 3:8, 4:12}[picasParticipantes] || 0;
    EstadoBatalla.progresoMuro += puntosGanados;
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;

    EstadoBatalla.accionesPendientes.forEach(acc => {
        let { tropa, pos, enemigo } = acc;
        
        // FIX DOD: Evaluar Poder Tropa en lugar de matemáticas manuales
        let poderDef = GestorEstado.evaluarPoderTropa(tropa, 'def');
        let dadoGracia = (jugador.liderazgo <= -50) ? 0 : tirarDado();
        let dadoFuria = (jugador.liderazgo >= 126) ? 0 : tirarDado();
        
        let pDefAliado = poderDef.neto + dadoGracia + infoFe.mod;
        let pAtkEnemigo = enemigo.atk + dadoFuria;

        let signoMod = (infoFe.mod >= 0) ? `+${infoFe.mod}` : `${infoFe.mod}`;
        let classMod = (infoFe.mod >= 0) ? "mensaje-sistema" : "txt-hereje";
        if (infoFe.mod === 0) classMod = "txt-sagrado";

        let idBc = 'bc_' + Math.random().toString(36).substr(2,9);
        let idBcCounter = idBc + '_counter';
        let phase1Cons = "";
        let hasCounter = false;

        if (pDefAliado >= pAtkEnemigo) {
            hasCounter = true;
            phase1Cons = `<span class="mensaje-sistema">¡Muro Impenetrable! ${tropa.nombre} resiste y prepara contraataque.</span>`;
        } else {
            GestorEstado.recibirDano(tropa.idUnico, 1);
            phase1Cons = `<span class="txt-hereje">¡Brecha en la guardia! El enemigo perfora y hiere a ${tropa.nombre}.</span>`;
            if(tropa.hp <= 0) {
                phase1Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                window.registrarMarcadorPersistente(pos.slotPos, 'cross', tropa.nombre);
                
                if(!EstadoBatalla.caidosEnMuro) EstadoBatalla.caidosEnMuro = [];
                if(!EstadoBatalla.caidosEnMuro.find(m => m.idUnico === tropa.idUnico)) {
                    EstadoBatalla.caidosEnMuro.push({ idUnico: tropa.idUnico, img: tropa.img, nombre: tropa.nombre, clase: tropa.clase, slotPos: pos.slotPos });
                }
            }
        }

        // FIX TÁCTICO DOD: Inyectar tropaId
        let dataRender = { 
            tropaId: tropa.idUnico,
            posNombre: pos.posNombre, enemigoNombre: enemigo.nombre, tropaNombre: tropa.nombre, 
            defBase: poderDef.base, stringHerido: poderDef.stringEfectos, dadoGracia, classMod, signoMod, infoFeNombre: infoFe.nombre, pDefAliado, 
            atkEnemigoBase: enemigo.atk, dadoFuria, pAtkEnemigo, phase1Cons, idBc, hasCounter, idBcCounter, autoCombat 
        };
        let logStr = RenderCombate.htmlAsaltoPicas(dataRender);

        if (hasCounter) {
            let poderAtk = GestorEstado.evaluarPoderTropa(tropa, 'atk');
            let dadoGracia2 = (jugador.liderazgo <= -50) ? 0 : tirarDado();
            let dadoFuria2 = (jugador.liderazgo >= 126) ? 0 : tirarDado();
            let pAtkAliado = poderAtk.neto + dadoGracia2 + infoFe.mod;
            let pAtkEnemigo2 = enemigo.atk + dadoFuria2;
            let phase2Cons = "";

            if (pAtkAliado > pAtkEnemigo2) {
                EstadoBatalla.bajasEnemigas++;
                EstadoBatalla.hordaMuertosActuales++; 
                phase2Cons = `<span class="mensaje-sistema">¡Infiel Ensartado! El asaltante muere en las lanzas.</span>`;
                window.registrarMarcadorPersistente(pos.slotPos, 'skull');

                if(!EstadoBatalla.enemigosCaidosEnMuro) EstadoBatalla.enemigosCaidosEnMuro = [];
                EstadoBatalla.enemigosCaidosEnMuro.push(pos.slotPos);

            } else {
                GestorEstado.recibirDano(tropa.idUnico, 1);
                phase2Cons = `<span class="txt-hereje">¡Duelo sangriento! ${tropa.nombre} sufre una herida en la refriega.</span>`;
                if(tropa.hp <= 0) {
                    phase2Cons += `<div class="separador txt-hereje">💀 ¡MÁRTIR EN EL MURO! ${tropa.nombre} ha caído.</div>`;
                    window.registrarMarcadorPersistente(pos.slotPos, 'cross', tropa.nombre);

                    if(!EstadoBatalla.caidosEnMuro) EstadoBatalla.caidosEnMuro = [];
                    if(!EstadoBatalla.caidosEnMuro.find(m => m.idUnico === tropa.idUnico)) {
                        EstadoBatalla.caidosEnMuro.push({ idUnico: tropa.idUnico, img: tropa.img, nombre: tropa.nombre, clase: tropa.clase, slotPos: pos.slotPos });
                    }
                }
            }

            // FIX TÁCTICO DOD: Inyectar tropaId
            let dataCounter = { 
                tropaId: tropa.idUnico,
                tropaNombre: tropa.nombre, atkBase: poderAtk.base, stringHerido: poderAtk.stringEfectos, dadoGracia2, classMod, signoMod, infoFeNombre: infoFe.nombre, pAtkAliado, 
                enemigoNombre: enemigo.nombre, atkEnemigoBase: enemigo.atk, dadoFuria2, pAtkEnemigo2, phase2Cons, idBcCounter, autoCombat 
            };
            logStr += RenderCombate.htmlContraataquePicas(dataCounter);
        }
        
        EstadoBatalla.logTurnoGlobal.push(logStr);
    });

    let metaDin = EstadoBatalla.metaProgresoMuro || 12;
    let avancePorc = Math.min(100, Math.round((EstadoBatalla.progresoMuro / metaDin) * 100));
    
    let displayStyle = autoCombat ? "block" : "none";
    EstadoBatalla.logTurnoGlobal.push(`<div class="resumen-turno-box resumen-oculto" style="display:${displayStyle};"><b>Progreso de Cobertura: ${avancePorc}%</b><br>Bajas enemigas trituradas: ${EstadoBatalla.bajasEnemigas}</div>`);
    
    setTimeout(() => {
        document.querySelectorAll(".enemigo-atacando-pica").forEach(e => e.remove());
        document.querySelectorAll(".en-combate").forEach(e => e.classList.remove("en-combate"));

        window.actualizarGrillaEnemigosBosque(false);
        
        EstadoBatalla.turnoActual++;
        if(typeof cerrarMesaDeGuerra === 'function') cerrarMesaDeGuerra();
    }, 400);
}