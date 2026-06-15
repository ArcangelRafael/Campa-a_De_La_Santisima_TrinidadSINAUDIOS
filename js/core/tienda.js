/* === TIENDA.JS - SISTEMA DE RECLUTAMIENTO Y FORJA === */

let faseReclutamientoInicial = false;
let carritoMercenarios = {}; 
let carritoObjetos = {}; 
window.seccionTiendaActiva = null; 
window.tiendaBloqueadaBosque = false; 

// --- SISTEMA DE EDICTOS (Alertas y Confirmaciones Personalizadas) ---
window.mostrarAlertaCustom = function(mensaje) {
    let overlay = document.getElementById("custom-alert-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "custom-alert-overlay";
        overlay.className = "modal-overlay";
        overlay.style.cssText = "display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:4000; justify-content:center; align-items:center;";
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
        <div style="background:#1a0a0a; border:2px solid #ff4c4c; padding:30px; width:450px; text-align:center; border-radius:5px; box-shadow:0 0 40px rgba(255,0,0,0.4); font-family:'Georgia', serif;">
            <h3 style="color:#ff4c4c; font-family:'Cinzel', serif; margin-top:0; border-bottom:1px solid #ff4c4c; padding-bottom:10px;">ATENCIÓN COMANDANTE</h3>
            <p style="color:#d4c4a8; font-size:16px; margin:25px 0; line-height:1.5;">${mensaje}</p>
            <button onclick="document.getElementById('custom-alert-overlay').style.display='none'" style="background:#4a0000; border:1px solid #ff4c4c; color:#fff; padding:10px 25px; cursor:pointer; font-family:'Cinzel', serif; transition:0.2s;" onmouseover="this.style.background='#ff4c4c'; this.style.color='#000';" onmouseout="this.style.background='#4a0000'; this.style.color='#fff';">ENTENDIDO</button>
        </div>
    `;
    overlay.style.display = "flex";
};

window.mostrarConfirmacionCustom = function(mensaje, onConfirm, onCancel) {
    let overlay = document.getElementById("custom-alert-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "custom-alert-overlay";
        overlay.className = "modal-overlay";
        overlay.style.cssText = "display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:4000; justify-content:center; align-items:center;";
        document.body.appendChild(overlay);
    }
    
    window._confirmCustomYes = function() {
        overlay.style.display = 'none';
        if(onConfirm) onConfirm();
    };
    window._confirmCustomNo = function() {
        overlay.style.display = 'none';
        if(onCancel) onCancel();
    };

    overlay.innerHTML = `
        <div style="background:#1a0a0a; border:2px solid #ffaa00; padding:30px; width:450px; text-align:center; border-radius:5px; box-shadow:0 0 40px rgba(255,170,0,0.3); font-family:'Georgia', serif;">
            <h3 style="color:#ffaa00; font-family:'Cinzel', serif; margin-top:0; border-bottom:1px solid #555; padding-bottom:10px;">DECISIÓN TÁCTICA</h3>
            <p style="color:#d4c4a8; font-size:16px; margin:25px 0; line-height:1.5;">${mensaje}</p>
            <div style="display:flex; justify-content:center; gap:20px;">
                <button onclick="window._confirmCustomNo()" style="background:#111; border:1px solid #aaa; color:#aaa; padding:10px 20px; cursor:pointer; font-family:'Cinzel', serif; transition:0.2s;" onmouseover="this.style.background='#333'; this.style.color='#fff';" onmouseout="this.style.background='#111'; this.style.color='#aaa';">CANCELAR</button>
                <button onclick="window._confirmCustomYes()" style="background:#2d5a2d; border:1px solid #88ff88; color:#fff; padding:10px 20px; cursor:pointer; font-family:'Cinzel', serif; transition:0.2s;" onmouseover="this.style.background='#88ff88'; this.style.color='#000';" onmouseout="this.style.background='#2d5a2d'; this.style.color='#fff';">CONFIRMAR</button>
            </div>
        </div>
    `;
    overlay.style.display = "flex";
};


// =========================================================================
// === ENTRADA PRINCIPAL A LA PLAZA ===
// =========================================================================

window.iniciarPlazaInicial = function() {
    faseReclutamientoInicial = true;
    carritoMercenarios = {}; 
    carritoObjetos = {};
    window.tiendaBloqueadaBosque = false;
    abrirTienda();
};

function abrirTienda() {
    if(window.tiendaBloqueadaBosque) {
        mostrarAlertaCustom("Estás en medio del inhóspito bosque, Comandante. Aquí solo hay sombras y herejes cruzando la espesura, no hay mercaderes ni herreros a la vista.");
        return;
    }

    const overlay = document.getElementById("tienda-overlay");
    
    let hardcodedCart = document.getElementById("tienda-carrito");
    if(hardcodedCart) hardcodedCart.style.display = "none";
    let objCart = document.getElementById("carrito-objetos-container");
    if(objCart) objCart.style.display = "none";
    
    if (typeof AudioManager !== "undefined" && typeof AudioManager.playBGMOverlay === "function") {
        AudioManager.playBGMOverlay("bgm-tienda");
    }

    mostrarPlazaCentral();
    overlay.style.display = "flex";
}

function crearColumnaResumen(titulo, costo, htmlLista, color, idSeccion, txtBtnIr, txtBtnBorrar) {
    return `
    <div style="flex:1; min-width:180px; max-width:280px; background:#111; border:1px solid #222; padding:10px; border-radius:4px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
            <b style="color:${color}; font-size:14px; border-bottom:1px solid #333; display:block; padding-bottom:5px; margin-bottom:8px;">${titulo} (${costo} Den)</b>
            <ul style="margin:0; padding-left:15px; color:#aaa; font-size:13px;">${htmlLista}</ul>
        </div>
        <div style="display:flex; flex-direction:column; gap:5px; margin-top:12px;">
            <button onclick="abrirSeccionTienda('${idSeccion}')" style="background:#1a0a0a; border:1px solid ${color}; color:${color}; padding:6px; font-size:11px; cursor:pointer; width:100%; transition:0.2s; font-weight:bold;" onmouseover="this.style.background='${color}'; this.style.color='#000';" onmouseout="this.style.background='#1a0a0a'; this.style.color='${color}';">${txtBtnIr}</button>
            <button onclick="vaciarCarritoSeccion('${idSeccion}')" style="background:#3a0000; border:1px solid #ff4c4c; color:#ff4c4c; padding:6px; font-size:11px; cursor:pointer; width:100%; transition:0.2s;" onmouseover="this.style.background='#ff4c4c'; this.style.color='#000';" onmouseout="this.style.background='#3a0000'; this.style.color='#ff4c4c';">✖ ${txtBtnBorrar}</button>
        </div>
    </div>`;
}

window.vaciarCarritoSeccion = function(seccion) {
    if(seccion === 'reclutamiento') {
        carritoMercenarios = {};
    } else {
        for(let key in carritoObjetos) {
            let item = bdObjetos[key];
            let itemSeccion = (item.categoria === "arma" || item.categoria === "armadura" || item.categoria.startsWith("armadura_") || item.categoria === "escudo_roble") ? "forja" : (item.categoria === "medicina" ? "curandera" : (item.categoria === "comida" ? "panadero" : "taberna"));
            if (itemSeccion === seccion) {
                delete carritoObjetos[key];
            }
        }
    }
    mostrarPlazaCentral();
    if (typeof actualizarHUD === "function") actualizarHUD();
};

function mostrarPlazaCentral() {
    window.seccionTiendaActiva = null;
    document.getElementById("tienda-titulo").innerText = "LA PLAZA CENTRAL";
    const contenedor = document.getElementById("tienda-contenido");
    
    let htmlCards = `
        <p style="color:#c0c0c0; font-style:italic; margin-bottom:20px; text-align:center;">¿Hacia dónde dirigiréis vuestros pasos, Comendador?</p>
        
        <div style="display:flex; justify-content:center; gap:15px; margin: 25px 0; flex-wrap:wrap;">
            
            <div class="item-card" onclick="abrirSeccionTienda('reclutamiento')" style="width:160px; padding:15px !important; border:2px solid #555;">
                <img src="assets/img/ui/rec_sold.webp" style="height:100px !important; width:100% !important; object-fit:cover !important; background:#000;">
                <h4 style="color:#ffaa00; font-family:'Cinzel', serif; margin:10px 0 5px 0; font-size:14px;">Reclutamiento</h4>
                <p style="font-size:11px; color:#aaa; font-style:italic; line-height: 1.4;">Hombres de fortuna en busca de oro y gloria.</p>
            </div>

            <div class="item-card" onclick="abrirSeccionTienda('forja')" style="width:160px; padding:15px !important; border:2px solid #555;">
                <img src="assets/img/ui/herreria.webp" style="height:100px !important; width:100% !important; object-fit:cover !important; background:#000;">
                <h4 style="color:#ffaa00; font-family:'Cinzel', serif; margin:10px 0 5px 0; font-size:14px;">La Forja</h4>
                <p style="font-size:11px; color:#aaa; font-style:italic; line-height: 1.4;">Acero forjado, letal para proteger a la hueste.</p>
            </div>
            
            <div class="item-card" onclick="abrirSeccionTienda('panadero')" style="width:160px; padding:15px !important; border:2px solid #555;">
                <img src="assets/img/ui/panaderia.webp" style="height:100px !important; width:100% !important; object-fit:cover !important; background:#000;">
                <h4 style="color:#ffaa00; font-family:'Cinzel', serif; margin:10px 0 5px 0; font-size:14px;">El Horno</h4>
                <p style="font-size:11px; color:#aaa; font-style:italic; line-height: 1.4;">Lotes de pan duro horneado en las abadías.</p>
            </div>
            
            <div class="item-card" onclick="abrirSeccionTienda('taberna')" style="width:160px; padding:15px !important; border:2px solid #555;">
                <img src="assets/img/ui/taberna.webp" style="height:100px !important; width:100% !important; object-fit:cover !important; background:#000;">
                <h4 style="color:#ffaa00; font-family:'Cinzel', serif; margin:10px 0 5px 0; font-size:14px;">La Taberna</h4>
                <p style="font-size:11px; color:#aaa; font-style:italic; line-height: 1.4;">Barriles de cerveza para aguantar la sed.</p>
            </div>

            <div class="item-card" onclick="abrirSeccionTienda('curandera')" style="width:160px; padding:15px !important; border:2px solid #555;">
                <img src="assets/img/ui/farmacia.webp" style="height:100px !important; width:100% !important; object-fit:cover !important; background:#000;">
                <h4 style="color:#ffaa00; font-family:'Cinzel', serif; margin:10px 0 5px 0; font-size:14px;">La Curandera</h4>
                <p style="font-size:11px; color:#aaa; font-style:italic; line-height: 1.4;">Bálsamos y ungüentos benditos para la carne herida.</p>
            </div>
        </div>
    `;
    
    contenedor.innerHTML = htmlCards;

    let costoMerc = calcularCostoCarrito();
    let costoForja = calcularCostoCarritoObjetos("forja");
    let costoHorno = calcularCostoCarritoObjetos("panadero");
    let costoTaberna = calcularCostoCarritoObjetos("taberna");
    let costoCurandera = calcularCostoCarritoObjetos("curandera");
    
    let totalGeneral = costoMerc + costoForja + costoHorno + costoTaberna + costoCurandera;
    
    if(totalGeneral > 0) {
        let divResumen = document.createElement("div");
        divResumen.style.cssText = "background:#0a0a0a; padding: 20px; border-radius: 4px; border: 1px solid #333; border-top: 3px solid #8b0000; margin-top: 20px; text-align:left; box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5);";
        
        let listasHtml = `<div style="display:flex; justify-content:center; gap:15px; margin-bottom:15px; flex-wrap:wrap;">`;
        
        if(costoMerc > 0) {
            let html = "";
            for(let k in carritoMercenarios) { if(carritoMercenarios[k]>0) html += `<li style="margin-bottom:3px;">${bdTiposTropa[k].nombre} <b style="color:#fff;">x${carritoMercenarios[k]}</b></li>`; }
            listasHtml += crearColumnaResumen("⚔️ Filas", costoMerc, html, "#4c88ff", "reclutamiento", "Ir al Reclutador", "Anular Pacto");
        }
        if(costoForja > 0) {
            let html = "";
            for(let k in carritoObjetos) {
                let item = bdObjetos[k];
                if(carritoObjetos[k]>0 && (item.categoria==="arma"||item.categoria==="armadura"||item.categoria.startsWith("armadura_")||item.categoria==="escudo_roble")) {
                    html += `<li style="margin-bottom:3px;">${item.nombre} <b style="color:#fff;">x${carritoObjetos[k]}</b></li>`;
                }
            }
            listasHtml += crearColumnaResumen("⚒️ Mejoras", costoForja, html, "#ffaa00", "forja", "Ir a la Forja", "Descartar Pedido");
        }
        if(costoHorno > 0) {
            let html = "";
            for(let k in carritoObjetos) {
                let item = bdObjetos[k];
                if(carritoObjetos[k]>0 && item.categoria==="comida") {
                    html += `<li style="margin-bottom:3px;">Lote de Pan <b style="color:#fff;">x${carritoObjetos[k]}</b></li>`;
                }
            }
            listasHtml += crearColumnaResumen("🍞 Horno", costoHorno, html, "#a3d9a5", "panadero", "Ir al Horno", "Descartar Pedido");
        }
        if(costoTaberna > 0) {
            let html = "";
            for(let k in carritoObjetos) {
                let item = bdObjetos[k];
                if(carritoObjetos[k]>0 && item.categoria==="bebida") {
                    html += `<li style="margin-bottom:3px;">Barril de Cerveza <b style="color:#fff;">x${carritoObjetos[k]}</b></li>`;
                }
            }
            listasHtml += crearColumnaResumen("🍺 Taberna", costoTaberna, html, "#ffccff", "taberna", "Ir a la Taberna", "Descartar Pedido");
        }
        if(costoCurandera > 0) {
            let html = "";
            for(let k in carritoObjetos) {
                let item = bdObjetos[k];
                if(carritoObjetos[k]>0 && item.categoria==="medicina") {
                    html += `<li style="margin-bottom:3px;">${item.nombre} <b style="color:#fff;">x${carritoObjetos[k]}</b></li>`;
                }
            }
            listasHtml += crearColumnaResumen("⚕️ Farmacia", costoCurandera, html, "#ff8888", "curandera", "Ir a la Curandera", "Descartar Pedido");
        }
        
        listasHtml += `</div>`;

        divResumen.innerHTML = `
            <h4 style="color:#d4af37; margin-top:0; border-bottom:1px solid #333; padding-bottom:8px; text-align:center; font-family:'Cinzel', serif; letter-spacing:2px;">MORRAL Y FILAS PENDIENTES</h4>
            ${listasHtml}
            <div style="border-top:1px solid #333; margin-top:5px; padding-top:15px; text-align:center;">
                <div style="color:#ff4c4c; font-weight:bold; font-size:17px; letter-spacing:1px;">COSTO TOTAL ACUMULADO: ${totalGeneral} Denarios</div>
                <div style="color:#ffd700; font-weight:bold; font-size:15px; margin-top:5px;">FONDOS ACTUALES: ${jugador.denarios} Denarios</div>
                <p style="color:#666; font-style:italic; font-size:12px; margin-top:8px; margin-bottom:0; text-align:center;">Visita al mercader específico para cerrar y pagar cada trato.</p>
            </div>
        `;
        contenedor.appendChild(divResumen);
    }
}

window.abrirSeccionTienda = function(seccion) {
    window.seccionTiendaActiva = seccion;
    let titulo = "EL MERCADO";
    
    if (seccion === "reclutamiento") titulo = "RECLUTAMIENTO DE HUESTES";
    if (seccion === "forja") titulo = "LA FORJA BÉLICA";
    if (seccion === "panadero") titulo = "EL HORNO MONÁSTICO";
    if (seccion === "taberna") titulo = "LA TABERNA LOCAL";
    if (seccion === "curandera") titulo = "LA TIENDA DE BÁLSAMOS";
    
    document.getElementById("tienda-titulo").innerText = titulo;

    if (seccion === "reclutamiento") {
        renderizarTiendaReclutamiento();
    } else {
        renderizarTiendaObjetos();
    }
};

// =========================================================================
// === SECCIÓN 1: RECLUTAMIENTO (Mercenarios) ===
// =========================================================================

function renderizarTiendaReclutamiento() {
    const contenedor = document.getElementById("tienda-contenido");
    contenedor.innerHTML = "";
    
    let objCart = document.getElementById("carrito-objetos-container");
    if(objCart) objCart.style.display = "none";

    let btnHeaderContainer = document.createElement("div");
    btnHeaderContainer.style.cssText = "display: flex; justify-content: flex-start; margin-bottom: 15px;";
    let btnVolver = document.createElement("button");
    btnVolver.innerHTML = "⬅ Volver a la Plaza";
    btnVolver.style.cssText = "background: #111; border: 1px solid #ffaa00; color: #ffaa00; padding: 5px 15px; cursor: pointer; font-family:'Cinzel', serif; transition: 0.2s;";
    btnVolver.onmouseover = () => { btnVolver.style.background = "#ffaa00"; btnVolver.style.color = "#111"; };
    btnVolver.onmouseout = () => { btnVolver.style.background = "#111"; btnVolver.style.color = "#ffaa00"; };
    btnVolver.onclick = () => mostrarPlazaCentral();
    btnHeaderContainer.appendChild(btnVolver);
    contenedor.appendChild(btnHeaderContainer);

    let cabCount = jugador.tropas.filter(t => t.tipoGeneral === 'caballeros').length;
    let piqCount = jugador.tropas.filter(t => t.tipoGeneral === 'piqueros').length;
    let ballCount = jugador.tropas.filter(t => t.tipoGeneral === 'ballesteros').length;
    
    let headerReclutamiento = document.createElement("div");
    headerReclutamiento.style.cssText = "text-align: center; margin-bottom: 20px; position: relative;";
    
    headerReclutamiento.innerHTML = `
        <div class="hover-armada-container">
            <div class="texto-pulso txt-sagrado">
                🛡️ VER TU COMPAÑÍA ACTUAL
            </div>
            <div class="tooltip-armada">
                <h4 style="margin: 0 0 10px 0; color: #4c88ff; font-family:'Cinzel', serif; border-bottom: 1px solid #333; padding-bottom: 5px; animation: none !important; text-shadow: none !important;">TROPAS EN FILA</h4>
                <div style="display:flex; justify-content:center; gap:15px; margin-top:10px;">
                    <div class="item-card-desplegado soldier-frame" style="min-width:100px; border-color:#d4af37; animation: none !important;">
                        <img src="assets/img/personajes/aliados/caballero_noble.webp" style="animation: none !important;">
                        <div style="font-size:11px; color:#fff; background-color:#111; border:1px solid #555; border-radius:3px; padding:3px; text-align:center; box-shadow:0 0 5px #000; position:relative; z-index:10; margin-top:-8px; font-weight:bold; text-transform:uppercase; animation: none !important; text-shadow: none !important;">CABALLEROS</div>
                        <div style="color:#ffd700; font-weight:bold; font-size:18px; margin-top:5px; text-shadow: 0 0 5px #4c88ff; animation: none !important;">x${cabCount}</div>
                    </div>
                    <div class="item-card-desplegado soldier-frame" style="min-width:100px; border-color:#d4af37; animation: none !important;">
                        <img src="assets/img/personajes/aliados/piquero_noble.webp" style="animation: none !important;">
                        <div style="font-size:11px; color:#fff; background-color:#111; border:1px solid #555; border-radius:3px; padding:3px; text-align:center; box-shadow:0 0 5px #000; position:relative; z-index:10; margin-top:-8px; font-weight:bold; text-transform:uppercase; animation: none !important; text-shadow: none !important;">PIQUEROS</div>
                        <div style="color:#ffd700; font-weight:bold; font-size:18px; margin-top:5px; text-shadow: 0 0 5px #4c88ff; animation: none !important;">x${piqCount}</div>
                    </div>
                    <div class="item-card-desplegado soldier-frame" style="min-width:100px; border-color:#d4af37; animation: none !important;">
                        <img src="assets/img/personajes/aliados/ballestero_noble.webp" style="animation: none !important;">
                        <div style="font-size:11px; color:#fff; background-color:#111; border:1px solid #555; border-radius:3px; padding:3px; text-align:center; box-shadow:0 0 5px #000; position:relative; z-index:10; margin-top:-8px; font-weight:bold; text-transform:uppercase; animation: none !important; text-shadow: none !important;">BALLESTEROS</div>
                        <div style="color:#ffd700; font-weight:bold; font-size:18px; margin-top:5px; text-shadow: 0 0 5px #4c88ff; animation: none !important;">x${ballCount}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contenedor.appendChild(headerReclutamiento);

    let grid = document.createElement("div");
    grid.className = "grid-items";
    
    for(let key in bdTiposTropa) {
        let tropa = bdTiposTropa[key];
        
        if(tropa.clase === "unico" || tropa.clase === "unico_random" || tropa.clase === "noble" || tropa.tipoG === "cautivos") continue; 

        let card = document.createElement("div");
        card.className = `item-card tropa-mercenaria`;
        card.innerHTML = `
            <img src="${tropa.img}" alt="${tropa.nombre}">
            <div style="margin-top:10px; font-weight:bold; font-size:15px; color:#fff;">${tropa.nombre}</div>
            <div class="stats-tropa" style="margin-top:8px;">⚔️ ${tropa.atk} | 🛡️ ${tropa.def}</div>
            <div class="txt-sagrado" style="margin-top:8px; font-size:14px;">💰 ${tropa.precio} Denarios</div>
            <button style="width:100%; padding:8px; margin-top:10px; font-size:12px; font-weight:bold; border-color:#fff;">+ Llamar a filas</button>
        `;
        card.querySelector("button").onclick = () => agregarAlCarrito(key);
        grid.appendChild(card);
    }
    contenedor.appendChild(grid);
    
    document.getElementById("tienda-carrito").style.display = "block";
    renderizarCarrito();
}

function agregarAlCarrito(idTropa) {
    if(!carritoMercenarios[idTropa]) carritoMercenarios[idTropa] = 0;
    
    let costoTotalGlobal = calcularCostoCarrito() + calcularCostoCarritoObjetos();
    let tropa = bdTiposTropa[idTropa];
    
    if(jugador.denarios >= (costoTotalGlobal + tropa.precio)) {
        carritoMercenarios[idTropa]++;
        renderizarCarrito();
    } else {
        mostrarAlertaCustom("Tu oro total no alcanza para cubrir este contrato de sangre, Comandante.");
    }
}

function restarDelCarrito(idTropa) {
    if(carritoMercenarios[idTropa] && carritoMercenarios[idTropa] > 0) {
        carritoMercenarios[idTropa]--;
        if(carritoMercenarios[idTropa] === 0) delete carritoMercenarios[idTropa];
        renderizarCarrito();
    }
}

window.vaciarCarrito = function() {
    window.vaciarCarritoSeccion('reclutamiento');
    renderizarCarrito();
};

function calcularCostoCarrito() {
    let total = 0;
    for(let key in carritoMercenarios) {
        total += (bdTiposTropa[key].precio * carritoMercenarios[key]);
    }
    return total;
}

function renderizarCarrito() {
    const contenedorItems = document.getElementById("carrito-items");
    const costoTotalSpan = document.getElementById("carrito-total");
    const restantesSpan = document.getElementById("carrito-restantes");

    let costoEstaSeccion = calcularCostoCarrito();
    let costoTotalGlobal = costoEstaSeccion + calcularCostoCarritoObjetos();
    let restantes = jugador.denarios - costoTotalGlobal;

    costoTotalSpan.innerText = costoEstaSeccion;
    restantesSpan.innerText = restantes;

    contenedorItems.innerHTML = "";
    let hayItems = false;

    for(let key in carritoMercenarios) {
        let cantidad = carritoMercenarios[key];
        if(cantidad > 0) {
            hayItems = true;
            let tropa = bdTiposTropa[key];
            let miniCard = document.createElement("div");
            miniCard.className = "item-card-desplegado soldier-frame";
            miniCard.style.position = "relative";
            miniCard.style.minWidth = "110px"; 
            miniCard.style.margin = "5px"; 
            
            miniCard.innerHTML = `
                <img src="${tropa.img}">
                <div class="unidad-nombre-aleatorio" style="font-size:12px;">${tropa.nombre}</div>
                <div class="txt-comendador" style="font-weight:bold; font-size:16px; margin-top:5px;">x${cantidad}</div>
                
                <button class="btn-restar-carrito" style="position:absolute; top:-10px; right:-10px; background:#ff4c4c; color:white; border-radius:50%; width:28px; height:28px; padding:0; border:2px solid #111; font-weight:bold; cursor:pointer; box-shadow: 0 0 5px #000;">-</button>
            `;
            miniCard.querySelector(".btn-restar-carrito").onclick = () => restarDelCarrito(key);
            contenedorItems.appendChild(miniCard);
        }
    }

    if(!hayItems) {
        contenedorItems.innerHTML = `<span class="txt-multitud" style="width:100%; text-align:center;">Las filas están vacías. Recluta hombres arriba.</span>`;
    }
}

window.confirmarCompra = function() {
    let costoTotal = calcularCostoCarrito();
    if(costoTotal === 0) {
        mostrarAlertaCustom("Tus filas están vacías. Recluta hombres arriba si deseas engrosar la hueste.");
        return;
    }

    let cantidadTropasAntes = jugador.tropas.length;

    let costoCab = (carritoMercenarios['caballero_mercenario'] || 0) * (bdTiposTropa['caballero_mercenario'] ? bdTiposTropa['caballero_mercenario'].precio : 0);
    let costoPiq = (carritoMercenarios['piquero_mercenario'] || 0) * (bdTiposTropa['piquero_mercenario'] ? bdTiposTropa['piquero_mercenario'].precio : 0);
    let costoBall = (carritoMercenarios['ballestero_mercenario'] || 0) * (bdTiposTropa['ballestero_mercenario'] ? bdTiposTropa['ballestero_mercenario'].precio : 0);

    jugador.denarios -= costoTotal;
    let denariosSobrantes = jugador.denarios;
    
    for(let key in carritoMercenarios) {
        agregarTropa(key, carritoMercenarios[key]); 
    }

    if (typeof Cronicas !== "undefined") {
        let tropasReclutadas = jugador.tropas.slice(cantidadTropasAntes);
        let nombresCab = tropasReclutadas.filter(t => t.tipoGeneral === "caballeros").map(t => t.nombre);
        let nombresPiq = tropasReclutadas.filter(t => t.tipoGeneral === "piqueros").map(t => t.nombre);
        let nombresBall = tropasReclutadas.filter(t => t.tipoGeneral === "ballesteros").map(t => t.nombre);

        Cronicas.registrar("RECLUTAMIENTO", {
            costo: costoTotal,
            costoCab: costoCab,
            costoPiq: costoPiq,
            costoBall: costoBall,
            denariosSobrantes: denariosSobrantes,
            caballeros: nombresCab,
            piqueros: nombresPiq,
            ballesteros: nombresBall
        });
    }

    carritoMercenarios = {};
    actualizarHUD();
    renderizarTiendaReclutamiento(); 
    
    mostrarAlertaCustom("¡Trato cerrado con sangre y plata! Los hombres han jurado lealtad a tu estandarte.");
};


// =========================================================================
// === SECCIÓN 2: MERCADO DE SUMINISTROS Y MEJORAS (Objetos por tienda) ===
// =========================================================================

function renderizarTiendaObjetos() {
    const seccion = window.seccionTiendaActiva;
    if (!seccion) return;

    const contenedor = document.getElementById("tienda-contenido");
    contenedor.innerHTML = "";
    
    let hardcodedCart = document.getElementById("tienda-carrito");
    if(hardcodedCart) hardcodedCart.style.display = "none";

    let btnHeaderContainer = document.createElement("div");
    btnHeaderContainer.style.cssText = "display: flex; justify-content: flex-start; margin-bottom: 15px;";
    let btnVolver = document.createElement("button");
    btnVolver.innerHTML = "⬅ Volver a la Plaza";
    btnVolver.style.cssText = "background: #111; border: 1px solid #ffaa00; color: #ffaa00; padding: 5px 15px; cursor: pointer; font-family:'Cinzel', serif; transition: 0.2s;";
    btnVolver.onmouseover = () => { btnVolver.style.background = "#ffaa00"; btnVolver.style.color = "#111"; };
    btnVolver.onmouseout = () => { btnVolver.style.background = "#111"; btnVolver.style.color = "#ffaa00"; };
    btnVolver.onclick = () => mostrarPlazaCentral();
    btnHeaderContainer.appendChild(btnVolver);
    contenedor.appendChild(btnHeaderContainer);

    let grid = document.createElement("div");
    grid.className = "grid-items";
    grid.style.padding = "10px";
    
    let totalBocas = jugador.tropas.filter(t => t.hp > 0).length;
    if (jugador.comandantes) {
        totalBocas += jugador.comandantes.filter(c => c.hp > 0).length;
    }

    let hayObjetos = false;

    for (let key in bdObjetos) {
        // FILTROS TÁCTICOS: Ocultar basura con valor 0 o equipo irrelevante según tienda
        if(key === "pan_podrido" || key === "cerveza_agria" || key === "manzana_fresca" || key === "manzana_podrida") continue; 
        
        let itemValido = false;
        let objMeta = bdObjetos[key];

        if (seccion === "forja" && key === "espada_forjada") itemValido = true;
        if (seccion === "panadero" && objMeta.categoria === "comida" && objMeta.precio > 0) itemValido = true;
        if (seccion === "taberna" && objMeta.categoria === "bebida" && objMeta.precio > 0) itemValido = true;
        if (seccion === "curandera" && objMeta.categoria === "medicina") itemValido = true;
        
        if (!itemValido) continue;
        
        hayObjetos = true;
        let item = bdObjetos[key];
        
        let extraInfo = "";
        let displayNombreTienda = item.nombre;

        if (key === "pan_cevada") {
            extraInfo = `<br><br><span style="color:#88ff88; font-weight:bold;">(Tu compañía cuenta con ${totalBocas} bocas que alimentar)</span>`;
            displayNombreTienda = "Lote de Pan de Cevada (x10)";
        } else if (key === "cerveza_mesa") {
            extraInfo = `<br><br><span style="color:#88ff88; font-weight:bold;">(Tu compañía cuenta con ${totalBocas} gaznates sedientos)</span>`;
            displayNombreTienda = "Barriles de Cerveza de Mesa (x4)";
        }

        let card = document.createElement("div");
        card.className = "item-card";
        card.style.width = "220px"; 
        card.style.border = "2px solid #8b0000";
        card.style.background = "#1a0a0a";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justifyContent = "space-between";
        
        card.innerHTML = `
            <div>
                <img src="${item.img}" alt="${item.nombre}" style="width: 100%; border-radius: 3px; border: 1px solid #444;">
                <div style="margin-top:10px; font-weight:bold; font-size:16px; color:#ffaa00; font-family:'Cinzel', serif;">${displayNombreTienda}</div>
                <div style="font-size:13px; color:#c0c0c0; margin-top:8px; font-style:italic; min-height:40px;">${item.descTienda}${extraInfo}</div>
            </div>
            <div>
                <div class="txt-hereje" style="margin-top:10px; font-size:16px; font-weight:bold;">💰 ${item.precio} Denarios</div>
                <button style="width:100%; padding:10px; margin-top:12px; font-size:14px; font-weight:bold; border: 1px solid #ffaa00; background: linear-gradient(to bottom, #4a3e12, #1a1604); color:#ffd700; cursor:pointer;" onclick="agregarObjetoAlCarrito('${key}')">Añadir al Morral</button>
            </div>
        `;
        grid.appendChild(card);
    }

    if (!hayObjetos) {
        let pEmpty = document.createElement("p");
        pEmpty.className = "txt-multitud";
        pEmpty.style.cssText = "margin-top: 50px; text-align:center;";
        pEmpty.innerText = "El mercader no tiene objetos por el momento.";
        contenedor.appendChild(pEmpty);
    } else {
        contenedor.appendChild(grid);
    }

    let divCarrito = document.getElementById("carrito-objetos-container");
    if (!divCarrito) {
        divCarrito = document.createElement("div");
        divCarrito.id = "carrito-objetos-container";
        divCarrito.style.cssText = "background:#111; padding: 12px 20px; border-radius: 8px; border: 2px solid #555; margin-top: 10px;";
        
        divCarrito.innerHTML = `
            <h4 style="margin-top:0; color:#88ff88; border-bottom: 1px solid #333; padding-bottom: 5px; text-align: left; margin-bottom: 5px;">🛒 MORRAL DEL MERCADER</h4>
            <div id="carrito-objetos-items" class="carrito-items-ext" style="display:flex;"></div>
            <div class="carrito-footer">
                <div class="carrito-totales">
                    <div>Costo en esta tienda: <span id="carrito-objetos-total" class="costo">0</span> Denarios</div>
                    <div>Fondo Restante: <span id="carrito-objetos-restantes" class="fondo">${jugador.denarios}</span> Denarios</div>
                </div>
                <div class="carrito-botones">
                    <button class="btn-disolver" onclick="window.vaciarCarritoSeccion(window.seccionTiendaActiva); renderizarTiendaObjetos();">Descartar Pedido</button>
                    <button class="btn-sellar" onclick="confirmarCompraObjetos()">Pagar y Guardar</button>
                </div>
            </div>
        `;
        contenedor.parentNode.appendChild(divCarrito); 
    } else {
        divCarrito.style.display = "block"; 
    }
    
    renderizarCarritoObjetos();
}

window.agregarObjetoAlCarrito = function(idItem) {
    if(!carritoObjetos[idItem]) carritoObjetos[idItem] = 0;
    
    let costoTotalGlobal = calcularCostoCarrito() + calcularCostoCarritoObjetos();
    let item = bdObjetos[idItem];
    
    if(jugador.denarios >= (costoTotalGlobal + item.precio)) {
        carritoObjetos[idItem]++;
        renderizarCarritoObjetos();
    } else {
        mostrarAlertaCustom("Tu reserva de denarios no alcanza para este trato, Comandante.");
    }
};

window.restarObjetoDelCarrito = function(idItem) {
    if(carritoObjetos[idItem] && carritoObjetos[idItem] > 0) {
        carritoObjetos[idItem]--;
        if(carritoObjetos[idItem] === 0) delete carritoObjetos[idItem];
        renderizarCarritoObjetos();
    }
};

function calcularCostoCarritoObjetos(seccionFiltro = null) {
    let total = 0;
    for(let key in carritoObjetos) {
        let item = bdObjetos[key];
        let itemSeccion = "";
        if(item.categoria === "arma" || item.categoria === "armadura" || item.categoria.startsWith("armadura_") || item.categoria === "escudo_roble") itemSeccion = "forja";
        else if(item.categoria === "comida") itemSeccion = "panadero";
        else if(item.categoria === "bebida") itemSeccion = "taberna";
        else if(item.categoria === "medicina") itemSeccion = "curandera";
        
        if (!seccionFiltro || itemSeccion === seccionFiltro) {
            total += (item.precio * carritoObjetos[key]);
        }
    }
    return total;
}

function renderizarCarritoObjetos() {
    const contenedorItems = document.getElementById("carrito-objetos-items");
    if(!contenedorItems) return; 
    
    const costoTotalSpan = document.getElementById("carrito-objetos-total");
    const restantesSpan = document.getElementById("carrito-objetos-restantes");

    let seccionActual = window.seccionTiendaActiva;
    let costoEstaTienda = calcularCostoCarritoObjetos(seccionActual);
    let costoTotalGlobal = calcularCostoCarrito() + calcularCostoCarritoObjetos();
    let restantes = jugador.denarios - costoTotalGlobal;

    costoTotalSpan.innerText = costoEstaTienda;
    restantesSpan.innerText = restantes;

    contenedorItems.innerHTML = "";
    let hayItems = false;

    for(let key in carritoObjetos) {
        let item = bdObjetos[key];
        let itemSeccion = (item.categoria === "arma" || item.categoria === "armadura" || item.categoria.startsWith("armadura_") || item.categoria === "escudo_roble") ? "forja" : (item.categoria === "medicina" ? "curandera" : (item.categoria === "comida" ? "panadero" : "taberna"));
        
        if(itemSeccion === seccionActual && carritoObjetos[key] > 0) {
            hayItems = true;
            let cantidad = carritoObjetos[key];
            
            let displayNombreCarrito = item.nombre;
            if(key === "pan_cevada") displayNombreCarrito = "Lote de Pan";
            if(key === "cerveza_mesa") displayNombreCarrito = "Barril de Cerveza";

            let miniCard = document.createElement("div");
            miniCard.className = "item-card-desplegado soldier-frame";
            miniCard.style.position = "relative";
            miniCard.style.minWidth = "110px"; 
            miniCard.style.margin = "5px"; 
            
            miniCard.innerHTML = `
                <img src="${item.img}" style="height:60px; object-fit:contain; background:#000;">
                <div class="unidad-nombre-aleatorio" style="font-size:11px;">${displayNombreCarrito}</div>
                <div class="txt-comendador" style="font-weight:bold; font-size:16px; margin-top:5px;">x${cantidad}</div>
                
                <button class="btn-restar-carrito" style="position:absolute; top:-10px; right:-10px; background:#ff4c4c; color:white; border-radius:50%; width:28px; height:28px; padding:0; border:2px solid #111; font-weight:bold; cursor:pointer; box-shadow: 0 0 5px #000;">-</button>
            `;
            miniCard.querySelector(".btn-restar-carrito").onclick = () => restarObjetoDelCarrito(key);
            contenedorItems.appendChild(miniCard);
        }
    }

    if(!hayItems) {
        contenedorItems.innerHTML = `<span class="txt-multitud" style="width:100%; text-align:center;">Aún no has acordado nada con este mercader.</span>`;
    }
}

window.confirmarCompraObjetos = function() {
    let seccion = window.seccionTiendaActiva;
    let costoSeccion = calcularCostoCarritoObjetos(seccion);
    
    if(costoSeccion === 0) {
        mostrarAlertaCustom("No hay tratos pendientes en este mercader. Selecciona algo antes de soltar tus monedas.");
        return;
    }

    jugador.denarios -= costoSeccion;
    
    let diaActual = (typeof RelojDivino !== 'undefined') ? RelojDivino.diaActualIndex : 0;
    let horaActual = (typeof RelojDivino !== 'undefined') ? RelojDivino.indiceActual : 0;
    let fechaActualStr = (typeof RelojDivino !== 'undefined') ? RelojDivino.obtenerFechaActual().fecha : "Fecha desconocida";

    for(let key in carritoObjetos) {
        let item = bdObjetos[key];
        let itemSeccion = (item.categoria === "arma" || item.categoria === "armadura" || item.categoria.startsWith("armadura_") || item.categoria === "escudo_roble") ? "forja" : (item.categoria === "medicina" ? "curandera" : (item.categoria === "comida" ? "panadero" : "taberna"));
        
        if (itemSeccion === seccion && carritoObjetos[key] > 0) {
            let cantidadComprada = carritoObjetos[key];
            for(let c = 0; c < cantidadComprada; c++) {
                if (key === "pan_cevada") {
                    for(let i = 0; i < 10; i++) jugador.inventario.push({ id: key, diaCompra: diaActual, horaCompra: horaActual, fechaTexto: fechaActualStr });
                } else if (key === "cerveza_mesa") {
                    for(let i = 0; i < 4; i++) jugador.inventario.push({ id: key, diaCompra: diaActual, horaCompra: horaActual, fechaTexto: fechaActualStr });
                } else {
                    jugador.inventario.push(key);
                }
            }
            delete carritoObjetos[key]; 
        }
    }

    if (typeof actualizarHUD === "function") actualizarHUD();
    renderizarTiendaObjetos(); 
    
    mostrarAlertaCustom("¡Trato cerrado! Los artículos han sido resguardados en tus carretas.");
};

// =========================================================================
// === SALIDA GENERAL Y CIERRE DE PLAZA ===
// =========================================================================

function cerrarTienda() {
    if(faseReclutamientoInicial) {
        let costoTotalPendiente = calcularCostoCarrito() + calcularCostoCarritoObjetos();
        
        if(costoTotalPendiente > 0) {
            mostrarAlertaCustom("¡Tienes tratos sin pagar en la Plaza! Visita a los mercaderes correspondientes para sellar el pacto con plata, o descarta los pedidos para poder marchar.");
            return;
        }

        mostrarConfirmacionCustom(
            "¡ATENCIÓN COMANDANTE! Si marchas ahora, dejarás atrás la seguridad de la plaza y comenzará oficialmente la campaña en el bosque hostil. Ya no podrás comprar ni reclutar.<br><br>¿Estás completamente seguro de partir?",
            () => {
                faseReclutamientoInicial = false;
                window.tiendaBloqueadaBosque = true; 
                
                document.getElementById("tienda-overlay").style.display = "none";
                if (typeof AudioManager !== "undefined" && typeof AudioManager.stopBGMOverlay === "function") {
                    AudioManager.stopBGMOverlay();
                }
                escena1(); 
            }
        );
    } else {
        if(Object.keys(carritoObjetos).length > 0 && calcularCostoCarritoObjetos() > 0) {
            mostrarConfirmacionCustom(
                "Tienes mercancía apartada sin pagar. Si abandonas la plaza ahora, el mercader deshará el trato y perderás todo lo seleccionado.<br><br>¿Deseas salir de todas formas?",
                () => {
                    carritoObjetos = {}; 
                    let carritoContainer = document.getElementById("carrito-objetos-container");
                    if (carritoContainer) carritoContainer.style.display = "none";
                    
                    document.getElementById("tienda-overlay").style.display = "none";
                    if (typeof AudioManager !== "undefined" && typeof AudioManager.stopBGMOverlay === "function") {
                        AudioManager.stopBGMOverlay();
                    }
                }
            );
            return;
        }
        
        let carritoContainer = document.getElementById("carrito-objetos-container");
        if (carritoContainer) carritoContainer.style.display = "none";
        let hardcodedCart = document.getElementById("tienda-carrito");
        if (hardcodedCart) hardcodedCart.style.display = "none";
        
        document.getElementById("tienda-overlay").style.display = "none";
        if (typeof AudioManager !== "undefined" && typeof AudioManager.stopBGMOverlay === "function") {
            AudioManager.stopBGMOverlay();
        }
    }
}