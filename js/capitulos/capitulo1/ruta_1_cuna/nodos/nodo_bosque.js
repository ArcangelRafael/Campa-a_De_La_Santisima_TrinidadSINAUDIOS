/* === NODO_BOSQUE.JS - BUCLE TÁCTICO DE SAETAS Y PICAS === */

async function iniciarFaseBosque() {
    if (!jugador.enemigosObjetivo) {
        jugador.enemigosObjetivo = Math.floor(Math.random() * 11) + 44; 
    }
    if (!jugador.enemigosAsesinados) jugador.enemigosAsesinados = 0;

    limpiarBotones(); storyArea.innerHTML = "";

    if (jugador.enemigosAsesinados >= jugador.enemigosObjetivo) {
        await evaluarVictoriaDerrotaBosque();
        return;
    }

    agregarTexto("<h2 class='txt-sagrado' style='text-align:center;'>LA DEFENSA DEL BOSQUE</h2>");
    
    await MotorDialogos.mostrarDialogo({
        personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante",
        texto: `"¡Mantened la posición! ¡Los repeleremos ola tras ola hasta que se ahoguen en su propia sangre!"`, claseTexto: "txt-comandante"
    });
    
    agregarTexto(`<div class='resumen-turno-box' style='border-color:#ff4c4c;'><h3 class='txt-hereje'>PROGRESO DE LA MASACRE</h3>
        <p style='font-size:24px; margin:0;'>⚔️ <span class='txt-hereje'>${jugador.enemigosAsesinados} / ${jugador.enemigosObjetivo}</span> Herejes Eliminados ⚔️</p></div>`, "", true);

    jugador.tropas.forEach(t => { if (t.cooldown === undefined) t.cooldown = 0; });

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin);
    let listosParaTirar = ballesterosVivos.filter(b => b.cooldown === 0);
    let totalPiqueros = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;

    if (listosParaTirar.length > 0) {
        crearBoton(`🏹 ORDENAR LLUVIA DE SAETAS (${listosParaTirar.length} Listos)`, ejecutarVolleyBosque);
    } else {
        agregarTexto("<div class='separador'>***</div>");
        
        if (ballesterosVivos.length > 0) {
            await MotorDialogos.mostrarDialogo({
                personajeImg: "assets/img/personajes/aliados/lider_ballesteros.webp", nombrePersonaje: "Barón Andrew", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡Mis hombres están tensando las cuerdas! ¡No podemos disparar en este turno, cubridnos!"`, claseTexto: "txt-lugarteniente"
            });
        }
        
        if (totalPiqueros === 0) {
            crearBoton("🛡️ PREPARAR LA ÚLTIMA LÍNEA (SACRIFICIO)", async () => await iniciarNarrativaSacrificio());
        } else {
            crearBoton("🛡️ PREPARAR MURO DE PICAS", async () => await iniciarPicasBosque());
        }
    }
}

