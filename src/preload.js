const { contextBridge, ipcRenderer } = require('electron');
const bigInt = require('big-integer');


function euclidesExtendido(a, b) {
  let [oldR, r] = [a, b];
  let [oldS, s] = [bigInt(1), bigInt(0)];
  let [oldT, t] = [bigInt(0), bigInt(1)];

  while (!r.equals(bigInt(0))) {
    const quotient = oldR.divide(r);
    [oldR, r] = [r, oldR.minus(quotient.multiply(r))];
    [oldS, s] = [s, oldS.minus(quotient.multiply(s))];
    [oldT, t] = [t, oldT.minus(quotient.multiply(t))];
  }
  // Asegurar que 'd' sea positivo
  return oldS.mod(b);
}

function esPrimo(n) {
  if (n.lesser(2)) return false;
  if (n.equals(2)) return true;
  if (n.mod(2).equals(0)) return false;

  for (let i = bigInt(3); i.multiply(i).lesserOrEquals(n); i = i.add(2)) {
    if (n.mod(i).equals(0)) return false;
  }
  return true;
}

function generarPrimoAleatorio(min, max) {
  let primo;
  do {
    primo = bigInt.randBetween(min, max);
  } while (!esPrimo(primo));
  return primo;
}

// Generación de claves RSA (números más pequeños para demo)
function generarClavesRSA() {
  const p = generarPrimoAleatorio(100, 1000);
  const q = generarPrimoAleatorio(100, 1000);
  const n = p.multiply(q);
  const phi = p.minus(1).multiply(q.minus(1));
  const e = bigInt(65537);  // Valor fijo típico para RSA
  const d = euclidesExtendido(e, phi);

  return {
    publicKey: { e, n },  // Asegúrate de que 'e' y 'n' estén aquí
    privateKey: { d, n }, // Asegúrate de que 'd' y 'n' estén aquí
    p, q
  };
}
function cifrar(mensaje, e, n) {
  // Convertimos los parámetros a BigInt nuevamente
  return bigInt(mensaje).modPow(bigInt(e), bigInt(n)).toString();
}

function descifrar(cifrado, d, n) {
  return bigInt(cifrado).modPow(bigInt(d), bigInt(n)).toString();
}

contextBridge.exposeInMainWorld('rsa', {
  generarClaves: () => {
    const keys = generarClavesRSA();
    return {
      publicKey: {
        e: keys.publicKey.e.toString(),  // Convertimos a string para evitar problemas
        n: keys.publicKey.n.toString()
      },
      privateKey: {
        d: keys.privateKey.d.toString(),
        n: keys.privateKey.n.toString()
      },
      p: keys.p.toString(),
      q: keys.q.toString()
    };
  },
  cifrar: (mensaje, e, n) => cifrar(mensaje, bigInt(e), bigInt(n)),  // Convertimos de vuelta a BigInt
  descifrar: (cifrado, d, n) => descifrar(cifrado, bigInt(d), bigInt(n))
});