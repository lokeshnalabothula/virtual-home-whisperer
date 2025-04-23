
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
    {/* Smallener */}
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

