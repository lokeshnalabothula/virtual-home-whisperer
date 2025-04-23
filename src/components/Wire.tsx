
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Wire: React.FC<{
  deviceType: string;
  roomWallOrigin: [number, number, number];
  devicePos: [number, number, number];
  isOn: boolean;
}> = ({ deviceType, roomWallOrigin, devicePos, isOn }) => {
  // Adjust roomWallOrigin to start from top of the wall
  const wallTopOrigin: [number, number, number] = [
    roomWallOrigin[0],
    2.4, // Position at the top of the wall
    roomWallOrigin[2]
  ];

  // STRAIGHT wire, not arched
  const points = [
    new THREE.Vector3(...wallTopOrigin),
    new THREE.Vector3(...devicePos),
  ];
  const curve = new THREE.LineCurve3(points[0], points[1]);
  const sample = curve.getPoints(32);

  // Animate electricity: electricity orb travels FORWARD ONLY (0 -> 1), then restarts
  const orbRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (orbRef.current && isOn) {
      // Animate forward only with faster speed (1.5x); resets smoothly to 0 after reaching 1
      const t = (clock.getElapsedTime() * 1.5) % 1;
      const pos = curve.getPoint(t);
      orbRef.current.position.set(pos.x, pos.y, pos.z);
      const mat = orbRef.current.material as any;
      if (mat) {
        mat.opacity = 0.56 + 0.21 * Math.abs(Math.cos(clock.getElapsedTime() * 6));
      }
    }
  });

  return (
    <group>
      {/* The wire: always straight */}
      <mesh>
        <tubeGeometry args={[curve, 2, 0.028, 9, false]} />
        <meshStandardMaterial
          color={isOn ? "#0FA0CE" : "#585b62"}
          metalness={0.74}
          roughness={0.13}
          emissive={isOn ? "#76beff" : "#000"}
          emissiveIntensity={isOn ? 0.19 : 0}
        />
      </mesh>
      {/* Electricity orb: travels only forward with faster speed */}
      {isOn && (
        <mesh ref={orbRef}>
          <sphereGeometry args={[0.056, 14, 14]} />
          <meshBasicMaterial color="#33e1ff" transparent opacity={0.69} />
        </mesh>
      )}
    </group>
  );
};
