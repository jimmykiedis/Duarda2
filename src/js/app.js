// ── Seletores ────────────────────────────────────────
const tela = document.getElementById('tela')
const ctx = tela.getContext('2d')
const fundo = document.getElementById('fundo')
const ctxFundo = fundo.getContext('2d')
const reconhecedor = new DollarRecognizer()
registrarFeiticos(reconhecedor)

// ── Estado ───────────────────────────────────────────
let lumusAtivo = false
let revelioAtivo = false
let mouse = { x: 0, y: 0 }
let pontos = []
let desenhando = false
let opacidadeFoto = 0
let cursorAnterior = { x: -1, y: -1 }

const imgFoto = new Image()
imgFoto.src = 'src/assets/photos/foto.png'

// ── Configuração ─────────────────────────────────────
const CONFIG = {
  polaroid: {
    largura: 446,
    altura: 547,
    anguloGraus: -8,        // ← negativo = anti-horário, positivo = horário
    sombra: {
      cor: 'rgba(0,0,0,0.5)',
      blur: 20,
      offsetX: 8,
      offsetY: 8,
    }
  },
  foto: {
    largura: 400,
    altura: 400,
    marginTop: 23,          // ← margem entre o topo do polaroid e a foto
  },
  legenda: {
    texto: 'adivinha quem é a pessoa mais lida e amada do mundo?', // ← edite aqui
    fonte: 'FeelingLovely',
    tamanho: 22,            // ← ajuste fino do tamanho
    cor: '#333',            // ← cor do texto
    marginBottom: 20,       // ← distância do texto até a borda inferior do polaroid
  },
  revelio: {
    velocidadeFade: 0.01,   // ← 0.01 = lento, 0.05 = rápido
  }
}

// ── Funções ──────────────────────────────────────────
function desenharPolaroid() {
  const cx = fundo.width / 2
  const cy = fundo.height / 2
  const angulo = CONFIG.polaroid.anguloGraus * (Math.PI / 180)
  const { largura, altura } = CONFIG.polaroid
  const { marginTop, largura: lFoto, altura: aFoto } = CONFIG.foto
  const { texto, fonte, tamanho, cor, marginBottom } = CONFIG.legenda

  ctxFundo.save()
  ctxFundo.translate(cx, cy)
  ctxFundo.rotate(angulo)

  // Sombra
  ctxFundo.shadowColor = CONFIG.polaroid.sombra.cor
  ctxFundo.shadowBlur = CONFIG.polaroid.sombra.blur
  ctxFundo.shadowOffsetX = CONFIG.polaroid.sombra.offsetX
  ctxFundo.shadowOffsetY = CONFIG.polaroid.sombra.offsetY

  // Corpo branco do polaroid
  ctxFundo.fillStyle = '#fff'
  ctxFundo.fillRect(-largura / 2, -altura / 2, largura, altura)

  // Remove sombra
  ctxFundo.shadowColor = 'transparent'
  ctxFundo.shadowBlur = 0
  ctxFundo.shadowOffsetX = 0
  ctxFundo.shadowOffsetY = 0

  const fotoX = -lFoto / 2
  const fotoY = -altura / 2 + marginTop

  // Fundo preto da área da foto
  ctxFundo.fillStyle = '#000'
  ctxFundo.fillRect(fotoX, fotoY, lFoto, aFoto)

  // Foto com opacidade controlada pelo Revelio
  if (opacidadeFoto > 0) {
    ctxFundo.globalAlpha = opacidadeFoto
    ctxFundo.drawImage(imgFoto, fotoX, fotoY, lFoto, aFoto)
    ctxFundo.globalAlpha = 1
  }

  // Legenda
  ctxFundo.fillStyle = cor
  ctxFundo.font = `${tamanho}px ${fonte}`
  ctxFundo.textAlign = 'center'
  ctxFundo.textBaseline = 'bottom'

  const areaTexto = largura - 40
  const palavras = texto.split(' ')
  const linhas = []
  let linhaAtual = ''

  for (const palavra of palavras) {
    const teste = linhaAtual ? `${linhaAtual} ${palavra}` : palavra
    if (ctxFundo.measureText(teste).width > areaTexto) {
      linhas.push(linhaAtual)
      linhaAtual = palavra
    } else {
      linhaAtual = teste
    }
  }
  linhas.push(linhaAtual)

  const yBase = altura / 2 - marginBottom
  linhas.reverse().forEach((linha, i) => {
    ctxFundo.fillText(linha, 0, yBase - i * (tamanho + 4))
  })

  ctxFundo.restore()
}

function desenharFundo() {
  ctxFundo.fillStyle = '#1a0a00'
  ctxFundo.fillRect(0, 0, fundo.width, fundo.height)
  desenharPolaroid()
}

function escurecer() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, tela.width, tela.height)
}

function iluminar(x, y) {
  ctx.globalCompositeOperation = 'destination-out'

  const gradiente = ctx.createRadialGradient(x, y, 0, x, y, 120)
  gradiente.addColorStop(0, 'rgba(0,0,0,1)')
  gradiente.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradiente
  ctx.beginPath()
  ctx.arc(x, y, 120, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'source-over'
}

function redimencionar() {
  const imagemSalva = ctx.getImageData(0, 0, tela.width, tela.height)

  tela.width = window.innerWidth
  tela.height = window.innerHeight
  fundo.width = window.innerWidth
  fundo.height = window.innerHeight

  desenharFundo()

  if (lumusAtivo) {
    ctx.putImageData(imagemSalva, 0, 0)
  } else {
    escurecer()
  }
}

function loop() {
  requestAnimationFrame(loop)

  if (revelioAtivo && opacidadeFoto < 1) {
    opacidadeFoto = Math.min(1, opacidadeFoto + CONFIG.revelio.velocidadeFade)
    desenharFundo()
  }

  if (!lumusAtivo) return
  if (mouse.x === cursorAnterior.x && mouse.y === cursorAnterior.y) return

  iluminar(mouse.x, mouse.y)
  cursorAnterior = { ...mouse }
}

// ── Eventos ──────────────────────────────────────────
tela.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY

  if (desenhando) {
    pontos.push({ X: e.clientX, Y: e.clientY })
  }
})

tela.addEventListener('mousedown', (e) => {
  desenhando = true
  pontos = [{ X: e.clientX, Y: e.clientY }]
})

tela.addEventListener('mouseup', () => {
  desenhando = false
  if (pontos.length < 10) return

  const resultado = reconhecedor.Recognize(pontos)
  console.log('Gesto reconhecido:', resultado.Name, '| Score:', resultado.Score)

  if (resultado.Name === 'Lumus!' && resultado.Score > 0.6) {
    lumusAtivo = true
    console.log('✨ Lumos Ativado!')
  }

  if (resultado.Name === 'Revelio!' && resultado.Score > 0.6) {
    revelioAtivo = true
    console.log('🔮 Revelio ativado!')
  }
})

window.addEventListener('resize', redimencionar)

// ── Inicialização (sempre por último) ────────────────
new FontFace('FeelingLovely', "url('src/assets/fonts/Feeling%20Lovely.ttf')")
  .load()
  .then((fonte) => {
    document.fonts.add(fonte)
  })
  .catch((err) => {
    console.warn('Fonte não carregada, usando fallback:', err)
  })
  .finally(() => {
    redimencionar()
    loop()
  })