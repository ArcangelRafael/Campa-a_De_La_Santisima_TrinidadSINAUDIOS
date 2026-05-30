/* === TIENDA.JS - SISTEMA DE RECLUTAMIENTO MILITAR === */

let faseReclutamientoInicial = false;
let carritoMercenarios = {}; 

function iniciarReclutamiento() {
    faseReclutamientoInicial = true;
    carritoMercenarios = {}; 
    
    const overlay = document.getElementById("tienda-overlay");
    
    if (typeof cambiarMusica === 'function') {
        cambiarMusica("bgm-tienda");
    }

    renderizarTienda();
    renderizarCarrito(); 
    
    overlay.style.display = "flex";
}

function renderizarTienda() {
    const contenedor = document.getElementById("tienda-contenido");
    contenedor.innerHTML = "";

    let cabCount = jugador.tropas.filter(t => t.tipoGeneral === 'caballeros').length;
    let piqCount = jugador.tropas.filter(t => t.tipoGeneral === 'piqueros').length;
    let ballCount = jugador.tropas.filter(t => t.tipoGeneral === 'ballesteros').length;
    
    let headerReclutamiento = document.createElement("div");
    headerReclutamiento.style.cssText = "text-align: center; margin-bottom: 20px; position: relative;";
    
    // FIX TÁCTICO: Separación estructural. El tooltip ya no está DENTRO del texto que parpadea.
    headerReclutamiento.innerHTML = `
        <style>
            @keyframes pulsoArmada {
                0% { color: #4c88ff; text-shadow: 0 0 5px #4c88ff; }
                50% { color: #fff; text-shadow: 0 0 15px #fff; }
                100% { color: #4c88ff; text-shadow: 0 0 5px #4c88ff; }
            }
            .tooltip-armada {
                display: none;
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10, 10, 15, 0.98);
                border: 2px solid #4c88ff;
                padding: 15px;
                border-radius: 8px;
                z-index: 500;
                box-shadow: 0 10px 30px rgba(0,0,0,1);
                min-width: 380px;
                cursor: default;
                animation: none !important;
                text-shadow: none !important;
            }
            .hover-armada-container {
                display: inline-block;
                position: relative;
                cursor: help;
            }
            .hover-armada-container:hover .tooltip-armada {
                display: block;
            }
            .texto-pulso {
                animation: pulsoArmada 2s infinite;
                font-size: 18px;
                font-weight: bold;
                padding: 5px 10px;
                display: inline-block;
            }
        </style>
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
        
        if(tropa.clase === "unico" || tropa.clase === "unico_random" || tropa.clase === "noble") continue; 

        let card = document.createElement("div");
        let claseBorde = tropa.clase === 'noble' ? 'tropa-noble' : 'tropa-mercenaria';

        card.className = `item-card ${claseBorde}`;
        
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
}

function agregarAlCarrito(idTropa) {
    if(!carritoMercenarios[idTropa]) carritoMercenarios[idTropa] = 0;
    let costoActual = calcularCostoCarrito();
    let tropa = bdTiposTropa[idTropa];
    
    if(jugador.denarios >= (costoActual + tropa.precio)) {
        carritoMercenarios[idTropa]++;
        renderizarCarrito();
    } else {
        alert("Tu oro no alcanza para más hombres, Comandante.");
    }
}

function restarDelCarrito(idTropa) {
    if(carritoMercenarios[idTropa] && carritoMercenarios[idTropa] > 0) {
        carritoMercenarios[idTropa]--;
        if(carritoMercenarios[idTropa] === 0) delete carritoMercenarios[idTropa];
        renderizarCarrito();
    }
}

function vaciarCarrito() {
    carritoMercenarios = {};
    renderizarCarrito();
}

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

    let costoTotal = calcularCostoCarrito();
    let restantes = jugador.denarios - costoTotal;

    costoTotalSpan.innerText = costoTotal;
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

function confirmarCompra() {
    let costoTotal = calcularCostoCarrito();
    if(costoTotal === 0) {
        alert("Tus filas están vacías. Llama hombres arriba si deseas reclutar antes de partir.");
        return;
    }

    jugador.denarios -= costoTotal;
    
    for(let key in carritoMercenarios) {
        agregarTropa(key, carritoMercenarios[key]); 
    }

    vaciarCarrito();
    actualizarHUD();
    
    alert("¡Trato hecho! Los hombres han jurado lealtad a tu estandarte. La marcha comienza ahora.");
    
    faseReclutamientoInicial = false;
    document.getElementById("tienda-overlay").style.display = "none";
    
    escena1();
}

function abrirTienda() {
    if(faseReclutamientoInicial) {
        alert("Organiza tus filas de reclutamiento antes de distraerte.");
        return;
    }
    alert("El herrero no tiene objetos por el momento.");
}

function cerrarTienda() {
    if(faseReclutamientoInicial) {
        if(Object.keys(carritoMercenarios).length > 0 && calcularCostoCarrito() > 0) {
            alert("¡Tienes hombres esperando en las filas sin confirmar! Sella el pacto o usa 'Disolver Filas' antes de marchar.");
            return;
        }

        let seguro = confirm("¡ATENCIÓN! Si marchas ahora, no podrás reclutar más tropas hasta encontrar otra ciudad. ¿Estás listo para la guerra?");
        if(seguro) {
            faseReclutamientoInicial = false;
            document.getElementById("tienda-overlay").style.display = "none";
            escena1(); 
        }
    } else {
        document.getElementById("tienda-overlay").style.display = "none";
    }
}