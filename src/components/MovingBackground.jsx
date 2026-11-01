import { useEffect, useRef } from 'react';

export default function MovingBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle interactive pull
    let mouse = { x: -1000, y: -1000, radius: 140 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes (Sustainability constellation)
    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const colors = ['#6cf8bb', '#006c49', '#4edea3', '#0d503c', '#38bdf8', '#10b981'];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2.5 + 1.5;
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.glow = Math.random() * 15 + 8;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse repulsion/attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      draw() {
        const currentRadius = this.radius + Math.sin(this.pulse) * 0.8;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.shadowBlur = this.glow;
        ctx.shadowColor = this.baseColor;
        ctx.globalAlpha = 0.65 + Math.sin(this.pulse) * 0.25;
        ctx.fill();
        ctx.restore();
      }
    }

    // Floating eco motes (drifting upward)
    const moteCount = 20;
    class EcoMote {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.size = Math.random() * 6 + 3;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rot += this.rotSpeed;
        if (this.y < -30) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.beginPath();
        // Leaf-like ellipse
        ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#6cf8bb';
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());
    const motes = Array.from({ length: moteCount }, () => new EcoMote());

    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw smooth animated flowing gradient wave at bottom
      waveOffset += 0.012;
      const waveGrad = ctx.createLinearGradient(0, height - 200, width, height);
      waveGrad.addColorStop(0, 'rgba(108, 248, 187, 0.12)');
      waveGrad.addColorStop(0.5, 'rgba(13, 80, 60, 0.08)');
      waveGrad.addColorStop(1, 'rgba(0, 56, 40, 0.15)');

      ctx.save();
      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 25) {
        const y =
          height -
          90 +
          Math.sin(x * 0.004 + waveOffset) * 35 +
          Math.cos(x * 0.002 - waveOffset * 0.8) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * 0.28;
            ctx.strokeStyle = `rgba(0, 108, 73, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 3. Update & draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // 4. Update & draw floating eco motes
      motes.forEach((m) => {
        m.update();
        m.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Animated Aurora Gradient Orbs in Background */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#6cf8bb]/30 to-[#4edea3]/20 blur-[120px] animate-blob-float" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#006c49]/20 to-[#6cf8bb]/25 blur-[140px] animate-blob-float-reverse" />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[500px] rounded-full bg-gradient-to-t from-[#003828]/25 via-[#6cf8bb]/15 to-transparent blur-[130px] animate-blob-pulse" />

      {/* Floating Geometric Eco Rings */}
      <div className="absolute top-12 right-[18%] w-48 h-48 rounded-full border border-[#006c49]/15 animate-spin-ultra-slow" />
      <div className="absolute top-16 right-[19%] w-36 h-36 rounded-full border border-dashed border-[#6cf8bb]/30 animate-spin-reverse-slow" />
      <div className="absolute bottom-16 left-[12%] w-56 h-56 rounded-full border border-[#4edea3]/20 animate-spin-ultra-slow" />

      {/* Interactive HTML5 Canvas Animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
