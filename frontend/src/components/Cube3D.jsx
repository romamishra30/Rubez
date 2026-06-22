import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
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

const FACE_KEYS = ["xp", "xn", "yp", "yn", "zp", "zn"];

const MOVE_MAP = {
  R: { axis: "x", layer: 1, dir: -1 },
  L: { axis: "x", layer: -1, dir: 1 },
  U: { axis: "y", layer: 1, dir: -1 },
  D: { axis: "y", layer: -1, dir: 1 },
  F: { axis: "z", layer: 1, dir: -1 },
  B: { axis: "z", layer: -1, dir: 1 },
};

function parseMoves(text = "") {
  return text.trim().split(/\s+/).filter(Boolean);
}

function createSolvedCube() {
  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const stickers = {};

        if (y === 1) stickers.yp = "yellow";
        if (y === -1) stickers.yn = "white";

        if (x === 1) stickers.xp = "green";
        if (x === -1) stickers.xn = "blue";

        if (z === 1) stickers.zp = "red";
        if (z === -1) stickers.zn = "orange";

        cubies.push({
          id: `${x}-${y}-${z}`,
          pos: [x, y, z],
          stickers,
        });
      }
    }
  }

  return cubies;
}

function keyToVec(key) {
  const map = {
    xp: [1, 0, 0],
    xn: [-1, 0, 0],
    yp: [0, 1, 0],
    yn: [0, -1, 0],
    zp: [0, 0, 1],
    zn: [0, 0, -1],
  };

  return map[key];
}

function vecToKey([x, y, z]) {
  if (x === 1) return "xp";
  if (x === -1) return "xn";
  if (y === 1) return "yp";
  if (y === -1) return "yn";
  if (z === 1) return "zp";
  return "zn";
}

function rotateVec([x, y, z], axis, dir) {
  if (axis === "x") {
    return dir === 1 ? [x, -z, y] : [x, z, -y];
  }

  if (axis === "y") {
    return dir === 1 ? [z, y, -x] : [-z, y, x];
  }

  return dir === 1 ? [-y, x, z] : [y, -x, z];
}

function rotateOneTurn(cube, move) {
  const config = MOVE_MAP[move];

  if (!config) return cube;

  const { axis, layer, dir } = config;
  const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;

  return cube.map((cubie) => {
    if (cubie.pos[axisIndex] !== layer) {
      return cubie;
    }

    const newPos = rotateVec(cubie.pos, axis, dir);

    const newStickers = {};

    Object.entries(cubie.stickers).forEach(([faceKey, color]) => {
      const newFaceKey = vecToKey(rotateVec(keyToVec(faceKey), axis, dir));
      newStickers[newFaceKey] = color;
    });

    return {
      ...cubie,
      pos: newPos,
      stickers: newStickers,
    };
  });
}

function applyMove(cube, moveText) {
  const face = moveText[0];
  const suffix = moveText.slice(1);

  let turns = 1;

  if (suffix === "2") turns = 2;
  if (suffix === "'") turns = 3;

  let nextCube = cube;

  for (let i = 0; i < turns; i++) {
    nextCube = rotateOneTurn(nextCube, face);
  }

  return nextCube;
}

function getMoveConfig(moveText) {
  if (!moveText) return null;

  const face = moveText[0];
  const suffix = moveText.slice(1);
  const base = MOVE_MAP[face];

  if (!base) return null;

  let turns = 1;
  if (suffix === "2") turns = 2;
  if (suffix === "'") turns = -1;

  return {
    ...base,
    turns,
  };
}

function getRotationValue(axis, angle) {
  if (axis === "x") return [angle, 0, 0];
  if (axis === "y") return [0, angle, 0];
  return [0, 0, angle];
}

function applyMoves(cube, moves) {
  return moves.reduce((state, move) => applyMove(state, move), cube);
}