function ejecutarVolleyBosque() {
    limpiarBotones(); storyArea.innerHTML = "";
    
    let autoCombat = document.getElementById("ht-auto-combat")?.checked;
    let btnLanzarTodos = autoCombat ? "" : `<br><button class='btn-lanzar-todos' style='margin-top:10px;' onclick='tirarTodosLosDadosBosque(this)'>TIRAR TODOS LOS DADOS</button>`;
    
    agregarTexto(`<h3 class='txt-sagrado' style='text-align:center; position:relative;'>LLUVIA DE SAETAS${btnLanzarTodos}</h3>`);
    agregarTexto(`[Las ballestas crujen al unísono mientras los virotes cortan el aire espeso del bosque...]`, "txt-accion");

    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin);
    let htmlGrid = `<div class="grid-desplegado" style="margin-top:20px;">`;
    
    let bajasVolley = 0;

    ballesterosVivos.forEach((b, indice) => {
        let claseBorde = b.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';
        let isNoble = b.clase === 'noble';
        
        if (b.cooldown > 0) {
            htmlGrid += RenderCombate.htmlCartaBallestero({cooldown: b.cooldown, claseBorde, img: b.img, nombre: b.nombre});
        } else {
            let dado = Math.floor(Math.random() * 6) + 1;
            let impacto = false;

            if (isNoble && dado <= 2) impacto = true;
            if (!isNoble && dado === 1) impacto = true;

            b.cooldown = isNoble ? 1 : 2; 
            if (impacto) bajasVolley++;

            let dadoClase = impacto ? 'saeta-hit' : 'saeta-miss';
            let textoDado = `<span class="txt-sagrado">Dado: <span class="${autoCombat ? dadoClase : 'dado-hide saeta-dado ' + dadoClase}" data-val="${dado}">${autoCombat ? dado : '__'}</span></span>`;
            let resultadoTexto = impacto ? `<b class="mensaje-sistema">¡CRÍTICO! 💀</b>` : `<b class="txt-hereje">Falla 💨</b>`;
            let idBc = 'bc_' + Math.random().toString(36).substr(2,9);

            // FIX TÁCTICO DOD: El "Switch de Modo". 
            // Eliminamos la inyección del tropaId. Al no enviarlo al motor, 
            // esta acción se registra mecánicamente como "Modo Distancia" 
            // y no desgastará ni un ápice de la armadura o espadas de la mochila.
            htmlGrid += RenderCombate.htmlCartaBallestero({
                cooldown: 0, autoCombat, claseBorde, img: b.img, nombre: b.nombre, 
                textoDado, resultadoTexto, idBc
            });

            if (autoCombat && typeof window.AudioManager !== 'undefined') {
                let delayDisparo = (indice * 150) + (Math.random() * 150);
                setTimeout(() => {
                    window.AudioManager.playSFX("assets/audio/ballesta.mp3");
                    if (impacto) {
                        setTimeout(() => window.AudioManager.playLamento(), 150);
                    }
                }, delayDisparo);
            }
        }
    });

    htmlGrid += `</div>`;
    agregarTexto(htmlGrid, "", true);

    window.bajasBallesterosEsteTurno = bajasVolley; 

    jugador.enemigosAsesinados += bajasVolley;
    
    let textoResumen = bajasVolley > 0 ? `<b class='mensaje-sistema'>¡Los virotes abatieron a ${bajasVolley} paganos!</b>` : `<b class='txt-hereje'>Todas las saetas se perdieron en los escudos enemigos...</b>`;
    
    let displayStyle = autoCombat ? "block" : "none";
    let oldActionArea = document.getElementById('action-area');
    if (oldActionArea) oldActionArea.style.display = 'none';
    
    let htmlFinal = `
    <div class="resumen-oculto" style="display:${displayStyle};">
        <div class='resumen-turno-box' style="margin-top:15px;">${textoResumen}</div>
        <div id="inline-action-area" style="text-align:center; margin-top:20px;"></div>
    </div>`;
    
    agregarTexto(htmlFinal, "", true);

    setTimeout(() => {
        let container = document.getElementById('inline-action-area');
        if (container) {
            let btnEvaluar = document.createElement("button");
            btnEvaluar.innerText = "EVALUAR RESULTADOS";
            btnEvaluar.style.cssText = "background: #111; color: #ffaa00; border: 2px solid #ffaa00; padding: 10px 20px; font-family: 'Cinzel', serif; font-weight: bold; cursor: pointer; letter-spacing: 1px;";
            btnEvaluar.onclick = async () => {
                if(window.verificarCombatesPendientes()) {
                    btnEvaluar.remove(); 
                    await finalizarVolleyBosque();
                }
            };
            container.appendChild(btnEvaluar);
        }
    }, 50);
}

async function finalizarVolleyBosque() {
    let aa = document.getElementById('action-area'); if(aa) aa.style.display = '';
    limpiarBotones();
    
    agregarTexto(`<div class='separador'>***</div>`);

    if (typeof window.mostrarNotificacionFlotante === 'function') {
        let bajasTop = Math.min(jugador.enemigosAsesinados, jugador.enemigosObjetivo);
        window.mostrarNotificacionFlotante(`⚔️ Progreso de Masacre: <b>${bajasTop} / ${jugador.enemigosObjetivo}</b> herejes abatidos.`);
    }
    
    if (jugador.enemigosAsesinados >= jugador.enemigosObjetivo) {
        window.victoriaPorSaetasFlag = true; 
        
        let skipCine = document.getElementById("ht-skip-cine")?.checked;
        if (!skipCine && typeof window.playCinematicaVictoriaPorSaetasBosque === 'function') {            
            let overlay = document.getElementById("formacion-overlay");
            if(overlay) {
                overlay.style.display = "flex";
                let roster = document.getElementById("formacion-roster");
                let tablero = document.getElementById("formacion-tablero");
                let picasTablero = document.getElementById("formacion-picas-tablero");
                let btnPicas = document.getElementById("btn-iniciar-formacion-picas");
                if(roster) roster.style.display = "none";
                if(tablero) tablero.style.display = "none";
                if(picasTablero) picasTablero.style.display = "none";
                if(btnPicas) btnPicas.style.display = "none";
                
                let titulo = document.getElementById("titulo-formacion");
                if(titulo) titulo.innerText = "";
            }

            await new Promise(res => window.playCinematicaVictoriaPorSaetasBosque(res));

            if(overlay) overlay.style.display = "none";
        }

        await evaluarVictoriaDerrotaBosque();
    } else {
        let divDialogo = document.createElement("div");
        storyArea.appendChild(divDialogo);
        
        let totalPiqueros = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
        
        if (totalPiqueros > 0) {
            await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq-align",
                texto: `"¡La horda se acerca por el claro! ¡PREPARAD LAS PICAS!"`, claseTexto: "txt-lugarteniente"
            });
            crearBoton("🛡️ PREPARAR MURO DE PICAS", async () => await iniciarPicasBosque());
        } else {
            await MotorDialogos.mostrarDialogoEnContenedor(divDialogo, {
                personajeImg: "assets/img/personajes/aliados/lider_piqueros.webp", nombrePersonaje: "Conde JuanA", alineacion: "izq", bordeClase: "borde-aliado", fontClassName: "nombre-izq-align",
                texto: `"¡Padre Santo, ten misericordia! ¡Mis falanges han sido masacradas hasta el último mártir! Su sangre riega esta tierra profanada. Barón Andrew... ya no me quedan lanzas para detener a las bestias. ¡Que la Santísima Trinidad os proteja, pues tendréis que arreglároslas con vuestras propias espadas!"`, claseTexto: "txt-lugarteniente"
            });
            crearBoton("🛡️ PREPARAR LA ÚLTIMA LÍNEA (SACRIFICIO)", async () => await iniciarNarrativaSacrificio());
        }
        
        setTimeout(() => { storyArea.scrollTop = storyArea.scrollHeight; }, 50);
    }
}

