const tela = document.getElementById('tela')
const ctx = tela.getContext('2d')
const outputDiv = document.getElementById('output')
const feiticoAtualEl = document.getElementById('feitico-atual')
const amostraEl = document.getElementById('amostra')

tela.width = window.innerWidth
tela.height = window.innerHeight - 180

// --- Configuração dos feitiços a treinar ---
const feiticos = ['Lumus!', 'Revelio!']
let feiticoIndex = 0
let amostraCount = 1
let amostras = { 'Lumus!': [], 'Revelio!': [] }

let desenhando = false
let pontos = []

// --- Desenho ---
tela.addEventListener('mousedown', (e) => {
  desenhando = true
  pontos = []
  ctx.clearRect(0, 0, tela.width, tela.height)
  ctx.beginPath()
  ctx.moveTo(e.clientX, e.clientY)
  pontos.push({ X: e.clientX, Y: e.clientY })
})

tela.addEventListener('mousemove', (e) => {
  if (!desenhando) return
  ctx.lineTo(e.clientX, e.clientY)
  ctx.strokeStyle = '#f0c040'
  ctx.lineWidth = 3
  ctx.stroke()
  pontos.push({ X: e.clientX, Y: e.clientY })
})

tela.addEventListener('mouseup', () => {
  if (!desenhando) return
  desenhando = false
  if (pontos.length < 10) return

  const feitico = feiticos[feiticoIndex]
  amostras[feitico].push([...pontos])

  // Formata linha no estilo do $1
  const pontosFormatados = pontos.map(p => `new Point(${p.X},${p.Y})`).join(',')
  const linha = `new Unistroke("${feitico}", new Array(${pontosFormatados}));`

  // Mostra no output
  const p = document.createElement('p')
  p.style.color = feitico === 'Lumus!' ? '#f0c040' : '#80c0ff'
  p.textContent = linha
  outputDiv.appendChild(p)
  outputDiv.scrollTop = outputDiv.scrollHeight

  // Avança amostra
  amostraCount++
  amostraEl.textContent = amostraCount

  console.log(linha)
})

// Pressiona ENTER para trocar de feitiço
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    feiticoIndex = (feiticoIndex + 1) % feiticos.length
    amostraCount = 1
    feiticoAtualEl.textContent = feiticos[feiticoIndex]
    amostraEl.textContent = amostraCount
    ctx.clearRect(0, 0, tela.width, tela.height)

    const separador = document.createElement('p')
    separador.style.color = '#888'
    separador.textContent = `--- Trocou para ${feiticos[feiticoIndex]} ---`
    outputDiv.appendChild(separador)
  }
})