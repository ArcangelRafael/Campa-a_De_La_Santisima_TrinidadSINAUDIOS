/* === INVENTARIO.JS - GESTIÓN DEL MORRAL DE OBJETOS === */

window.obtenerKeyItem = function(item) {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && item.diaCompra !== undefined) {
        return `${item.id}_${item.diaCompra}_${item.horaCompra}`;
    }
    return item.id;
};

function abrirInventario() {
    const overlay = document.getElementById("inventario-overlay");
    const contenedor = document.getElementById("inv-contenido");
    
    if (typeof AudioManager !== "undefined" && typeof AudioManager.playBGMOverlay === "function") {
        AudioManager.playBGMOverlay("bgm-inventario");
    }

    contenedor.innerHTML = "";

    if (jugador.inventario.length === 0) {
        contenedor.innerHTML = "<p class='txt-multitud' style='margin-top: 50px;'>El morral está vacío.</p>";
    } else {
        let conteoItems = {};
        let detallesItems = {};

        jugador.inventario.forEach(item => {
            let key = window.obtenerKeyItem(item);
            conteoItems[key] = (conteoItems[key] || 0) + 1;
            
            if (!detallesItems[key]) {
                detallesItems[key] = (typeof item === 'object') ? item : { id: item };
            }
        });

        let grid = document.createElement("div");
        grid.className = "grid-items";
        
        for (let key in conteoItems) {
            let cantidad = conteoItems[key];
            let itemMeta = detallesItems[key];
            let itemData = bdObjetos[itemMeta.id];
            
            if (!itemData) continue;
            
            let displayNombre = `${itemData.nombre} (x${cantidad})`;
            
            let etiquetaLote = "";
            if ((itemData.categoria === "comida" || itemData.categoria === "bebida") && itemMeta.fechaTexto) {
                etiquetaLote = `<div style="font-size:11px; color:#a3d9a5; font-style:italic; margin-top:2px;">Adquirido: ${itemMeta.fechaTexto}</div>`;
            }

            let card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
                <img src="${itemData.img}" alt="${itemData.nombre}">
                <div style="margin-top:10px; font-weight:bold; font-size:14px;">${displayNombre}</div>
                ${etiquetaLote}
            `;
            card.onclick = () => mostrarDetalleObjeto(key, cantidad, itemMeta);
            grid.appendChild(card);
        }
        contenedor.appendChild(grid);
    }
    
    overlay.style.display = "flex";
}

function cerrarInventario() {
    document.getElementById("inventario-overlay").style.display = "none";
    if (typeof AudioManager !== "undefined" && typeof AudioManager.stopBGMOverlay === "function") {
        AudioManager.stopBGMOverlay();
    }
}

function mostrarDetalleObjeto(keyItem, cantidadActual, itemMeta) {
    let itemData = bdObjetos[itemMeta.id];
    if (!itemData) return;

    let overlayDetalle = document.getElementById("detalle-inv-overlay");
    if (!overlayDetalle) {
        overlayDetalle = document.createElement("div");
        overlayDetalle.id = "detalle-inv-overlay";
        document.body.appendChild(overlayDetalle);
    }
    
    let btnVenderHTML = "";
    let extraWarning = "";

    if (itemData.estado === "riesgo") {
        btnVenderHTML = `<button onclick="desecharObjeto('${keyItem}')" style="background:#550000; border:1px solid #ff4c4c; font-size:14px; padding:10px;">🗑️ Desechar Todos</button>`;
        if (itemData.warningTexto) {
            extraWarning = `<p class='txt-hereje' style='font-weight:bold; margin-top:10px; font-size:13px;'>¡ADVERTENCIA! ${itemData.warningTexto}</p>`;
        }
    } else if (itemData.loteVenta) {
        if (cantidadActual >= itemData.loteVenta) {
            btnVenderHTML = `<button onclick="venderObjeto('${keyItem}')" style="background:#550000; border:1px solid #ff4c4c; font-size:14px; padding:10px;">💰 Vender Lote (1 Denario)</button>`;
        }
    } else {
        let valorVenta = Math.max(1, Math.floor(itemData.precio / 2));
        btnVenderHTML = `<button onclick="venderObjeto('${keyItem}')" style="background:#550000; border:1px solid #ff4c4c; font-size:14px; padding:10px;">💰 Vender (${valorVenta} Denarios)</button>`;
    }

    let txtBtnUsar = "🛡️ Usar Objeto";
    if (itemData.categoria === "comida" || itemData.categoria === "bebida") {
        txtBtnUsar = "🍞🍺 Abrir Mesa de Suministros";
    }

    overlayDetalle.innerHTML = `
        <div id="detalle-inv-box" style="background-color: #1a1a1a; border: 2px solid #ffaa00; padding: 30px; width: 400px; max-width: 90%; position: relative; text-align: center; border-radius: 5px; color: #d4c4a8; font-family: 'Georgia', serif; box-shadow: 0 0 40px rgba(255, 170, 0, 0.3);">
            <span class="close-btn" onclick="cerrarDetalleObjeto()" style="position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 22px; color: #555; transition: 0.3s;">✖</span>
            <img src="${itemData.img}" style="width: 150px; border: 2px solid #555; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="color:#ffaa00; margin-top:0; font-family:'Cinzel', serif;">${itemData.nombre}</h3>
            <p style="font-size:16px; font-style:italic; color:#c0c0c0; line-height:1.5;">"${itemData.lore}"</p>
            ${extraWarning}
            
            <div style="background:#111; border:1px solid #444; padding:10px; border-radius:5px; margin: 15px 0;">
                <span class="mensaje-sistema" style="font-weight:bold;">✨ Efecto: ${itemData.efectoTexto}</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-top:25px; gap: 10px;">
                <button onclick="usarObjeto('${keyItem}')" style="background:#2d5a2d; border:1px solid #88ff88; font-size:14px; padding:10px; flex-grow: 1;">${txtBtnUsar}</button>
                ${btnVenderHTML}
            </div>
        </div>
    `;
    
    overlayDetalle.style.display = "flex";
}

function cerrarDetalleObjeto() {
    let overlayDetalle = document.getElementById("detalle-inv-overlay");
    if (overlayDetalle) overlayDetalle.style.display = "none";
}

function usarObjeto(keyItem) {
    let index = jugador.inventario.findIndex(i => window.obtenerKeyItem(i) === keyItem);
    if (index > -1) {
        let itemSeleccionado = jugador.inventario[index];
        let idReal = (typeof itemSeleccionado === 'object') ? itemSeleccionado.id : itemSeleccionado;
        let itemData = bdObjetos[idReal];
        
        if (itemData && (itemData.categoria === "comida" || itemData.categoria === "bebida")) {
            let prop = itemData.categoria === "bebida" ? "sed" : "hambre";
            let maxVal = itemData.categoria === "bebida" ? 3 : 5;
            
            let necesitados = false;
            if (jugador.tropas.some(t => t.hp > 0 && (t[prop] === undefined || t[prop] < maxVal))) necesitados = true;
            if (jugador.comandantes && jugador.comandantes.some(c => c.hp > 0 && (c[prop] === undefined || c[prop] < maxVal))) necesitados = true;
            
            if (!necesitados) {
                alert(`Tus tropas y comandantes no tienen necesidad de esta ración por ahora. No desperdicies suministros.`);
                return;
            }
            cerrarDetalleObjeto();
            abrirMenuAlimentar();
        } else {
            alert("Aún no tienes los permisos divinos para usar esta Reliquia o Arma, Comandante.");
            return;
        }
    }
}

window.cerrarMesaRaciones = function() {
    let overlay = document.getElementById('alimentar-overlay');
    if (overlay) overlay.style.display = 'none';
    
    if (window.modoRacionesDesdeFormacion) {
        window.modoRacionesDesdeFormacion = false;
        if (typeof generarRoster === "function" && window.formacionPendienteRefresh) {
            generarRoster(window.formacionPendienteRefresh.tipo, window.formacionPendienteRefresh.claseFiltro);
        }
    } else {
        abrirInventario();
    }
};

window.filtrosMesa = window.filtrosMesa || { especial: true, caballeros: true, piqueros: true, ballesteros: true, priorizar: true };

window.toggleFiltroMesa = function(filtro) {
    window.filtrosMesa[filtro] = document.getElementById('chk-filtro-' + filtro).checked;
    renderizarMenuAlimentar();
};

function abrirMenuAlimentar() {
    let overlay = document.getElementById("alimentar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "alimentar-overlay";
        overlay.className = "modal-overlay";
        overlay.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(0,0,0,0.9); justify-content:center; align-items:center;";
        document.body.appendChild(overlay);
    }
    
    if (window.modoRacionesDesdeFormacion) overlay.style.zIndex = "3100";
    else overlay.style.zIndex = "2700";

    renderizarMenuAlimentar();
}

function procesarConsumo(tropa, idReal, isComandante) {
    let itemData = bdObjetos[idReal];
    if (itemData && typeof itemData.onConsumir === 'function') {
        return itemData.onConsumir(tropa, isComandante);
    }
    return { status: 'error' };
}

function renderizarMenuAlimentar() {
    let overlay = document.getElementById("alimentar-overlay");

    let scrollCont = document.getElementById("lista-raciones-scroll");
    let currentScroll = scrollCont ? scrollCont.scrollTop : 0;

    let comidasLimpias = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === "comida" && obj.estado === "fresco"; });
    let comidasSucias = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === "comida" && obj.estado === "riesgo"; });
    let bebidasLimpias = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === "bebida" && obj.estado === "fresco"; });
    let bebidasSucias = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === "bebida" && obj.estado === "riesgo"; });

    let tropasNecesitadas = [];
    let todasLasUnidades = [];
    if (jugador.comandantes) todasLasUnidades = todasLasUnidades.concat(jugador.comandantes);
    if (jugador.tropas) todasLasUnidades = todasLasUnidades.concat(jugador.tropas);

    todasLasUnidades.forEach(t => {
        if (t.hp <= 0) return; 

        let h = t.hambre !== undefined ? t.hambre : 5;
        let s = t.sed !== undefined ? t.sed : 3;
        if (h >= 5 && s >= 3) return;

        let esEspecial = t.idTipo === "sacerdote_unico" || t.idTipo === "explorador_unico" || t.idUnico === "cmd_player" || t.idUnico.startsWith("cmd_");
        let esCaballero = t.tipoGeneral === "caballeros";
        let esPiquero = t.tipoGeneral === "piqueros";
        let esBallestero = t.tipoGeneral === "ballesteros";

        let pasaFiltro = false;
        if (esEspecial && window.filtrosMesa.especial) pasaFiltro = true;
        if (esCaballero && window.filtrosMesa.caballeros) pasaFiltro = true;
        if (esPiquero && window.filtrosMesa.piqueros) pasaFiltro = true;
        if (esBallestero && window.filtrosMesa.ballesteros) pasaFiltro = true;

        if (pasaFiltro) tropasNecesitadas.push(t);
    });

    tropasNecesitadas.sort((a, b) => {
        const getWeight = (t) => {
            if (t.idUnico === "cmd_player") return 1;
            if (t.idTipo === "sacerdote_unico") return 2;
            if (["cmd_alex", "cmd_andrew", "cmd_juan"].includes(t.idUnico)) return 3;
            if (t.idTipo === "explorador_unico") return 4;
            return 5;
        };
        return getWeight(a) - getWeight(b);
    });

    let listaHtml = "";
    if (tropasNecesitadas.length === 0) {
        listaHtml = `<div style="text-align:center; padding:20px; color:#aaa; font-style:italic;">No hay tropas que coincidan con estos filtros y requieran suministros.</div>`;
    }

    tropasNecesitadas.forEach(t => {
        let h = t.hambre !== undefined ? t.hambre : 5;
        let s = t.sed !== undefined ? t.sed : 3;
        
        let htmlHambre = "";
        for (let i = 0; i < 5; i++) { htmlHambre += (i < Math.max(0, h)) ? "<b style='color:#d4af37;'>I</b> " : "<b style='color:#555;'>I</b> "; }
        
        let htmlSed = "";
        for (let i = 0; i < 3; i++) { htmlSed += (i < Math.max(0, s)) ? "<b style='color:#4c88ff;'>I</b> " : "<b style='color:#555;'>I</b> "; }
        
        let advertencia = (h < 0 || s < 0) ? `<span class='txt-hereje' style='font-size:10px;'><br>¡MURIENDO! A un turno de perecer.</span>` : "";
        let txtDesmayo = (h <= 0 || s <= 0) ? "<span class='txt-hereje' style='font-weight:bold; font-size:11px;'>(Desmayado)</span> " : "";
        
        let etiquetaLider = "";
        if (t.idUnico === "cmd_player") etiquetaLider = "<span style='color:#ffaa00; font-size:10px; display:block;'>👑 Comendador Supremo</span>";
        else if (t.idTipo === "sacerdote_unico") etiquetaLider = "<span style='color:#a3d9a5; font-size:10px; display:block;'>📖 Capellán Máximo</span>";
        else if (t.idTipo === "explorador_unico") etiquetaLider = "<span style='color:#a3d9a5; font-size:10px; display:block;'>👁️ Vigía Maestro</span>";
        else if (["cmd_alex", "cmd_andrew", "cmd_juan"].includes(t.idUnico)) etiquetaLider = "<span style='color:#4c88ff; font-size:10px; display:block;'>⭐ Lugarteniente</span>";

        let btnComida = "";
        if (h >= 5) {
            btnComida = `<button disabled style="background:#222; border:1px solid #444; color:#555; padding:5px; font-size:11px; cursor:not-allowed; border-radius:3px;">🍞 Lleno</button>`;
        } else if (comidasLimpias.length > 0) {
            let itemId = typeof comidasLimpias[0] === 'object' ? comidasLimpias[0].id : comidasLimpias[0];
            btnComida = `<button onclick="darConsumibleTropa('${t.idUnico}', '${itemId}')" style="background:#2d5a2d; border:1px solid #88ff88; color:#fff; padding:5px; font-size:11px; font-weight:bold; cursor:pointer; border-radius:3px; transition:0.2s;">🍞 Dar Comida</button>`;
        } else if (comidasSucias.length > 0) {
            let itemId = typeof comidasSucias[0] === 'object' ? comidasSucias[0].id : comidasSucias[0];
            btnComida = `<button onclick="darConsumibleTropa('${t.idUnico}', '${itemId}')" style="background:#5a0000; border:1px solid #ff4c4c; color:#ff8888; padding:5px; font-size:11px; font-weight:bold; cursor:pointer; border-radius:3px; transition:0.2s;">☠️ Comida Podrida</button>`;
        } else {
            btnComida = `<button disabled style="background:#222; border:1px solid #444; color:#555; padding:5px; font-size:11px; cursor:not-allowed; border-radius:3px;">❌ Sin Comida</button>`;
        }

        let btnBebida = "";
        if (s >= 3) {
            btnBebida = `<button disabled style="background:#222; border:1px solid #444; color:#555; padding:5px; font-size:11px; cursor:not-allowed; border-radius:3px;">🍺 Hidratado</button>`;
        } else if (bebidasLimpias.length > 0) {
            let itemId = typeof bebidasLimpias[0] === 'object' ? bebidasLimpias[0].id : bebidasLimpias[0];
            btnBebida = `<button onclick="darConsumibleTropa('${t.idUnico}', '${itemId}')" style="background:#214073; border:1px solid #4c88ff; color:#fff; padding:5px; font-size:11px; font-weight:bold; cursor:pointer; border-radius:3px; transition:0.2s;">🍺 Dar Bebida</button>`;
        } else if (bebidasSucias.length > 0) {
            let itemId = typeof bebidasSucias[0] === 'object' ? bebidasSucias[0].id : bebidasSucias[0];
            btnBebida = `<button onclick="darConsumibleTropa('${t.idUnico}', '${itemId}')" style="background:#5a0000; border:1px solid #ff4c4c; color:#ff8888; padding:5px; font-size:11px; font-weight:bold; cursor:pointer; border-radius:3px; transition:0.2s;">☠️ Bebida Agria</button>`;
        } else {
            btnBebida = `<button disabled style="background:#222; border:1px solid #444; color:#555; padding:5px; font-size:11px; cursor:not-allowed; border-radius:3px;">❌ Sin Bebida</button>`;
        }

        listaHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#111; border:1px solid #444; padding:10px; margin-bottom:10px; border-radius:5px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${t.img}" style="width:40px; height:40px; border-radius:3px; border:1px solid #888; object-fit: cover;">
                <div style="text-align:left;">
                    <div style="color:#d4c4a8; font-weight:bold; font-size:14px;">${t.nombre} ${txtDesmayo}</div>
                    ${etiquetaLider}
                    <div style="font-size:12px; letter-spacing:1px; margin-top: 3px;">🍖 ${htmlHambre} <span style="margin-left:5px;">🍺 ${htmlSed}</span>${advertencia}</div>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:5px;">
                ${btnComida}
                ${btnBebida}
            </div>
        </div>
        `;
    });

    let displayStock = `
        <div style="background:#0a0a0a; border:1px solid #333; padding:10px; border-radius:5px; margin-bottom:15px; font-size:14px; text-align:center;">
            <span style="color:#d4af37;">🍞 Frescos: <b>${comidasLimpias.length}</b></span> &nbsp;|&nbsp; <span style="color:#ff4c4c;">☠️ Podridos: <b>${comidasSucias.length}</b></span><br>
            <span style="color:#4c88ff;">🍺 Cervezas: <b>${bebidasLimpias.length}</b></span> &nbsp;|&nbsp; <span style="color:#ff4c4c;">☠️ Agrias: <b>${bebidasSucias.length}</b></span>
        </div>
    `;

    overlay.innerHTML = `
        <div style="background-color: #1a1a1a; border: 2px solid #ffaa00; padding: 30px; width: 600px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; position: relative; border-radius: 5px; box-shadow: 0 0 50px rgba(0, 0, 0, 0.9); font-family: 'Georgia', serif;">
            <span class="close-btn" onclick="cerrarMesaRaciones()" style="position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 22px; color: #555; transition: 0.3s;">✖</span>
            <h3 style="color:#ffaa00; margin-top:0; text-align:center; font-family:'Cinzel', serif;">MESA DE SUMINISTROS</h3>
            
            ${displayStock}
            
            <div style="background:#111; padding:10px; border:1px dashed #555; margin-bottom:15px; border-radius:5px; text-align:center;">
                <div style="color:#fff; font-size:12px; margin-bottom:8px; color:#ffaa00;">Filtros de Tropa:</div>
                <div style="display:flex; justify-content:center; gap:12px; font-size:12px; color:#aaa; flex-wrap:wrap;">
                    <label style="cursor:pointer;"><input type="checkbox" id="chk-filtro-especial" onchange="toggleFiltroMesa('especial')" ${window.filtrosMesa.especial ? 'checked' : ''}> Especiales</label>
                    <label style="cursor:pointer;"><input type="checkbox" id="chk-filtro-caballeros" onchange="toggleFiltroMesa('caballeros')" ${window.filtrosMesa.caballeros ? 'checked' : ''}> Caballeros</label>
                    <label style="cursor:pointer;"><input type="checkbox" id="chk-filtro-piqueros" onchange="toggleFiltroMesa('piqueros')" ${window.filtrosMesa.piqueros ? 'checked' : ''}> Piqueros</label>
                    <label style="cursor:pointer;"><input type="checkbox" id="chk-filtro-ballesteros" onchange="toggleFiltroMesa('ballesteros')" ${window.filtrosMesa.ballesteros ? 'checked' : ''}> Ballesteros</label>
                </div>
            </div>

            <div style="display:flex; justify-content:center; gap:15px; margin-bottom:15px;">
                <label style="color:#fff; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" id="chk-priorizar-hambre" onchange="window.filtrosMesa.priorizar = this.checked;" ${window.filtrosMesa.priorizar ? 'checked' : ''} style="width:15px; height:15px;"> 
                    Priorizar al Azar los más necesitados
                </label>
            </div>
            
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button onclick="repartirConsumibleMasivo('comida')" style="flex-grow:1; background:linear-gradient(to bottom, #8b6508, #b8860b); border:1px solid #ffd700; color:#fff; font-weight:bold; padding:10px; font-family:'Cinzel', serif; cursor:pointer; border-radius:3px; font-size:13px; transition:0.2s;">🍞 ESPARCIR COMIDA</button>
                <button onclick="repartirConsumibleMasivo('bebida')" style="flex-grow:1; background:linear-gradient(to bottom, #214073, #0a1f44); border:1px solid #4c88ff; color:#fff; font-weight:bold; padding:10px; font-family:'Cinzel', serif; cursor:pointer; border-radius:3px; font-size:13px; transition:0.2s;">🍺 ESPARCIR BEBIDA</button>
            </div>
            
            <div id="lista-raciones-scroll" style="overflow-y:auto; flex-grow:1; padding-right:10px;">
                ${listaHtml}
            </div>
        </div>
    `;
    overlay.style.display = "flex";

    setTimeout(() => {
        let sc = document.getElementById("lista-raciones-scroll");
        if (sc) sc.scrollTop = currentScroll;
    }, 0);
}

