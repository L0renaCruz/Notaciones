// public/js/main.js

// --- TOKENIZAR ---
function tokenizar(exp) {
  return exp.match(/\d+|\+|\-|\*|\/|\(|\)/g);
}

// --- INFIX → POSTFIX ---
function aPostfija(tokens) {
  let salida = [], pila = [];
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };

  for (let t of tokens) {
    if (/\d+/.test(t)) salida.push(t);        // número → salida
    else if (t === '(') pila.push(t);         // ( → pila
    else if (t === ')') {                     // ) → vaciar pila hasta (
      while (pila.length && pila[pila.length - 1] !== '(') salida.push(pila.pop());
      pila.pop();
    } else {                                  // operador
      while (pila.length && prec[pila[pila.length - 1]] >= prec[t]) salida.push(pila.pop());
      pila.push(t);
    }
  }
  return salida.concat(pila.reverse());
}

// --- INFIX → PREFIX ---
function aPrefija(tokens) {
  let invertidos = [...tokens].reverse().map(t => t === '(' ? ')' : t === ')' ? '(' : t);
  let post = aPostfija(invertidos);
  return post.reverse();
}

// --- EVALUAR EXPRESIÓN ---
function evaluar(exp) {
  return Function("return " + exp)();
}

// --- EVENTO BOTÓN ---
const btn = document.getElementById("btn_generar");
const input = document.getElementById("expresion");
const recorridosDiv = document.getElementById("recorridos");

btn.addEventListener("click", () => {
  let exp = (input.value || '').replace(/\s+/g, "");
  if (!exp) return alert("Ingresa una expresión válida.");

  let tokens = tokenizar(exp);

  // POSTFIJA
  let t0 = performance.now();
  let post = aPostfija(tokens).join(" ");
  let tPost = (performance.now() - t0).toFixed(4);

  // PREFIJA
  t0 = performance.now();
  let pre = aPrefija(tokens).join(" ");
  let tPre = (performance.now() - t0).toFixed(4);

  // INFIX (solo para mostrar y medir tiempo)
  t0 = performance.now();
  let infija = tokens.join(" ");
  let tInfija = (performance.now() - t0).toFixed(4);

  // RESULTADO
  let resultado = evaluar(exp);

  // Mostrar resultados en el div "recorridos"
  recorridosDiv.innerHTML = `
    <ul class="list-unstyled">
      <li><b>Infija:</b> ${infija} (<span class="text-success">Tiempo: ${tInfija} ms</span>)</li>
      <li><b>Prefija:</b> ${pre} (<span class="text-primary">Tiempo: ${tPre} ms</span>)</li>
      <li><b>Postfija:</b> ${post} (<span class="text-warning">Tiempo: ${tPost} ms</span>)</li>
    </ul>
    <p><b>Resultado:</b> ${resultado}</p>
  `;
});
