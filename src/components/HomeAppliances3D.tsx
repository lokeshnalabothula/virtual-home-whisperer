
import React from "react";

export const Sofa: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Base */}
    <mesh position={[0, 0.17, 0]}>
      <boxGeometry args={[1.2, 0.34, 0.5]} />
      <meshStandardMaterial color="#dfdfde" roughness={0.7} metalness={0.07} />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.37, -0.19]}>
      <boxGeometry args={[1.18, 0.28, 0.18]} />
      <meshStandardMaterial color="#ccccca" roughness={0.7} metalness={0.05} />
    </mesh>
    {/* Left armrest */}
    <mesh position={[-0.58, 0.28, 0]}>
      <boxGeometry args={[0.07, 0.28, 0.5]} />
      <meshStandardMaterial color="#ccccca" roughness={0.7} metalness={0.05} />
    </mesh>
    {/* Right armrest */}
    <mesh position={[0.58, 0.28, 0]}>
      <boxGeometry args={[0.07, 0.28, 0.5]} />
      <meshStandardMaterial color="#ccccca" roughness={0.7} metalness={0.05} />
    </mesh>
  </group>
);

export const CoffeeTable: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Top */}
    <mesh position={[0, 0.23, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 0.04, 18]} />
      <meshStandardMaterial color="#363636" metalness={0.6} roughness={0.3} />
    </mesh>
    {/* Legs */}
    {[[-0.13, 0], [0.13, 0], [0, 0.13], [0, -0.13]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.115, z]}>
        <cylinderGeometry args={[0.014, 0.014, 0.19, 12]} />
        <meshStandardMaterial color="#b1a89a" metalness={0.1} roughness={0.6} />
      </mesh>
    ))}
  </group>
);

export const Wardrobe: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.85, 0]}>
      <boxGeometry args={[0.65, 1.6, 0.44]} />
      <meshStandardMaterial color="#e4e1dc" roughness={0.4} metalness={0.11} />
    </mesh>
    {/* Handles */}
    <mesh position={[0.17, 1.25, 0.24]}>
      <boxGeometry args={[0.02, 0.07, 0.03]} />
      <meshStandardMaterial color="#778" metalness={0.75} roughness={0.2} />
    </mesh>
    <mesh position={[-0.17, 1.25, 0.24]}>
      <boxGeometry args={[0.02, 0.07, 0.03]} />
      <meshStandardMaterial color="#778" metalness={0.75} roughness={0.2} />
    </mesh>
  </group>
);

export const TVWall: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Panel */}
    <mesh position={[0, 1.55, 0.07]}>
      <boxGeometry args={[1.1, 0.75, 0.06]} />
      <meshStandardMaterial color="#23272a" roughness={0.5} metalness={0.3} />
    </mesh>
    {/* TV */}
    <mesh position={[0, 1.55, 0.12]}>
      <boxGeometry args={[0.95, 0.52, 0.01]} />
      <meshStandardMaterial color="#101113" emissive="#222" />
    </mesh>
  </group>
);

export const PlantBig: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Pot */}
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.16, 0.18, 0.27, 16]} />
      <meshStandardMaterial color="#d7a77b" metalness={0.12} roughness={0.53} />
    </mesh>
    {/* Leaves: randomize slightly for realism */}
    {[...Array(10)].map((_, i) => (
      <mesh key={i} position={[
        Math.cos(i * Math.PI / 5) * (0.19 + (i % 2) * 0.04),
        0.44 + 0.03 * (i % 2),
        Math.sin(i * Math.PI / 5) * (0.19 + (i % 2) * 0.04)
      ]}>
        <sphereGeometry args={[0.11, 7, 7]} />
        <meshStandardMaterial color="#217b3e" metalness={0.15} roughness={0.36} />
      </mesh>
    ))}
  </group>
);

// Future: you can add Fridge2D, WashingMachine, Shelf, etc here.
