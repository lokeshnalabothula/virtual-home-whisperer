import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DeviceState } from '@/types/types';
import * as THREE from 'three';
import { 
  Plant, RoomRug, TVSet, WallMirrors, Fridge, CoffeeMaker, 
  Microwave, Toaster, KitchenCounter, DiningTable, Chair, 
  Bed, BathroomSink, Shower 
} from "./DecorElements";
import { Sofa, CoffeeTable, Wardrobe, TVWall, PlantBig } from "./HomeAppliances3D";

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
      roughness={0.35}
      metalness={0.1}
    />
  </mesh>
);

const Floor = ({
  size = [5, 5],
  color = '#f3f3f3'
}: {
  size?: [number, number];
  color?: string;
}) => (
  <mesh position={[0, -0.05, 0]} receiveShadow>
    <boxGeometry args={[size[0], 0.13, size[1]]} />
    <meshStandardMaterial
      color={color}
      roughness={0.8}
      metalness={0.09}
      opacity={0.98}
      transparent
    />
  </mesh>
);

const Room = ({
  position = [0, 0, 0],
  size = [5, 3, 5],
  wallColor = "#e6e6ea",
  floorColor = "#f3f3f3",
  decorKey,
  children,
}: any) => {
  const [w, h, d] = size;
  const t = 0.33;
  return (
    <group position={position}>
      <Floor size={[w, d]} color={floorColor} />
      {decorKey === "living" ? (
        <>
          <Wall position={[0, h / 2, d / 2 - t / 2]} size={[w, h, t]} color="#FFDEE2" />
          <Wall position={[0, h / 2, -d / 2 + t / 2]} size={[w, h, t]} color={wallColor} />
          <Wall position={[-w / 2 + t / 2, h / 2, 0]} size={[t, h, d]} color="#C8C8C9" />
          <Wall position={[w / 2 - t / 2, h / 2, 0]} size={[t, h, d]} color="#C8C8C9" />
        </>
      ) : (
        <>
          <Wall position={[0, h / 2, d / 2 - t / 2]} size={[w, h, t]} color={wallColor} />
          <Wall position={[0, h / 2, -d / 2 + t / 2]} size={[w, h, t]} color={wallColor} />
          <Wall position={[-w / 2 + t / 2, h / 2, 0]} size={[t, h, d]} color="#C8C8C9" />
          <Wall position={[w / 2 - t / 2, h / 2, 0]} size={[t, h, d]} color="#C8C8C9" />
        </>
      )}
      {children}
      {decorKey === "living" && (
        <>
          <RoomRug position={[0.5, 0.01, 0.5]} />
          <Sofa position={[-0.7, 0.01, 0.68]} />
          <CoffeeTable position={[0.35, 0.01, 1.2]} />
          <TVWall position={[-1.5, 0.9, -1.98]} />
          <PlantBig position={[2.1, 0.01, 1.9]} />
          <WallMirrors position={[-2.2, 1.25, 2.45]} />
          <DiningTable position={[1.75, 0.03, -1.1]} />
          <Chair position={[2.15, 0.03, -0.85]} />
          <Chair position={[1.37, 0.03, -1.3]} />
        </>
      )}
      {decorKey === "kitchen" && (
        <>
          <Fridge position={[-1.5, 0.5, -2]} />
          <KitchenCounter position={[0.2, 0.03, -1.8]} />
          <CoffeeMaker position={[-0.6, 0.5, -1.8]} />
          <Microwave position={[0.2, 0.92, -1.8]} />
          <Toaster position={[0.8, 0.5, -1.8]} />
        </>
      )}
      {decorKey === "bedroom" && (
        <>
          <RoomRug position={[-0.65, 0.01, 0.75]} />
          <Bed position={[0.1, 0.03, -0.2]} />
          <Wardrobe position={[2.01, 0.01, 1.6]} />
          <Plant position={[1.2, 0.14, -1.2]} />
        </>
      )}
      {decorKey === "bathroom" && (
        <>
          <RoomRug position={[0.2, 0.01, 1.38]} />
          <BathroomSink position={[-0.7, 0.03, -1.16]} />
          <Shower position={[1, 0.03, -1.1]} />
        </>
      )}
    </group>
  );
};

const Light = ({
  position,
  isOn,
  color = '#ffe178'
}: { position: any; isOn: boolean; color?: string }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
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

const Fan = ({
  position, isOn, speed = 1
}: { position: any; isOn: boolean; speed?: number }) => {
  const fanGroup = React.useRef<THREE.Group>(null);
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
      wallColor: "#F1F0FB",
      floorColor: "#f3f3f3"
    },
    {
      key: "kitchen",
      pos: [4.95, 0, 0] as [number, number, number],
      wallColor: "#d3e4fd",
      floorColor: "#f6f7ff"
    },
    {
      key: "bedroom",
      pos: [0, 0, 4.6] as [number, number, number],
      wallColor: "#fffdee",
      floorColor: "#f8f3e6"
    },
    {
      key: "bathroom",
      pos: [4.95, 0, 4.6] as [number, number, number],
      wallColor: "#e0ffff",
      floorColor: "#e8f8fa"
    }
  ];

  const deviceOffsets: Record<string, [number, number, number]> = {
    light: [0, 2.48, -1.1],
    fan: [1, 2.45, 1],
    switch: [1.8, 1.2, 1.8],
  };

  return (
    <>
      <ambientLight intensity={0.41} color="#eae9ff" />
      <directionalLight
        position={[9, 10.2, 9.2]}
        intensity={0.67}
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
          size={[4.6, 2.8, 4.6]}
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
      <mesh position={[2.5, -0.72, 2.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#e3f7ea" roughness={0.91} metalness={0.019} />
      </mesh>
      <OrbitControls
        enableDamping
        dampingFactor={0.15}
        maxDistance={20}
        minDistance={4}
        maxPolarAngle={Math.PI / 2.14}
        target={[2.5, 1.1, 2.5]}
      />
    </>
  );
};

export const ThreeScene: React.FC<{ devices: Record<string, DeviceState> }> = ({ devices }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows="soft"
        camera={{ position: [9, 9, 16], fov: 38 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <HouseScene devices={devices} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
