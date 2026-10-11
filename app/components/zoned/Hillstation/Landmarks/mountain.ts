import * as THREE from 'three';

export type MountainOpts = {
  kind: 'peak' | 'dome'; // peak = pointed cone, dome = steep sides with a rounded sugar-loaf top
  radius: number;
  height: number;
  seed: number;
  radialSegments?: number;
  heightSegments?: number;
  colors: { low: string; mid: string; high: string }; // forest, upper slope, bare rock
  highAt?: number; // 0..1: how far up the bare rock starts
  stretch?: [number, number]; // squash/stretch in x and z so the base is not a perfect circle
};

export type Mountain = {
  geometry: THREE.BufferGeometry;
  /** Height of the surface at (x, z) in the mountain's own space, or null if (x, z) is off the mountain. */
  heightAt: (x: number, z: number) => number | null;
};

// Deterministic 0..1 value from a position, so vertices that share a position (the seam) move together.
function hash(x: number, y: number, z: number, s: number) {
  let h = (Math.round(x * 1000) * 73856093) ^ (Math.round(y * 1000) * 19349663) ^ (Math.round(z * 1000) * 83492791) ^ (s * 2654435761);
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  h = Math.imul(h ^ (h >>> 13), 3266489917);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

export function buildMountain(o: MountainOpts): Mountain {
  const { kind, radius, height, seed, colors, highAt = 0.75, stretch = [1, 1] } = o;
  const rs = o.radialSegments ?? 11;
  const hs = o.heightSegments ?? 7;

  let geometry: THREE.BufferGeometry;
  if (kind === 'peak') {
    geometry = new THREE.ConeGeometry(radius, height, rs, hs, true);
    geometry.translate(0, height / 2, 0);
  } else {
    // Bell profile: wide base, steep flanks, rounded top.
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= hs; i++) {
      const t = i / hs;
      pts.push(new THREE.Vector2(radius * Math.pow(1 - Math.pow(t, 2.2), 0.55), height * t));
    }
    geometry = new THREE.LatheGeometry(pts, rs);
  }

  // Roughen it: nudge every vertex a little so the facets are uneven, like real rock.
  const pos = geometry.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const t = y / height;
    const a = hash(x, y, z, seed);
    const b = hash(x, y, z, seed + 11);
    const c = hash(x, y, z, seed + 23);
    if (t < 0.985) {
      const k = 1 - t * 0.55;
      const rad = 1 + (a - 0.5) * 0.26 * k;
      x = x * rad + (b - 0.5) * radius * 0.07 * k;
      z = z * rad + (c - 0.5) * radius * 0.07 * k;
      if (t > 0.02) y += (b - 0.5) * height * 0.06;
    }
    pos.setXYZ(i, x, y, z);
  }
  geometry.scale(stretch[0], 1, stretch[1]);

  // Colour by height: forest at the bottom, lighter slopes, bare rock at the top, with a little variation per vertex.
  const low = new THREE.Color(colors.low);
  const mid = new THREE.Color(colors.mid);
  const high = new THREE.Color(colors.high);
  const col = new THREE.Color();
  const rgb = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = Math.min(1, Math.max(0, pos.getY(i) / height));
    if (t < 0.3) col.copy(low);
    else if (t < highAt) col.lerpColors(low, mid, (t - 0.3) / (highAt - 0.3));
    else col.lerpColors(mid, high, smooth((t - highAt) / 0.1));
    col.multiplyScalar(0.88 + hash(pos.getX(i), pos.getY(i), pos.getZ(i), seed + 5) * 0.24);
    rgb[i * 3] = col.r;
    rgb[i * 3 + 1] = col.g;
    rgb[i * 3 + 2] = col.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
  geometry.computeVertexNormals();

  // Surface lookup by casting a ray straight down: accurate even with the roughened vertices.
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  mesh.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const heightAt = (x: number, z: number) => {
    ray.set(new THREE.Vector3(x, height * 2, z), down);
    const hit = ray.intersectObject(mesh, false)[0];
    return hit ? hit.point.y : null;
  };

  return { geometry, heightAt };
}
