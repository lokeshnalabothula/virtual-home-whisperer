
import React from "react";

// Plant decor (low poly)
export const Plant: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Pot */}
    <mesh position={[0, 0.15, 0]}>
      <cylinderGeometry args={[0.13, 0.18, 0.27, 16]} />
      <meshStandardMaterial color="#d7a77b" metalness={0.13} roughness={0.52} />
    </mesh>
    {/* Leaves */}
    {[...Array(8)].map((_, i) => (
      <mesh key={i} position={[Math.cos(i*Math.PI/4)*0.16, 0.37, Math.sin(i*Math.PI/4)*0.16]}>
        <sphereGeometry args={[0.12, 7, 7]} />
        <meshStandardMaterial color="#2f9252" metalness={0.15} roughness={0.36} />
      </mesh>
    ))}
  </group>
);

// TV cabinet & TV
export const TVSet: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Cabinet */}
    <mesh position={[0, 0.16, 0]}>
      <boxGeometry args={[0.86, 0.3, 0.36]} />
      <meshStandardMaterial color="#bba07a" metalness={0.02} roughness={0.27} />
    </mesh>
    {/* TV Screen */}
    <mesh position={[-0.38, 0.36, -0.12]}>
      <boxGeometry args={[0.44, 0.23, 0.03]} />
      <meshStandardMaterial color="#222" emissive="#111" />
    </mesh>
  </group>
);

// Simple mirror (or wall decor)
export const WallMirrors: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Big mirror */}
    <mesh position={[0, 2, 0.09]}>
      <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
      <meshStandardMaterial color="#efe6db" metalness={0.25} roughness={0.11} />
    </mesh>
    {/* Smaller */}
    <mesh position={[0.35, 2.15, 0.09]}>
      <cylinderGeometry args={[0.11, 0.11, 0.02, 32]} />
      <meshStandardMaterial color="#d5b486" metalness={0.19} roughness={0.12} />
    </mesh>
  </group>
);

// Rug
export const RoomRug: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <mesh position={position} rotation={[-Math.PI/2, 0, 0]}>
    <circleGeometry args={[0.68, 36]} />
    <meshStandardMaterial 
      color="#f1eee2"
      metalness={0.02}
      roughness={0.38}
      />
  </mesh>
);

// Kitchen - Fridge
export const Fridge: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.8, 0]}>
      <boxGeometry args={[0.7, 1.6, 0.6]} />
      <meshStandardMaterial color="#e8e8e8" metalness={0.6} roughness={0.2} />
    </mesh>
    <mesh position={[0, 1.4, 0.31]} castShadow>
      <boxGeometry args={[0.1, 0.1, 0.02]} />
      <meshStandardMaterial color="#333" metalness={0.5} roughness={0.2} />
    </mesh>
  </group>
);

// Coffee Maker
export const CoffeeMaker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.24, 0.35, 0.24]} />
      <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
      <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.2} />
    </mesh>
  </group>
);

// Microwave
export const Microwave: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.45, 0.28, 0.32]} />
      <meshStandardMaterial color="#444444" metalness={0.4} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0, 0.17]} castShadow>
      <boxGeometry args={[0.32, 0.22, 0.02]} />
      <meshStandardMaterial color="#222" opacity={0.7} transparent={true} />
    </mesh>
  </group>
);
