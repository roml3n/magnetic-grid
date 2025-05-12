# 🧲 magnetic-grid

A lightweight, animated background component for React apps that reacts to cursor movement using magnetic motion.

Perfect for landing pages, hero sections, or any spot you want to add subtle flair.

---

## 📦 Install

```bash
npm install magnetic-grid
````

Or using yarn:

```bash
yarn add magnetic-grid
```

---

## 🧠 Usage

> ⚠️ This is a **Client Component**, so make sure you're using it in a client-rendered environment (like inside `"use client"` blocks in Next.js).

```tsx
// app/page.tsx (Next.js 13+)
'use client';

import MagneticGrid from 'magnetic-grid';

export default function Home() {
  return (
    <main className="relative">
      <MagneticGrid />
      <section className="relative z-10">
        {/* your content here */}
      </section>
    </main>
  );
}
```

---

## 🎛️ Props

| Prop           | Type     | Default   | Description                                        |
| -------------- | -------- | --------- | -------------------------------------------------- |
| `gridSize`     | `number` | `50`      | Distance between the icons                         |
| `rowRadius`    | `number` | `3`       | How far vertically the icons respond to the cursor |
| `colRadius`    | `number` | `5`       | How far horizontally the icons respond             |
| `iconScale`    | `number` | `1.2`     | Scales the icon size slightly                      |
| `fontBaseSize` | `number` | `24`      | Base font size of the icons                        |
| `fontColor`    | `string` | `#8ce1ff` | Colour of the icon text                            |
| `bgColor`      | `string` | `black`   | Canvas background colour                           |

---

## ✨ What it does

* Renders a full-screen grid of text icons (`+`, `—`) on a `<canvas>`.
* Animates icon rotation based on cursor proximity.
* Creates a fluid magnetic field vibe — feels alive.
* No DOM bloat — everything drawn on canvas.

---

## 🧪 Example with custom props

```tsx
<MagneticGrid
  gridSize={40}
  rowRadius={2}
  colRadius={4}
  iconScale={1.5}
  fontBaseSize={20}
  fontColor="#ff69b4"
  bgColor="#0a0a0a"
/>
```

---


## 💌 Credits

Built with love by [@roml3n](https://github.com/roml3n) with the help of [ChatGPT](https://chatgpt.com)
