/* === HACKTESTER.JS - HERRAMIENTAS DE DESARROLLADOR === */

// 1. INYECCIÓN DINÁMICA DE LA INTERFAZ Y CSS
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("ht-master-wrapper")) return; // Previene inyecciones dobles

    let daysHtml = '';
    for(let i=0; i<21; i++) {
        let diaNum = i+1;
        let mes = i < 15 ? "Dic" : "Ene";
        let diaDom = i < 15 ? 17 + i : i - 14;
        daysHtml += `<button class="ht-btn-jump-day" onclick="ht_setDia(${i})">⮞ Día ${diaNum} (${diaDom} ${mes})</button>`;
    }

    const htStyle = document.createElement("style");
    htStyle.innerHTML = `
        /* Contenedor Maestro por defecto a 9999 (por debajo del Fray de producción) */
        #ht-master-wrapper {
            position: fixed; bottom: 10px; right: 10px; z-index: 9999 !important;
            display: flex; flex-direction: column; align-items: flex-end;
        }

        #hacktester-panel {
            background: rgba(0,0,0,0.9); border: 2px solid #00ff00; color: #00ff00; 
            padding: 15px; font-family: monospace; font-size: 12px; display: none; 
            width: 250px; border-radius: 8px; box-shadow: 0 0 15px #00ff00; overflow: visible;
            margin-bottom: 15px; 
        }
        
        #ht-master-wrapper:hover #hacktester-panel { display: block; }

        #hacktester-panel h3 { margin: 0 0 10px 0; border-bottom: 1px solid #00ff00; padding-bottom: 5px; text-align: center; font-size: 14px; }
        #hacktester-panel b { color: #fff; display: block; margin-top: 10px; }
        .ht-row { display: flex; gap: 5px; margin: 5px 0; }
        .ht-row-mb { display: flex; gap: 5px; margin-bottom: 10px; }
        .ht-btn { flex-grow: 1; padding: 5px; cursor: pointer; font-family: monospace; font-weight: bold; border-radius: 3px; }
        .ht-btn-cab { background: #111; color: #0f0; border: 1px solid #0f0; }
        .ht-btn-mer { background: #111; color: #ffaa00; border: 1px solid #ffaa00; }
        .ht-btn-dmg { background: #4a0000; color: #fff; border: 1px solid #ff4c4c; }
        .ht-btn-heal { background: #004a00; color: #fff; border: 1px solid #88ff88; }
        .ht-btn-fe { background: #111; color: #1e90ff; border: 1px solid #1e90ff; }
        
        .ht-btn-trib { background: #111; color: #ff4c4c; border: 1px solid #ff4c4c; transition: 0.2s; }
        .ht-btn-trib:hover { background: #300; }
        
        .ht-btn-verfe { background: #111; color: #d05ce3; border: 1px solid #d05ce3; transition: 0.2s; }
        .ht-btn-verfe:hover { background: #4a004a; }

        .ht-label { display: flex; align-items: center; justify-content: flex-start; gap: 8px; margin: 5px 0; background: #222; padding: 5px; border: 1px solid #aaa; color: #aaa; cursor: pointer; text-align: left; border-radius: 3px; }
        .ht-label-cyan { border-color: #0ff; color: #0ff; font-weight: bold; }
        .ht-label-orange { border-color: #ff8c00; color: #ff8c00; font-weight: bold; }
        .ht-label-yellow { border-color: #ff0; color: #ff0; }
        .ht-label-red { border-color: #ff4c4c; color: #ff4c4c; font-weight: bold; }
        
        .ht-dropdown-nav { position: relative; background: #111; border: 1px solid #f0f; margin-bottom: 10px; border-radius: 3px; margin-top: 10px; }
        .ht-nav-title { padding: 8px; color: #f0f; font-weight: bold; cursor: help; text-align: center; }
        .ht-nav-content { display: none; position: absolute; right: 100%; bottom: -1px; background: #000; border: 1px solid #555; border-radius: 3px; white-space: nowrap; z-index: 10001; }
        .ht-dropdown-nav:hover > .ht-nav-content { display: block; }
        
        .ht-dropdown-nav-time { position: relative; background: #111; border: 1px solid #00e5ff; border-radius: 3px; flex: 1; }
        .ht-dropdown-nav-time .ht-nav-title { padding: 8px; color: #00e5ff; font-weight: bold; cursor: help; text-align: center; font-size: 11.5px; }
        .ht-dropdown-nav-time .ht-nav-content { display: none; position: absolute; right: 100%; bottom: -1px; background: #000; border: 1px solid #00e5ff; border-radius: 3px; white-space: nowrap; z-index: 10001; }
        .ht-dropdown-nav-time:hover > .ht-nav-content { display: block; }
        .ht-btn-jump-time { display: block; box-sizing: border-box; width: 100%; margin: 0 0 5px 0; background: #111; color: #00e5ff; border: 1px solid #008899; padding: 8px 15px; cursor: pointer; font-family: monospace; border-radius: 2px; text-align: left; transition: 0.2s; white-space: nowrap; }
        .ht-btn-jump-time:last-child { margin-bottom: 0; }
        .ht-btn-jump-time:hover { background: #003344; border-color: #00e5ff; color: #fff; transform: translateX(-3px); }

        .ht-dropdown-nav-day { position: relative; background: #111; border: 1px solid #a3d9a5; border-radius: 3px; flex: 1; }
        .ht-dropdown-nav-day .ht-nav-title { padding: 8px; color: #a3d9a5; font-weight: bold; cursor: help; text-align: center; font-size: 11.5px; }
        .ht-dropdown-nav-day .ht-nav-content { display: none; position: absolute; right: 100%; bottom: -1px; background: #000; border: 1px solid #a3d9a5; border-radius: 3px; white-space: nowrap; z-index: 10001; max-height: 250px; overflow-y: auto; overflow-x: hidden; }
        .ht-dropdown-nav-day .ht-nav-content::-webkit-scrollbar { width: 5px; }
        .ht-dropdown-nav-day .ht-nav-content::-webkit-scrollbar-thumb { background: #a3d9a5; border-radius: 3px; }
        .ht-dropdown-nav-day:hover > .ht-nav-content { display: block; }
        .ht-btn-jump-day { display: block; box-sizing: border-box; width: 100%; margin: 0 0 5px 0; background: #111; color: #a3d9a5; border: 1px solid #4a754a; padding: 8px 15px; cursor: pointer; font-family: monospace; border-radius: 2px; text-align: left; transition: 0.2s; white-space: nowrap; }
        .ht-btn-jump-day:last-child { margin-bottom: 0; }
        .ht-btn-jump-day:hover { background: #1a331a; border-color: #a3d9a5; color: #fff; transform: translateX(-3px); }

        .ht-nested { position: relative; border-top: 1px solid #333; }
        .ht-nested:first-child { border-top: none; }
        .ht-nested-title { padding: 8px 15px; color: #888; cursor: default; font-weight: bold; text-align: right; transition: 0.2s; white-space: nowrap; }
        .ht-nested-title:hover { color: #bbb; background: #1a1a1a; }
        .ht-nested-title.clickable { color: #f0f; cursor: pointer; }
        .ht-nested-title.clickable:hover { color: #fff; background: #303; }
        .ht-nested-content { display: none; position: absolute; right: 100%; bottom: -1px; background: #111; border: 1px solid #555; padding: 5px; border-radius: 3px; white-space: nowrap; }
        .ht-nested:hover > .ht-nested-content { display: block; }
        .ht-btn-jump2 { display: block; box-sizing: border-box; width: 100%; margin: 0 0 5px 0; background: #111; color: #f0f; border: 1px solid #505; padding: 8px 15px; cursor: pointer; font-family: monospace; border-radius: 2px; text-align: left; transition: 0.2s; white-space: nowrap; }
        .ht-btn-jump2:last-child { margin-bottom: 0; }
        .ht-btn-jump2:hover { background: #303; border-color: #f0f; color: #fff; transform: translateX(-3px); }

        #btn-open-ht { background: #000; border: 2px solid #00ff00; color: #00ff00; padding: 10px; border-radius: 50%; font-size: 16px; cursor: help; box-shadow: 0 0 10px #00ff00; transition: 0.2s; }
        #ht-master-wrapper:hover #btn-open-ht { background: #111; transform: scale(1.1); }
    `;
    document.head.appendChild(htStyle);

    const htContainer = document.createElement("div");
    htContainer.innerHTML = `
        <div id="ht-master-wrapper">
            <div id="hacktester-panel">
                <h3>🛠️ MODO TESTER</h3>
                
                <b>[TROPAS NOBLES]</b>
                <div class="ht-row"><button class="ht-btn ht-btn-cab" onclick="ht_addTropa('caballero_noble')">+ Cab.</button><button class="ht-btn ht-btn-cab" onclick="ht_removeTropa('caballero_noble')">- Cab.</button></div>
                <div class="ht-row"><button class="ht-btn ht-btn-cab" onclick="ht_addTropa('piquero_noble')">+ Piq.</button><button class="ht-btn ht-btn-cab" onclick="ht_removeTropa('piquero_noble')">- Piq.</button></div>
                <div class="ht-row-mb"><button class="ht-btn ht-btn-cab" onclick="ht_addTropa('ballestero_noble')">+ Ball.</button><button class="ht-btn ht-btn-cab" onclick="ht_removeTropa('ballestero_noble')">- Ball.</button></div>
                
                <b>[TROPAS MERCENARIAS]</b>
                <div class="ht-row"><button class="ht-btn ht-btn-mer" onclick="ht_addTropa('caballero_mercenario')">+ Cab.</button><button class="ht-btn ht-btn-mer" onclick="ht_removeTropa('caballero_mercenario')">- Cab.</button></div>
                <div class="ht-row"><button class="ht-btn ht-btn-mer" onclick="ht_addTropa('piquero_mercenario')">+ Piq.</button><button class="ht-btn ht-btn-mer" onclick="ht_removeTropa('piquero_mercenario')">- Piq.</button></div>
                <div class="ht-row-mb"><button class="ht-btn ht-btn-mer" onclick="ht_addTropa('ballestero_mercenario')">+ Ball.</button><button class="ht-btn ht-btn-mer" onclick="ht_removeTropa('ballestero_mercenario')">- Ball.</button></div>

                <b>[SALUD DEL EJÉRCITO]</b>
                <div class="ht-row-mb"><button class="ht-btn ht-btn-dmg" onclick="ht_modVidasGeneral(-1)">-1 Vida</button><button class="ht-btn ht-btn-heal" onclick="ht_modVidasGeneral(1)">+1 Vida</button></div>
                
                <b>[RECURSOS Y FE]</b>
                <div class="ht-row"><button class="ht-btn ht-btn-mer" onclick="ht_addDenarios(50)">+50 Den.</button><button class="ht-btn ht-btn-mer" onclick="ht_addDenarios(-10)">-10 Den.</button></div>
                <div class="ht-row-mb"><button class="ht-btn ht-btn-fe" onclick="ht_modFe(50)">+50 Fe</button><button class="ht-btn ht-btn-fe" onclick="ht_modFe(-10)">-10 Fe</button></div>

                <b>[EVENTOS Y ESTADO]</b>
                <div class="ht-row-mb">
                    <button class="ht-btn ht-btn-trib" onclick="ht_lanzarTribulacion()">Lanza Trib.</button>
                    <button class="ht-btn ht-btn-verfe" onclick="ht_mostrarFeActual()">Fe Actual</button>
                </div>

                <b style="display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                    <input type="checkbox" onclick="ht_toggleAllSettings(this.checked)" style="cursor:pointer; transform: scale(1.2);" title="Marcar/Desmarcar Todos"> 
                    <span>[AJUSTES Y ESCENAS]</span>
                </b>
                <label class="ht-label ht-label-yellow"><input type="checkbox" id="ht-top-layer" class="ht-ajuste-cb" onchange="ht_toggleTopLayer(this.checked)"> 👑 Panel Supremo</label>
                <label class="ht-label ht-label-cyan"><input type="checkbox" id="ht-auto-fill" class="ht-ajuste-cb"> 🎲 Auto-Despliegue Aleatorio</label>
                <label class="ht-label ht-label-orange"><input type="checkbox" id="ht-auto-combat" class="ht-ajuste-cb"> ⚡ Combate Automático</label>
                <label class="ht-label ht-label-yellow" style="color: #ff0; border-color: #ff0;"><input type="checkbox" id="ht-skip-cine" class="ht-ajuste-cb"> 🎬 Omitir Cinemáticas</label>
                <label class="ht-label"><input type="checkbox" id="ht-textos-planos" class="ht-ajuste-cb"> 📜 Textos Planos (Sin VN)</label>
                <label class="ht-label ht-label-red"><input type="checkbox" id="ht-disable-popups" class="ht-ajuste-cb"> 🚫 Omitir Emergentes</label>

                <div style="display: flex; gap: 5px; margin-top: 10px; margin-bottom: 10px;">
                    <div class="ht-dropdown-nav-time">
                        <div class="ht-nav-title">⏳ Hora...</div>
                        <div class="ht-nav-content">
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Laudes')">⮞ Laudes</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Prima')">⮞ Prima</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Tercia')">⮞ Tercia</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Sexta')">⮞ Sexta</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Nona')">⮞ Nona</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Vísperas')">⮞ Vísperas</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Completas')">⮞ Completas</button>
                        </div>
                    </div>

                    <div class="ht-dropdown-nav-day">
                        <div class="ht-nav-title">📅 Día...</div>
                        <div class="ht-nav-content">
                            ${daysHtml}
                        </div>
                    </div>
                </div>

                <div class="ht-dropdown-nav">
                    <div class="ht-nav-title">⏴ Salto a...</div>
                    <div class="ht-nav-content">
                        <div class="ht-nested">
                            <div class="ht-nested-title">⏴ Capítulo 1</div>
                            <div class="ht-nested-content">
                                <div class="ht-nested">
                                    <div class="ht-nested-title clickable" onclick="ht_jumpTo('opciones_cap1')" title="Clic para saltar, Hover para sub-opciones">⏴ Decisión del Puente</div>
                                    <div class="ht-nested-content">
                                        <div class="ht-nested">
                                            <div class="ht-nested-title">⏴ Opción I</div>
                                            <div class="ht-nested-content">
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('muro_picas')">⮞ Muro de Picas (4T)</button>
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('repliegue')">⮞ Ballesteros+Picas</button>
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('bosque_victoria')">⮞ Victoria</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button id="btn-open-ht">🛠️</button>
        </div>
    `;
    document.body.appendChild(htContainer);
});

