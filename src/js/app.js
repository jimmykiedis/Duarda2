// ── Seletores ────────────────────────────────────────
const tela = document.getElementById('tela')
const ctx = tela.getContext('2d')
const fundo = document.getElementById('fundo')
const ctxFundo = fundo.getContext('2d')
const particulas = document.getElementById('particulas')
const ctxP = particulas.getContext('2d')
const reconhecedor = new DollarRecognizer()
const somFeitico = new Audio('src/assets/sounds/wizardSoundSpell.mp3')
registrarFeiticos(reconhecedor)

// ── Estado ───────────────────────────────────────────
let lumusAtivo = false
let revelioAtivo = false
let mouse = { x: 0, y: 0 }
let pontos = []
let desenhando = false
let opacidadeFoto = 0
let cursorAnterior = { x: -1, y: -1 }
let estrelas = []
let brilhoRevelio = 0      // 0 = sem brilho, 1 = brilho máximo
let revelioFase = 'idle'   // 'idle' | 'brilhando' | 'revelando'

const imgFoto = new Image()
imgFoto.src = 'src/assets/photos/foto.png'

const imgEstencil = new Image()
imgEstencil.src = 'src/assets/photos/estencil.png'

// ── Configuração ─────────────────────────────────────
const CONFIG = {
  polaroid: {
    largura: 446,
    altura: 547,
    anguloGraus: -8,
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
    marginTop: 23,
  },
  legenda: {
    texto: 'adivinha quem é a pessoa mais linda e amada do mundo?', // ← edite aqui
    fonte: 'FeelingLovely',
    tamanho: 22,
    cor: '#333',
    marginBottom: 20,
  },
  revelio: {
    velocidadeFade: 0.005,  // ← velocidade do fade in da foto
    velocidadeBrilho: 0.03, // ← velocidade do brilho do polaroid
  },
  particulas: {
    quantidade: 3,          // ← estrelas por frame enquanto desenha
    vidaMaxima: 50,         // ← frames até sumir
    tamanhoMax: 3,          // ← tamanho máximo da estrela em px
    velocidade: 1.5,        // ← velocidade de dispersão
  },
  cursor: {
    raio: 18,               // ← tamanho da bolinha brilhosa
    cor: '#ffe066',         // ← cor do centro do cursor
  }
}

// ── Partículas ───────────────────────────────────────
function criarEstrela(x, y) {
  const angulo = Math.random() * Math.PI * 2
  const velocidade = Math.random() * CONFIG.particulas.velocidade + 0.5
  return {
    x,
    y,
    vx: Math.cos(angulo) * velocidade,
    vy: Math.sin(angulo) * velocidade - 1.5, // leve impulso pra cima
    vida: CONFIG.particulas.vidaMaxima,
    vidaMax: CONFIG.particulas.vidaMaxima,
    tamanho: Math.random() * CONFIG.particulas.tamanhoMax + 1,
    rotacao: Math.random() * Math.PI * 2,
    velocidadeRotacao: (Math.random() - 0.5) * 0.2,
  }
}

function atualizarEstrelas() {
  // Adiciona novas estrelas enquanto desenha
  if (desenhando) {
    for (let i = 0; i < CONFIG.particulas.quantidade; i++) {
      estrelas.push(criarEstrela(mouse.x, mouse.y))
    }
  }

  // Atualiza posição e vida
  estrelas = estrelas.filter(e => e.vida > 0)
  for (const e of estrelas) {
    e.x += e.vx
    e.y += e.vy
    e.vy += 0.05 // gravidade leve
    e.rotacao += e.velocidadeRotacao
    e.vida--
  }
}

