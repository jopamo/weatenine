import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { BlurFilter } from '@pixi/filter-blur';
import { debounce } from 'lodash';
import './Background.css';

function Background({ onBackgroundClick }) {
  const pixiContainer = useRef(null);

  useEffect(() => {
    const background = new PIXI.Application({
      resizeTo: window,
      transparent: true,
    });

    const currentContainer = pixiContainer.current;
    currentContainer.appendChild(background.view);

    const bg = PIXI.Sprite.from('texture.jpg');
    bg.width = background.screen.width;
    bg.height = background.screen.height;
    background.stage.addChild(bg);

    let scale = 1;
    let scaleSpeed = 0.0001;

    const paintSplash = PIXI.Sprite.from('splash.png');
    paintSplash.anchor.set(0.5);
    paintSplash.x = background.screen.width / 2;
    paintSplash.y = background.screen.height / 2;
    background.stage.addChild(paintSplash);

    const resizeSplash = () => {
      const scaleX = background.screen.width / paintSplash.texture.width;
      const scaleY = background.screen.height / paintSplash.texture.height;
      const coverScale = Math.max(scaleX, scaleY);

      paintSplash.scale.set(coverScale);
      paintSplash.x = background.screen.width / 2;
      paintSplash.y = background.screen.height / 2;
    };

    const blurFilter1 = new BlurFilter();
    const blurFilter2 = new BlurFilter();
    paintSplash.filters = [blurFilter2];

    let count = 0;
    background.ticker.add(() => {
      count += 0.005;
      blurFilter1.blur = 20 * Math.cos(count);
      blurFilter2.blur = 20 * Math.sin(count);

      scale += scaleSpeed;
      bg.scale.set(scale);

      if (scale >= 1.50 || scale <= 1.0) {
        scaleSpeed *= -1;
      }

      resizeSplash();
    });

    const debouncedResizeElements = debounce(resizeSplash, 100);
    window.addEventListener('resize', debouncedResizeElements);
    currentContainer.addEventListener('click', onBackgroundClick);

    return () => {
      window.removeEventListener('resize', debouncedResizeElements);
      currentContainer.removeEventListener('click', onBackgroundClick);
      currentContainer.removeChild(background.view);
      background.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [onBackgroundClick]);

  return (
    <div className="background-container">
      <div ref={pixiContainer} />
    </div>
  );
};

export default Background;
