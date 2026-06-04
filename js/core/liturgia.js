/* === LITURGIA.JS - BASE DE DATOS DEL CALENDARIO SANTORAL Y REZOS === */

const DescripcionesHoras = [
    "Alabanzas del amanecer. La hueste despierta con la luz de Cristo.",
    "Primera hora del día. Comienza la marcha hacia la gloria.",
    "Media mañana. El fervor y la fatiga aumentan bajo el sol.",
    "El mediodía. El sol castiga a justos y pecadores por igual.",
    "Media tarde. El cansancio se asienta, pero la fe sostiene el acero.",
    "El ocaso. La luz mengua y se elevan rezos por los caídos.",
    "La noche cae. Última oración antes del descanso en el campamento."
];

const OracionesCanonicas = {
    "Laudes": { v1: "V. Domine, labia mea aperies.", r1: "R. Et os meum annuntiabit laudem tuam.", v2: "V. Deus, in adiutorium meum intende.", r2: "R. Domine, ad adiuvandum me festina.<br><br>Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen. Alleluia." },
    "Prima": { v1: "V. Deus, in adiutorium meum intende.", r1: "R. Domine, ad adiuvandum me festina.", v2: "V. Dirigere et sanctificare, regere et gubernare dignare, Domine Deus.", r2: "R. Corda et corpora nostra in lege tua, et in operibus mandatorum tuorum. Amen." },
    "Tercia": { v1: "V. Deus, in adiutorium meum intende.", r1: "R. Domine, ad adiuvandum me festina.", v2: "V. Nunc, Sancte, nobis, Spiritus, unum Patri cum Filio.", r2: "R. Dignare promptus ingeri, nostro refusus pectori. Amen." },
    "Sexta": { v1: "V. Deus, in adiutorium meum intende.", r1: "R. Domine, ad adiuvandum me festina.", v2: "V. Rector potens, verax Deus, qui temperas rerum vices.", r2: "R. Extingue flammas litium, aufer calorem noxium. Amen." },
    "Nona": { v1: "V. Deus, in adiutorium meum intende.", r1: "R. Domine, ad adiuvandum me festina.", v2: "V. Rerum Deus tenax vigor, immotus in te permanens.", r2: "R. Lucis diurnae tempora successibus determinans. Amen." },
    "Vísperas": { v1: "V. Deus, in adiutorium meum intende.", r1: "R. Domine, ad adiuvandum me festina.", v2: "V. Dirigatur, Domine, oratio mea.", r2: "R. Sicut incensum in conspectu tuo. Amen." },
    "Completas": { v1: "V. Iube, domne, benedicere. Noctem quietam et finem perfectum concedat nobis Dominus omnipotens. Amen.<br>V. Converte nos, Deus, salutaris noster.", r1: "R. Et averte iram tuam a nobis.", v2: "V. Deus, in adiutorium meum intende.", r2: "R. Domine, ad adiuvandum me festina.<br><br>Gloria Patri et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen." }
};

const OracionesEspeciales = {
    divinasAlabanzas: "Benedictus Deus.<br>Benedictum Nomen Sanctum eius.<br>Benedictus Iesus Christus, verus Deus et verus homo.<br>Benedictum Nomen Iesu.<br>Benedictum Cor eius sacratissimum.<br>Benedictus Sanguis eius pretiosissimus.<br>Benedictus Iesus in sanctissimo altaris Sacramento.<br>Benedictus Sanctus Spiritus, Paraclitus.<br>Benedicta excelsa Mater Dei, Maria sanctissima.<br>Benedicta sancta eius et immaculata Conceptio.<br>Benedicta eius gloriosa Assumptio.<br>Benedictum nomen Mariae, Virginis et Matris.<br>Benedictus sanctus Ioseph, eius castissimus Sponsus.<br>Benedictus Deus in Angelis et in Sanctis suis. Amen.",
    veniSancteSpiritus: "Veni, Sancte Spíritus, reple tuórum corda fidélium, et tui amóris in eis ignem accénde. Emítte Spíritum tuum et creabúntur. Et renovábis fáciem terræ.<br><br>Orémus: Deus, qui corda fidélium Sancti Spíritus illustratióne docuísti, da nobis in eódem Spíritu recta sápere, et de eius semper consolatióne gaudére. Per Christum Dóminum nostrum. Amen."
};

