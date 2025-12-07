import { useEffect, useRef, useState } from 'react';

const TextPressure = ({
  text = "CINEVIEW",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  className = "",
  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [spans, setSpans] = useState([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      const words = text.split(' ');
      let chars = [];
      words.forEach((word, i) => {
        const wordChars = word.split('');
        chars.push(...wordChars);
        if (i < words.length - 1) chars.push(' ');
      });
      setSpans(chars);
    }
  }, [text]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.1;

      if (titleRef.current && containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        const charElements = titleRef.current.querySelectorAll('span');

        charElements.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;

          const dist = Math.sqrt(
            Math.pow(charX - mouseRef.current.x, 2) + 
            Math.pow(charY - mouseRef.current.y, 2)
          );

          // "Pressure" Logic
          const maxDist = 800; // Radius of influence
          const prox = Math.max(0, 1 - dist / maxDist);

          // Variable Font Axis Mapping
          // 'wdth' (Width): 100 to 200
          // 'wght' (Weight): 100 to 900
          // 'ital' (Italic): 0 to 1
          
          const wdth = width ? 100 + prox * 200 : 100;
          const wght = weight ? 100 + prox * 800 : 800;
          const ital = italic ? prox * 1 : 0;

          char.style.fontVariationSettings = `'wdth' ${wdth}, 'wght' ${wght}, 'ital' ${ital}`;
          
          if (alpha) {
            char.style.opacity = 1 - (dist / (maxDist * 1.5));
          }
        });
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, spans]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <style>
        {`
          @font-face {
            font-family: '${fontFamily}';
            src: url('${fontUrl}') format('woff2');
            font-style: normal;
          }
        `}
      </style>
      <h1
        ref={titleRef}
        className={`${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke-text' : ''} w-full h-full items-center`}
        style={{
          fontFamily: fontFamily,
          fontSize: scale ? 'clamp(2rem, 15vw, 15rem)' : '100%',
          color: stroke ? 'transparent' : textColor,
          WebkitTextStroke: stroke ? `2px ${strokeColor}` : 'none',
          userSelect: 'none',
          minHeight: minFontSize, // Prevent collapse
        }}
      >
        {spans.map((char, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-75 will-change-transform"
            style={{ minWidth: char === ' ' ? '0.5em' : 'auto' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;