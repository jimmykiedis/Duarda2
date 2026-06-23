# 🪄 Balançar da varinha

Um projeto web interativo onde o usuário utiliza o cursor do mouse como se fosse uma varinha mágica para executar alguns elencados feitiços inspirados no universo de Harry Potter.

O objetivo é reconhecer gestos desenhados pelo usuário e executar ações dentro da página de acordo com o feitiço identificado.

---

## 🎯 Objetivos

* Transformar o cursor em uma "varinha de bruxo".
* Capturar o movimento do mouse durante a execução de um feitiço.
* Reconhecer padrões de gestos desenhados pelo usuário.
* Exibir animações e efeitos visuais para aumentar a imersão.
* Criar desafios interativos, como abrir cadeados, revelar mensagens ou ativar objetos mágicos.

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
├── index.html
├── src/
│   ├── assets/
│   │   └── fonts/
│   │   └── photos/
│   ├── css/
│   │   └── app.css
│   └── js/
│       └── app.js
├── assets/
│   ├── images/
│   └── sounds/
└── README.md
```

---

## 🚀 Ideias para futuras expansões

* Sistema de fases a serem descobertas, desafios e enigmas.
* Biblioteca com múltiplos feitiços.
* Efeitos sonoros sincronizados.
* Ranking de precisão dos gestos.
* Modo tutorial para ensinar novos movimentos.
