
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shows a curved wire from the wall to a device, optionally with a moving blue "electricity" effect.
const curveByType = (type: string) => {
  // Appliance type => end height for realism
  switch (type) {
    case "light": return 2.6;
    case "fan": return 2.45;
    case "switch": return 1.25;
    default: return 1.2;
  }
};

export const Wire: React.FC<{
  deviceType: string;
  roomWallOrigin: [number, number, number];
  devicePos: [number, number, number];
  isOn: boolean;
}> = ({ deviceType, roomWallOrigin, devicePos, isOn }) => {
  // Curve from wall socket to device, arching up and then down for realism
  // We'll use a quadratic Bézier
  const points = [
    new THREE.Vector3(...roomWallOrigin),
    new THREE.Vector3(
      (roomWallOrigin[0] + devicePos[0])/2 + 0.11,
      curveByType(deviceType) + 0.22,
      (roomWallOrigin[2] + devicePos[2])/2 + 0.13
    ),
    new THREE.Vector3(...devicePos)
  ];
  const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
  const sample = curve.getPoints(32);

  // Animate electricity: glowing blue orb pulses along the wire when on
  const orbRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (orbRef.current && isOn) {
      // Animate along curve
      const t = (Math.sin(clock.getElapsedTime()*2)+1)/2; // 0 to 1
      const pos = curve.getPoint(t);
      orbRef.current.position.set(pos.x, pos.y, pos.z);
      (orbRef.current.material as any).opacity = 0.48 + 0.38 * Math.abs(Math.cos(clock.getElapsedTime()*4));
    }
  });

  return (
    <group>
      {/* The wire */}
      <mesh>
        <tubeGeometry args={[curve, 32, 0.025, 6, false]} />
        <meshStandardMaterial
          color={isOn ? "#0FA0CE" : "#585b62"}
          metalness={0.72}
          roughness={0.23}
          emissive={isOn ? "#8edbff" : "#000"}
          emissiveIntensity={isOn ? 0.22 : 0}
        />
      </mesh>
      {/* Electricity orb */}
      {isOn && (
        <mesh ref={orbRef}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshBasicMaterial color="#33e1ff" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};
