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
  if (rank === 1) return 'text-yellow-400 animate-pulse-slow';
  if (rank === 2) return 'text-gray-300 animate-pulse-slow';
  if (rank === 3) return 'text-amber-600 animate-pulse-slow';
  return 'text-cyan-400';
};

// HARDCODED TEAM DATA - Replace this with your own data
// To update the leaderboard, simply change the rank values in this array
// Teams will be displayed in the order of their rank
const TEAMS = [
  { id: '1', teamName: 'lorem ipsum', rank: 4 },
  { id: '2', teamName: 'V4', rank: 6 },
  { id: '3', teamName: 'Tech Shastra', rank: 8 },
  { id: '4', teamName: 'Anon', rank: 10 },
  { id: '5', teamName: 'MADS 404', rank: 13 },
  { id: '6', teamName: 'Devally', rank: 14 },
  { id: '7', teamName: 'Fantastic Four', rank: 15 },
  { id: '8', teamName: 'Four Loop', rank: 16 },
  { id: '9', teamName: 'Falcons', rank: 17 },
  { id: '10', teamName: 'Star', rank: 21 },
  { id: '11', teamName: 'MangoDB', rank: 9 },
  { id: '12', teamName: 'Team Voldemort', rank: 1 },
  { id: '13', teamName: 'Unfortunately Fortunate', rank: 12 },
  { id: '14', teamName: 'Code Blooded', rank: 20 },
  { id: '15', teamName: 'ROSHINI', rank: 23 },
  { id: '16', teamName: 'npx Masters', rank: 22 },
  { id: '17', teamName: 'Debug Thugs', rank: 18 },
  { id: '18', teamName: 'Syntax Error', rank: 19 },
  { id: '19', teamName: 'KnowWiz', rank: 2 },
  { id: '20', teamName: 'Mappa', rank: 7 },
  { id: '21', teamName: 'Team PASH', rank: 3 },
  { id: '22', teamName: 'Unpaid Labours', rank: 11 },
  { id: '23', teamName: '</ByteZeta>', rank: 5 },
  { id: '24', teamName: 'AlgoZenith', rank: 24 },
];

