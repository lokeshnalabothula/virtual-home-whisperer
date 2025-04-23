
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DeviceState } from '@/types/types';
import * as THREE from 'three';
import { 
  Plant, RoomRug, TVSet, WallMirrors, Fridge, CoffeeMaker, 
  Microwave, Toaster, KitchenCounter, DiningTable, Chair, 
  Bed, BathroomSink, Shower 
} from "./DecorElements";

const Wall = ({
  position = [0, 0, 0],
  size = [1, 1, 0.1],
  color = '#e6e6ea'
}: {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
}) => (
  <mesh position={position} receiveShadow castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      roughness={0.45}
      metalness={0.19}
    />
    <mesh position={[0, -size[1] / 2 + 0.07, 0]}>
      <boxGeometry args={[size[0], 0.12, size[2] * 1.06]} />
      <meshStandardMaterial color="#ded4be" roughness={0.31} metalness={0.12} />
    </mesh>
  </mesh>
);

const Floor = ({
  size = [5, 5],
  color = '#f3f3f3'
}: {
  size?: [number, number];
  color?: string;
}) => (
  <mesh position={[0, -0.06, 0]} receiveShadow>
    <boxGeometry args={[size[0], 0.12, size[1]]} />
    <meshStandardMaterial
      color={color}
      roughness={0.82}
      metalness={0.07}
      opacity={0.97}
      transparent
    />
  </mesh>
);

const Room = ({
  position = [0, 0, 0],
  size = [5, 3, 5],
  wallColor = "#e6e6ea",
  floorColor = "#f3f3f3",
  children,
  decorKey
}: any) => {
  const [w, h, d] = size;
  const t = 0.14; // wall thickness
  return (
    <group position={position}>
      <Floor size={[w, d]} color={floorColor} />
      <Wall position={[0, h / 2, d / 2 - t / 2]} size={[w, h, t]} color={wallColor} />
      <Wall position={[0, h / 2, -d / 2 + t / 2]} size={[w, h, t]} color={wallColor} />
      <Wall position={[-w / 2 + t / 2, h / 2, 0]} size={[t, h, d]} color={wallColor} />
      <Wall position={[w / 2 - t / 2, h / 2, 0]} size={[t, h, d]} color={wallColor} />
      {decorKey === "living" && (
        <>
          <RoomRug position={[0.4, 0.01, 0.6]} />
          <Plant position={[2.18, 0.14, 2.07]} />
          <TVSet position={[-1.62, 0.03, -2.05]} />
          <WallMirrors position={[-2, 1.26, 2.48]} />
          <DiningTable position={[-1.2, 0.03, 1]} />
          <Chair position={[-1.2, 0.03, 1.4]} />
          <Chair position={[-1.6, 0.03, 1]} />
          <Chair position={[-0.8, 0.03, 1]} />
        </>
      )}
      {decorKey === "kitchen" && (
        <>
          <Fridge position={[-1.8, 0.5, -2]} />
          <KitchenCounter position={[0.2, 0.03, -1.8]} />
          <CoffeeMaker position={[-0.6, 0.5, -1.8]} />
          <Microwave position={[0.2, 0.92, -1.8]} />
          <Toaster position={[0.8, 0.5, -1.8]} />
        </>
      )}
      {decorKey === "bedroom" && (
        <>
          <RoomRug position={[0, 0.01, 0]} />
          <Bed position={[0, 0.03, 0]} />
          <Plant position={[1.8, 0.14, -1.8]} />
        </>
      )}
      {decorKey === "bathroom" && (
        <>
          <RoomRug position={[0, 0.01, 1.8]} />
          <BathroomSink position={[-1.8, 0.03, -1.8]} />
          <Shower position={[1.8, 0.03, -1.8]} />
        </>
      )}
      {children}
    </group>
  );
};

const Light = ({
  position,
  isOn,
  color = '#ffe178'
}: { position: any; isOn: boolean; color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current && isOn) {
      const k = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 0.7;
      (meshRef.current.material as any).emissiveIntensity = k;
    }
  });
  return (
    <group position={position}>
      {isOn && (
        <pointLight
          intensity={0.7}
          color={color}
          distance={4.5}
          decay={2}
          castShadow
          position={[0, -0.2, 0]}
          shadow-bias={-0.002}
        />
      )}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.23, 24, 24]} />
        <meshStandardMaterial
          color={isOn ? color : '#ccc'}
          emissive={isOn ? color : '#333'}
          emissiveIntensity={isOn ? 0.8 : 0.1}
          roughness={.36}
          metalness={.13}
        />
      </mesh>
    </group>
  );
};

