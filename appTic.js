/**
 * Todas las casillas tienen la clase casilla
 */


/**
 * Almacenamos todas las casillas, es decir, todos los divs que tienen  la clase "casila" 
 * en total tenemos 9 casillas que van desde la 0 hasta la 8
 */


let casillas = document.getElementsByClassName("casilla");
let reloj;
let contador = 0;
let p;
let posicionGanadora;
let keyframes = [
    { transform: "translateY(0)" },
    { transform: "translateY(-10px)" },
    { transform: "translateY(0px)" },
];
let pFichaActual = document.getElementsByClassName("fichaActual")[0];
let pCronometro = document.getElementsByClassName("cronometro")[0];
//  fill: 'forwards' 
let opcionesAnimacion = { duration: 150 };
/**
 * [0] => [0, 1, 2]
 * [1] => [3, 4, 5]
 */
let fichaActual = true;
let posicionesO = [];
let posicionesX = [];
let contadorX = 0;
let contadorO = 0;
let contadorTurnos = 0;
let combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];


/**
 * recorrer las casillas que tengo en array casillas
 * comprobar el contenio de cada una
 */


/**
 * Push para introducir un valor en un array 
 * contain para comprobar el contenio de un array
 */

/**
 * Utilizo el array posicionesLlenas para introducir aquellas posiciones que contienen un texto igual a 'X'
 */


/**
 * Funcion que crea una linea la cual se posicion dentro de la casilla del medio de la combinacion ganadora proporcionada por paramatro
 * 
 * @param array combinacionGanadora 
 * 
 */

function createLinea(combinacionGanadora) {
    let linea = document.createElement("div");
    let diferencia = combinacionGanadora[0] - combinacionGanadora[1];
    linea.setAttribute("class", "linea")
    switch (diferencia) {
        case -3:
            linea.style.transform = "rotate(90deg)";
            break;
        case -4:
            linea.style.transform = "rotate(45deg)";
            break;
        case 2:
            linea.style.transform = "rotate(135deg)";
            break;
        default:
            break;
    }
    casillas[combinacionGanadora[1]].appendChild(linea);
    linea.animate([
        { width: "0" },
        { width: "90%" }
    ], { duration: 200, fill: "forwards" });

}

function pintarCronometro(segundo) {
    pCronometro.textContent = segundo;
}

function validarGanador(posicionesOcupadas) {
    let ganadoPadre = false;
    let ganado = true;
    let contadorCombinacion = 0;
    let contadorPos = 0;

    do {
        contadorPos = 0;
        ganado = true;
        do {
            if (posicionesOcupadas.includes(combinacionesGanadoras[contadorCombinacion][contadorPos])) {
                contadorPos++;
            } else {
                ganado = false;
            }
        } while (ganado && contadorPos < 3);

        if (ganado) {
            ganadoPadre = true;
            posicionGanadora = combinacionesGanadoras[contadorCombinacion];
        } else {
            contadorCombinacion++;
        }

    } while (!ganadoPadre && contadorCombinacion < 8);

    return ganadoPadre;
}


function sumarContador(ficha) {
    let textoFicha = document.getElementById(ficha);
    let valor = textoFicha.innerHTML;
    valor = parseInt(valor);
    valor++;
    textoFicha.innerHTML = `${valor}`;
}



function reset() {
    for (let i = 0; i < casillas.length; i++) {
        casillas[i].setAttribute("onclick", `addFicha(${i})`);
        casillas[i].innerHTML = '';
        fichaActual = true;
        pintarFichaActual();
        posicionesO = [];
        posicionesX = [];
        contadorTurnos = 0;
        pintarCronometro("");
        stopReloj();
        reloj = false;
    }
}


/**
 * Una vez tengo un array con las posiiones que contienen "x"
 * me interesa comparar si en el contenido de posicionesLlenas esta incluido alguna de las combinaciones de "combinacionesGanadoras"
 * 
 * En este caso:
 * [0] --> 0
 * [1] --> 1
 * [2] --> 2
 * [3] --> 5
 * 
 * En este caso en "combinacionesGanadoras" tenemos:
 * [0] --> [0, 1, 2]    //CORRECTA
 */





/**
 * -----------------------------------------------------------------------------------------------------
 * CONTENIDO NUEVO
 * 
 *
 */


function timer() {
    contador = 15;
    pintarCronometro(contador);
    if (!reloj) {
        reloj = setInterval(() => {
            contador--;
            console.log(`contador: ${contador}`);
            pintarCronometro(contador);
            // console.log(fichaActual);
            if (contador === 0) {
                contador = 15;
                if (fichaActual) {
                    fichaActual = false;
                } else {
                    fichaActual = true;
                }
                pintarFichaActual();
            }
        }, 1000);
    }
}

function stopReloj() {
    if (reloj) {
        clearInterval(reloj);
    }
}

function removerOnClick() {
    for (let i = 0; i < casillas.length; i++) {
        casillas[i].removeAttribute("onclick");
    }
}


function pintarFichaActual() {
    if (fichaActual) {
        pFichaActual.textContent = "X";
        pFichaActual.classList.remove("o");
        pFichaActual.classList.add("x");
    } else {
        pFichaActual.textContent = "O";
        pFichaActual.classList.remove("x");
        pFichaActual.classList.add("o");
    }
}


function addFicha(numero) {
    contadorTurnos++;
    casillas[numero].removeAttribute("onclick");
    timer();
    p = document.createElement("p");


    if (fichaActual) {
        p.setAttribute("class", "x");
        p.textContent = "X";
        posicionesX.push(numero);
        fichaActual = false;
    } else {
        p.setAttribute("class", "o");
        p.textContent = "O";
        posicionesO.push(numero);
        fichaActual = true;
        pintarFichaActual();
    }

    casillas[numero].appendChild(p);
    p.animate(keyframes, opcionesAnimacion);
    pintarFichaActual();


    if (validarGanador(posicionesO)) {
        sumarContador("O");
        alert("Has ganado O");
        stopReloj();
        removerOnClick();
        createLinea(posicionGanadora);
    } else if (validarGanador(posicionesX)) {
        sumarContador("X");
        alert("Has ganado X");
        stopReloj();
        removerOnClick();
        createLinea(posicionGanadora);
    } else if (contadorTurnos == 9) {
        alert("Empate");
        sumarContador("tablas");
        stopReloj();
    }
}







/**
 * Paara acabar el juego necesitamos
 * 1. Colocar ficha x
 * 2. Comprobar en cada insercion de ficha si se ha ganado el juego
 * 3. Cm¡ambiar turno x
 * 4. Cuando hay ganador mostar mensaje
 * opciones extra 
 * - generara un contado de victorias y resetear el tablero
 */