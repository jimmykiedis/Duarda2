const tela = document.getElementById('tela')
const contexto = tela.getContext('2d')
const reconhecedor = new DollarRecognizer()
registrarFeiticos(reconhecedor)

// Deixa o canvas ocupar a tela toda
tela.width = window.innerWidth
tela.height = window.innerHeight

let desenhando = false
let pontos = []

tela.addEventListener('mousedown', (e) => {
  desenhando = true
  pontos = []
  pontos.push({ X: e.clientX, Y: e.clientY })
})

tela.addEventListener('mousemove', (e) => {
  if (!desenhando) return
  pontos.push({ X: e.clientX, Y: e.clientY })
})

tela.addEventListener('mouseup', () => {
  desenhando = false
  if (pontos.length < 10) return // movimento muito curto, ignora

  const resultado = reconhecedor.Recognize(pontos)
  console.log('Gesto reconhecido:', resultado.Name, '| Score:', resultado.Score)
})