async function iniciarPicasBosque() {
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin);
    let minCooldown = 1; 
    let recargando = ballesterosVivos.filter(b => b.cooldown > 0);
    
    if (recargando.length > 0) {
        minCooldown = Math.min(...recargando.map(b => b.cooldown));
        if (minCooldown <= 0) minCooldown = 1; 
    }

    let turnosMeta = minCooldown; 
    let totalPiq = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
    let ppTurno = (totalPiq >= 4) ? 12 : (totalPiq === 3 ? 8 : (totalPiq === 2 ? 6 : (totalPiq === 1 ? 3 : 12)));
    let metaCalculada = turnosMeta * ppTurno; 
    
    if(typeof CONSTANTES_TACTICAS !== 'undefined') CONSTANTES_TACTICAS.PICAS_MAX_TURNOS = turnosMeta;
    
    if(typeof EstadoBatalla !== 'undefined') {
        EstadoBatalla.esBosque = true;
        EstadoBatalla.metaProgresoMuro = metaCalculada;
        EstadoBatalla.progresoMuro = 0; 
        EstadoBatalla.hordaMuertosActuales = 0; 
    }
    
    let resultado = await abrirFormacionPicas();
    
    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "flex";
    
    let roster = document.getElementById("formacion-roster");
    let tablero = document.getElementById("formacion-tablero");
    let picasTablero = document.getElementById("formacion-picas-tablero");
    let btnPicas = document.getElementById("btn-iniciar-formacion-picas");
    
    if(roster) roster.style.display = "none";
    if(tablero) tablero.style.display = "none";
    if(picasTablero) picasTablero.style.display = "none";
    if(btnPicas) btnPicas.style.display = "none";
    
    let titulo = document.getElementById("titulo-formacion");
    if(titulo) titulo.innerText = "";

    let skipCine = document.getElementById("ht-skip-cine")?.checked;

    if (!skipCine) {
        if (typeof window.playCinematicaFormarMuroBosque === 'function') {
            await new Promise(res => window.playCinematicaFormarMuroBosque(resultado, res));
        } else if (typeof playCinematicaFormarMuroBosque === 'function') {
            await new Promise(res => playCinematicaFormarMuroBosque(resultado, res));
        } else {
            console.error("⚠️ [ALERTA TÁCTICA]: No se encontró la cinemática de formar muro. Saltando animación.");
        }
    }
    
    if(overlay) overlay.style.display = "none";
    
    let {victoria, bajas} = await new Promise(resolve => {
        if (typeof window.iniciarCombatePicasBosque === 'function') {
            window.iniciarCombatePicasBosque(resultado, (v, b) => resolve({victoria: v, bajas: b}), metaCalculada, turnosMeta);
        } else {
            resolve({victoria: true, bajas: 0});
        }
    });
    
    await evaluarPicasBosque(victoria, bajas);
}

