// TABELAS EAN13 - Igual do vídeo do ByteAnimates
// L-code (odd), G-code (even), R-code (right)
const L = {
  '0':'0001101','1':'0011001','2':'0010011','3':'0111101','4':'0100011',
  '5':'0110001','6':'0101111','7':'0111011','8':'0110111','9':'0001011'
};
const G = {
  '0':'0100111','1':'0110011','2':'0011011','3':'0100001','4':'0011101',
  '5':'0111001','6':'0000101','7':'0010001','8':'0001001','9':'0010111'
};
const R = {
  '0':'1110010','1':'1100110','2':'1101100','3':'1000010','4':'1011100',
  '5':'1001110','6':'1010000','7':'1000100','8':'1001000','9':'1110100'
};
// Tabela do primeiro dígito - qual padrão L/G usar nos 6 da esquerda
// Isso que o vídeo explica: o primeiro dígito não tem barra, ele está no padrão!
const FIRST_DIGIT_PARITY = {
  '0': ['L','L','L','L','L','L'],
  '1': ['L','L','G','L','G','G'],
  '2': ['L','G','L','G','L','G'],
  '3': ['L','G','G','L','L','G'],
  '4': ['L','L','G','G','G','L'],
  '5': ['L','G','L','L','G','G'],
  '6': ['L','G','G','L','G','L'],
  '7': ['L','G','L','G','G','L'],
  '8': ['L','L','G','G','L','G'],
  '9': ['L','G','G','G','L','L']
};

function encodeEAN13(code) {
  if (!/^[0-9]{13}$/.test(code)) return null;
  const first = code[0];
  const left = code.slice(1,7).split('');   // 6 dígitos esquerda
  const right = code.slice(7,13).split(''); // 6 dígitos direita
  const parity = FIRST_DIGIT_PARITY[first];

  let pattern = '101'; // start guard
  
  // Esquerda - usa L ou G dependendo do primeiro dígito
  left.forEach((d,i) => {
    const type = parity[i];
    pattern += (type === 'L' ? L[d] : G[d]);
  });
  
  pattern += '01010'; // middle guard
  
  // Direita - sempre R-code
  right.forEach(d => { pattern += R[d]; });
  
  pattern += '101'; // end guard
  return { pattern, first, left, right, parity };
}

function drawBarcode(code) {
  const canvas = document.getElementById('barcode');
  const ctx = canvas.getContext('2d');
  const result = encodeEAN13(code);
  if (!result) { alert('Digite 13 números! Ex: 7891000315507'); return; }
  
  const { pattern, first, left, right, parity } = result;
  
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  const barWidth = 2.5;
  const xStart = 30;
  const y = 20;
  const h = 110;
  
  // Desenha barras: 1 = preto, 0 = branco
  for (let i=0; i<pattern.length; i++) {
    if (pattern[i] === '1') {
      // guardas são mais altas
      const isGuard = (i < 3 || (i >= 45 && i < 50) || i >= 92);
      ctx.fillStyle = 'black';
      ctx.fillRect(xStart + i*barWidth, y, barWidth, isGuard ? h+20 : h);
    }
  }
  
  // Números embaixo
  const numbersDiv = document.getElementById('numbers');
  numbersDiv.innerHTML = `<b>${first}</b> <span>${left.join('')}</span> <span style="margin-left:20px">${right.join('')}</span>`;
  
  // Explicação igual do vídeo
  document.getElementById('explanation').innerHTML = `
    <strong>Onde está o 13º dígito?</strong><br>
    Código digitado: <strong>${code}</strong><br>
    Primeiro dígito = <strong style="font-size:18px; color:#00ff88">${first}</strong><br>
    Ele NÃO tem barras próprias. Ele é codificado no <strong>padrão L/G</strong> dos 6 dígitos da esquerda:<br>
    Esquerda (${left.join('')}): ${parity.map((p,i)=> left[i]+':'+p).join(' | ')}<br>
    Direita (${right.join('')}): sempre R-code<br>
    Total de barras: 12 dígitos * 7 barras = 84 + 11 de guardas = <strong>95 barras</strong><br>
    Mas números impressos: <strong>13</strong> - por isso "Doze dígitos de barras, treze dígitos impressos"
  `;
  
  // Mostra trecho de código igual do vídeo
  document.getElementById('codeView').textContent = 
`// Tabela igual do vídeo - ByteAnimates
const PARITY = ${JSON.stringify(FIRST_DIGIT_PARITY, null, 2)}

// Codificação
let key = ${first}; // primeiro dígito
for (i=0; i<6; i++) {
  let digit = left[i]; // ${left.join('')}
  let type = PARITY[key][i]; // ${parity.join(',')}
  // se type == L usa L-code, se G usa G-code
  pattern += (type === 'L' ? L[digit] : G[digit]);
}
// Direita sempre R-code: ${right.join('')}
for (d of right) pattern += R[d];`;
}

function generate() {
  const val = document.getElementById('eanInput').value.replace(/\D/g,'');
  drawBarcode(val);
}

// inicia
generate();
