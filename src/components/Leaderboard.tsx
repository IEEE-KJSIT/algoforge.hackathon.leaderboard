import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import * as THREE from 'three';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

// Helper for trophy colors
const getTrophyColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-gray-400';
};

// HARDCODED TEAM DATA - Replace this with your own data
// Just modify this array with your team data
const TEAMS = [
  { id: '1', teamName: 'Code Warriors', rank: 1 },
  { id: '2', teamName: 'Byte Busters', rank: 2 },
  { id: '3', teamName: 'Quantum Coders', rank: 3 },
  { id: '4', teamName: 'Digital Nomads', rank: 4 },
  { id: '5', teamName: 'Tech Titans', rank: 5 },
  { id: '6', teamName: 'Algorithm Aces', rank: 6 },
  { id: '7', teamName: 'Neural Ninjas', rank: 7 },
  { id: '8', teamName: 'Pixel Pirates', rank: 8 },
  { id: '9', teamName: 'Data Demons', rank: 9 },
  { id: '10', teamName: 'Binary Bandits', rank: 10 },
  { id: '11', teamName: 'Logic Legends', rank: 11 },
  { id: '12', teamName: 'Circuit Breakers', rank: 12 },
  { id: '13', teamName: 'Cloud Chasers', rank: 13 },
  { id: '14', teamName: 'Syntax Savants', rank: 14 },
  { id: '15', teamName: 'Function Fanatics', rank: 15 },
  { id: '16', teamName: 'Bug Hunters', rank: 16 },
  { id: '17', teamName: 'Crypto Crusaders', rank: 17 },
  { id: '18', teamName: 'Data Divers', rank: 18 },
  { id: '19', teamName: 'AI Alchemists', rank: 19 },
  { id: '20', teamName: 'Schema Shifters', rank: 20 },
  { id: '21', teamName: 'Pythonic Panthers', rank: 21 },
  { id: '22', teamName: 'JavaScript Jugglers', rank: 22 },
  { id: '23', teamName: 'Ruby Rebels', rank: 23 },
  { id: '24', teamName: 'Go Getters', rank: 24 },
];

export function Leaderboard() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Three.js background
  useEffect(() => {
    if (!backgroundRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.9);
    backgroundRef.current.appendChild(renderer.domElement);

    // Create particles (digital rain effect)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const particlesPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      particlesPositions[i3] = (Math.random() - 0.5) * 100;
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 100;
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    
    // Create particles material with blue digital rain look
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x007bff, 
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create digital grid
    const gridSize = 100;
    const gridDivisions = 50;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00bfff, 0x000066);
    gridHelper.position.y = -20;
    gridHelper.rotation.x = Math.PI / 10;
    scene.add(gridHelper);

    // Create digital circuit lines
    const circuitLinesCount = 25;
    const circuitLines: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>[] = [];
    
    for (let i = 0; i < circuitLinesCount; i++) {
      const points = [];
      const segmentCount = Math.floor(Math.random() * 5) + 3;
      let x = (Math.random() - 0.5) * 80;
      let y = (Math.random() - 0.5) * 80;
      let z = (Math.random() - 0.5) * 80;
      
      for (let j = 0; j < segmentCount; j++) {
        points.push(new THREE.Vector3(x, y, z));
        
        // Create 90-degree turns for circuit-like appearance
        const direction = Math.floor(Math.random() * 3);
        const distance = Math.random() * 10 + 5;
        
        if (direction === 0) x += distance;
        else if (direction === 1) y += distance;
        else z += distance;
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // Random circuit color (blues)
      const colorChoice = Math.random();
      const color = colorChoice > 0.7 ? 0x0066ff : colorChoice > 0.3 ? 0x00bfff : 0x007bff;
      
      const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      
      const line = new THREE.Line(geometry, material);
      circuitLines.push(line);
      scene.add(line);
    }

    // Camera position
    camera.position.z = 50;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Move particles downward slowly (digital rain effect)
      particlesMesh.rotation.y += 0.0003;
      particlesMesh.rotation.x += 0.0001;
      
      // Rotate the grid slowly
      gridHelper.rotation.z += 0.001;

      // Animate circuit lines - pulse opacity
      circuitLines.forEach((line, index) => {
        line.material.opacity = 0.2 + Math.sin(time + index) * 0.2;
      });

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (backgroundRef.current && backgroundRef.current.contains(renderer.domElement)) {
        backgroundRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  // Special styling for top 3 rows
  const getRowClass = (rank: number) => {
    const baseClass = "relative overflow-hidden rounded-lg mb-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,123,255,0.7)]";
    
    if (rank === 1) return `${baseClass} border-2 border-yellow-400 bg-black/80 shadow-[0_0_10px_rgba(255,255,0,0.5)]`;
    if (rank === 2) return `${baseClass} border-2 border-gray-300 bg-black/80 shadow-[0_0_8px_rgba(200,200,200,0.5)]`;
    if (rank === 3) return `${baseClass} border-2 border-amber-600 bg-black/80 shadow-[0_0_8px_rgba(205,127,50,0.5)]`;
    
    return `${baseClass} border border-[#007bff]/30 bg-black/80`;
  };

  return (
    <div className="relative min-h-screen">
      {/* Three.js background */}
      <div 
        ref={backgroundRef} 
        className="fixed top-0 left-0 w-full h-full z-0" 
      />

      {/* Overlay gradient to improve text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-black/80" />
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Title */}
        <div className="text-center mb-12 mt-4">
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#00bfff] mb-6 tracking-tighter">
            AlgoForge
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-glitch">
            LEADERBOARD
          </h2>
          <p className="text-[#00bfff] text-xl">
            <span className="inline-block animate-pulse">{'</'}</span> Hackathon Champions <span className="inline-block animate-pulse">{'>'}</span>
          </p>
        </div>

        {/* Leaderboard Table */}
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 mb-4 px-4 py-3 rounded-t-lg bg-gradient-to-r from-[#000d1a] to-[#001a33] text-white font-medium border-b border-[#007bff]/50">
            <div className="col-span-2 flex items-center justify-center">
              <p className="font-bold text-[#00bfff]">RANK</p>
            </div>
            <div className="col-span-10 flex items-center justify-center">
              <p className="font-bold text-[#00bfff]">TEAM</p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {TEAMS.map((team) => (
              <motion.div 
                key={team.id}
                className={getRowClass(team.rank || 0)}
                variants={itemVariants}
              >
                {/* Glow effect overlay for top 3 */}
                {team.rank && team.rank <= 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine" />
                )}
                
                <div className="grid grid-cols-12 gap-4 px-4 py-5 items-center">
                  {/* Rank */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      {team.rank && team.rank <= 3 ? (
                        <Trophy className={`w-8 h-8 ${getTrophyColor(team.rank)}`} />
                      ) : (
                        <span className="text-2xl font-mono text-gray-300">{team.rank}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Team Name */}
                  <div className="col-span-10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span className={`font-medium text-center ${team.rank && team.rank <= 3 ? 'text-white text-xl' : 'text-gray-200 text-lg'}`}>
                          {team.teamName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 