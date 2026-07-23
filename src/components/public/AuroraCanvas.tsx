import React, { useEffect, useRef } from 'react';

export const AuroraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse spring state
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Aurora blob configurations
    const blobs = [
      { x: width * 0.2, y: height * 0.3, radius: 450, color: 'rgba(139, 92, 246, 0.45)', vx: 0.4, vy: 0.3 }, // Purple
      { x: width * 0.8, y: height * 0.4, radius: 420, color: 'rgba(6, 182, 212, 0.40)', vx: -0.3, vy: 0.5 }, // Cyan
      { x: width * 0.5, y: height * 0.7, radius: 500, color: 'rgba(236, 72, 153, 0.35)', vx: 0.5, vy: -0.4 }, // Pink
      { x: width * 0.3, y: height * 0.8, radius: 400, color: 'rgba(20, 184, 166, 0.35)', vx: -0.4, vy: -0.3 }, // Emerald
      { x: width * 0.7, y: height * 0.2, radius: 380, color: 'rgba(59, 130, 246, 0.40)', vx: 0.3, vy: 0.4 }, // Blue
    ];

    let tick = 0;

    const render = () => {
      tick += 0.008;

      // Spring easing for cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Clear with dark slate background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Enable additive blending for glowing aurora blend
      ctx.globalCompositeOperation = 'lighter';

      // Draw floating aurora blobs
      blobs.forEach((blob, index) => {
        // Floating drift animation
        const floatX = Math.sin(tick + index) * 80;
        const floatY = Math.cos(tick * 0.8 + index) * 60;
        const currentX = blob.x + floatX;
        const currentY = blob.y + floatY;

        // Radial gradient blob
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.6, blob.color.replace(/[\d\.]+\)$/, '0.15)'));
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cursor magnetic radial light & pop effect
      const cursorGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        350
      );
      cursorGradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)'); // Vibrant Cyan Bloom
      cursorGradient.addColorStop(0.4, 'rgba(139, 92, 246, 0.25)'); // Soft Purple
      cursorGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 350, 0, Math.PI * 2);
      ctx.fill();

      // Reset composite operation for subtle film grain noise
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* SVG Grain Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