function desenharEstrelas() {
  ctxP.clearRect(0, 0, particulas.width, particulas.height)

  for (const e of estrelas) {
    const alpha = e.vida / e.vidaMax
    const t = e.tamanho

    ctxP.save()
    ctxP.translate(e.x, e.y)
    ctxP.rotate(e.rotacao)
    ctxP.globalAlpha = alpha

    // Estrela de 4 pontas
    ctxP.fillStyle = '#ffe066'
    ctxP.beginPath()
    ctxP.moveTo(0, -t * 2)
    ctxP.lineTo(t * 0.5, -t * 0.5)
    ctxP.lineTo(t * 2, 0)
    ctxP.lineTo(t * 0.5, t * 0.5)
    ctxP.lineTo(0, t * 2)
    ctxP.lineTo(-t * 0.5, t * 0.5)
    ctxP.lineTo(-t * 2, 0)
    ctxP.lineTo(-t * 0.5, -t * 0.5)
    ctxP.closePath()
    ctxP.fill()

    // Brilho central
    const brilho = ctxP.createRadialGradient(0, 0, 0, 0, 0, t * 2)
    brilho.addColorStop(0, 'rgba(255,255,255,0.8)')
    brilho.addColorStop(1, 'rgba(255,220,80,0)')
    ctxP.fillStyle = brilho
    ctxP.beginPath()
    ctxP.arc(0, 0, t * 2, 0, Math.PI * 2)
    ctxP.fill()

    ctxP.restore()
  }
}

// ── Cursor brilhoso (Lumos ativo) ────────────────────
function desenharCursor() {
  if (!lumusAtivo) return

  const { x, y } = mouse
  const { raio, cor } = CONFIG.cursor

  // Halo externo
  const halo = ctxP.createRadialGradient(x, y, 0, x, y, raio * 3)
  halo.addColorStop(0, 'rgba(255,220,80,0.4)')
  halo.addColorStop(1, 'rgba(255,220,80,0)')
  ctxP.beginPath()
  ctxP.fillStyle = halo
  ctxP.arc(x, y, raio * 3, 0, Math.PI * 2)
  ctxP.fill()

  // Degradê principal
  const gradiente = ctxP.createRadialGradient(x, y, 0, x, y, raio)
  gradiente.addColorStop(0, '#fff')
  gradiente.addColorStop(0.3, cor)
  gradiente.addColorStop(1, 'rgba(255,180,0,0)')

  ctxP.beginPath()
  ctxP.fillStyle = gradiente
  ctxP.arc(x, y, raio, 0, Math.PI * 2)
  ctxP.fill()
}

// ── Brilho do Revelio no polaroid ────────────────────
function desenharBrilhoRevelio() {
  if (brilhoRevelio <= 0) return

  const cx = fundo.width / 2
  const cy = fundo.height / 2
  const { largura, altura } = CONFIG.polaroid
  const angulo = CONFIG.polaroid.anguloGraus * (Math.PI / 180)

  ctxP.save()
  ctxP.translate(cx, cy)
  ctxP.rotate(angulo)

  // Brilho dourado sobre o polaroid
  const brilho = ctxP.createRadialGradient(0, 0, 0, 0, 0, Math.max(largura, altura))
  brilho.addColorStop(0, `rgba(255,220,80,${brilhoRevelio * 0.8})`)
  brilho.addColorStop(0.5, `rgba(255,180,0,${brilhoRevelio * 0.4})`)
  brilho.addColorStop(1, 'rgba(255,150,0,0)')

  ctxP.fillStyle = brilho
  ctxP.fillRect(-largura / 2, -altura / 2, largura, altura)

  ctxP.restore()
}