window.darConsumibleTropa = function(idUnico, targetId) {
    let tropa = jugador.tropas.find(t => t.idUnico === idUnico);
    let isComandante = false;
    if (!tropa && jugador.comandantes) {
        tropa = jugador.comandantes.find(c => c.idUnico === idUnico);
        isComandante = true;
    }
    if (!tropa) return;

    let itemsValidos = jugador.inventario.filter(i => (typeof i === 'string' ? i : i.id) === targetId);
    if (itemsValidos.length === 0) return;

    let oldest = itemsValidos.reduce((prev, current) => {
        return ((prev.edad || 0) > (current.edad || 0)) ? prev : current;
    });

    let key = window.obtenerKeyItem(oldest);
    let indexItem = jugador.inventario.findIndex(i => window.obtenerKeyItem(i) === key);
    
    if (indexItem > -1) {
        jugador.inventario.splice(indexItem, 1);
        let resultado = procesarConsumo(tropa, targetId, isComandante);
        
        if (resultado.status === 'muerte') alert(`¡Tragedia! La inmundicia destruyó sus entrañas y ${resultado.nombre} ha muerto instantáneamente.`);
        else if (resultado.status === 'salvado') alert(`Milagrosamente, el cuerpo de ${resultado.nombre} resistió la podredumbre. Se ha salvado.`);
        else if (resultado.status === 'enfermo') alert(`¡Severamente infectado! ${resultado.nombre} sufre dolores y pierde barras vitales.`);
        else if (resultado.status === 'agria') alert(`¡Asco! El líquido está agrio como el vinagre. ${resultado.nombre} lo escupe.`);

        renderizarMenuAlimentar();
    }
};

