const tela = document.getElementById('tela')
const ctx = tela.getContext('2d')
const fundo = document.getElementById('fundo')
const ctxFundo = fundo.getContext('2d')
const reconhecedor = new DollarRecognizer()
registrarFeiticos(reconhecedor)

let lumusAtivo = false
let revelioAtivo = false
let mouse = {x:0, y:0}
let pontos = []
let desenhando = false
let opacidadeFoto = 0
const imgFoto = new Image()
imgFoto.src = 'src/assets/photos/foto.png'

// ── Configuração do Polaroid ─────────────────────────
const CONFIG = {
  polaroid: {
    largura: 446,
    altura: 547,
    anguloGraus: -8,        // ← ajuste fino aqui: negativo = anti-horário, positivo = horário
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
  revelio: {
    velocidadeFade: 0.01,   // ← quão rápido a foto aparece (0.01 = lento, 0.05 = rápido)
  }
}

function desenharPolaroid() {
  const cx = fundo.width / 2
  const cy = fundo.height / 2
  const angulo = CONFIG.polaroid.anguloGraus * (Math.PI / 180)
  const { largura, altura } = CONFIG.polaroid
  const { marginTop, largura: lFoto, altura: aFoto } = CONFIG.foto

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

  // Remove sombra antes de desenhar a foto
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

  ctxFundo.restore()
}

function redimencionar() {
  const imagemSalva = ctx.getImageData(0,0, tela.width, tela.height)
  
  tela.width = window.innerWidth
  tela.height = window.innerHeight
  fundo.width = window.innerWidth
  fundo.height = window.innerHeight

  desenharFundo()

  if (lumusAtivo) {
    ctx.putImageData(imagemSalva, 0, 0)
  }
  else {
    escurecer()
  }
}

function desenharFundo() {
  ctxFundo.fillStyle = '#1a0a00'
  ctxFundo.fillRect(0, 0, fundo.width, fundo.height)

  // Texto do quadro
  ctxFundo.fillStyle = '#c8a96e'
  ctxFundo.font = 'bold 36px serif'
  ctxFundo.textAlign = 'center'
  ctxFundo.fillText('Adivinha quem é a pessoa', fundo.width / 2, fundo.height / 2 - 30)
  ctxFundo.fillText('mais lida e amada do mundo?', fundo.width / 2, fundo.height / 2 + 20)

  // Polaroid
  desenharPolaroid()
}

function escurecer(){
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, tela.width, tela.height)
}

function iluminar(x, y){
  ctx.globalCompositeOperation = 'destination-out'

  const gradiente = ctx.createRadialGradient(x, y, 0, x, y, 120)
  gradiente.addColorStop(0, 'rgba(0, 0, 0, 1)')
  gradiente.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradiente
  ctx.beginPath()
  ctx.arc(x, y, 120, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'source-over'
}

let cursorAnterior = {x:-1, y:-1}

function loop() {
  requestAnimationFrame(loop)

  // Animação do Revelio
  if (revelioAtivo && opacidadeFoto < 1) {
    opacidadeFoto = Math.min(1, opacidadeFoto + CONFIG.revelio.velocidadeFade)
    desenharFundo()  // redesenha o fundo com a nova opacidade
  }

  if (!lumusAtivo) return
  if (mouse.x === cursorAnterior.x && mouse.y === cursorAnterior.y) return

  iluminar(mouse.x, mouse.y)
  cursorAnterior = { ...mouse }
}

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

desenharFundo()
escurecer()
redimencionar()
loop()
window.addEventListener('resize', redimencionar)