// 2. LÓGICA DEL HACKTESTER

function ht_toggleTopLayer(estado) {
    let wrapper = document.getElementById("ht-master-wrapper");
    if (estado) {
        wrapper.style.setProperty("z-index", "2147483647", "important");
        window.ht_topLayerInterval = setInterval(() => {
            let fray = document.getElementById("fray-rezo-overlay");
            if (fray) {
                fray.style.setProperty("z-index", "2147483646", "important");
            }
        }, 200);
    } else {
        if (window.ht_topLayerInterval) clearInterval(window.ht_topLayerInterval);
        wrapper.style.setProperty("z-index", "9999", "important");
        let fray = document.getElementById("fray-rezo-overlay");
        if (fray) {
            fray.style.setProperty("z-index", "2147483647", "important");
        }
    }
}

function ht_lanzarTribulacion() {
    ht_checkInit();
    if (typeof dispararTribulacionAleatoria === 'function') {
        dispararTribulacionAleatoria();
    } else {
        alert("Error: No se detectó la función 'dispararTribulacionAleatoria' de motor.js/tribulaciones.js.");
    }
}

function ht_mostrarFeActual() {
    ht_checkInit();
    if (typeof obtenerEstadoFe === 'function' && typeof mostrarAvisoFe === 'function') {
        let info = obtenerEstadoFe();
        mostrarAvisoFe(info);
    } else {
        alert("Error: No se detectaron las funciones 'obtenerEstadoFe' y 'mostrarAvisoFe' nativas en motor.js.");
    }
}