async function evaluarPicasBosque(victoria, bajasEnPicas) {
    window.victoriaPorSaetasFlag = false; 

    let overlay = document.getElementById("formacion-overlay");
    if(overlay) overlay.style.display = "none";

    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    jugador.enemigosAsesinados += bajasEnPicas;
    
    if (typeof window.mostrarNotificacionFlotante === 'function') {
        let bajasTop = Math.min(jugador.enemigosAsesinados, jugador.enemigosObjetivo);
        window.mostrarNotificacionFlotante(`⚔️ Progreso de Masacre: <b>${bajasTop} / ${jugador.enemigosObjetivo}</b> herejes abatidos.`);
    }

    if (!victoria) {
        let totalPiqueros = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;
        if (totalPiqueros === 0) {
            await iniciarNarrativaSacrificio(); return;
        } else {
            agregarTexto(`<h3 class='txt-hereje'>EL MURO HA CAÍDO</h3>`);
            agregarTexto(`La horda sobrepasó vuestras lanzas y la masacre es inminente...`);
            crearBoton("Continuar (Misión Fallida)", () => { crearBoton("Reiniciar Campaña", iniciarJuego); });
            return;
        }
    }
    
    agregarTexto(`<h3 class='mensaje-sistema' style='text-align:center;'>¡LA LÍNEA RESISTIÓ!</h3>`);
    agregarTexto(`Los piqueros aguantaron estoicos el embate, dando tiempo valioso a los ballesteros.`);
    
    jugador.tropas.forEach(t => {
        if (t.tipoGeneral === "ballesteros" && t.cooldown > 0 && !t.espadachin) {
            t.cooldown -= EstadoBatalla.turnosFaseBosque;
            if (t.cooldown < 0) t.cooldown = 0;
        }
    });

    if (jugador.enemigosAsesinados >= jugador.enemigosObjetivo) {
        crearBoton("LA HORDA HUYE (Asegurar el Perímetro)", async () => await evaluarVictoriaDerrotaBosque());
    } else {
        crearBoton("REPLIEGUE (Abrir Campo de Tiro)", async () => {
            let overlay2 = document.getElementById("formacion-overlay");
            if(overlay2) overlay2.style.display = "flex";

            let skipCine = document.getElementById("ht-skip-cine")?.checked;

            if (!skipCine) {
                if (typeof window.playCinematicaRepliegueBosque === 'function') {
                    await new Promise(res => window.playCinematicaRepliegueBosque(res));
                } else if (typeof playCinematicaRepliegueBosque === 'function') {
                    await new Promise(res => playCinematicaRepliegueBosque(res));
                } else {
                    console.error("⚠️ [ALERTA TÁCTICA]: No se encontró la cinemática de repliegue.");
                }
            }
            
            if(overlay2) overlay2.style.display = "none";
            await iniciarFaseBosque();
        });
    }
}

async function evaluarVictoriaDerrotaBosque() {
    storyArea.innerHTML = ""; limpiarBotones();
    let ballesterosVivos = jugador.tropas.filter(t => t.tipoGeneral === "ballesteros" && t.hp > 0 && !t.espadachin).length;
    let piquerosVivos = jugador.tropas.filter(t => t.tipoGeneral === "piqueros" && t.hp > 0).length;

    if (ballesterosVivos > 0) {
        agregarTexto(`<h2 class='txt-sagrado' style='text-align:center;'>LA CARNICERÍA HA TERMINADO</h2>`);
        agregarTexto(`Vuestros hermanos resoplan cansados. La colina está cubierta de cadáveres paganos. Habéis sobrevivido al asedio.`);
        
        if (piquerosVivos === 0) {
            agregarTexto(`No obstante, todos vuestros lanceros perecieron. Ha sido una victoria pírrica. Vuestras fuerzas están mermadas y el hedor a sangre atrae moscas y desesperanza.`, "txt-hereje");
            GestorEstado.modificarFe(-15, "las bajas críticas y el agobiante hedor a muerte");
        } else {
            agregarTexto(`Vuestros soldados alzan sus espadas al cielo en agradecimiento.`, "mensaje-sistema");
            GestorEstado.modificarFe(10, "una gran victoria moral en el bosque");
        }
        
        crearBoton("ASEGURAR EL PERÍMETRO", async () => {
            let overlay = document.getElementById("formacion-overlay");
            if(overlay) overlay.style.display = "flex";
            
            let skipCine = document.getElementById("ht-skip-cine")?.checked;
            
            if(!skipCine && typeof window.playCinematicaVictoria === 'function') {
                await new Promise(res => window.playCinematicaVictoria(res, window.victoriaPorSaetasFlag));
            }
            
            if(overlay) overlay.style.display = "none";
            if (typeof iniciarParlamentoBosque === 'function') await iniciarParlamentoBosque(); 
            else interludiumCapitulo1();
        });
    } else {
        agregarTexto(`<div class='separador'>***</div>`);
        agregarTexto(`<h2 class='txt-hereje' style='text-align:center;'>MASACRE EN EL BOSQUE</h2>`);
        agregarTexto(`Sin protección, vuestros tiradores fueron despedazados. La Cruzada ha fracasado en estas tierras impías.`);
        crearBoton("Soportar el Juicio Divino...", capitulo1_DerrotaFinal);
    }
}