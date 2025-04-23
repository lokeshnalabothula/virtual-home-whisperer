
import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
    <mesh position={[0, 0.56, 0]}>
      <boxGeometry args={[0.74, 0.46, 0.04]} />
      <meshStandardMaterial color="#222" emissive="#111" />
    </mesh>
    {/* TV Stand */}
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[0.15, 0.14, 0.15]} />
      <meshStandardMaterial color="#555" metalness={0.6} roughness={0.2} />
    </mesh>
  </group>
);

// Simple mirror (or wall decor)
export const WallMirrors: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Big mirror */}
    <mesh position={[0, 2, 0.09]}>
      <boxGeometry args={[0.5, 0.7, 0.03]} />
      <meshStandardMaterial color="#efe6db" metalness={0.65} roughness={0.11} />
    </mesh>
    {/* Mirror frame */}
    <mesh position={[0, 2, 0.08]}>
      <boxGeometry args={[0.58, 0.78, 0.02]} />
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
    {/* Fridge door seal */}
    <mesh position={[0, 0.8, 0.3]}>
      <boxGeometry args={[0.65, 1.55, 0.01]} />
      <meshStandardMaterial color="#ddd" metalness={0.3} roughness={0.5} />
    </mesh>
  </group>
);

// Coffee Maker
export const CoffeeMaker: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const steamRef = React.useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (steamRef.current) {
      steamRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02 + 0.3;
      steamRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.24, 0.08, 0.24]} />
        <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.2, 0.18]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.18]} />
        <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Steam (animated) */}
      <group ref={steamRef}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
};

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
    {/* Control panel */}
    <mesh position={[0.17, 0, 0]}>
      <boxGeometry args={[0.08, 0.24, 0.28]} />
      <meshStandardMaterial color="#333333" metalness={0.3} roughness={0.4} />
    </mesh>
    {/* Buttons */}
    {[...Array(4)].map((_, i) => (
      <mesh key={i} position={[0.21, 0.07 - i * 0.04, 0]}>
        <boxGeometry args={[0.01, 0.02, 0.08]} />
        <meshStandardMaterial color="#666" metalness={0.5} roughness={0.2} />
      </mesh>
    ))}
  </group>
);

// New: Toaster
export const Toaster: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.06, 0]}>
      <boxGeometry args={[0.2, 0.12, 0.14]} />
      <meshStandardMaterial color="#d1d1d1" metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Slots */}
    <mesh position={[0, 0.12, 0]}>
      <boxGeometry args={[0.16, 0.02, 0.1]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Lever */}
    <mesh position={[0.08, 0.06, 0.08]}>
      <boxGeometry args={[0.02, 0.06, 0.02]} />
      <meshStandardMaterial color="#444" metalness={0.5} roughness={0.2} />
    </mesh>
  </group>
);

// New: Kitchen Counter
export const KitchenCounter: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[1.8, 0.05, 0.6]} />
      <meshStandardMaterial color="#e5e5e5" metalness={0.2} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[1.8, 0.4, 0.58]} />
      <meshStandardMaterial color="#c4a68a" metalness={0.1} roughness={0.7} />
    </mesh>
    {/* Cabinet handles */}
    {[...Array(3)].map((_, i) => (
      <mesh key={i} position={[-0.5 + i * 0.5, 0.2, 0.29]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
  </group>
);

// New: Dining Table
export const DiningTable: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Table top */}
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[1, 0.05, 0.6]} />
      <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.8} />
    </mesh>
    {/* Table legs */}
    {[[-0.4, -0.4], [-0.4, 0.4], [0.4, -0.4], [0.4, 0.4]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.2, z]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6e4230" metalness={0.1} roughness={0.7} />
      </mesh>
    ))}
  </group>
);

// New: Chair
export const Chair: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Seat */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[0.4, 0.04, 0.4]} />
      <meshStandardMaterial color="#a87654" metalness={0.1} roughness={0.8} />
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.45, -0.18]}>
      <boxGeometry args={[0.38, 0.4, 0.04]} />
      <meshStandardMaterial color="#a87654" metalness={0.1} roughness={0.8} />
    </mesh>
    {/* Legs */}
    {[[-0.15, -0.15], [-0.15, 0.15], [0.15, -0.15], [0.15, 0.15]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.12, z]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#8b5d3b" metalness={0.1} roughness={0.7} />
      </mesh>
    ))}
  </group>
);

// New: Bed for bedroom
export const Bed: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Mattress */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1.4, 0.2, 2]} />
      <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.9} />
    </mesh>
    {/* Frame */}
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[1.5, 0.1, 2.1]} />
      <meshStandardMaterial color="#8b5a2b" metalness={0.2} roughness={0.7} />
    </mesh>
    {/* Pillow */}
    <mesh position={[0, 0.4, -0.8]}>
      <boxGeometry args={[1, 0.1, 0.3]} />
      <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} />
    </mesh>
    {/* Blanket */}
    <mesh position={[0, 0.35, 0.3]}>
      <boxGeometry args={[1.38, 0.05, 1.3]} />
      <meshStandardMaterial color="#7986cb" metalness={0.1} roughness={0.8} />
    </mesh>
  </group>
);

// New: Bathroom Sink
export const BathroomSink: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Basin */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.6, 0.1, 0.4]} />
      <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.1, 24]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.1} />
    </mesh>
    {/* Cabinet */}
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[0.58, 0.4, 0.38]} />
      <meshStandardMaterial color="#d0c8c0" metalness={0.1} roughness={0.8} />
    </mesh>
    {/* Faucet */}
    <mesh position={[0, 0.6, -0.15]}>
      <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} rotation={[Math.PI/2, 0, 0]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
    </mesh>
    <mesh position={[0, 0.65, -0.07]}>
      <cylinderGeometry args={[0.02, 0.02, 0.1, 12]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

// New: Shower
export const Shower: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Shower base */}
    <mesh position={[0, 0.05, 0]}>
      <boxGeometry args={[0.9, 0.1, 0.9]} />
      <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.2} />
    </mesh>
    {/* Glass walls */}
    {[
      [0, 0.75, -0.45], // back
      [0.45, 0.75, 0], // right
      [-0.45, 0.75, 0], // left
    ].map(([x, y, z], i) => (
      <mesh key={i} position={[x, y, z]}>
        <boxGeometry args={i === 0 ? [0.9, 1.5, 0.05] : [0.05, 1.5, 0.9]} />
        <meshStandardMaterial color="#c5e8eb" transparent opacity={0.3} metalness={0.2} roughness={0.1} />
      </mesh>
    ))}
    {/* Shower head */}
    <mesh position={[0, 1.8, -0.4]}>
      <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);