function Cubie({ cubie, neonMode }) {
  const COLORS = neonMode ? NEON_COLORS : NORMAL_COLORS;

  const materials = FACE_KEYS.map((faceKey) => {
    const colorName = cubie.stickers[faceKey];
    return colorName ? COLORS[colorName] : COLORS.black;
  });

  return (
    <group position={cubie.pos}>
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />

        {materials.map((color, index) => (
          <meshBasicMaterial
            key={index}
            attach={`material-${index}`}
            color={color}
          />
        ))}
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.98, 0.98, 0.98)]} />
        <lineBasicMaterial color={neonMode ? "#7DF9FF" : "#111111"} />
      </lineSegments>
    </group>
  );
}

function RubiksCube({
  neonMode,
  scramble,
  solution,
  currentMoveIndex,
  currentMove,
}) {
  const [turnProgress, setTurnProgress] = useState(1);

  const moveConfig = getMoveConfig(currentMove);

  useEffect(() => {
    setTurnProgress(0);

    let frame;
    let start = null;
    const duration = 450;

    const animate = (time) => {
      if (!start) start = time;

      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      setTurnProgress(progress);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [currentMoveIndex, currentMove]);

  const baseCube = useMemo(() => {
    const solved = createSolvedCube();
    const scrambleMoves = parseMoves(scramble);

    const previousSolutionMoves =
      solution.length > 0 && currentMoveIndex > 0
        ? solution.slice(0, currentMoveIndex)
        : [];

    return applyMoves(solved, [...scrambleMoves, ...previousSolutionMoves]);
  }, [scramble, solution, currentMoveIndex]);

  const finalCube = useMemo(() => {
    if (!currentMove) return baseCube;
    return applyMove(baseCube, currentMove);
  }, [baseCube, currentMove]);

  if (!moveConfig || turnProgress >= 1) {
    return (
      <group rotation={[0.5, 0.7, 0]}>
        {finalCube.map((cubie) => (
          <Cubie key={cubie.id} cubie={cubie} neonMode={neonMode} />
        ))}
      </group>
    );
  }

  const axisIndex =
    moveConfig.axis === "x" ? 0 : moveConfig.axis === "y" ? 1 : 2;

  const activeCubies = baseCube.filter(
    (cubie) => cubie.pos[axisIndex] === moveConfig.layer,
  );

  const staticCubies = baseCube.filter(
    (cubie) => cubie.pos[axisIndex] !== moveConfig.layer,
  );

  const angle =
    moveConfig.dir * moveConfig.turns * (Math.PI / 2) * turnProgress;

  return (
    <group rotation={[0.5, 0.7, 0]}>
      {staticCubies.map((cubie) => (
        <Cubie key={cubie.id} cubie={cubie} neonMode={neonMode} />
      ))}

      <group rotation={getRotationValue(moveConfig.axis, angle)}>
        {activeCubies.map((cubie) => (
          <Cubie key={cubie.id} cubie={cubie} neonMode={neonMode} />
        ))}
      </group>
    </group>
  );
}

export default function Cube3D({
  neonMode,
  scramble,
  solution,
  currentMoveIndex,
  currentMove,
  mode,
}) {
  return (
    <Canvas camera={{ position: [8, 7, 9], fov: 40 }}>
      {" "}
      <ambientLight intensity={neonMode ? 0.22 : 0.45} />
      <directionalLight position={[5, 6, 5]} intensity={neonMode ? 0.9 : 1.2} />
      <pointLight
        position={[0, 3, 5]}
        intensity={neonMode ? 1.4 : 0.4}
        color={neonMode ? "#7DF9FF" : "#00eaff"}
      />
      <RubiksCube
        neonMode={neonMode}
        scramble={scramble}
        solution={solution}
        currentMoveIndex={currentMoveIndex}
        currentMove={currentMove}
        mode={mode}
      />
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
        autoRotate={mode == "idle"}
        enablePan={false}
        target={[0, 0, 0]}
        minDistance={7}
        maxDistance={10.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
