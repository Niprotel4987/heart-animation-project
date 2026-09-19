"""
barcode_ean13.py - Gerador de código de barras EAN13 em Python
Explica o mesmo conceito do vídeo: o primeiro dígito não tem barras!

Como rodar:
pip install pillow
python barcode_ean13.py

Autor: Projeto para Niprotel4987
Inspirado em ByteAnimates - Inside a Barcode
"""

from PIL import Image, ImageDraw, ImageFont

L = {
  '0':'0001101','1':'0011001','2':'0010011','3':'0111101','4':'0100011',
  '5':'0110001','6':'0101111','7':'0111011','8':'0110111','9':'0001011'
}
G = {
  '0':'0100111','1':'0110011','2':'0011011','3':'0100001','4':'0011101',
  '5':'0111001','6':'0000101','7':'0010001','8':'0001001','9':'0010111'
}
R = {
  '0':'1110010','1':'1100110','2':'1101100','3':'1000010','4':'1011100',
  '5':'1001110','6':'1010000','7':'1000100','8':'1001000','9':'1110100'
}
FIRST_PARITY = {
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
}

def encode_ean13(code: str):
    assert len(code)==13 and code.isdigit(), "Precisa ter 13 dígitos"
    first = code[0]
    left = code[1:7]
    right = code[7:13]
    parity = FIRST_PARITY[first]
    pattern = "101"
    for i,d in enumerate(left):
        pattern += L[d] if parity[i]=='L' else G[d]
    pattern += "01010"
    for d in right:
        pattern += R[d]
    pattern += "101"
    return pattern, first, left, right, parity

def draw_barcode(code, filename="ean13.png", scale=3):
    pattern, first, left, right, parity = encode_ean13(code)
    width = len(pattern)*scale + 60
    height = 180
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)
    
    x = 30
    for i, bit in enumerate(pattern):
        if bit == '1':
            is_guard = i<3 or (45 <= i < 50) or i >= 92
            h = 110 if not is_guard else 130
            draw.rectangle([x + i*scale, 20, x + i*scale + scale -1, 20+h], fill="black")
    
    # texto
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((10, 150), first, fill="black", font=font)
    draw.text((x + 3*scale, 150), left, fill="black", font=font)
    draw.text((x + 48*scale, 150), right, fill="black", font=font)
    
    img.save(filename)
    print(f"[OK] Código {code} salvo em {filename}")
    print(f"Primeiro dígito {first} codificado no padrão: {'-'.join(parity)}")
    print(f"Padrão total: {len(pattern)} barras (95 esperado)")
    print(f"Texto impresso: 13 dígitos, mas só 12 têm barras!")

if __name__ == "__main__":
    # Exemplo do Brasil (789 é Brasil)
    draw_barcode("7891000315507")
    draw_barcode("0123456789012", "ean13_2.png")
