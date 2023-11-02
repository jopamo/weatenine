***Random Paint Drops Simulation*** 🎨<br>
[https://weatenine.com](https://weatenine.com)

---

## **Table of Contents** 📋

- [🎉 Introduction](#-introduction)
- [🚀 Getting Started](#-getting-started)
- [🖼 Setting Up the Canvas](#-setting-up-the-canvas)
- [🔄 Starting the Simulation](#-starting-the-simulation)
- [🔬 Running Experiments](#-running-experiments)
- [📈 Visualizing Results](#-visualizing-results)
- [💻 Contribute](#-contribute)
- [🎈 Conclusion](#-conclusion)

---

### 🎉 Introduction

This is the user manual for the Random Paint Drops Simulation website.

---

### 🚀 Getting Started

When you open the website, there's an animation that shows what you can do.

---

### 🖼 Setting Up the Canvas

- Go to 'Simulation'.
- Enter **X** and **Y dimensions** for the canvas.
- Choose **three colors**.
- Set the **stopping criterion**:
    1. Stop when all squares are painted.
    2. Stop when any square gets a second paint drop.
    3. Choose other options if available.

---

### 🔄 Starting the Simulation

- Click 'Start Simulation'.
- Watch the paint drops on the canvas.
- Use controls to change speed.
- Click **CONTINUE** when finished.

---

### 🔬 Running Experiments

- Go to 'Experiments'.
- Choose an **independent variable** (D, X, or R).
- Enter the needed values.
- Click 'Run Experiment' and see the results.

---

### 📈 Visualizing Results

- Select variables to visualize.
- Click **CONTINUE** for a graph.
- After viewing, you can:
    1. Make another graph.
    2. Do a new experiment.
    3. Exit.

---

### 💻 Contribute

- Windows: Use git bash, wsl2, or msys2?
- MacOS: Use homebrew?
- Linux: ...

#### install nodejs
* [Download](https://nodejs.org/en/download)

#### github ssh setup
* [Setup ssh github access](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
* [add generated public key to github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account?tool=webui)

### clone, code, and test react
```
cd ~/
git clone git@github.com:jopamo/weatenine.git
cd ~/weatenine
npm install
npm start

```

### pull latest changes and run local webserver for testing local changes
> **_NOTE:_**  you're gonna want to have this running in one terminal window and control git in another, this will show errors/warnings in realtime.

```
cd ~/weatenine
git pull
npm start

```

### git add and commit
```
cd ~/weatenine
git add .
git commit -m "Your commit message"
git push

```
---

### 🎈 Conclusion

Thanks for using the Random Paint Drops Simulation website.

---