const CalendarioSantoral = [
    { 
        fecha: "17 de Diciembre de 1198", santo: "San Lázaro de Betania", 
        biografia: "nuestro Señor lloró ante su tumba antes de arrancarlo de las garras de la muerte? Dice San Agustín que Cristo no lloró por la muerte de la carne, que es natural, sino por la muerte del alma a causa del pecado. Así como la carne de Lázaro llevaba cuatro días pudriéndose, así hiede vuestra alma ante Dios cuando consentís la lujuria, el odio o la codicia del saqueo. El pecado mortal es un sepulcro del que no podéis salir por vuestras propias fuerzas. Requerís que Cristo grite: '¡Sal fuera!', y vosotros, la obediencia de acudir a la santa confesión. ¡Salid de vuestra fosa de inmundicia, Comendador, antes de que la espada enemiga os envíe al infierno para siempre!" 
    }, 
    { 
        fecha: "18 de Diciembre de 1198", santo: "la Expectación del Parto de Nuestra Señora", 
        biografia: "la Purísima Virgen aguardaba con perfecta castidad el nacimiento del Redentor? En este mundo lleno de cerdos, donde los hombres de armas se revuelcan en el fango del instinto y la sangre, debemos imitar el vientre intacto de María. San Bernardo enseñaba que la pureza de corazón espanta a las legiones del demonio mucho más que el acero de nuestras picas. Si marcháis a la batalla con la mente sucia por el recuerdo de rameras o por pensamientos impuros, ya habéis sido derrotados por Satanás antes de sacar la espada. ¡Someted vuestra carne a la Cruz, o la justicia de Dios os aplastará!" 
    }, 
    { 
        fecha: "19 de Diciembre de 1198", santo: "San Anastasio, Papa", 
        biografia: "el Papa San Anastasio se alzó como un azote implacable contra la herejía en Roma? No hubo 'falsa piedad' ni 'diálogo complaciente' en sus bulas, pues tolerar la mentira es odiar el alma del prójimo. Como advierte San Jerónimo: 'Una sola chispa de herejía basta para quemar un bosque entero de almas'. Aprended esto y grabadlo a fuego en el pecho: la Verdad de la Santa Madre Iglesia no se negocia en mesas de mercaderes, se defiende tajantemente con el filo de la espada y la propia sangre. Quien es tibio ante la blasfemia, escupe directamente en el rostro del Redentor." 
    }, 
    { 
        fecha: "20 de Diciembre de 1198", santo: "Santo Domingo de Silos", 
        biografia: "Santo Domingo dedicó su vida entera a caminar entre peligros para redimir a los cristianos cautivos por la tiranía mora? Él solía decir que 'la caridad es el fuego ardiente que purifica el oro'. Mirad bien vuestras manos encallecidas; él usó el sacrificio y los milagros para romper cadenas, vosotros derramáis sangre para el mismo maldito fin. Si vuestro corazón no arde en auténtica caridad cristiana por los prisioneros, y solo buscáis engordar vuestro ego en el campo de batalla, vuestro combate es simple y vulgar carnicería, y vuestro pago será arder junto a los asesinos paganos." 
    }, 
    { 
        fecha: "21 de Diciembre de 1198", santo: "Santo Tomás, Apóstol", 
        biografia: "el Apóstol Tomás ofendió al Señor con su incredulidad, pero al hundir sus dedos en las llagas suplicó: '¡Señor mío y Dios mío!'? San Gregorio Magno afirma que su dura incredulidad sanó para siempre nuestras propias dudas. Sé bien que muchos de vosotros templaréis de pavor cuando el cuerno de batalla suene y veáis las picas enemigas desgarrando entrañas. Cuando el pánico os invite a desertar, meted el dedo de vuestra mente en la llaga abierta del costado de Cristo, dejad de lloriquear como cobardes sin fe, y marchad a la muerte sabiendo que el martirio es la vía directa al Paraíso." 
    }, 
    { 
        fecha: "22 de Diciembre de 1198", santo: "San Flaviano", 
        biografia: "San Flaviano prefirió que los tiranos marcaran su frente con hierros candentes antes que rendir un gramo de culto a los ídolos inmundos? Él sonrió a sus verdugos diciendo: 'Quemad mi carne corruptible, que mi alma volará intacta a las manos de Dios'. Hoy el mundo pagano no nos pide encender incienso a Júpiter, nos tienta para adorar nuestro propio orgullo, nuestro estómago y nuestras arcas. Ser un verdadero mártir en el campamento es despreciar sin asco las comodidades y el oro. ¡Sufrid con estoicismo las marchas, que el dolor se desvanece pronto, pero la gloria o la condena son eternas!" 
    }, 
    { 
        fecha: "23 de Diciembre de 1198", santo: "Santa Victoria", 
        biografia: "esta joven doncella romana rechazó desposarse con un acaudalado noble pagano y prefirió que le perforaran el corazón con un puñal? Su testamento fue claro: 'Mi único esposo es el Rey del Cielo, y la dote que le entrego es mi propia sangre'. ¡Qué absoluta vergüenza para los hombres de pelo en pecho de vuestras compañías que venden su lealtad militar por unas míseras monedas de plata, o que rompen filas al primer crujido del estómago! Si una frágil doncella rió ante la muerte por su pureza, ¡endureced de una vez vuestro miserable espíritu, soldados de barro!" 
    }, 
    { 
        fecha: "24 de Diciembre de 1198", santo: "Vigilia de la Natividad", 
        biografia: "iniciamos esta santa vigilia con ayuno severo y abstinencia total? El gran San León Magno enseñaba con severidad que 'un vientre lleno engendra mentes perezosas y enciende los fuegos de la lujuria'. Entendedlo, cruzar este desierto exige cruz. No hay domingo de Resurrección sin el madero y los clavos del Viernes Santo. Apretad hasta lastimar el cinturón de vuestra armadura y dejad de murmurar sobre el frío o la ración menguante. Nuestro Rey está por nacer a medianoche sobre estiércol congelado en Belén, no entre sábanas de seda. ¡Ayunad, callad y orad!" 
    }, 
    { 
        fecha: "25 de Diciembre de 1198", santo: "la Natividad de Nuestro Señor Jesucristo", 
        biografia: "el Creador inmenso y Omnipotente del firmamento se ha rebajado voluntariamente a nacer como un infante que tiembla y llora entre bestias de carga? San Juan Crisóstomo nos grita desde la eternidad: '¡Reconoce, oh cristiano, tu dignidad incomparable!'. Los soberanos, príncipes y comandantes de la tierra inflan el pecho con sus títulos nobiliarios y armaduras bruñidas, pero el Señor del Cielo nos enseña que el orgullo es la marca registrada de Lucifer. Humillaos hoy mismo en el polvo y reconoced vuestra miseria ante el pesebre, o el Infierno devorará a los soberbios." 
    }, 
    { 
        fecha: "26 de Diciembre de 1198", santo: "San Esteban, Protomártir", 
        biografia: "mientras pesadas rocas le aplastaban el pecho y le reventaban el cráneo, San Esteban, bañado en sangre, usó su último aliento para rogar: '¡Señor, no les tomes en cuenta este pecado!'? Escuchadme bien: es sumamente fácil clavarle la espada en la garganta al hereje movido por la sed de sangre y la adrenalina; pero perdonar de corazón al pagano cautivo que os ha mutilado, requiere el heroísmo sobrenatural del Espíritu Santo. Luchamos esta cruzada para imponer la Divina Justicia, no por odio mezquino ni venganza. Si odiáis al enemigo, ya sois moralmente igual de paganos que ellos." 
    }, 
    { 
        fecha: "27 de Diciembre de 1198", santo: "San Juan, Apóstol y Evangelista", 
        biografia: "San Juan fue el único entre los discípulos que no huyó como un perro despavorido en el Jueves Santo, quedándose firme, sosteniendo la mirada, mientras la sangre de su Dios regaba la tierra del Gólgota? La huida es el sello maldito de los traidores y de Judas. Yo os pregunto: cuando nuestra táctica colapse, el cuerno de retirada se pierda en el caos, y la tormenta de saetas paganas oscurezca el sol... ¿romperéis el juramento huyendo al bosque para salvar vuestro pellejo, o permaneceréis firmes para morir con honor junto a la Cruz Bicolor?" 
    }, 
    { 
        fecha: "28 de Diciembre de 1198", santo: "los Santos Inocentes", 
        biografia: "miles de infantes fueron degollados y destripados por la asquerosa ambición y el miedo de Herodes? San Agustín nos recuerda: 'Ellos no tenían edad para confesar a Cristo con los labios, pero lo confesaron derramando su sangre limpia'. La tiranía de los herejes siempre buscará devorar a los más puros. Vuestras espadas y cotas de malla no os las dio el Papa para pavonearos en los campamentos; son el único muro entre la guadaña pagana y el cuello de los huérfanos. Si un caballero no muere por los débiles, es un bastardo a los ojos de Dios." 
    }, 
    { 
        fecha: "29 de Diciembre de 1198", santo: "Santo Tomás Becket, Obispo y Mártir", 
        biografia: "este ilustre obispo fue masacrado a hachazos dentro de su propia catedral por los perros falderos de un rey que se creía dios? Las últimas palabras de Tomás, mientras su cerebro se derramaba sobre el mármol, fueron: 'Por el nombre de Jesús y la defensa de su Iglesia, abrazo la muerte'. Él prefirió extinguirse antes que someter las Sagradas Leyes al capricho político. Que esto os sirva de norma absoluta: ningún rey, papa falso, o general terrenal está por encima de los Mandamientos. Si la autoridad os ordena el pecado, vuestro deber inquebrantable es la desobediencia sagrada." 
    }, 
    { 
        fecha: "30 de Diciembre de 1198", santo: "San Sabino", 
        biografia: "a este mártir le amputaron violentamente ambas manos porque se negó categóricamente a rendir tributo a Júpiter, y aún chorreando sangre por los muñones, lograba obrar milagros con su fe? Aquí en el campamento nos quejamos por raciones frías o botas desgastadas. ¡Miserables! No hay justificación alguna para la tibieza ni la pereza espiritual. Si en el choque de falanges os amputan el brazo derecho, ofreced el izquierdo para golpear al hereje; y si perdéis ambos, ofrecedle vuestra garganta a su sable para ir directo a Cristo. El dolor se desvanece, la cobardía condena eternamente." 
    }, 
    { 
        fecha: "31 de Diciembre de 1198", santo: "San Silvestre, Papa", 
        biografia: "bajo su glorioso pontificado las persecuciones del Imperio Romano fueron erradicadas, y la Santa Madre Iglesia salió triunfante y coronada de las oscuras catacumbas? San Ambrosio lo dice con claridad innegable: 'La Iglesia de Cristo es una barca que el mundo y el infierno azotan con furia salvaje, pero que jamás podrán hundir'. Todos los imperios del hombre construidos sobre el orgullo, la carne, el oro saqueado y el poder militar se volverán ceniza y polvo de la historia; pero la Cruz de Cristo y el Trono de San Pedro juzgarán a las naciones cuando llegue el fin de los tiempos." 
    }, 
    { 
        fecha: "1 de Enero de 1199", santo: "la Circuncisión del Señor", 
        biografia: "hoy se cumplen ocho días del nacimiento y el Niño Dios ya derramó su primera sangre por nosotros en el templo, sometiéndose a la Ley divina aunque Él era su creador absoluto? Nuestro venerado San Bernardo enseña que con esto, Cristo nos exige 'circuncidar' y amputar sin piedad nuestros propios vicios carnales. Acatar las órdenes duele, obedecer mortifica el ego y hace que el orgullo llore sangre, pero es el único maldito camino a la salvación. El caballero o mercenario que actúa por cuenta propia y desobedece en el frente de batalla, es la ruina de toda nuestra hueste." 
    }, 
    { 
        fecha: "2 de Enero de 1199", santo: "San Macario de Alejandría", 
        biografia: "huyó a las arenas del desierto más hostil para triturar su propio cuerpo durmiendo sobre espinas, comiendo ceniza y ayunando durante semanas enteras? Su máxima era cruda: 'Si deseas matar al demonio de la impureza, primero tienes que matar de inanición a tu propia carne'. Tenedlo muy claro: la horda pagana que nos espera mañana no es nuestro mayor enemigo. El verdadero peligro mortal es la escoria del egoísmo y los apetitos que os pudren desde el interior. ¡Sujetad con cadenas vuestros instintos animales, o la lujuria os empujará gritando hacia las llamas inextinguibles!" 
    }, 
    { 
        fecha: "3 de Enero de 1199", santo: "Santa Genoveva", 
        biografia: "una frágil mujer salvó a la ciudad de París del brutal saqueo de Atila el Huno, no construyendo grandes empalizadas ni forjando miles de picas, sino forzando a todo el pueblo a postrarse en severo llanto y penitencia pública? La historia nos escupe una lección innegable: la oración mortificada de un alma casta aterra a las legiones enemigas. Por tanto, no confiéis vuestra alma ciegamente en el grosor de vuestra cota de malla ni en el filo de las espadas que lleváis al cinto. Quien marcha a la guerra sin las rodillas gastadas de orar, marcha directamente al suicidio espiritual." 
    }, 
    { 
        fecha: "4 de Enero de 1199", santo: "San Tito", 
        biografia: "este firme discípulo de San Pablo recibió una orden directa y pastoral nada complaciente: reprender públicamente a los herejes y silenciar sin piedad a los mentirosos de su congregación? Como nos exige San Juan Crisóstomo: 'Reprende con vigor al pecador, incluso si ello te arranca la vida'. La corrección fraterna y severa es el mayor acto de amor verdadero. Si observáis a un compañero de fila robando denarios, embriagándose o blasfemando contra Dios, y cerráis la boca por 'no ofenderle' o por vil cobardía, sabed que su segura condena eterna pesará íntegra sobre vuestras cobardes espaldas." 
    }, 
    { 
        fecha: "5 de Enero de 1199", santo: "San Telesforo, Papa y Mártir", 
        biografia: "este ilustre mártir, antes de ser cazado por los perros del Imperio Romano, instituyó para siempre la gozosa Misa de Medianoche? San Ignacio de Antioquía nos advirtió tempranamente que la Sagrada Eucaristía es 'el antídoto contra la muerte y la verdadera medicina de inmortalidad'. Escuchad con temor de Dios: quien de vosotros tenga la temeridad de marchar mañana a chocar lanzas en el frente sin haberse arrodillado antes a purgar sus pecados en confesión, es un cadáver andante; un árbol seco y podrido que el menor soplido del demonio echará al fuego de la condenación." 
    }, 
    { 
        fecha: "6 de Enero de 1199", santo: "la Epifanía del Señor", 
        biografia: "los más sabios y temidos reyes de oriente no sintieron humillación alguna al ensuciarse las túnicas, cayendo de bruces en el fango de un establo para rendir culto absoluto a la Verdad? Se despojaron de sus egos de monarcas para someterse al único Señor, ofreciendo su oro, su incienso adorador y la profética mirra del dolor. Hoy, vosotros no haréis menos: arrojad vuestro oro a las arcas para el rescate de los prisioneros, mantened la vigilia de vuestra oración constante como el incienso humeante, y bebed sin lamentos la amarga mirra de la sangre derramada en batalla. ¡Adelante, en el Nombre de Cristo!" 
    } 
];