# Inside a Barcode - EAN13 Project
Projeto inspirado no vídeo do **ByteAnimates** que você mandou: 
"Twelve digits of bars, thirteen digits printed. The first digit has no bars."

## O que esse projeto explica?
Todo produto tem código de barras EAN13 com 13 números, mas só 12 têm barras desenhadas!
O primeiro dígito (ex: 7 do Brasil) não tem barra própria. Ele está ESCONDIDO no padrão de como os 6 dígitos da esquerda são desenhados.

### Como funciona?
- Cada dígito tem 3 jeitos de desenhar: L-code, G-code, R-code (7 barras cada)
- Esquerda (6 dígitos): usa L ou G dependendo do primeiro dígito
- Direita (6 dígitos): sempre R-code
- Tabela do primeiro dígito (igual do vídeo):
```
0 = L L L L L L
1 = L L G L G G
2 = L G L G L G
...
9 = L G G G L L
```

### Estrutura VS Code
```
barcode-ean13-project/
├── index.html          -> página web interativa (igual vídeo)
├── style.css           -> tema escuro estilo GitHub
├── script.js           -> lógica completa EAN13 (L,G,R + parity)
├── barcode_ean13.py    -> versão Python que gera PNG (para VS Code)
├── requirements.txt
└── README.md
```

### Como rodar no VS Code

**Web (recomendado pra GitHub Pages):**
1. Abra index.html com Live Server
2. Digite um EAN13: 7891000315507
3. Veja o segredo do primeiro dígito

**Python (gera imagem PNG):**
```bash
pip install -r requirements.txt
python barcode_ean13.py
# gera ean13.png
```

### Como mandar para seu GitHub (em conjunto com seus outros projetos)

**Repo separado:**
```bash
git init
git add .
git commit -m "EAN13 Inside a Barcode - ByteAnimates inspired"
git branch -M main
git remote add origin https://github.com/Niprotel4987/barcode-ean13.git
git push -u origin main
```

**Junto com seu portfolio (recomendado):**
Crie pasta `projects/` dentro do seu repo principal e cole este projeto lá:
```bash
# dentro de slime-platformer-vscode/
mkdir projects
cp -r barcode-ean13-project projects/barcode
git add projects/barcode
git commit -m "Adiciona projeto EAN13 barcode em conjunto"
git push
```

### Créditos
Inspirado em: ByteAnimates - Facebook
Implementação educacional para @Niprotel4987
