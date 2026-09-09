# 🪄 Balança a minha varinha

<p align="center">
  <a href="https://jimmykiedis.github.io/Duarda/">
    <img src="https://img.shields.io/badge/❤️%20Live%20Demo-FF4B4B?style=for-the-badge" alt="Live Demo">
  </a>
  <br>
  <em>Clique na imagem para acessar a demonstração.</em>
</p>

---

Um projeto web interativo onde o usuário utiliza o cursor do mouse como se fosse uma varinha mágica para executar alguns elencados feitiços inspirados no universo de Harry Potter.

O objetivo é reconhecer gestos desenhados pelo usuário e executar ações dentro da página de acordo com o feitiço identificado.

---

## 🎯 Objetivos

* Transformar o cursor em uma "varinha de bruxo".
* Capturar o movimento do mouse durante a execução de um feitiço.
* Reconhecer padrões de gestos desenhados pelo usuário.
* Exibir animações e efeitos visuais para aumentar a imersão.
* Criar desafios interativos, como abrir cadeados, revelar mensagens ou ativar objetos mágicos.


## ✨ Funcionalidades

- 🪄 **Desenho de feitiços:** pressione e arraste o mouse ou o dedo pela tela para desenhar um gesto mágico.
- 💡 **Lumos:** desenhe o gesto correspondente ao feitiço **Lumos!** para iluminar a tela com o cursor, revelando a área ao redor enquanto partículas mágicas acompanham o movimento.
- 🔮 **Revelio:** desenhe o gesto correspondente ao feitiço **Revelio!** para ativar um brilho mágico sobre o polaroid e revelar gradualmente a fotografia escondida.
- ✨ **Partículas mágicas:** estrelas e brilhos são gerados automaticamente enquanto o usuário desenha os feitiços.
- 🔊 **Efeitos sonoros:** cada feitiço reconhecido reproduz um efeito sonoro para reforçar a experiência.
- 📸 **Polaroid interativo:** a fotografia permanece inicialmente oculta e pode ser revelada através do feitiço **Revelio**.
- 📱 **Suporte a dispositivos móveis:** os feitiços podem ser desenhados utilizando tanto mouse quanto toque na tela.
- 🎨 **Experiência visual:** efeitos de iluminação, brilho, partículas, animações e tipografia personalizada criam uma experiência temática e imersiva. 

---

## 🛠 Como utilizar o repositório

1. Clone ou baixe este repositório e abra a pasta do projeto no terminal.
2. Verifique se o [Node.js](https://nodejs.org/) está instalado.
3. Inicie o servidor local:

  ```bash
  npm run dev
  ```

  O projeto não possui dependências externas, portanto não é necessário executar `npm install`.

4. Abra `http://127.0.0.1:4173` no navegador para acessar a aplicação principal.
5. Para abrir o modo de treinamento dos gestos, acesse `http://127.0.0.1:4173/trainer.html`.
6. Para personalizar o projeto, adicione ou substitua imagens em `src/assets/photos/` e ajuste os arquivos HTML, CSS ou JavaScript conforme necessário.

O servidor local é recomendado porque garante o carregamento correto dos scripts, fontes, sons e do cursor personalizado. Não abra o `index.html` diretamente pelo navegador (`file://`), pois alguns recursos podem não funcionar corretamente.

Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

---

## 🏗️ Estratégia de implementação

A aplicação será dividida em duas partes principais:

### Interface (HTML/CSS)

Utilizada para elementos convencionais da página, como:

* Menus
* Botões
* Instruções
* Mensagens
* Painéis de configuração

### Área de interação (Canvas)

O elemento `<canvas>` será utilizado como superfície principal para:

* Desenhar o rastro da varinha.
* Exibir efeitos mágicos e partículas.
* Renderizar objetos interativos.
* Atualizar a cena dinamicamente conforme as ações do usuário.
* Compatibilidade com dispositivos touch.

Essa abordagem evita a criação excessiva de elementos no DOM e oferece maior liberdade para animações.

---

## 🪄 Reconhecimento de feitiços

Durante o movimento do mouse, serão registrados pontos contendo as coordenadas do trajeto realizado pelo usuário.

Esses pontos poderão ser comparados com modelos de gestos previamente definidos para identificar qual feitiço foi executado.

Como evolução futura, pode ser adotado um algoritmo de reconhecimento de gestos, como o `$1 Unistroke Recognizer`, para tornar a identificação mais precisa e tolerante a variações.

---

## 🛠️ Tecnologias

* HTML5
* CSS3
* JavaScript (Vanilla)
* Canvas 2D API

---

## 📁 Estrutura sugerida

```text
/
├── scripts/
│   └──  dev-server.mjs
├── src/
│   ├── assets/
│   │   ├── cursor/
│   │   │   ├──  movingWand.ani
│   │   │   ├──  wand.ani
│   │   │   └──  wand.cur
│   │   ├── fonts/
│   │   └── photos/
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── app.js
│       ├── dollar.js
│       ├── gestures.js
│       └── trainer.js
├── .gitignore
├── amostrar.txt
├── anotações.md
├── index.html
├── package.json
├── README.md
└── trainer.html
```

---

## 🚀 Ideias para futuras expansões

* Sistema de fases a serem descobertas, desafios e enigmas.
* Biblioteca com múltiplos feitiços.
* Efeitos sonoros sincronizados.
* Ranking de precisão dos gestos.
* Modo tutorial para ensinar novos movimentos.

---

## 📄 Licença

Sinta-se à vontade para usar, editar e compartilhar! Espalhe amor por onde for. 🫡