function ht_toggleAllSettings(estado) {
    document.querySelectorAll('.ht-ajuste-cb').forEach(cb => {
        cb.checked = estado;
        if(cb.id === "ht-top-layer") ht_toggleTopLayer(estado);
    });
}

function ht_checkInit() {
    if(!jugador.nombre || jugador.nombre === "Recluta Anónimo" || jugador.nombre === "...") {
        jugador.nombre = "Lord Tester";
        jugador.orden = "Santísima Trinidad";
        
        jugador.liderazgo = 0; 
        jugador.liderazgoBase = 0; 
        jugador.denarios = 0; 
        jugador.ataqueReal = 0;
        jugador.defensaReal = 0;
        jugador.ataqueBase = 0;
        jugador.defensaBase = 0;
        
        if(!jugador.tropas.find(t => t.idTipo === "explorador_unico")){
            agregarTropa("explorador_unico", 1);
        }
        
        if(jugador.tropas.filter(t => t.tipoGeneral === "caballeros").length === 0) {
            agregarTropa("caballero_noble", 5);
        }
        if(jugador.tropas.filter(t => t.tipoGeneral === "piqueros").length === 0) {
            agregarTropa("piquero_noble", 6);
        }
        if(jugador.tropas.filter(t => t.tipoGeneral === "ballesteros").length === 0) {
            agregarTropa("ballestero_noble", 9);
        }
    }

    inventarioDesbloqueado = true;
    tiendaDesbloqueada = true; 
    let flecha = document.getElementById("flecha-inventario");
    if(flecha) flecha.style.display = "inline";
    
    let iconoOrden = document.getElementById("icono-orden");
    if(iconoOrden) { 
        iconoOrden.src = "assets/img/ui/cruz_trinidad.webp"; 
        iconoOrden.style.display = "inline-block"; 
    }

    document.querySelectorAll('.estandarte').forEach(el => el.style.display = 'block');
    
    let emblemaIzq = document.getElementById("emblema-izq"); 
    let emblemaDer = document.getElementById("emblema-der");
    if (emblemaIzq && emblemaDer) { 
        emblemaIzq.src = "assets/img/ui/cruz_trinidad.webp"; 
        emblemaDer.src = "assets/img/ui/cruz_trinidad.webp"; 
    }

    if (typeof RelojDivino !== 'undefined' && RelojDivino.indiceActual === -1) {
        RelojDivino.iniciar();
    }

    if(typeof actualizarHUD === "function") actualizarHUD();
}

