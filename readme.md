# 🪄 Wave My Wand

<p align="center">
  <a href="https://jimmykiedis.github.io/Duarda2/">
    <img src="https://img.shields.io/badge/❤️%20Live%20Demo-FF4B4B?style=for-the-badge" alt="Live Demo">
  </a>
  <br>
  <em>Click the image to access the live demo.</em>
</p>

---

An interactive web project where the user uses the mouse cursor as a magical wand to cast selected spells inspired by the Harry Potter universe.

The goal is to recognize gestures drawn by the user and trigger actions on the page according to the identified spell.

---

## 🎯 Objectives

- 🪄 Turn the cursor into a "wizard's wand".
- 🖱️ Capture mouse movement while casting a spell.
- ✏️ Recognize gesture patterns drawn by the user.
- ✨ Display animations and visual effects to enhance immersion.
- 🔐 Create interactive challenges, such as unlocking locks, revealing messages, or activating magical objects.

---

## ✨ Features

- 🪄 **Spell drawing:** press and drag the mouse or your finger across the screen to draw a magical gesture.
- 💡 **Lumos:** draw the gesture corresponding to the **Lumos!** spell to illuminate the screen around the cursor while magical particles follow the movement.
- 🔮 **Revelio:** draw the gesture corresponding to the **Revelio!** spell to activate a magical glow over the polaroid and gradually reveal the hidden photograph.
- ✨ **Magical particles:** stars and sparkles are automatically generated while the user draws the spells.
- 🔊 **Sound effects:** each recognized spell plays a sound effect to enhance the experience.
- 📸 **Interactive polaroid:** the photograph initially remains hidden and can be revealed using the **Revelio** spell.
- 📱 **Mobile support:** spells can be drawn using either a mouse or touchscreen.
- 🎨 **Visual experience:** lighting effects, glow, particles, animations, and custom typography create an immersive themed experience.

---

## 🛠 How to Use the Repository

### 📥 1. Clone the Repository

Clone or download the repository and open the project folder in the terminal.

```bash
git clone https://github.com/jimmykiedis/Duarda.git
cd Duarda
```

### ⚙️ 2. Check Node.js

Make sure [Node.js](https://nodejs.org/) is installed on your system.

### ▶️ 3. Start the Local Server

Run the development server:

```bash
npm run dev
```

The project has no external dependencies, so running `npm install` is not required.

### 🌐 4. Access the Application

Open the following address in your browser:

```text
http://127.0.0.1:4173
```

This will open the main application.

### 🧪 5. Access the Gesture Trainer

To open the gesture training mode, access:

```text
http://127.0.0.1:4173/trainer.html
```

The trainer can be used to work with and test the gestures recognized by the application.

### ✏️ 6. Customize the Project

To customize the project, you can add or replace images inside:

```text
src/assets/photos/
```

You can also modify the HTML, CSS, or JavaScript files according to your needs.

The local server is recommended because it ensures that scripts, fonts, sounds, and the custom cursor are loaded correctly.

> **Important:** Do not open `index.html` directly using the browser (`file://`), as some resources may not work correctly.

To stop the server, return to the terminal and press `Ctrl+C`.

---

## 🏗️ Implementation Strategy

The application is divided into two main parts:

### Interface (HTML/CSS)

Used for conventional page elements such as:

- Menus
- Buttons
- Instructions
- Messages
- Configuration panels

### Interaction Area (Canvas)

The `<canvas>` element is used as the main interaction surface for:

- Drawing the wand trail.
- Displaying magical effects and particles.
- Rendering interactive objects.
- Dynamically updating the scene according to user actions.
- Supporting touch-based interaction.

This approach reduces the need for excessive DOM elements and provides greater flexibility for animations and real-time visual effects.

---

## 🪄 Spell Recognition

During mouse or touch movement, points containing the coordinates of the user's gesture are recorded.

These points can then be compared against predefined gesture patterns to identify which spell was cast.

The project uses the `$1 Unistroke Recognizer` approach to recognize gestures, allowing the application to identify spells while tolerating variations in how the user draws each movement.

---

## 🛠️ Technologies

- **HTML5** — Page structure and application interface.
- **CSS3** — Styling, animations, visual effects, and responsive layout.
- **JavaScript (Vanilla JS)** — Application logic, interactions, gesture handling, and spell recognition.
- **Canvas 2D API** — Real-time rendering of gestures, particles, magical effects, and interactive elements.
- **$1 Unistroke Recognizer** — Gesture recognition and pattern matching.
- **Node.js** — Local development environment and server execution.

---

## 📁 Project Structure

```text
/
├── scripts/
│   └── dev-server.mjs
├── src/
│   ├── assets/
│   │   ├── cursor/
│   │   │   ├── movingWand.ani
│   │   │   ├── wand.ani
│   │   │   └── wand.cur
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

## 🚀 Future Improvements

- 🧩 Multi-stage system with discoverable challenges and puzzles.
- 🪄 Spell library with multiple spells.
- 🔊 Synchronized sound effects.
- 🏆 Gesture accuracy ranking system.
- 📖 Tutorial mode for teaching new gestures and movements.

---

## 📄 License

Feel free to use, edit, and share! Spread love wherever you go. 🫡
