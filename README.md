# 🎨 Random Paint — Generative Grid Painter  
**Live demo:** <https://1g4.org/wa9/>

An interactive playground where multi-colour paint drops evolve into abstract art. Tweak the grid, set your rules, run experiments, and watch colours blend in real time.

---

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Canvas Controls](#canvas-controls)
4. [Run the Simulation](#run-the-simulation)
5. [Experiment Mode](#experiment-mode)
6. [Visualise Results](#visualise-results)
7. [Contributing](#contributing)
8. [License](#license)

---

## Introduction
Random Paint lets you create unique, algorithm-driven artwork with just a few clicks. Choose up to three base colours, decide when the run should stop, and enjoy the emergent patterns.

---

## Quick Start
1. Open the [demo](https://1g4.org/wa9/).  
2. Click anywhere to skip the intro animation.  
3. Choose **Simulation** or **Experiments** from the navbar.

---

## Canvas Controls
| Setting | Purpose |
| ------- | ------- |
| **X / Y Dimension** | Set the grid width and height. |
| **Colour 1-3** | Pick up to three base colours (Red, Green, Blue, Yellow, Cyan, Magenta, Maroon, Teal). |
| **Stopping Criterion** | • _Fill Grid_ – stop when every square has paint.<br>• _First Collision_ – stop when any square receives its second drop.<br>• Additional criteria may appear in future updates. |

---

## Run the Simulation
1. Click **Start Painting**.  
2. Every tick, one colour is chosen at random and dropped on a random cell.<br>
   • New paint blends with existing colour.  
   • The colour tracker (left sidebar) shows usage stats.  
3. Adjust tick speed with the slider.  
4. Click **Continue** to finish and view stats.

---

## Experiment Mode
1. Open **Experiments**.  
2. Select an **independent variable** (`D`, `X`, or `R`).  
3. Enter the value range.  
4. Click **Run Experiment** to collect data.

---

## Visualise Results
1. Choose the variables to plot.  
2. Press **Continue** → a graph appears.  
3. Afterwards you can:  
   1. Generate another graph.  
   2. Run a new experiment.  
   3. Return to the simulation.

---

## Contributing
### Prerequisites
* **Node JS** ≥ 20 → <https://nodejs.org/en/download>  
* Git + SSH access to GitHub.

### Quick setup
```bash
git clone git@github.com:jopamo/weatenine.git
cd weatenine
npm install          # install dependencies
npm start            # dev server with hot-reload
````

> Keep `npm start` running in one terminal; use another for Git commands.

### Typical workflow

```bash
#  pull latest
git pull

#  make changes, then:
git add .
git commit -m "scope: message"
git push
```

Works on macOS (Homebrew), Windows (Git Bash / WSL2 / MSYS2) and Linux.

---

## License

This project is released under the MIT License — see `LICENSE` for details.

---

Thanks for painting with us 🖌️
