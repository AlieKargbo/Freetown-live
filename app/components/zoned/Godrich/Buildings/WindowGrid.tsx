'use client';

import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  position: [number, number, number]; // centre of the facade rectangle
  width: number;
  height: number;
  cols: number;
  rows: number;
  rotationY?: number; // 0 = faces +z (front), Math.PI / 2 = faces +x, -Math.PI / 2 = faces -x
  fill?: number; // 0..1, share of each grid cell the pane covers
  color?: string;
  emissive?: string;
};

// A whole facade of windows as ONE instanced mesh (one draw call, however many panes).
export default function WindowGrid({
  position,
  width,
  height,
  cols,
  rows,
  rotationY = 0,
  fill = 0.55,
  color = '#bae6fd',
  emissive = '#38bdf8',
}: Props) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const cw = width / cols;
    const ch = height / rows;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        o.position.set(-width / 2 + (c + 0.5) * cw, -height / 2 + (r + 0.5) * ch, 0);
        o.scale.set(cw * fill, ch * fill, 0.03);
        o.updateMatrix();
        mesh.setMatrixAt(i++, o.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [width, height, cols, rows, fill]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <instancedMesh key={`${cols}x${rows}`} ref={ref} args={[undefined, undefined, cols * rows]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.25} />
      </instancedMesh>
    </group>
  );
}
