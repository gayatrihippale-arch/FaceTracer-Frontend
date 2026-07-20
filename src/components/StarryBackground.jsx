import React, { useEffect, useRef } from "react";

export default function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Star configuration
    const numStars = 120;
    const stars = [];
    const mouse = { x: -1000, y: -1000, radius: 160 };

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        originX: 0,
        originY: 0,
        baseSize: Math.random() * 1.8 + 0.5,
        size: 0,
        color: `rgba(245, 158, 11, ${Math.random() * 0.7 + 0.3})`, // Yellow/Gold colors
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: Math.random() * 0.02 - 0.01,
        brightnessOffset: Math.random() * 100,
      });
      stars[i].originX = stars[i].x;
      stars[i].originY = stars[i].y;
    }

    // Mouse movement listener
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Move star slowly
        star.x += star.speedX;
        star.y += star.speedY;
        star.angle += star.angularSpeed;

        // Wrap around screen boundaries
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        star.originX = star.x;
        star.originY = star.y;

        // Mouse reactive magnetic/gravitational pull
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let finalX = star.x;
        let finalY = star.y;
        let extraGlow = 0;

        if (distance < mouse.radius) {
          // Calculate force (closer = stronger)
          const force = (mouse.radius - distance) / mouse.radius;
          
          // Gently push stars away or attract them (repulsion creates nice galaxy field effect)
          const pullAngle = Math.atan2(dy, dx);
          const shift = force * 20; // Maximum shift in pixels
          
          finalX = star.x - Math.cos(pullAngle) * shift;
          finalY = star.y - Math.sin(pullAngle) * shift;
          
          // Increase glow
          extraGlow = force * 0.8;
        }

        // Pulse brightness (twinkle effect)
        const time = Date.now() * 0.002 + star.brightnessOffset;
        const twinkle = Math.sin(time) * 0.25 + 0.75; // Between 0.5 and 1.0
        
        ctx.beginPath();
        // Star size with hover glow expansion
        const currentSize = star.baseSize * twinkle + extraGlow * 1.5;
        
        // Draw star particle
        ctx.arc(finalX, finalY, currentSize, 0, Math.PI * 2);
        
        // Glow shadow
        ctx.shadowBlur = extraGlow > 0 ? 12 : 3;
        ctx.shadowColor = "#f59e0b";
        
        ctx.fillStyle = extraGlow > 0 
          ? `rgba(253, 230, 138, ${Math.min(1, 0.7 + extraGlow)})` 
          : star.color;
          
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for efficiency
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