window.repartirConsumibleMasivo = function(categoriaBase) {
    let priorizar = window.filtrosMesa.priorizar;
    
    let limpios = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === categoriaBase && obj.estado === "fresco"; });
    let sucios = jugador.inventario.filter(i => { let obj = bdObjetos[typeof i === 'string' ? i : i.id]; return obj && obj.categoria === categoriaBase && obj.estado === "riesgo"; });

    if (limpios.length === 0 && sucios.length === 0) {
        alert(`No tienes más suministros de este tipo en el morral.`);
        return;
    }

    let isBebida = (categoriaBase === "bebida");
    let idUsoMasivo = limpios.length > 0 ? (typeof limpios[0] === 'object' ? limpios[0].id : limpios[0]) : (typeof sucios[0] === 'object' ? sucios[0].id : sucios[0]);
    let stackSize = limpios.length > 0 ? limpios.length : sucios.length;
    let maxVal = isBebida ? 3 : 5;
    let prop = isBebida ? "sed" : "hambre";
    
    let itemsUsados = 0;
    let muertesMasivas = [];
    let enfermosMasivos = 0;

    for (let i = 0; i < stackSize; i++) {
        let tropasNecesitadas = [];
        let todasLasUnidades = [];
        if (jugador.comandantes) todasLasUnidades = todasLasUnidades.concat(jugador.comandantes);
        if (jugador.tropas) todasLasUnidades = todasLasUnidades.concat(jugador.tropas);

        todasLasUnidades.forEach(t => {
            if (t.hp <= 0) return;
            if (t[prop] !== undefined && t[prop] >= maxVal) return; 

            let esEspecial = t.idTipo === "sacerdote_unico" || t.idTipo === "explorador_unico" || t.idUnico === "cmd_player" || t.idUnico.startsWith("cmd_");
            let esCaballero = t.tipoGeneral === "caballeros";
            let esPiquero = t.tipoGeneral === "piqueros";
            let esBallestero = t.tipoGeneral === "ballesteros";

            let pasaFiltro = false;
            if (esEspecial && window.filtrosMesa.especial) pasaFiltro = true;
            if (esCaballero && window.filtrosMesa.caballeros) pasaFiltro = true;
            if (esPiquero && window.filtrosMesa.piqueros) pasaFiltro = true;
            if (esBallestero && window.filtrosMesa.ballesteros) pasaFiltro = true;

            if (pasaFiltro) tropasNecesitadas.push({t, isCmd: esEspecial && t.idTipo !== "sacerdote_unico" && t.idTipo !== "explorador_unico"}); 
        });

        if (tropasNecesitadas.length === 0) break; 

        let objElegido;
        if (priorizar) {
            let minNecesidad = Math.min(...tropasNecesitadas.map(obj => obj.t[prop] !== undefined ? obj.t[prop] : maxVal));
            let candidatos = tropasNecesitadas.filter(obj => (obj.t[prop] !== undefined ? obj.t[prop] : maxVal) === minNecesidad);
            objElegido = candidatos[Math.floor(Math.random() * candidatos.length)];
        } else {
            objElegido = tropasNecesitadas[Math.floor(Math.random() * tropasNecesitadas.length)];
        }

        let subsetInventario = jugador.inventario.filter(inv => (typeof inv === 'string' ? inv : inv.id) === idUsoMasivo);
        let oldest = subsetInventario.reduce((prev, current) => {
            return ((prev.edad || 0) > (current.edad || 0)) ? prev : current;
        });
        
        let idxToRemove = jugador.inventario.findIndex(inv => window.obtenerKeyItem(inv) === window.obtenerKeyItem(oldest));
        jugador.inventario.splice(idxToRemove, 1);
        itemsUsados++;

        let resultado = procesarConsumo(objElegido.t, idUsoMasivo, objElegido.isCmd);
        if (resultado.status === 'muerte') muertesMasivas.push(resultado.nombre);
        if (resultado.status === 'enfermo') enfermosMasivos++;
    }

    if (itemsUsados > 0) {
        let objReferencia = bdObjetos[idUsoMasivo];
        if (objReferencia.estado === "riesgo") {
            if (isBebida) alert(`Has esparcido ${itemsUsados} raciones AGRÍAS.\nFue un asco total. Todos la escupieron y nadie se hidrató.`);
            else alert(`Has esparcido ${itemsUsados} raciones de comida PODRIDA.\nConsecuencias trágicas:\n☠️ ${muertesMasivas.length} muertos.\n🤢 ${enfermosMasivos} intoxicados gravemente.`);
        } else {
            alert(`Has esparcido exitosamente ${itemsUsados} raciones de ${objReferencia.nombre} entre la hueste seleccionada.`);
        }
    }
    
    renderizarMenuAlimentar();
    if (typeof actualizarHUD === "function") actualizarHUD();
};