function ht_addTropa(tipo) {
    agregarTropa(tipo, 1);
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Añadido 1 " + tipo);
}

function ht_removeTropa(tipo) {
    if(jugador && jugador.tropas) {
        let indicesCompatibles = [];
        jugador.tropas.forEach((t, index) => {
            if(t.idTipo === tipo) indicesCompatibles.push(index);
        });

        if(indicesCompatibles.length > 0) {
            let randomIndex = indicesCompatibles[Math.floor(Math.random() * indicesCompatibles.length)];
            let removida = jugador.tropas.splice(randomIndex, 1)[0];
            
            if(typeof actualizarHUD === "function") actualizarHUD();
            console.log("HackTester: Eliminada 1 unidad de tipo " + tipo + " (" + removida.nombre + ")");
        } else {
            console.log("HackTester: No hay tropas de tipo " + tipo + " en la campaña para eliminar.");
        }
    }
}

function ht_addDenarios(cant) {
    jugador.denarios += cant;
    if (jugador.denarios < 0) jugador.denarios = 0; 
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Tesorería actualizada. Total: " + jugador.denarios);
}

function ht_modFe(cant) {
    jugador.liderazgo += cant;
    jugador.liderazgoBase += cant;
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Moral (Fe) actualizada. Total: " + jugador.liderazgo);
}

