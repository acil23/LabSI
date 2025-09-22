import React, { useEffect, useRef, useState } from 'react';

// Komponen Background Neural Network yang terpisah
const NeuralNetworkBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      
      // Recreate nodes after resize
      createNodes();
    };

    // Node class
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 5 + 2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;

        // Bounce off walls
        if (this.x <= 0 || this.x >= canvas.width) {
          this.vx *= -1;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y <= 0 || this.y >= canvas.height) {
          this.vy *= -1;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
      }

      draw() {
        const pulseRadius = this.radius + Math.sin(this.pulse) * 0.3;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity * 0.15})`;
        ctx.fill();
        
        // Main node
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Particle class
    class Particle {
      constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.progress = Math.random();
        this.speed = 0.003 + Math.random() * 0.007;
        this.size = Math.random() * 1.2 + 0.4;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.progress = 0;
        }
      }

      draw() {
        const x = this.startX + (this.endX - this.startX) * this.progress;
        const y = this.startY + (this.endY - this.startY) * this.progress;

        // Particle trail
        ctx.beginPath();
        ctx.arc(x, y, this.size + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
        ctx.fill();

        // Main particle
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create nodes
    const createNodes = () => {
      nodes = [];
      particles = [];
      const nodeCount = Math.max(15, Math.min(40, Math.floor((canvas.width * canvas.height) / 25000)));
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }
      
      // Create particles for connections
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const maxDistance = 180;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) + 
            Math.pow(nodes[i].y - nodes[j].y, 2)
          );
          
          if (distance < maxDistance && Math.random() < 0.3) {
            particles.push(new Particle(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            ));
          }
        }
      }
    };

    // Draw connections
    const drawConnections = () => {
      const maxDistance = 180;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const distance = Math.sqrt(
            Math.pow(node1.x - node2.x, 2) + 
            Math.pow(node1.y - node2.y, 2)
          );
          
          if (distance < maxDistance) {
            const opacity = Math.max(0.05, (1 - distance / maxDistance) * 0.3);
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
            gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 1.2})`);
            gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.random() * 5 + 2;
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw connections
      drawConnections();
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation with small delay to ensure canvas is ready
    setTimeout(() => {
      animate();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Fixed background gradient */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          zIndex: -100
        }}
      />
      
      {/* Fixed canvas for neural network */}
      <canvas
        ref={canvasRef}
        className="position-fixed top-0 start-0"
        style={{
          zIndex: -99,
          width: '100vw',
          height: '100vh',
          display: 'block',
          pointerEvents: 'none' // Penting: agar tidak menghalangi interaksi
        }}
      />
    </>
  );
};


export default NeuralNetworkBackground;;