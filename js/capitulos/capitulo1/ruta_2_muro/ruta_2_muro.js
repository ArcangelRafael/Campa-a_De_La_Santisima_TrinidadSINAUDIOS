/* === RUTA_2_MURO.JS - NARRATIVA OPCIÓN 2 (EL MURO DE LOS PENITENTES) === */

async function capitulo1_opcionII_Inicio() {
    limpiarBotones(); storyArea.innerHTML = "";
    agregarTexto(`Has escogido: <b>II. El Muro de los Penitentes</b>`, "mensaje-sistema");
    
    await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Fieles Ballesteros! ¡Ascended por la cresta de piedra..."`, claseTexto: "txt-comandante" });

    GestorEstado.modificarFe(1, "la disciplina de hierro impuesta");
    let victoria = await combateAtaqueVsAtaque(4);
    if(victoria) await victoriaCombate(); else await capitulo1_opcionII_Fallo1();
}

async function capitulo1_opcionII_Fallo1() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq", texto: `"Señor, los paganos han advertido la posición de nuestros ballesteros... ¿Qué ordenáis?"`, claseTexto: "txt-lugarteniente" });

    crearBoton("El Repliegue de las Saetas", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Hijos de la Luz! ¡Replegaos al instante!"`, claseTexto: "txt-comandante" });
        GestorEstado.modificarFe(-2, "una orden de repliegue apresurada"); GestorEstado.modificarAtaque(-2, "desorganización táctica");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else await capitulo1_opcionII_DerrotaRepliegue();
    });
    crearBoton("Amparo a los Ballesteros", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡Niego tal orden! ¡Es imperativo que mantengan la posición..."`, claseTexto: "txt-comandante" });
        GestorEstado.modificarFe(1, "valentía táctica temeraria"); GestorEstado.modificarAtaque(1, "posicionamiento firme");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else await capitulo1_opcionII_Fallo2();
    });
}

async function capitulo1_opcionII_DerrotaRepliegue() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    agregarTexto("Los paganos se abalanzan sobre nuestros saeteros; son feroces en la cercanía...");
    
    crearBoton("El Sacrificio de los Justos", () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        jugador.ataqueBase = 0; GestorEstado.modificarFe(-3, "el sacrificio desesperado de las filas"); GestorEstado.modificarVidas(-1, "un asalto directo al mando");
        crearBoton("Continuar", capitulo1_DerrotaFinal);
    });
    crearBoton("Luchar o Perecer", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/lider_caballeromontado.webp", nombrePersonaje: "Sir Alexandro", alineacion: "izq", bordeClase: "borde-aliado", nombreClase: "nombre-izq", texto: `"No, la salvación de esta campaña depende de esas saetas..."`, claseTexto: "txt-lugarteniente" });
        GestorEstado.modificarFe(1, "la moral inquebrantable del lugarteniente");
        
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombateAlexandro(); else capitulo1_DerrotaFinal();
    });
}

async function capitulo1_opcionII_Fallo2() {
    limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
    await MotorDialogos.mostrarDialogo({ personajeImg: "assets/img/personajes/aliados/jugador.webp", nombrePersonaje: `Comendador ${jugador.nombre}`, alineacion: "izq", bordeClase: "borde-comandante", nombreClase: "nombre-comandante", texto: `"¡He acudido en vuestro socorro, mas requiero de vuestra puntería certera!..."`, claseTexto: "txt-comandante" });
    crearBoton("Auxilio al Comendador", async () => {
        limpiarBotones(); agregarTexto("<div class='separador'>***</div>");
        GestorEstado.modificarAtaque(-1, "descoordinación en la ayuda"); GestorEstado.modificarFe(-1, "dudas en la retaguardia");
        let victoria = await combateAtaqueVsAtaque(4);
        if(victoria) await victoriaCombate(); else capitulo1_DerrotaFinal();
    });
}