function ht_modVidasGeneral(cantidad) {
    if(jugador && jugador.tropas) {
        jugador.tropas.forEach(t => {
            t.hp += cantidad;
            if(t.hp > 2) t.hp = 2; 
            if(t.hp < 0) t.hp = 0; 
        });
        if(typeof actualizarHUD === "function") actualizarHUD();
        
        document.querySelectorAll('.tropa-draggable').forEach(el => {
            let id = el.id.replace('drag-', '');
            let tropa = jugador.tropas.find(tr => tr.idUnico === id);
            if (tropa) {
                let hpContainer = el.querySelector('.unidad-hp-combate');
                if (hpContainer) {
                    hpContainer.innerHTML = "❤️".repeat(Math.max(0, tropa.hp)) + "🖤".repeat(2 - Math.max(0, tropa.hp));
                }
            }
        });
        console.log("HackTester: Salud del ejército modificada en " + cantidad);
    }
}

function ht_setReloj(hora) {
    ht_checkInit();
    if (typeof RelojDivino !== 'undefined') {
        RelojDivino.marchaIniciada = true; 
        
        let index = RelojDivino.horas.indexOf(hora);
        if (index !== -1) {
            RelojDivino.indiceActual = index - 1;
            RelojDivino.avanzarHora(); 
            if (!RelojDivino.intervalo) RelojDivino.reanudar(); 
            console.log("HackTester: El flujo del tiempo ha sido forzado a " + hora);
        }
    } else {
        console.log("HackTester: El RelojDivino no está activo aún.");
    }
}