const Fan = ({ position, isOn, speed = 1 }: { position: any; isOn: boolean; speed?: number }) => {
  const fanGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (fanGroup.current && isOn) {
      fanGroup.current.rotation.y += 0.12 * speed;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.10, 0.10, 0.09, 18]} />
        <meshStandardMaterial color="#888" metalness={0.35} roughness={0.26} />
      </mesh>
      <group ref={fanGroup} position={[0, -0.12, 0]}>
        {[0, 1, 2, 3].map(i => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, i * (Math.PI / 2), 0]}
            castShadow
          >
            <boxGeometry args={[0.13, 0.024, 1.05]} />
            <meshStandardMaterial
              color="#bcbcc2"
              metalness={0.28}
              roughness={0.15}
              opacity={isOn ? 0.34 : 1}
              transparent={isOn}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Switch = ({ position, isOn }: { position: any; isOn: boolean }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[0.22, 0.36, 0.06]} />
      <meshStandardMaterial color="#fff" roughness={0.66} metalness={0.05} />
    </mesh>
    <mesh position={[0, isOn ? 0.08 : -0.08, 0.05]} castShadow>
      <boxGeometry args={[0.09, 0.10, 0.04]} />
      <meshStandardMaterial
        color={isOn ? "#89f593" : "#f59595"}
        roughness={0.31}
        metalness={0.09}
      />
    </mesh>
  </group>
);

const HouseScene = ({ devices }: { devices: Record<string, DeviceState> }) => {
  const devicesByRoom: Record<string, DeviceState[]> = {};
  Object.values(devices).forEach(device => {
    if (!devicesByRoom[device.room]) devicesByRoom[device.room] = [];
    devicesByRoom[device.room].push(device);
  });

  const roomCfgs = [
    {
      key: "living",
      pos: [0, 0, 0] as [number, number, number],
      wallColor: "#e5deff",
      floorColor: "#f3f3f3"
    },
    {
      key: "kitchen",
      pos: [7, 0, 0] as [number, number, number],
      wallColor: "#d3e4fd",
      floorColor: "#f6f7ff"
    },
    {
      key: "bedroom",
      pos: [0, 0, 7] as [number, number, number],
      wallColor: "#fffdee",
      floorColor: "#f8f3e6"
    },
    {
      key: "bathroom",
      pos: [7, 0, 7] as [number, number, number],
      wallColor: "#e0ffff",
      floorColor: "#e8f8fa"
    }
  ];

  const deviceOffsets: Record<string, [number, number, number]> = {
    light: [0, 2.65, -1.1],
    fan: [1, 2.5, 1],
    switch: [1.8, 1.3, 1.8],
  };

  return (
    <>
      <ambientLight intensity={0.43} color="#eae9ff" />
      <directionalLight
        position={[10, 11.2, 8.8]}
        intensity={0.7}
        color="#fffcf7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {roomCfgs.map(({ key, pos, wallColor, floorColor }) => (
        <Room
          key={key}
          position={pos}
          wallColor={wallColor}
          floorColor={floorColor}
          size={[5, 3, 5]}
          decorKey={key}
        >
          {devicesByRoom[key]?.filter(d => d.type === 'light').map(device => (
            <Light 
              key={device.id} 
              position={deviceOffsets.light} 
              isOn={device.isOn} 
              color="#ffe178" 
            />
          ))}
          {devicesByRoom[key]?.filter(d => d.type === 'fan').map(device => (
            <Fan 
              key={device.id}
              position={deviceOffsets.fan} 
              isOn={device.isOn} 
              speed={device.speed || 1} 
            />
          ))}
          {devicesByRoom[key]?.filter(d => d.type === 'switch').map(device => (
            <Switch 
              key={device.id}
              position={deviceOffsets.switch} 
              isOn={device.isOn} 
            />
          ))}
        </Room>
      ))}
      <mesh position={[3.5, -0.68, 3.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#e3f7ea" roughness={0.91} metalness={0.019} />
      </mesh>
      <OrbitControls
        enableDamping
        dampingFactor={0.15}
        maxDistance={23}
        minDistance={4}
        maxPolarAngle={Math.PI / 2.18}
        target={[3.5, 1.1, 3.5]}
      />
    </>
  );
};

export const ThreeScene: React.FC<{ devices: Record<string, DeviceState> }> = ({ devices }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows="soft"
        camera={{ position: [11, 12, 18], fov: 38 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <HouseScene devices={devices} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
