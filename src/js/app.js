const tela = document.getElementById('tela')
const ctx = tela.getContext('2d')
const fundo = document.getElementById('fundo')
const ctxFundo = fundo.getContext('2d')
const reconhecedor = new DollarRecognizer()
registrarFeiticos(reconhecedor)

let lumusAtivo = false
let mouse = {x:0, y:0}
let pontos = []
let desenhando = false

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
  ctxFundo.fillStyle = "#1a2246"
  ctxFundo.fillRect(0, 0, fundo.width, fundo.height)

  ctxFundo.fillStyle = '#d1ba8f'
  ctxFundo.font = 'bold 36px serif'
  ctxFundo.textAlign = 'center'
  ctxFundo.fillText('Adivinha quem é a pessoa', fundo.width/2, fundo.height/2 - 30)
ctxFundo.fillText('mais lida e amada do mundo?', fundo.width/2, fundo.height/2 + 20)
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

  if (!lumusAtivo){
    return
  }
  if (mouse.x === cursorAnterior.x && mouse.y === cursorAnterior.y) {
    return
  }

  iluminar(mouse.x, mouse.y)

  cursorAnterior = {...mouse}
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
})

desenharFundo()
escurecer()
redimencionar()
loop()
window.addEventListener('resize', redimencionar)