window.desecharObjeto = function(keyItem) {
    let index = jugador.inventario.findIndex(i => window.obtenerKeyItem(i) === keyItem);
    let idReal = (typeof jugador.inventario[index] === 'object') ? jugador.inventario[index].id : jugador.inventario[index];
    let itemData = bdObjetos[idReal];
    let cuenta = jugador.inventario.filter(i => window.obtenerKeyItem(i) === keyItem).length;
    
    let msg = `¿Estás seguro de arrojar estos ${cuenta} ${itemData.nombre} al fango para proteger a tu tropa?`;

    if (confirm(msg)) {
        jugador.inventario = jugador.inventario.filter(i => window.obtenerKeyItem(i) !== keyItem);
        cerrarDetalleObjeto();
        abrirInventario();
    }
};

function venderObjeto(keyItem) {
    let index = jugador.inventario.findIndex(i => window.obtenerKeyItem(i) === keyItem);
    if (index > -1) {
        let itemObj = jugador.inventario[index];
        let idReal = (typeof itemObj === 'object') ? itemObj.id : itemObj;
        let itemData = bdObjetos[idReal];
        
        if (itemData.loteVenta) {
            let itemsEnLote = jugador.inventario.filter(i => window.obtenerKeyItem(i) === keyItem).length;
            if (itemsEnLote >= itemData.loteVenta) {
                let seguro = confirm(`¿Vender todo el Lote de ${itemData.loteVenta} ${itemData.nombre} por 1 mísero Denario?`);
                if (seguro) {
                    for (let i = 0; i < itemData.loteVenta; i++) {
                        let idx = jugador.inventario.findIndex(inv => window.obtenerKeyItem(inv) === keyItem);
                        if (idx > -1) jugador.inventario.splice(idx, 1);
                    }
                    jugador.denarios += 1;
                    if (typeof actualizarHUD === "function") actualizarHUD();
                    alert("Has vendido los suministros al mercader.");
                }
            } else {
                alert(`No tienes suficientes objetos exactos en este lote para vender.`);
            }
        } else {
            let valorVenta = Math.max(1, Math.floor(itemData.precio / 2));
            let seguro = confirm(`¿Estás seguro de vender ${itemData.nombre} por ${valorVenta} Denarios?`);
            if (seguro) {
                jugador.inventario.splice(index, 1);
                jugador.denarios += valorVenta;
                if (typeof actualizarHUD === "function") actualizarHUD();
                alert(`Vendiste ${itemData.nombre}.`);
            }
        }
    }
    cerrarDetalleObjeto();
    abrirInventario(); 
}