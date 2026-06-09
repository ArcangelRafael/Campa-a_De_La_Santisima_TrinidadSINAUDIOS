/* === HACKTESTER.JS - HERRAMIENTAS DE DESARROLLADOR === */

// 1. INYECCIÓN DINÁMICA DE LA INTERFAZ Y CSS
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("ht-master-wrapper")) return; // Previene inyecciones dobles

    let daysHtml = '';
    for(let i=0; i<21; i++) {
        let diaNum = i+1;
        let mes = i < 15 ? "Dic" : "Ene";
        let diaDom = i < 15 ? 17 + i : i - 14;
        daysHtml += `<button class="ht-btn-jump-day" onclick="ht_setDia(${i})">Día ${diaNum} (${diaDom} ${mes})</button>`;
    }

    const htStyle = document.createElement("style");
    htStyle.innerHTML = `
        /* Contenedor Maestro por defecto a 9999 (por debajo del Fray de producción) */
        #ht-master-wrapper {
            position: fixed; bottom: 10px; right: 10px; z-index: 9999 !important;
            display: flex; flex-direction: column; align-items: flex-end;
        }

        /* Panel maestro visible para no cortar los acordeones */
        #hacktester-panel {
            background: rgba(0,0,0,0.9); border: 2px solid #00ff00; color: #00ff00; 
            padding: 15px; font-family: monospace; font-size: 12px; display: none; 
            width: 280px; border-radius: 8px; box-shadow: 0 0 15px #00ff00; 
            overflow: visible; margin-bottom: 15px; position: relative;
        }
        
        #ht-master-wrapper:hover #hacktester-panel { display: block; }

        /* PANEL DE TROPA INDIVIDUAL (Alineado hasta arriba a la izquierda del maestro) */
        #ht-tropa-panel {
            position: absolute; right: 310px; top: 0;
            background: rgba(0,0,0,0.95); border: 2px solid #00ff00; color: #00ff00;
            padding: 15px; width: 300px; border-radius: 8px; box-shadow: 0 0 15px #00ff00;
            display: none; flex-direction: column; max-height: 80vh;
        }

        /* Zona de scroll interna exclusiva para los botones */
        .ht-scroll-zone {
            max-height: 55vh; overflow-y: auto; overflow-x: hidden; 
            padding-right: 8px; margin-bottom: 10px;
            border-bottom: 1px dashed rgba(0, 255, 0, 0.4); padding-bottom: 10px;
        }
        .ht-scroll-zone::-webkit-scrollbar { width: 5px; }
        .ht-scroll-zone::-webkit-scrollbar-thumb { background: #00ff00; border-radius: 3px; }

        #hacktester-panel h3, #ht-tropa-panel h3 { margin: 0 0 10px 0; border-bottom: 1px solid #00ff00; padding-bottom: 5px; text-align: center; font-size: 14px; }
        #hacktester-panel b { color: #fff; display: block; margin-top: 10px; }
        
        .ht-row { display: flex; gap: 5px; margin: 5px 0; align-items: center; justify-content: space-between;}
        .ht-row-mb { display: flex; gap: 5px; margin-bottom: 10px; align-items: center; justify-content: space-between;}
        
        .ht-btn { flex-grow: 1; padding: 5px; cursor: pointer; font-family: monospace; font-weight: bold; border-radius: 3px; text-align:center; }
        .ht-btn-cab { background: #111; color: #0f0; border: 1px solid #0f0; }
        .ht-btn-cab:hover { background: #050; }
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
        
        .ht-tropa-item { background: #111; border: 1px dashed #050; padding: 5px; margin-bottom: 3px; cursor: pointer; color:#0f0; }
        .ht-tropa-item:hover { background: #050; }
        
        .ht-dropdown-nav { position: relative; background: #111; border: 1px solid #f0f; border-radius: 3px; }
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
        <div id="ht-master-wrapper" onmouseleave="ht_closeTropaPanel()">
            
            <div id="ht-tropa-panel" onmouseleave="ht_closeTropaPanel()">
                <h3>🔎 INSPECCIÓN AISLADA</h3>
                <input type="text" id="ht-tropa-buscar" placeholder="Buscar por nombre..." onkeyup="ht_actualizarListaTropas()" style="width:100%; box-sizing:border-box; margin-bottom:5px; background:#000; color:#0f0; border:1px solid #0f0; padding:5px;">
                <select id="ht-tropa-filtro" onchange="ht_actualizarListaTropas()" style="width:100%; box-sizing:border-box; margin-bottom:10px; background:#000; color:#0f0; border:1px solid #0f0; padding:5px;">
                    <option value="todos">Todas las Unidades</option>
                    <option value="caballeros">Caballeros</option>
                    <option value="piqueros">Piqueros</option>
                    <option value="ballesteros">Ballesteros</option>
                    <option value="especiales">Especiales (Cmd/Fraile)</option>
                </select>
                <div id="ht-tropa-lista" class="ht-scroll-zone" style="max-height: 140px;"></div>
                <div id="ht-tropa-detalles" style="display:none; margin-top:10px; border-top: 1px dashed #0f0; padding-top: 10px;"></div>
                
                <div id="ht-afectados-list" style="margin-top:10px; border-top:1px solid #0f0; padding-top:10px; display:none;">
                    <b style="color:#fff; margin-bottom:5px; display:block;">Lista de Inamovibles:</b>
                    <div id="ht-afectados-nombres" style="color:#aaa; font-size:11px;"></div>
                </div>
            </div>

            <div id="hacktester-panel">
                <h3>⚙️ MODO TESTER</h3>
                
                <div class="ht-scroll-zone">
                    <b>[INSPECCIÓN DE UNIDAD]</b>
                    <div class="ht-row-mb">
                        <button class="ht-btn ht-btn-cab" onmouseenter="ht_openTropaPanel()">🔎 TROPA INDIVIDUAL</button>
                    </div>

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

                    <b>[LOGÍSTICA Y SUMINISTROS]</b>
                    <div class="ht-row">
                        <button class="ht-btn ht-btn-mer" onclick="ht_addLotePan()">+10 Pan</button>
                        <button class="ht-btn ht-btn-fe" style="border-color:#4c88ff; color:#4c88ff;" onclick="ht_addLoteCerveza()">+4 Cerveza</button>
                    </div>
                    <div class="ht-row-mb" style="gap: 2px;">
                        <button class="ht-btn ht-btn-dmg" style="padding:5px 2px;" onclick="ht_modHambre(-1)">-1🍞</button>
                        <button class="ht-btn ht-btn-heal" style="padding:5px 2px;" onclick="ht_modHambre(1)">+1🍞</button>
                        <button class="ht-btn ht-btn-dmg" style="border-color:#4c88ff; background:#1a3055; padding:5px 2px;" onclick="ht_modSed(-1)">-1🍺</button>
                        <button class="ht-btn ht-btn-fe" style="border-color:#4c88ff; background:#214073; color:#fff; padding:5px 2px;" onclick="ht_modSed(1)">+1🍺</button>
                    </div>

                    <b>[EVENTOS Y ESTADO]</b>
                    <div class="ht-row-mb">
                        <button class="ht-btn ht-btn-trib" onclick="ht_lanzarTribulacion()">Lanza Trib.</button>
                        <button class="ht-btn ht-btn-verfe" onclick="ht_mostrarFeActual()">Fe Actual</button>
                    </div>

                    <b style="display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                        <input type="checkbox" onclick="ht_toggleAllSettings(this.checked)" style="cursor:pointer; transform: scale(1.2);" title="Marcar/Desmarcar Todos"> 
                        <span>[AJUSTES Y ESCENAS]</span>
                    </b>
                    <label class="ht-label"><input type="checkbox" id="ht-mute-audio" class="ht-ajuste-cb" onchange="ht_toggleMute(this.checked)"> 🔇 Mutear Todo el Juego</label>
                    <label class="ht-label ht-label-yellow"><input type="checkbox" id="ht-top-layer" class="ht-ajuste-cb" onchange="ht_toggleTopLayer(this.checked)"> 👑 Panel Supremo</label>
                    <label class="ht-label ht-label-yellow"><input type="checkbox" id="ht-sin-vidas-perdidas" class="ht-ajuste-cb"> 🛡️ Sin Perder Vidas (Global)</label>
                    <label class="ht-label ht-label-yellow"><input type="checkbox" id="ht-sin-hambre" class="ht-ajuste-cb"> 🍞 Sin Hambre (Inmune)</label>
                    <label class="ht-label ht-label-cyan"><input type="checkbox" id="ht-sin-sed" class="ht-ajuste-cb"> 🍺 Sin Sed (Inmune)</label>
                    <label class="ht-label ht-label-cyan"><input type="checkbox" id="ht-auto-fill" class="ht-ajuste-cb"> ⚡ Auto-Despliegue</label>
                    <label class="ht-label ht-label-orange"><input type="checkbox" id="ht-auto-combat" class="ht-ajuste-cb"> ⚔️ Combate Automático</label>
                    <label class="ht-label ht-label-yellow" style="color: #ff0; border-color: #ff0;"><input type="checkbox" id="ht-skip-cine" class="ht-ajuste-cb"> ⏭️ Omitir Cinemáticas</label>
                    <label class="ht-label"><input type="checkbox" id="ht-textos-planos" class="ht-ajuste-cb"> 📜 Textos Planos</label>
                    <label class="ht-label ht-label-red"><input type="checkbox" id="ht-disable-popups" class="ht-ajuste-cb"> 🚫 Omitir Emergentes</label>
                </div>

                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <div class="ht-dropdown-nav-time">
                        <div class="ht-nav-title">⏳ Hora...</div>
                        <div class="ht-nav-content">
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Laudes')">🌅 Laudes</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Prima')">☀️ Prima</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Tercia')">🌤️ Tercia</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Sexta')">🌞 Sexta</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Nona')">🌥️ Nona</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Vísperas')">🌇 Vísperas</button>
                            <button class="ht-btn-jump-time" onclick="ht_setReloj('Completas')">🌙 Completas</button>
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
                    <div class="ht-nav-title">⏭️ Salto a...</div>
                    <div class="ht-nav-content">
                        <div class="ht-nested">
                            <div class="ht-nested-title">📖 Capítulo 1</div>
                            <div class="ht-nested-content">
                                <div class="ht-nested">
                                    <div class="ht-nested-title clickable" onclick="ht_jumpTo('opciones_cap1')" title="Clic para saltar, Hover para sub-opciones">🔀 Decisión del Puente</div>
                                    <div class="ht-nested-content">
                                        <div class="ht-nested">
                                            <div class="ht-nested-title">🛡️ Opción I</div>
                                            <div class="ht-nested-content">
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('muro_picas')">⚔️ Muro de Picas (4T)</button>
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('repliegue')">🏹 Ballesteros+Picas</button>
                                                <button class="ht-btn-jump2" onclick="ht_jumpTo('bosque_victoria')">👑 Victoria</button>
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

// =========================================================================
// LÓGICA DE TROPA INDIVIDUAL Y SEGUIMIENTO (DOBLE CIERRE & HOVER MAGIC)
// =========================================================================

window.ht_closeTropaPanel = function() {
    let panel = document.getElementById('ht-tropa-panel');
    if (panel) panel.style.display = 'none';
};

window.ht_openTropaPanel = function() {
    let panel = document.getElementById("ht-tropa-panel");
    if(panel) {
        panel.style.display = "flex";
        ht_actualizarListaTropas();
        ht_actualizarAfectados();
    }
};

window.ht_actualizarAfectados = function() {
    if (!jugador) return;
    
    let lista = [];
    if (jugador.comandantes) lista = lista.concat(jugador.comandantes);
    if (jugador.tropas) lista = lista.concat(jugador.tropas);

    // Solo entran los que tengan un candado inamovible marcado
    let afectados = lista.filter(t => t.hpInamovible || t.hambreInamovible || t.sedInamovible || t.atkInamovible || t.defInamovible);

    let divContenedor = document.getElementById("ht-afectados-list");
    let spanNombres = document.getElementById("ht-afectados-nombres");

    if (afectados.length > 0) {
        divContenedor.style.display = "block";
        spanNombres.innerHTML = "";
        
        afectados.forEach(t => {
            let btn = document.createElement("div");
            btn.style.cssText = "color:#aaa; font-size:12px; cursor:pointer; padding:4px 0; border-bottom:1px solid #222; transition: 0.2s;";
            btn.innerHTML = `• <b style="color:#0ff;">${t.nombre}</b> [Abrir Ajustes]`;
            btn.onmouseover = () => btn.style.background = "#050";
            btn.onmouseout = () => btn.style.background = "transparent";
            btn.onclick = () => ht_seleccionarTropa(t.idUnico);
            spanNombres.appendChild(btn);
        });
    } else {
        divContenedor.style.display = "none";
        spanNombres.innerHTML = "";
    }
};

window.ht_actualizarListaTropas = function() {
    if (!jugador || (!jugador.tropas && !jugador.comandantes)) return;
    
    let filtroClase = document.getElementById("ht-tropa-filtro").value;
    let busqueda = document.getElementById("ht-tropa-buscar").value.toLowerCase();
    
    let lista = [];
    if (jugador.comandantes) lista = lista.concat(jugador.comandantes);
    if (jugador.tropas) lista = lista.concat(jugador.tropas);
    
    let result = lista.filter(t => {
        if (t.hp <= 0) return false;
        if (busqueda && !t.nombre.toLowerCase().includes(busqueda)) return false;
        
        if (filtroClase === "caballeros" && t.tipoGeneral !== "caballeros") return false;
        if (filtroClase === "piqueros" && t.tipoGeneral !== "piqueros") return false;
        if (filtroClase === "ballesteros" && t.tipoGeneral !== "ballesteros") return false;
        if (filtroClase === "especiales" && t.tipoGeneral !== "especial" && t.idTipo !== "comandante" && t.idTipo !== "sacerdote_unico") return false;
        
        return true;
    });

    let contenedor = document.getElementById("ht-tropa-lista");
    contenedor.innerHTML = "";
    
    if (result.length === 0) {
        contenedor.innerHTML = "<div style='color:#555; text-align:center;'>Ningún hermano coincide.</div>";
        return;
    }

    result.forEach(t => {
        let div = document.createElement("div");
        div.className = "ht-tropa-item";
        
        let tipoName = t.tipoGeneral ? t.tipoGeneral.toUpperCase() : t.idTipo.toUpperCase();
        let claseName = "ESPECIAL";
        if (t.clase === "noble") claseName = "NOBLE";
        else if (t.clase === "mercenaria") claseName = "MERCENARIO";
        else if (t.clase === "unico_random") claseName = "VIGÍA";
        
        div.innerText = `${t.nombre} [${tipoName} - ${claseName}]`;
        div.onclick = () => ht_seleccionarTropa(t.idUnico);
        contenedor.appendChild(div);
    });
};

window.ht_seleccionarTropa = function(idUnico) {
    let t = null;
    if (jugador.comandantes) t = jugador.comandantes.find(x => x.idUnico === idUnico);
    if (!t && jugador.tropas) t = jugador.tropas.find(x => x.idUnico === idUnico);
    
    let panel = document.getElementById("ht-tropa-detalles");
    if (!t) {
        panel.style.display = "none";
        return;
    }

    panel.style.display = "block";
    let h = t.hambre !== undefined ? t.hambre : 5;
    let s = t.sed !== undefined ? t.sed : 3;

    panel.innerHTML = `
        <div style="color:#fff; font-weight:bold; margin-bottom:10px; text-align:center;">${t.nombre}</div>
        
        <div class="ht-row-mb">
            <span style="width:40px; color:#ff4c4c;">HP:</span>
            <button class="ht-btn ht-btn-dmg" onclick="ht_modStatTropa('${t.idUnico}', 'hp', -1)">-</button>
            <span style="width:20px; text-align:center;">${t.hp}</span>
            <button class="ht-btn ht-btn-heal" onclick="ht_modStatTropa('${t.idUnico}', 'hp', 1)">+</button>
            <label style="margin-left:auto;"><input type="checkbox" onchange="ht_setLock('${t.idUnico}', 'hpInamovible', this.checked)" ${t.hpInamovible ? 'checked':''}> Inamov.</label>
        </div>
        <div class="ht-row-mb">
            <span style="width:40px; color:#d4af37;">Pan:</span>
            <button class="ht-btn ht-btn-dmg" onclick="ht_modStatTropa('${t.idUnico}', 'hambre', -1)">-</button>
            <span style="width:20px; text-align:center;">${h}</span>
            <button class="ht-btn ht-btn-heal" onclick="ht_modStatTropa('${t.idUnico}', 'hambre', 1)">+</button>
            <label style="margin-left:auto;"><input type="checkbox" onchange="ht_setLock('${t.idUnico}', 'hambreInamovible', this.checked)" ${t.hambreInamovible ? 'checked':''}> Inamov.</label>
        </div>
        <div class="ht-row-mb">
            <span style="width:40px; color:#4c88ff;">Sed:</span>
            <button class="ht-btn ht-btn-dmg" onclick="ht_modStatTropa('${t.idUnico}', 'sed', -1)">-</button>
            <span style="width:20px; text-align:center;">${s}</span>
            <button class="ht-btn ht-btn-heal" onclick="ht_modStatTropa('${t.idUnico}', 'sed', 1)">+</button>
            <label style="margin-left:auto;"><input type="checkbox" onchange="ht_setLock('${t.idUnico}', 'sedInamovible', this.checked)" ${t.sedInamovible ? 'checked':''}> Inamov.</label>
        </div>
        <div class="ht-row-mb">
            <span style="width:40px; color:#ffaa00;">Atk:</span>
            <button class="ht-btn ht-btn-dmg" onclick="ht_modStatTropa('${t.idUnico}', 'atkMax', -1)">-</button>
            <span style="width:20px; text-align:center;">${t.atkMax || 0}</span>
            <button class="ht-btn ht-btn-heal" onclick="ht_modStatTropa('${t.idUnico}', 'atkMax', 1)">+</button>
            <label style="margin-left:auto;"><input type="checkbox" onchange="ht_setLock('${t.idUnico}', 'atkInamovible', this.checked)" ${t.atkInamovible ? 'checked':''}> Inamov.</label>
        </div>
        <div class="ht-row-mb">
            <span style="width:40px; color:#0ff;">Def:</span>
            <button class="ht-btn ht-btn-dmg" onclick="ht_modStatTropa('${t.idUnico}', 'defMax', -1)">-</button>
            <span style="width:20px; text-align:center;">${t.defMax || 0}</span>
            <button class="ht-btn ht-btn-heal" onclick="ht_modStatTropa('${t.idUnico}', 'defMax', 1)">+</button>
            <label style="margin-left:auto;"><input type="checkbox" onchange="ht_setLock('${t.idUnico}', 'defInamovible', this.checked)" ${t.defInamovible ? 'checked':''}> Inamov.</label>
        </div>
    `;
};

window.ht_modStatTropa = function(idUnico, stat, delta) {
    let t = null;
    if (jugador.comandantes) t = jugador.comandantes.find(x => x.idUnico === idUnico);
    if (!t && jugador.tropas) t = jugador.tropas.find(x => x.idUnico === idUnico);
    if (!t) return;

    if (t[stat + "Inamovible"]) {
        console.log(`HackTester: Imposible modificar [${stat}], el atributo está marcado como INAMOVIBLE.`);
        return;
    }

    if (stat === 'hp') {
        t.hp += delta;
        if(t.hp < 0) t.hp = 0;
        let max = t.hpMax || 2;
        if(t.hp > max) t.hp = max;
    } else if (stat === 'hambre') {
        if(t.hambre === undefined) t.hambre = 5;
        t.hambre += delta;
        if(t.hambre < 0) t.hambre = 0;
        if(t.hambre > 5) t.hambre = 5;
    } else if (stat === 'sed') {
        if(t.sed === undefined) t.sed = 3;
        t.sed += delta;
        if(t.sed < 0) t.sed = 0;
        if(t.sed > 3) t.sed = 3;
    } else if (stat === 'atkMax') {
        t.atkMax = (t.atkMax || 0) + delta;
        if(t.atkMax < 0) t.atkMax = 0;
    } else if (stat === 'defMax') {
        t.defMax = (t.defMax || 0) + delta;
        if(t.defMax < 0) t.defMax = 0;
    }

    ht_seleccionarTropa(idUnico); 
    
    if (typeof actualizarHUD === "function") actualizarHUD();
    if (typeof renderizarMenuAlimentar === "function" && document.getElementById('alimentar-overlay')?.style.display === 'flex') {
        renderizarMenuAlimentar();
    }
    if (typeof generarRoster === "function" && document.getElementById('formacion-overlay')?.style.display === 'flex') {
        let tipo = window.formacionModoActivo === "cuna" ? "caballeros" : (window.formacionModoActivo === "sacrificio" ? "ballesteros" : "piqueros");
        let filtro = window.formacionModoActivo === "sacrificio" ? "noble" : null;
        generarRoster(tipo, filtro);
    }
};

window.ht_setLock = function(idUnico, statKey, isLocked) {
    let t = null;
    if (jugador.comandantes) t = jugador.comandantes.find(x => x.idUnico === idUnico);
    if (!t && jugador.tropas) t = jugador.tropas.find(x => x.idUnico === idUnico);
    if (!t) return;

    t[statKey] = isLocked;
    ht_actualizarAfectados(); // Re-evalúa la lista dinámicamente
    console.log(`HackTester: [${t.nombre}] -> ${statKey} establecido en ${isLocked}`);
};


// 2. LÓGICA GENERAL DEL HACKTESTER
window.htAudioInterceptado = false;
window.htMuteActivo = false;

function ht_toggleMute(estado) {
    window.htMuteActivo = estado;
    
    document.querySelectorAll('audio, video').forEach(media => media.muted = estado);
    
    if (!window.htAudioInterceptado) {
        window.htAudioInterceptado = true;
        const originalAudioPlay = window.Audio.prototype.play;
        window.Audio.prototype.play = function() {
            this.muted = window.htMuteActivo;
            return originalAudioPlay.apply(this, arguments);
        };
    }
    
    if (typeof AudioManager !== 'undefined') {
        if(AudioManager.bgmActual) AudioManager.bgmActual.muted = estado;
    }
    
    console.log("HackTester: Juego " + (estado ? "MUTEADO ABSOLUTAMENTE" : "CON SONIDO RESTAURADO"));
}

function ht_addLotePan() {
    ht_checkInit();
    let diaActual = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.diaActualIndex : 0;
    let horaActual = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.indiceActual : 0;
    let fechaActualStr = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.obtenerFechaActual().fecha : "Fecha Tester";
    for(let i=0; i<10; i++) {
        jugador.inventario.push({ id: "pan_cevada", diaCompra: diaActual, horaCompra: horaActual, fechaTexto: fechaActualStr });
    }
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Añadidos 10 Panes de Cevada al morral.");
}

function ht_addLoteCerveza() {
    ht_checkInit();
    let diaActual = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.diaActualIndex : 0;
    let horaActual = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.indiceActual : 0;
    let fechaActualStr = (typeof window.RelojDivino !== 'undefined') ? window.RelojDivino.obtenerFechaActual().fecha : "Fecha Tester";
    for(let i=0; i<4; i++) {
        jugador.inventario.push({ id: "cerveza_mesa", diaCompra: diaActual, horaCompra: horaActual, fechaTexto: fechaActualStr });
    }
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Añadidos 4 Barriles de Cerveza al morral.");
}

function ht_modHambre(cant) {
    ht_checkInit();
    let listas = [jugador.tropas, jugador.comandantes];
    listas.forEach(lista => {
        if(lista) {
            lista.forEach(t => {
                if (t.hp > 0 && !t.hambreInamovible) {
                    if (t.hambre === undefined) t.hambre = 5;
                    t.hambre += cant;
                    if (t.hambre > 5) t.hambre = 5;
                    if (t.hambre < 0) t.hambre = 0;
                }
            });
        }
    });
    
    if(typeof actualizarHUD === "function") actualizarHUD();
    if(typeof renderizarMenuAlimentar === "function" && document.getElementById('alimentar-overlay')?.style.display === 'flex') {
        renderizarMenuAlimentar();
    }
    if(typeof generarRoster === "function" && document.getElementById('formacion-overlay')?.style.display === 'flex') {
        let tipo = window.formacionModoActivo === "cuna" ? "caballeros" : (window.formacionModoActivo === "sacrificio" ? "ballesteros" : "piqueros");
        let filtro = window.formacionModoActivo === "sacrificio" ? "noble" : null;
        generarRoster(tipo, filtro);
    }
    console.log("HackTester: Hambre modificada globalmente (" + (cant>0?"+":"") + cant + ")");
}

function ht_modSed(cant) {
    ht_checkInit();
    let listas = [jugador.tropas, jugador.comandantes];
    listas.forEach(lista => {
        if(lista) {
            lista.forEach(t => {
                if (t.hp > 0 && !t.sedInamovible) {
                    if (t.sed === undefined) t.sed = 3;
                    t.sed += cant;
                    if (t.sed > 3) t.sed = 3;
                    if (t.sed < 0) t.sed = 0;
                }
            });
        }
    });
    
    if(typeof actualizarHUD === "function") actualizarHUD();
    if(typeof renderizarMenuAlimentar === "function" && document.getElementById('alimentar-overlay')?.style.display === 'flex') {
        renderizarMenuAlimentar();
    }
    if(typeof generarRoster === "function" && document.getElementById('formacion-overlay')?.style.display === 'flex') {
        let tipo = window.formacionModoActivo === "cuna" ? "caballeros" : (window.formacionModoActivo === "sacrificio" ? "ballesteros" : "piqueros");
        let filtro = window.formacionModoActivo === "sacrificio" ? "noble" : null;
        generarRoster(tipo, filtro);
    }
    console.log("HackTester: Sed modificada globalmente (" + (cant>0?"+":"") + cant + ")");
}

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
        if(cb.id === "ht-mute-audio") ht_toggleMute(estado);
    });
}

function ht_checkInit() {
    let hudPrincipal = document.getElementById("hud");
    if (hudPrincipal) hudPrincipal.style.display = "flex";
    let actionArea = document.getElementById("action-area");
    if (actionArea) actionArea.style.display = "flex";
    let storyArea = document.getElementById("story-area");
    if (storyArea) storyArea.style.overflowY = "auto";

    let idsOpacos = ["btn-nombre-hud", "btn-tienda-hud", "stat-tiempo-container", "stat-fe-container"];
    idsOpacos.forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.style.opacity = "1";
            el.style.pointerEvents = "auto";
            el.style.display = "flex";
        }
    });

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
    cronicasDesbloqueado = true;
    
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

    if (typeof window.RelojDivino !== 'undefined' && window.RelojDivino.indiceActual === -1) {
        window.RelojDivino.iniciar();
    }
    if(typeof actualizarHUD === "function") actualizarHUD();
}

function ht_addTropa(tipo) {
    ht_checkInit();
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
    ht_checkInit();
    jugador.denarios += cant;
    if (jugador.denarios < 0) jugador.denarios = 0; 
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Tesorería actualizada. Total: " + jugador.denarios);
}

function ht_modFe(cant) {
    ht_checkInit();
    jugador.liderazgo += cant;
    jugador.liderazgoBase += cant;
    if(typeof actualizarHUD === "function") actualizarHUD();
    console.log("HackTester: Moral (Fe) actualizada. Total: " + jugador.liderazgo);
}

function ht_modVidasGeneral(cantidad) {
    ht_checkInit();
    if(jugador && jugador.tropas) {
        jugador.tropas.forEach(t => {
            let globalInmortal = document.getElementById("ht-sin-vidas-perdidas")?.checked;
            if (!t.hpInamovible && !globalInmortal) {
                t.hp += cantidad;
                if(t.hp > 2) t.hp = 2; 
                if(t.hp < 0) t.hp = 0; 
            }
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
    if (typeof window.RelojDivino !== 'undefined') {
        window.RelojDivino.marchaIniciada = true; 
        let index = window.RelojDivino.horas.indexOf(hora);
        if (index !== -1) {
            window.RelojDivino.indiceActual = index - 1;
            window.RelojDivino.avanzarHora(); 
            if (!window.RelojDivino.intervalo) window.RelojDivino.reanudar(); 
            console.log("HackTester: El flujo del tiempo ha sido forzado a " + hora);
        }
    }
}

function ht_setDia(diaIndex) {
    ht_checkInit();
    if (typeof window.RelojDivino !== 'undefined') {
        window.RelojDivino.marchaIniciada = true; 
        window.RelojDivino.diaActualIndex = diaIndex - 1;
        window.RelojDivino.indiceActual = 4; // Nona
        window.RelojDivino.avanzarHora(); // Salta a Vísperas y procesa el cambio de día
        if (!window.RelojDivino.intervalo) window.RelojDivino.reanudar();
        console.log("HackTester: El flujo del tiempo ha sido forzado al Día " + (diaIndex + 1) + " en Vísperas.");
    }
}

function ht_jumpTo(destino) {
    ht_checkInit();
    
    document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    if(typeof AudioManager !== "undefined" && AudioManager.bgmActual) {
        AudioManager.bgmActual.pause();
    }
    
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
        animCaja.style.display = "none"; 
        animCaja.style.backgroundImage = "url('assets/img/fondos/puente_fondo.webp')"; 
        animCaja.style.backgroundSize = "cover"; 
        animCaja.style.backgroundPosition = "center bottom"; 
        animCaja.innerHTML = "";
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

    setTimeout(() => {
        if (typeof window.RelojDivino !== 'undefined') {
            if (window.RelojDivino.indiceActual === -1) {
                window.RelojDivino.iniciar();
            }
            window.RelojDivino.marchaIniciada = true;
            window.RelojDivino.actualizarHUD();
        }

        if (typeof AudioManager !== "undefined") {
            const escenasCap1 = ['opciones_cap1', 'muro_picas', 'repliegue', 'bosque_victoria'];
            const escenasCap2 = ['inicio_cap2', 'opciones_cap2'];
            
            if (escenasCap1.includes(destino)) {
                AudioManager.playBGM('bgm-juego');
                
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
                AudioManager.playBGM('bgm-cap2'); 
            }
        }
    }, 250);
}