// ── Funções principais ───────────────────────────────
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

  ctxFundo.shadowColor = CONFIG.polaroid.sombra.cor
  ctxFundo.shadowBlur = CONFIG.polaroid.sombra.blur
  ctxFundo.shadowOffsetX = CONFIG.polaroid.sombra.offsetX
  ctxFundo.shadowOffsetY = CONFIG.polaroid.sombra.offsetY

  ctxFundo.fillStyle = '#fff'
  ctxFundo.fillRect(-largura / 2, -altura / 2, largura, altura)

  ctxFundo.shadowColor = 'transparent'
  ctxFundo.shadowBlur = 0
  ctxFundo.shadowOffsetX = 0
  ctxFundo.shadowOffsetY = 0

  const fotoX = -lFoto / 2
  const fotoY = -altura / 2 + marginTop

  ctxFundo.fillStyle = '#000'
  ctxFundo.fillRect(fotoX, fotoY, lFoto, aFoto)

  if (opacidadeFoto > 0) {
    ctxFundo.globalAlpha = opacidadeFoto
    ctxFundo.drawImage(imgFoto, fotoX, fotoY, lFoto, aFoto)
    ctxFundo.drawImage(imgEstencil, fotoX, fotoY, lFoto, aFoto) // ← estêncil junto com a foto
    ctxFundo.globalAlpha = 1
  }

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

function tocarSom() {
  somFeitico.currentTime = 0
  somFeitico.play()
}

function redimencionar() {
  const imagemSalva = ctx.getImageData(0, 0, tela.width, tela.height)

  tela.width = window.innerWidth
  tela.height = window.innerHeight
  fundo.width = window.innerWidth
  fundo.height = window.innerHeight
  particulas.width = window.innerWidth
  particulas.height = window.innerHeight

  desenharFundo()

  if (lumusAtivo) {
    ctx.putImageData(imagemSalva, 0, 0)
  } else {
    escurecer()
  }
}

function loop() {
  requestAnimationFrame(loop)

  // Fase do Revelio
  if (revelioFase === 'brilhando') {
    brilhoRevelio = Math.min(1, brilhoRevelio + CONFIG.revelio.velocidadeBrilho)
    if (brilhoRevelio >= 1) revelioFase = 'revelando'
  }

  if (revelioFase === 'revelando') {
    brilhoRevelio = Math.max(0, brilhoRevelio - CONFIG.revelio.velocidadeBrilho)
    opacidadeFoto = Math.min(1, opacidadeFoto + CONFIG.revelio.velocidadeFade)
    desenharFundo()
  }

  // Partículas
  atualizarEstrelas()
  desenharEstrelas()
  desenharCursor()
  desenharBrilhoRevelio()

  // Lumos
  if (!lumusAtivo) return
  if (mouse.x === cursorAnterior.x && mouse.y === cursorAnterior.y) return
  iluminar(mouse.x, mouse.y)
  cursorAnterior = { ...mouse }
}

function getPonto(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

// ── Eventos ──────────────────────────────────────────
function iniciarGesto(e) {
  e.preventDefault()
  const p = getPonto(e)
  desenhando = true
  pontos = [{ X: p.x, Y: p.y }]
  mouse.x = p.x
  mouse.y = p.y
}

function moverGesto(e) {
  e.preventDefault()
  const p = getPonto(e)
  mouse.x = p.x
  mouse.y = p.y
  if (desenhando) {
    pontos.push({ X: p.x, Y: p.y })
  }
}

function finalizarGesto(e) {
  e.preventDefault()
  desenhando = false
  if (pontos.length < 10) return

  const resultado = reconhecedor.Recognize(pontos)
  console.log('Gesto reconhecido:', resultado.Name, '| Score:', resultado.Score)

  if (resultado.Name === 'Lumus!' && resultado.Score > 0.6) {
    lumusAtivo = true
    tocarSom()
    console.log('✨ Lumos Ativado!')
  }

  if (resultado.Name === 'Revelio!' && resultado.Score > 0.6) {
    revelioAtivo = true
    revelioFase = 'brilhando'
    tocarSom()
    console.log('🔮 Revelio ativado!')
  }
}

// Mouse
tela.addEventListener('mousedown', iniciarGesto)
tela.addEventListener('mousemove', moverGesto)
tela.addEventListener('mouseup', finalizarGesto)

// Touch
tela.addEventListener('touchstart', iniciarGesto, { passive: false })
tela.addEventListener('touchmove', moverGesto, { passive: false })
tela.addEventListener('touchend', finalizarGesto, { passive: false })

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