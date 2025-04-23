
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { DeviceState } from '@/types/types';
import * as THREE from 'three';

// Simple room component
const Room = ({ position = [0, 0, 0], size = [5, 3, 5], color = 'white', children }: any) => {
  return (
    <group position={position as any}>
      <mesh position={[0, size[1]/2, 0]} receiveShadow>
        <boxGeometry args={size as any} />
        <meshStandardMaterial color={color} side={THREE.BackSide} />
      </mesh>
      {children}
    </group>
  );
};

// Light device component
const Light = ({ position, isOn, color = '#ffcc77' }: { position: any, isOn: boolean, color?: string }) => {
  return (
    <group position={position}>
      <pointLight intensity={isOn ? 1 : 0} color={color} distance={5} castShadow />
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={isOn ? color : 'black'} 
          emissiveIntensity={isOn ? 0.5 : 0} 
        />
      </mesh>
    </group>
  );
};

// Fan device component
const Fan = ({ position, isOn, speed = 1 }: { position: any, isOn: boolean, speed?: number }) => {
  const fanGroup = useRef<THREE.Group>(null);
  
  // Rotate fan blades
  useFrame(() => {
    if (fanGroup.current && isOn) {
      fanGroup.current.rotation.y += 0.02 * speed;
    }
  });
  
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      <group ref={fanGroup} position={[0, -0.1, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[0, i * Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[0.1, 0.02, 1]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Switch device component
const Switch = ({ position, isOn }: { position: any, isOn: boolean }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh position={[0, isOn ? 0.1 : -0.1, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color={isOn ? "#88ff88" : "#ff8888"} />
      </mesh>
    </group>
  );
};

// Main house scene
const HouseScene = ({ devices }: { devices: Record<string, DeviceState> }) => {
  const devicesByRoom: Record<string, DeviceState[]> = {};
  
  Object.values(devices).forEach(device => {
    if (!devicesByRoom[device.room]) {
      devicesByRoom[device.room] = [];
    }
    devicesByRoom[device.room].push(device);
  });

  // Set up room positions
  const roomPositions: Record<string, [number, number, number]> = {
    'living': [0, 0, 0],
    'kitchen': [7, 0, 0],
    'bedroom': [0, 0, 7],
    'bathroom': [7, 0, 7]
  };

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
      
      {/* Rooms */}
      {Object.keys(roomPositions).map(room => (
        <Room 
          key={room} 
          position={roomPositions[room]} 
          color={room === 'living' ? "#f0f8ff" : 
                room === 'kitchen' ? "#f5f5dc" : 
                room === 'bedroom' ? "#e6e6fa" : "#e0ffff"}
        >
          {/* Devices */}
          {devicesByRoom[room]?.filter(d => d.type === 'light').map(device => (
            <Light 
              key={device.id} 
              position={[0, 2.8, 0]} 
              isOn={device.isOn} 
            />
          ))}
          
          {devicesByRoom[room]?.filter(d => d.type === 'fan').map(device => (
            <Fan 
              key={device.id} 
              position={[0, 2.5, 0]} 
              isOn={device.isOn} 
              speed={device.speed || 1}
            />
          ))}
          
          {devicesByRoom[room]?.filter(d => d.type === 'switch').map(device => (
            <Switch 
              key={device.id} 
              position={[2, 1.5, 2.4]} 
              isOn={device.isOn} 
            />
          ))}
        </Room>
      ))}
      
      {/* Ground plane */}
      <mesh position={[3.5, -0.5, 3.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.1} 
        maxDistance={20} 
        minDistance={3}
        maxPolarAngle={Math.PI / 2 - 0.1} 
      />
    </>
  );
};

// Main component wrapper
export const ThreeScene: React.FC<{ devices: Record<string, DeviceState> }> = ({ devices }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [15, 15, 15], fov: 45 }}>
        <HouseScene devices={devices} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
