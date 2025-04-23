document.addEventListener('DOMContentLoaded', () => {
  const generarClavesBtn = document.getElementById('generarClaves');
  const cifrarBtn = document.getElementById('cifrarBtn');
  const descifrarBtn = document.getElementById('descifrarBtn');

  let claves;
  generarClavesBtn.addEventListener('click', () => {
    claves = window.rsa.generarClaves();
    console.log('Claves generadas:', claves); // ← Verifica en la consola que 'e' y 'd' existan
  
    document.getElementById('pasos').innerHTML = `
      <strong>Claves generadas:</strong><br>
      p = ${claves.p}, q = ${claves.q}<br>
      n = ${claves.publicKey.n}<br>
      Clave pública (e, n) = (${claves.publicKey.e}, ${claves.publicKey.n})<br>
      Clave privada (d, n) = (${claves.privateKey.d}, ${claves.privateKey.n})
    `;
  });
  
  cifrarBtn.addEventListener('click', () => {
    const mensaje = document.getElementById('mensaje').value;
    if (!mensaje || !claves) return alert("Primero genera las claves e ingresa un número.");
    
    // No necesitas convertir a bigInt aquí, ya que el preload maneja la conversión
    const cifrado = window.rsa.cifrar(mensaje, claves.publicKey.e, claves.publicKey.n);
    document.getElementById('cifrado').innerHTML = `<strong>Texto cifrado:</strong> ${cifrado}`;
  });
  descifrarBtn.addEventListener('click', () => {
    const cifrado = document.getElementById('cifrado').textContent.split(': ')[1];
    if (!cifrado || !claves) return alert("Primero cifra un mensaje.");
    const descifrado = window.rsa.descifrar(cifrado, claves.privateKey.d, claves.privateKey.n);
    document.getElementById('descifrado').innerHTML = `<strong>Texto descifrado:</strong> ${descifrado}`;
  });
});