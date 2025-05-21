import { useEffect } from 'react';

const SparkleCursor = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        overflow: hidden;
        margin: 0;
        padding: 0;
        max-width: 100vw;
        max-height: 100vh;
      }
    `;
    document.head.appendChild(style);

    let colour = "#FF0000";
    let sparkles = 40;
    let x = 400, ox = 400, y = 300, oy = 300;
    let swide = window.innerWidth, shigh = window.innerHeight;
    let sleft = 0, sdown = 0;

    let tiny = [], star = [], starv = [],
        starx = [], stary = [], tinyx = [],
        tinyy = [], tinyv = [];

    const createDiv = (height, width) => {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.height = `${height}px`;
      div.style.width = `${width}px`;
      div.style.overflow = "hidden";
      div.style.backgroundColor = colour;
      return div;
    };

    const sparkle = () => {
      if (x !== ox || y !== oy) {
        ox = x;
        oy = y;
        for (let c = 0; c < sparkles; c++) {
          if (!starv[c]) {
            star[c].style.left = (starx[c] = x) + "px";
            star[c].style.top = (stary[c] = y) + "px";
            star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
            star[c].style.visibility = "visible";
            starv[c] = 50;
            break;
          }
        }
      }

      for (let c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
      }
      setTimeout(sparkle, 40);
    };

    const update_star = (i) => {
      if (--starv[i] === 25) {
        star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
      }
      if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;
        if (stary[i] < shigh + sdown) {
          star[i].style.top = stary[i] + "px";
          starx[i] += (i % 5 - 2) / 5;
          star[i].style.left = starx[i] + "px";
        } else {
          star[i].style.visibility = "hidden";
          starv[i] = 0;
        }
      } else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
        tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
        tiny[i].style.width = "2px";
        tiny[i].style.height = "2px";
        star[i].style.visibility = "hidden";
        tiny[i].style.visibility = "visible";
      }
    };

    const update_tiny = (i) => {
      if (--tinyv[i] === 25) {
        tiny[i].style.width = "1px";
        tiny[i].style.height = "1px";
      }
      if (tinyv[i]) {
        tinyy[i] += 1 + Math.random() * 3;
        if (tinyy[i] < shigh + sdown) {
          tiny[i].style.top = tinyy[i] + "px";
          tinyx[i] += (i % 5 - 2) / 5;
          tiny[i].style.left = tinyx[i] + "px";
        } else {
          tiny[i].style.visibility = "hidden";
          tinyv[i] = 0;
        }
      } else {
        tiny[i].style.visibility = "hidden";
      }
    };

    const set_scroll = () => {
      sdown = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      sleft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    };

    const set_width = () => {
      swide = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      shigh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    };

    const mouse = (e) => {
      set_scroll();
      y = e.pageY + sdown;
      x = e.pageX + sleft;
    };

    for (let i = 0; i < sparkles; i++) {
      let rats = createDiv(3, 3);
      rats.style.visibility = "hidden";
      document.body.appendChild(tiny[i] = rats);
      starv[i] = 0;
      tinyv[i] = 0;

      rats = createDiv(5, 5);
      rats.style.backgroundColor = "transparent";
      rats.style.visibility = "hidden";

      let rlef = createDiv(1, 5);
      let rdow = createDiv(5, 1);
      rats.appendChild(rlef);
      rats.appendChild(rdow);

      rlef.style.top = "2px";
      rlef.style.left = "0px";
      rdow.style.top = "0px";
      rdow.style.left = "2px";

      document.body.appendChild(star[i] = rats);
    }

    document.addEventListener("mousemove", mouse);
    window.addEventListener("resize", set_width);

    set_width();
    sparkle();

    return () => {
      document.removeEventListener("mousemove", mouse);
      window.removeEventListener("resize", set_width);
      style.remove();
      // Nettoyage DOM
      tiny.forEach(el => document.body.removeChild(el));
      star.forEach(el => document.body.removeChild(el));
    };
  }, []);

  return null;
};

export default SparkleCursor;
