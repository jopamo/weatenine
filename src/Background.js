import React, { useRef, useEffect } from 'react';
import { Application, Assets, Sprite, BlurFilter } from 'pixi.js';
import { debounce } from 'lodash';
import './Background.css';

function Background({ onBackgroundClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let app;
    let dispose = () => {};

    (async () => {

      app = new Application();
      await app.init({ resizeTo: window, backgroundAlpha: 0 });

      if (!containerRef.current) return;
      containerRef.current.appendChild(app.canvas);

	  const root = process.env.PUBLIC_URL || '';
      const urls = [`${root}/texture.jpg`, `${root}/splash.png`];

	  const tex   = await Assets.load(urls);
	  const bgTex = tex[`${root}/texture.jpg`];
	  const spTex = tex[`${root}/splash.png`];

      const bg = new Sprite(bgTex);
      const splash = new Sprite(spTex);
      bg.anchor.set(0.5);
      splash.anchor.set(0.5);
      app.stage.addChild(bg, splash);

      let coverScale = 1;

      const fit = () => {
        coverScale = Math.max(
          app.screen.width  / bgTex.width,
          app.screen.height / bgTex.height,
        );
        bg.scale.set(coverScale);
        bg.position.set(app.screen.width / 2, app.screen.height / 2);

        const sS = Math.max(
          app.screen.width  / spTex.width,
          app.screen.height / spTex.height,
        );
        splash.scale.set(sS);
        splash.position.set(app.screen.width / 2, app.screen.height / 2);
      };
      fit();

      const blur = new BlurFilter({ blur: 0, padding: 100 });
      splash.filters = [blur];

      const zoomAmp  = 0.05;
      const moveRad  = 15;
      const blurBase = 4;
      const blurSwing = 2;

      let t = 0;
      app.ticker.add(() => {
        t += 0.005;

        blur.blur = blurBase + blurSwing * Math.sin(t * 2);

        const zoomFactor = 2 + zoomAmp * (0.5 + 0.5 * Math.sin(t));
        bg.scale.set(coverScale * zoomFactor);

        bg.x = app.screen.width  / 2 + moveRad * Math.sin(t * 0.9);
        bg.y = app.screen.height / 2 + moveRad * Math.cos(t * 0.9);
      });

      const onResize = debounce(fit, 200);
      window.addEventListener('resize', onResize);
      app.canvas.addEventListener('click', onBackgroundClick);

      dispose = () => {
        window.removeEventListener('resize', onResize);
        app.canvas.removeEventListener('click', onBackgroundClick);
        Assets.unload(urls);
        if (containerRef.current?.contains(app.canvas)) {
          containerRef.current.removeChild(app.canvas);
        }
        app.destroy(true, { children: true });
      };
    })();

    return () => dispose();
  }, [onBackgroundClick]);

  return (
    <div className="background-container">
      <div ref={containerRef} />
    </div>
  );
}

export default Background;
