/* === RUTA_3_CARRETAS.JS - NARRATIVA OPCIÓN 3 (EL SACRIFICIO DEL CAMINO) === */

async function capitulo1_opcionIII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>III. El Sacrificio del Camino</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Atajad el paso con los carros de carga y sed roca ante el enemigo!..."`, claseTexto: "txt-comandante" });
    
    GestorEstado.modificarFe(2, "asegurar defensas improvisadas");
    crearBoton("¡Todos a la Vanguardia del Carro!", async () => await capitulo1_opcionIII_Vanguardia());
    crearBoton("¡Dividíos! ¡Dos grupos de combate!", async () => await capitulo1_opcionIII_Dividios());
}

async function capitulo1_opcionIII_Vanguardia() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Soldados de Cristo, os requiero a todos en la defensa de los carros!..."`, claseTexto: "txt-comandante" });
    
    GestorEstado.modificarFe(1, "presencia de mando en la línea");
    let victoria = await combateDefensaVsAtaque(4);
    
    if (victoria) {
        await victoriaVanguardia();
    } else {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Sostened la línea! ¡No desfallezcáis!"`, claseTexto: "txt-comandante" });
        crearBoton("¡Firmeza y Penitencia!", () => {
            limpiarBotones(); GestorEstado.modificarFe(2, "firmeza en la adversidad");
            crearBoton(`${jugador.nombre} se entrega a la lid`, async () => {
                limpiarBotones(); GestorEstado.modificarAtaque(3, "la ira del Comendador");
                let v2 = await combateAtaqueVsAtaque(4);
                if(v2) await victoriaCombateSolemne(); else capitulo1_DerrotaFinal();
            });
        });
    }
}

async function capitulo1_opcionIII_Dividios() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    GestorEstado.modificarAtaque(-1, "división de las fuerzas"); GestorEstado.modificarFe(-1, "la confusión en las órdenes");
    
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) { await victoriaCombate(); } else {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡No demoréis vuestro retorno, Alexandro!..."`, claseTexto: "txt-comandante" });
        crearBoton(`${jugador.nombre} Se entrega al combate`, async () => {
            limpiarBotones(); GestorEstado.modificarAtaque(3, "furia desesperada del mando");
            let v2 = await combateAtaqueVsAtaque(4);
            if(v2) await victoriaCombate(); else await capitulo1_opcionIII_Dividios_Fallo2();
        });
    }
}

async function capitulo1_opcionIII_Dividios_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    GestorEstado.modificarAtaque(5, "sacrificio total de la línea");
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) await victoriaCombateSolemne(); else capitulo1_DerrotaFinal();
}