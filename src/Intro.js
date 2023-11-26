import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import './Intro.css';

function Intro({ setCurrentPage }) {
  const pixiContainer = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      resizeTo: window,
      transparent: true,
    });

    const currentContainer = pixiContainer.current;
    currentContainer.appendChild(app.view);

    // Background image
    const bg = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/bg_depth_blur.jpg');
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    app.stage.addChild(bg);

    // Sprites
    const littleDudes = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/depth_blur_dudes.jpg');
    littleDudes.x = (app.screen.width / 2) - 315;
    littleDudes.y = 200;
    app.stage.addChild(littleDudes);

    const littleRobot = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/depth_blur_moby.jpg');
    littleRobot.x = (app.screen.width / 2) - 200;
    littleRobot.y = 100;
    app.stage.addChild(littleRobot);

    // Blur filters
    const blurFilter1 = new PIXI.filters.BlurFilter();
    const blurFilter2 = new PIXI.filters.BlurFilter();
    littleDudes.filters = [blurFilter1];
    littleRobot.filters = [blurFilter2];

    // Animation for blur
    let count = 0;

    app.ticker.add(() => {
      count += 0.005;
      blurFilter1.blur = 20 * Math.cos(count);
      blurFilter2.blur = 20 * Math.sin(count);
    });

    const message = new PIXI.Text('Welcome to Random paint', new PIXI.TextStyle({
      fontFamily: 'Arial',
      dropShadow: true,
      dropShadowAlpha: 0.8,
      dropShadowAngle: 2.1,
      dropShadowBlur: 4,
      dropShadowColor: '#111111',
      dropShadowDistance: 10,
      fill: ['#ffffff'],
      stroke: '#004620',
      fontSize: 60,
      fontWeight: 'lighter',
      lineJoin: 'round',
      strokeThickness: 12,
    }));
    message.anchor.set(0.5);
    message.x = app.screen.width / 2;
    message.y = app.screen.height / 2;
    app.stage.addChild(message);

    // Function to resize text
    const resizeText = () => {
      const newSize = Math.max(20, window.innerWidth / 30); // Adjust this formula as needed
      message.style.fontSize = newSize;
      message.x = app.screen.width / 2;
      message.y = app.screen.height / 2;
    };

    // Call resizeText initially and on window resize
    resizeText(app, message);
    window.addEventListener('resize', resizeText);

    // Auto-navigate after 10 seconds
    const timer = setTimeout(() => {
      setCurrentPage('app');
    }, 10000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeText);
      currentContainer.removeChild(app.view);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [setCurrentPage]);

  return (
    <div className="intro-animation">
      <div ref={pixiContainer} className="pixi-container">
        {/* Pixi.js canvas will be attached here */}
      </div>
      {/* Add more elements if needed */}
    </div>
);

}

export default Intro;