function ht_setDia(diaIndex) {
    ht_checkInit();
    if (typeof RelojDivino !== 'undefined') {
        RelojDivino.marchaIniciada = true; 
        RelojDivino.diaActualIndex = diaIndex - 1;
        RelojDivino.indiceActual = 4; // Nona
        RelojDivino.avanzarHora(); // Salta a Vísperas y procesa el cambio de día
        if (!RelojDivino.intervalo) RelojDivino.reanudar();
        console.log("HackTester: El flujo del tiempo ha sido forzado al Día " + (diaIndex + 1) + " en Vísperas.");
    } else {
        console.log("HackTester: El RelojDivino no está activo aún.");
    }
}

function ht_jumpTo(destino) {
    ht_checkInit();
    
    if (typeof RelojDivino !== 'undefined') {
        RelojDivino.marchaIniciada = true;
    }
    
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    if(typeof AudioManager !== "undefined" && AudioManager.bgmActual) {
        AudioManager.bgmActual.pause();
    }
    
    // FIX TÁCTICO: Limpieza rigurosa del clima antes de cualquier salto.
    if (typeof window.Clima !== "undefined" && typeof window.Clima.detenerTodo === "function") {
        window.Clima.detenerTodo();
    }
    
    if(typeof limpiarBotones === "function") limpiarBotones();
    let storyArea = document.getElementById("story-area");
    if(storyArea) storyArea.innerHTML = "";
    let formOverlay = document.getElementById("formacion-overlay");
    if(formOverlay) formOverlay.style.display = "none";
    
    let animCaja = document.getElementById("animacion-escena1");
    if(animCaja) {
         animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')";
         animCaja.style.backgroundSize = "cover";
         animCaja.style.backgroundPosition = "center bottom";
    }

    if(destino === 'opciones_cap1') {
        if(typeof mostrarOpcionesCapitulo1 === "function") mostrarOpcionesCapitulo1();
    } else if (destino === 'muro_picas') {
        if(typeof ruta_IA_Victoria_Cuna === "function") ruta_IA_Victoria_Cuna();
    } else if (destino === 'repliegue') {
        if(typeof nodo_IA_Victoria === "function") nodo_IA_Victoria();
    } else if (destino === 'bosque_victoria') {
        jugador.enemigosObjetivo = 50;
        jugador.enemigosAsesinados = 50;
        
        if (typeof playCinematicaVictoria === 'function') {
            let callback = (typeof iniciarParlamentoBosque === 'function') ? iniciarParlamentoBosque : () => { console.log("Cinemática completada"); };
            playCinematicaVictoria(callback);
        } else if (typeof evaluarVictoriaDerrotaBosque === 'function') {
            evaluarVictoriaDerrotaBosque();
        }
    }

    // FIX TÁCTICO: Asignación inmersiva de música y clima para cada escena
    setTimeout(() => {
        if (typeof AudioManager !== "undefined") {
            const escenasCap1 = ['opciones_cap1', 'muro_picas', 'repliegue', 'bosque_victoria'];
            const escenasCap2 = ['inicio_cap2', 'opciones_cap2']; 
            
            if (escenasCap1.includes(destino)) {
                // Inicia la música épica por ID, sin importar en qué punto del archivo esté declarada
                AudioManager.playBGM('bgm-juego');
                
                // Asigna el clima exacto según la etapa del Capítulo 1
                if (typeof window.Clima !== "undefined") {
                    if (destino === 'repliegue' || destino === 'bosque_victoria') {
                        if (typeof window.Clima.iniciarLluvia === "function") window.Clima.iniciarLluvia();
                    } else if (destino === 'muro_picas') {
                        if (typeof window.Clima.iniciarVientoRayo === "function") window.Clima.iniciarVientoRayo();
                    } else {
                        if (typeof window.Clima.iniciarViento === "function") window.Clima.iniciarViento();
                    }
                }
            } else if (escenasCap2.includes(destino)) {
                AudioManager.playBGM('bgm-cap2'); // Reserva para el futuro Capítulo 2
            }
        }
    }, 150);
}