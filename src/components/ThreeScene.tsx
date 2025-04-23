import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DeviceState } from '@/types/types';
import * as THREE from 'three';
import { Plant, RoomRug, TVSet, WallMirrors } from "./DecorElements";
import { Wire } from "./Wire";

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
    <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
  </mesh>
);

const Floor = ({
  size = [5, 5],
  color = '#f3f3f3'
}: {
  size?: [number, number];
  color?: string;
}) => (
  <mesh position={[0, 0, 0]} receiveShadow>
    <boxGeometry args={[size[0], 0.12, size[1]]} />
    <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
  </mesh>
);

const Room = ({
  position = [0, 0, 0],
  size = [5, 3, 5],
  color = "#e6e6ea",
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
      <Wall position={[0, h/2, d/2 - t/2]} size={[w, h, t]} color={wallColor} />
      <Wall position={[0, h/2, -d/2 + t/2]} size={[w, h, t]} color={wallColor} />
      <Wall position={[-w/2 + t/2, h/2, 0]} size={[t, h, d]} color={wallColor} />
      <Wall position={[w/2 - t/2, h/2, 0]} size={[t, h, d]} color={wallColor} />
      {decorKey === "living" && (
        <>
          <RoomRug position={[0.8, 0.02, 1]} />
          <Plant position={[2.2, 0.14, 2.05]} />
          <TVSet position={[-1.6, 0.03, -2.1]} />
          <WallMirrors position={[-2, 1.2, 2.5]} />
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
      pos: [0, 0, 0],
      wallColor: "#e5deff",
      floorColor: "#f3f3f3"
    },
    {
      key: "kitchen",
      pos: [7, 0, 0],
      wallColor: "#d3e4fd",
      floorColor: "#f6f7ff"
    },
    {
      key: "bedroom",
      pos: [0, 0, 7],
      wallColor: "#fffdee",
      floorColor: "#f8f3e6"
    },
    {
      key: "bathroom",
      pos: [7, 0, 7],
      wallColor: "#e0ffff",
      floorColor: "#e8f8fa"
    }
  ];

  const outWallOrigin = {
    living: [-2.37, 0.32, 2.37],
    kitchen: [4.68, 0.35, 2.38],
    bedroom: [-2.37, 0.36, 6.98],
    bathroom: [4.68, 0.36, 6.98],
  };

  const deviceOffsets = {
    light: [0, 2.65, -1.1],
    fan: [1, 2.5, 1],
    switch: [2, 1.3, 1.8],
  };

  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[11, 12, 8]}
        intensity={0.54}
        color="#fff7ec"
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
            <React.Fragment key={device.id}>
              <Wire deviceType="light" roomWallOrigin={outWallOrigin[key]} devicePos={deviceOffsets.light} isOn={device.isOn} />
              <Light position={deviceOffsets.light} isOn={device.isOn} color="#ffe178" />
            </React.Fragment>
          ))}
          {devicesByRoom[key]?.filter(d => d.type === 'fan').map(device => (
            <React.Fragment key={device.id}>
              <Wire deviceType="fan" roomWallOrigin={outWallOrigin[key]} devicePos={deviceOffsets.fan} isOn={device.isOn} />
              <Fan position={deviceOffsets.fan} isOn={device.isOn} speed={device.speed || 1} />
            </React.Fragment>
          ))}
          {devicesByRoom[key]?.filter(d => d.type === 'switch').map(device => (
            <React.Fragment key={device.id}>
              <Wire deviceType="switch" roomWallOrigin={outWallOrigin[key]} devicePos={deviceOffsets.switch} isOn={device.isOn} />
              <Switch position={deviceOffsets.switch} isOn={device.isOn} />
            </React.Fragment>
          ))}
        </Room>
      ))}
      <mesh position={[3.5, -0.61, 3.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e4f8e3" roughness={0.92} metalness={0.01} />
      </mesh>
      <OrbitControls
        enableDamping
        dampingFactor={0.14}
        maxDistance={22}
        minDistance={5}
        maxPolarAngle={Math.PI / 2.17}
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
