import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { debounce } from 'lodash';
import './Intro.css';

function Intro({ setCurrentPage }) {
  const pixiContainer = useRef(null);

  const titleText = 'Welcome to Random Paint';
  const infoTextContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aenean et tortor at risus viverra adipiscing at. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Congue eu consequat ac felis donec et odio pellentesque. Adipiscing bibendum est ultricies integer. A erat nam at lectus urna duis convallis convallis tellus.";

  const handleToApp = () => {
    setCurrentPage("app");
  };

  useEffect(() => {
    const app = new PIXI.Application({
      resizeTo: window,
      transparent: true,
    });

    const currentContainer = pixiContainer.current;
    currentContainer.appendChild(app.view);

    // Background image
    const bg = PIXI.Sprite.from('texture.jpg');
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    app.stage.addChild(bg);

    let scale = 1;
    let scaleSpeed = 0.0001;

    const littleRobot = PIXI.Sprite.from('splash.png');
    littleRobot.anchor.set(0.5);
    littleRobot.x = app.screen.width / 2;
    littleRobot.y = app.screen.height / 2;
    app.stage.addChild(littleRobot);

    const blurFilter1 = new PIXI.filters.BlurFilter();
    const blurFilter2 = new PIXI.filters.BlurFilter();
    littleRobot.filters = [blurFilter2];

    let count = 0;
    app.ticker.add(() => {
      count += 0.005;
      blurFilter1.blur = 20 * Math.cos(count);
      blurFilter2.blur = 20 * Math.sin(count);

      scale += scaleSpeed;
      bg.scale.set(scale);

      // Reset scale after a certain point to create a looping effect
      if (scale >= 1.05 || scale <= 0.95) {
        scaleSpeed *= -1;
      }
    });

    const textStyle = {
      fontFamily: 'Arial',
      fill: 'white',
      stroke: 'black',
      strokeThickness: 4,
      fontSize: Math.max(20, window.innerWidth / 30),

    };

    const titleMessage = new PIXI.Text(titleText, new PIXI.TextStyle(textStyle));
    titleMessage.anchor.set(0.5);
    titleMessage.x = app.screen.width / 2;
    titleMessage.y = 50;
    app.stage.addChild(titleMessage);

    const infoTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0x000000,
      wordWrap: true,
      wordWrapWidth: 400
    });

    const infoText = new PIXI.Text(infoTextContent, infoTextStyle);
    infoText.x = 20;
    infoText.y = titleMessage.y + 60;

    const background = new PIXI.Graphics();
    const backgroundWidth = infoText.width + 35;
    const backgroundHeight = infoText.height + 35;
    background.beginFill(0xFFFFFF, 0.3);
    background.drawRect(0, 0, backgroundWidth, backgroundHeight);
    background.endFill();
    background.x = (app.screen.width - backgroundWidth) / 2;
    background.y = infoText.y - 10;

    app.stage.addChild(background);
    app.stage.addChild(infoText);

    const resizeElements = () => {
      if (!app.view) return;

      const newTitleSize = Math.max(20, window.innerWidth / 30);
      titleMessage.style = new PIXI.TextStyle({ ...textStyle, fontSize: newTitleSize });
      titleMessage.x = app.screen.width / 2;
      titleMessage.y = 50;

      background.x = (app.screen.width - backgroundWidth) / 2;
      background.y = titleMessage.y + 60;

      infoText.style = new PIXI.TextStyle({ ...infoTextStyle, wordWrapWidth: backgroundWidth - 40 });
      infoText.x = background.x + 20;
      infoText.y = background.y + 10;

      littleRobot.x = app.screen.width / 2;
      littleRobot.y = app.screen.height / 2;
    };

    resizeElements();

    const debouncedResizeElements = debounce(resizeElements, 100);
    window.addEventListener('resize', debouncedResizeElements);
    currentContainer.addEventListener('click', handleToApp);

    return () => {
      window.removeEventListener('resize', debouncedResizeElements);
      currentContainer.removeEventListener('click', handleToApp);
      currentContainer.removeChild(app.view);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [setCurrentPage]);

  return (
    <div className="intro-animation">
      <div ref={pixiContainer} className="pixi-container">
        {/* Pixi.js canvas will be attached here */}
      </div>
    </div>
  );
}

export default Intro;
