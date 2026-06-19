import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const NORMAL_COLORS = {
  white: "#FFFFFF",
  yellow: "#FFD500",
  red: "#FF0000",
  orange: "#ff6a00",
  blue: "#0066FF",
  green: "#18930d",
  black: "#050505",
};

const NEON_COLORS = {
  white: "#FFFFFF",
  yellow: "#FFF200",
  red: "#FF1744",
  orange: "#FF9100",
  blue: "#00B0FF",
  green: "#00FF66",
  black: "#050505",
};

function Cubie({ position, neonMode }) {
  const [x, y, z] = position;

  const COLORS = neonMode ? NEON_COLORS : NORMAL_COLORS;

  const materials = [
    { color: x === 1 ? COLORS.red : COLORS.black },
    { color: x === -1 ? COLORS.orange : COLORS.black },
    { color: y === 1 ? COLORS.white : COLORS.black },
    { color: y === -1 ? COLORS.yellow : COLORS.black },
    { color: z === 1 ? COLORS.green : COLORS.black },
    { color: z === -1 ? COLORS.blue : COLORS.black },
  ];

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />

        {materials.map((mat, index) => {
          const isOuterFace = mat.color !== COLORS.black;

          return (
            <meshBasicMaterial
              key={index}
              attach={`material-${index}`}
              color={mat.color}
            />
          );
        })}
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.98, 0.98, 0.98)]} />
        <lineBasicMaterial color={neonMode ? "#7DF9FF" : "#111111"} />
      </lineSegments>
    </group>
  );
}

function RubiksCube({ neonMode }) {
  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push([x, y, z]);
      }
    }
  }

  return (
    <group rotation={[0.5, 0.7, 0]}>
      {cubies.map((pos, index) => (
        <Cubie key={index} position={pos} neonMode={neonMode} />
      ))}
    </group>
  );
}

export default function Cube3D({ neonMode }) {
  return (
    <Canvas camera={{ position: [6, 5, 7], fov: 45 }}>
      <ambientLight intensity={neonMode ? 0.22 : 0.45} />

      <directionalLight position={[5, 6, 5]} intensity={neonMode ? 0.9 : 1.2} />

      <pointLight
        position={[0, 3, 5]}
        intensity={neonMode ? 1.4 : 0.4}
        color={neonMode ? "#7DF9FF" : "#00eaff"}
      />

      <RubiksCube neonMode={neonMode} />

      {neonMode && (
        <EffectComposer>
          <Bloom
            intensity={0.18}
            luminanceThreshold={0.88}
            luminanceSmoothing={0.75}
          />
        </EffectComposer>
      )}

      <OrbitControls
        enableDamping
        autoRotate
        autoRotateSpeed={1}
        minDistance={6}
        maxDistance={10}
      />
    </Canvas>
  );
}