// Sort teams by rank
const sortedTeams = [...TEAMS].sort((a, b) => a.rank - b.rank);

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
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

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
      // Random circuit color (blues/cyans)
      const colorChoice = Math.random();
      const color = colorChoice > 0.7 ? 0x0284c7 : colorChoice > 0.3 ? 0x06b6d4 : 0x0ea5e9;
      
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
    const baseClass = "relative overflow-hidden rounded-lg mb-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.7)] group";
    
    if (rank === 1) return `${baseClass} border border-yellow-400/50 bg-black/80 shadow-[0_0_10px_rgba(255,255,0,0.2)]`;
    if (rank === 2) return `${baseClass} border border-gray-300/50 bg-black/80 shadow-[0_0_8px_rgba(200,200,200,0.2)]`;
    if (rank === 3) return `${baseClass} border border-amber-600/50 bg-black/80 shadow-[0_0_8px_rgba(205,127,50,0.2)]`;
    
    return `${baseClass} border border-cyan-500/20 bg-black/80 hover:border-cyan-500/40`;
  };

  return (
    <div className="relative min-h-screen">
      {/* Three.js background */}
      <div 
        ref={backgroundRef} 
        className="fixed top-0 left-0 w-full h-full z-0" 
      />

      {/* Enhanced overlay gradient to improve text readability with cyberpunk feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      
      {/* Cyber grid lines overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Horizontal lines */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute h-[1px] bg-cyan-500/30 w-full" 
            style={{ top: `${(i + 1) * 5}%` }} 
          />
        ))}
        
        {/* Vertical lines */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={`v-${i}`} 
            className="absolute w-[1px] bg-cyan-500/20 h-full" 
            style={{ left: `${(i + 1) * 5}%` }} 
          />
        ))}
      </div>
      
      {/* Add scanner line effect */}
      <motion.div 
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-0"
        animate={{ 
          y: ["-10%", "110%"]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Title - Cyberpunk AlgoForge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="relative mb-12 mt-4 text-center"
        >
          <div className="relative inline-block">
            {/* Circuit pattern background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-[1px] h-full bg-cyan-500/50"></div>
              <div className="absolute top-0 right-1/4 w-[1px] h-full bg-red-500/50"></div>
              <div className="absolute top-1/3 left-0 w-full h-[1px] bg-cyan-500/50"></div>
              <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-red-500/50"></div>
            </div>

            {/* Main container with glowing border */}
            <div className="relative px-8 py-4 bg-black/80 overflow-hidden group">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-red-500/20"></div>
              <div className="absolute inset-[1px] bg-black/90 z-0"></div>

              {/* Glowing lines */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.15), transparent 25%)",
                    "radial-gradient(circle at 80% 80%, rgba(255, 0, 0, 0.15), transparent 25%)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>

              {/* Main text */}
              <div className="relative z-10">
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold text-center relative">
                  <div className="relative inline-block group">
                    {/* Main text with enhanced gradients */}
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-600 group-hover:from-cyan-400 group-hover:to-cyan-700 transition-all duration-500">
                      Algo
                    </span>
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-red-500 to-purple-700 group-hover:from-red-500 group-hover:to-purple-800 transition-all duration-500">
                      Forge
                    </span>

                    {/* Animated background elements */}
                    <div className="absolute inset-0 -z-10">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-red-500/10 blur-xl"
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                          scale: [0.98, 1.02, 0.98]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>

                    {/* Glitch effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-red-500/5"
                      animate={{
                        x: ["-1%", "1%", "-1%"],
                        opacity: [0.2, 0.3, 0.2]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />

                    {/* Decorative elements */}
                    <div className="absolute -inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
                    <div className="absolute -inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
                    
                    {/* Energy particles */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          "radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.08), transparent 50%)",
                          "radial-gradient(circle at 70% 60%, rgba(255, 0, 0, 0.08), transparent 50%)"
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
          </h1>

                {/* Dynamic scan lines */}
                <motion.div 
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0.05 }}
                  animate={{ opacity: [0.05, 0.1, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
                      style={{ top: `${i * 10}%` }}
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "linear"
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Subtle scan line effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent"
                animate={{ 
                  y: ["-200%", "200%"]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-red-500 opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            ></motion.div>
        </div>

          {/* Leaderboard Title - Mini version with less effects */}
          <div className="relative mt-2 mb-10">
            <h2 className="text-3xl md:text-5xl font-bold relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500">LEADER</span>
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-red-500 to-purple-600">BOARD</span>
              
              {/* Simple glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-red-500/20 blur-sm -z-10"></div>
              
              {/* Minimal line decorations */}
              <div className="absolute -inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
              <div className="absolute -inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
            </h2>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Podium for Top 3 */}
          <motion.div 
            className="mb-12 grid grid-cols-7 gap-4 relative h-64"
            variants={containerVariants}
          >
            {/* Second Place - Left */}
            <motion.div 
              className="col-span-2 h-full flex flex-col relative"
              variants={itemVariants}
            >
              <div className="flex-grow flex items-end">
                <div className="w-full relative overflow-hidden rounded-t-lg border border-gray-300/50 bg-black/80 shadow-[0_0_8px_rgba(200,200,200,0.2)] group h-48">
                  {/* Glow effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine" />
                  
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/5 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] h-full bg-gray-300/30"></div>
                  <div className="absolute inset-y-0 left-0 w-[1px] h-full bg-gray-300/30"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 relative z-10">
                    <div className="relative mb-3">
                      <Trophy className="w-10 h-10 text-gray-300 animate-pulse-slow" />
                      <div className="absolute -inset-2 rounded-full bg-gray-300/10"></div>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 text-center mb-1">2nd</p>
                    <p className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 text-center">
                      {sortedTeams.find(t => t.rank === 2)?.teamName || "---"}
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-gray-300/30 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-[1px] bg-gradient-to-l from-gray-300/30 to-transparent"></div>
                </div>
              </div>
              <div className="h-6 w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-t border-gray-500/50 rounded-b-lg relative">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gray-300/30"></div>
                <div className="absolute left-1/4 bottom-0 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* First Place - Center */}
            <motion.div 
              className="col-span-3 h-full flex flex-col relative"
              variants={itemVariants}
            >
              <div className="flex-grow flex items-end">
                <div className="w-full relative overflow-hidden rounded-t-lg border border-yellow-400/50 bg-black/80 shadow-[0_0_10px_rgba(255,255,0,0.2)] group h-64">
                  {/* Glow effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine" />
                  
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] h-full bg-yellow-400/30"></div>
                  <div className="absolute inset-y-0 left-0 w-[1px] h-full bg-yellow-400/30"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 relative z-10">
                    <div className="relative mb-4">
                      <Trophy className="w-14 h-14 text-yellow-400 animate-pulse-slow" />
                      <motion.div 
                        className="absolute -inset-3 rounded-full bg-yellow-400/10"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-center mb-1">1st</p>
                    <p className="text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-center">
                      {sortedTeams.find(t => t.rank === 1)?.teamName || "---"}
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-yellow-400/30 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-[1px] bg-gradient-to-l from-yellow-400/30 to-transparent"></div>
                </div>
              </div>
              <div className="h-8 w-full bg-gradient-to-r from-yellow-900/80 to-yellow-800/80 border-t border-yellow-500/50 rounded-b-lg relative">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-yellow-400/30"></div>
                <div className="absolute left-1/4 bottom-0 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* Third Place - Right */}
            <motion.div 
              className="col-span-2 h-full flex flex-col relative"
              variants={itemVariants}
            >
              <div className="flex-grow flex items-end">
                <div className="w-full relative overflow-hidden rounded-t-lg border border-amber-600/50 bg-black/80 shadow-[0_0_8px_rgba(205,127,50,0.2)] group h-40">
                  {/* Glow effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shine" />
                  
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] h-full bg-amber-600/30"></div>
                  <div className="absolute inset-y-0 left-0 w-[1px] h-full bg-amber-600/30"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 relative z-10">
                    <div className="relative mb-3">
                      <Trophy className="w-10 h-10 text-amber-600 animate-pulse-slow" />
                      <div className="absolute -inset-2 rounded-full bg-amber-600/10"></div>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 text-center mb-1">3rd</p>
                    <p className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 text-center">
                      {sortedTeams.find(t => t.rank === 3)?.teamName || "---"}
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-amber-600/30 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-[1px] bg-gradient-to-l from-amber-600/30 to-transparent"></div>
                </div>
              </div>
              <div className="h-5 w-full bg-gradient-to-r from-amber-800/80 to-amber-700/80 border-t border-amber-700/50 rounded-b-lg relative">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-600/30"></div>
                <div className="absolute left-1/4 bottom-0 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* Podium connecting line effects */}
            <motion.div 
              className="absolute left-0 right-0 bottom-0 h-[2px]"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="h-full bg-gradient-to-r from-cyan-500/30 via-transparent to-cyan-500/30"></div>
            </motion.div>
            
            {/* Floating particles around podium */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  i % 3 === 0 ? 'bg-cyan-500/60' : i % 3 === 1 ? 'bg-red-500/60' : 'bg-cyan-400/60'
                }`}
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [Math.random() * 10, -Math.random() * 10, Math.random() * 10],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 mb-4 px-4 py-3 rounded-t-lg bg-gradient-to-r from-black/80 to-black/90 text-white font-medium border border-cyan-500/30 relative overflow-hidden">
            {/* Header glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-red-500/5"></div>
            <div className="absolute -inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
            <div className="absolute -inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
            
            <div className="col-span-2 flex items-center justify-center relative z-10">
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">RANK</p>
            </div>
            <div className="col-span-10 flex items-center justify-center relative z-10">
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-600">TEAM</p>
            </div>
          </div>

          {/* Table Rows - Now showing only teams 4th place and below */}
          <div className="space-y-2">
            {sortedTeams.filter(team => team.rank > 3).map((team) => (
              <motion.div 
                key={team.id}
                className={getRowClass(team.rank || 0)}
                variants={itemVariants}
              >
                <div className="grid grid-cols-12 gap-4 px-4 py-5 items-center relative z-10">
                  {/* Rank */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <span className="text-2xl font-mono text-gray-300 group-hover:text-cyan-300 transition-colors duration-300">{team.rank}</span>
                    </div>
                  </div>
                  
                  {/* Team Name */}
                  <div className="col-span-10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span className="font-medium text-center text-cyan-100 text-lg group-hover:text-cyan-300 transition-colors duration-300">
                          {team.teamName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements for all rows */}
                  <div className="absolute top-0 left-0 w-1/4 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-1/4 h-[1px] bg-gradient-to-l from-cyan-500/30 to-transparent"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 