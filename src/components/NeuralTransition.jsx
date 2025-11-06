import React, { useEffect, useRef } from 'react';

const NeuralTransition = ({ stage }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class dengan efek yang lebih dramatis
    class Particle {
      constructor() {
        this.reset();
        this.age = Math.random() * 100;
      }

      reset() {
        // Start from center
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        
        // Burst direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        
        // Color variations dalam tema
        this.hue = Math.random() * 60 + 180; // 180-240 (cyan to blue/purple)
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
        this.age++;
        
        if (this.life <= 0) {
          this.reset();
        }
      }

      draw(globalAlpha) {
        const alpha = this.life * globalAlpha;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 60%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Neural network nodes
    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.radius = Math.random() * 2 + 1;
        this.hue = Math.random() * 60 + 180;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        this.pulsePhase += 0.05;
      }

      draw(alpha, time) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const nodeAlpha = alpha * pulse;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 4
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${nodeAlpha * 0.6})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize
    const particleCount = 120;
    const nodeCount = 40;
    
    particlesRef.current = Array(particleCount).fill().map(() => new Particle());
    const nodes = Array(nodeCount).fill().map(() => new Node());

    let progress = 0;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      const time = Date.now() * 0.001;

      // Dark background dengan gradient
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bgGradient.addColorStop(1, 'rgba(5, 10, 30, 0.95)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate alpha based on stage
      let alpha;
      if (stage === 'fadeOut') {
        // Ease in-out untuk transisi lebih smooth
        const t = progress;
        alpha = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      } else {
        const t = 1 - progress;
        alpha = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }

      // Draw neural network connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const connectionAlpha = (1 - distance / 180) * alpha * 0.4;
            
            // Gradient line
            const gradient = ctx.createLinearGradient(
              nodeA.x, nodeA.y, nodeB.x, nodeB.y
            );
            gradient.addColorStop(0, `hsla(${nodeA.hue}, 100%, 60%, ${connectionAlpha})`);
            gradient.addColorStop(1, `hsla(${nodeB.hue}, 100%, 60%, ${connectionAlpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach(node => {
        node.update(time);
        node.draw(alpha * 0.9, time);
      });

      // Update and draw particles (burst effect)
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(alpha * 1.2);
      });

      // Center energy pulse effect
      if (alpha > 0.3) {
        const pulseSize = 150 * alpha;
        const pulseGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, pulseSize
        );
        pulseGradient.addColorStop(0, `hsla(200, 100%, 60%, ${alpha * 0.3})`);
        pulseGradient.addColorStop(0.5, `hsla(220, 100%, 50%, ${alpha * 0.15})`);
        pulseGradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      className="neural-transition-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default NeuralTransition;
