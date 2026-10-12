'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type Body = 'Woman' | 'Man';
type Hair = 'Braids' | 'Afro' | 'Bun' | 'Ponytail' | 'Long' | 'Locs' | 'Low cut' | 'Gele' | 'Classic';
type Outfit = 'Casual' | 'Office' | 'Owambe' | 'Site work' | 'School' | 'Traditional';
type Fabric = 'Plain' | 'Ankara' | 'Adire' | 'Aso-oke' | 'Kente' | 'Lace';

export type SimAppearance = {
  name: string; body: Body; hairstyle: Hair; outfit: Outfit; fabric: Fabric;
  skin: string; hairColor: string; accent: string;
};

const HAIR: Hair[] = ['Braids', 'Afro', 'Bun', 'Ponytail', 'Long', 'Locs', 'Low cut', 'Gele', 'Classic'];
const OUTFITS: Outfit[] = ['Casual', 'Office', 'Owambe', 'Site work', 'School', 'Traditional'];
const FABRICS: Fabric[] = ['Plain', 'Ankara', 'Adire', 'Aso-oke', 'Kente', 'Lace'];
const SKINS = ['#6f3b24', '#8d5524', '#a9683e', '#c68642', '#4b291b', '#d49a70'];
const HAIR_COLORS = ['#171311', '#3b241b', '#6b4226', '#b45309', '#d6b37b'];
const INITIAL: SimAppearance = {
  name: '@paaka', body: 'Woman', hairstyle: 'Braids', outfit: 'Owambe',
  fabric: 'Ankara', skin: '#8d5524', hairColor: '#171311', accent: '#f59e0b',
};

const FABRIC_COLORS: Record<Fabric, [string, string, string]> = {
  Plain: ['#202938', '#202938', '#202938'],
  Ankara: ['#f4a62a', '#087f8c', '#f8df8b'],
  Adire: ['#123a70', '#eaf3f8', '#2c5a9a'],
  'Aso-oke': ['#c32d75', '#f4a4cb', '#79234d'],
  Kente: ['#eab308', '#dc2626', '#166534'],
  Lace: ['#e7e5e4', '#b8b8c0', '#f8fafc'],
};

function PatternMaterial({ fabric, base }: { fabric: Fabric; base: string }) {
  const material = useMemo(() => {
    if (fabric === 'Plain' || typeof document === 'undefined') return new THREE.MeshStandardMaterial({ color: base, roughness: 0.9 });
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const [a, b, c] = FABRIC_COLORS[fabric];
    ctx.fillStyle = a; ctx.fillRect(0, 0, 128, 128);
    if (fabric === 'Ankara' || fabric === 'Kente') {
      for (let y = -64; y < 192; y += 32) for (let x = -64; x < 192; x += 32) {
        ctx.save(); ctx.translate(x + 16, y + 16); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = b; ctx.fillRect(-9, -9, 18, 18);
        ctx.fillStyle = c; ctx.fillRect(-4, -4, 8, 8); ctx.restore();
      }
    } else if (fabric === 'Adire') {
      ctx.strokeStyle = b; ctx.lineWidth = 5;
      for (let x = -128; x < 256; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 128, 128); ctx.stroke(); }
      ctx.fillStyle = c;
      for (let y = 12; y < 128; y += 32) for (let x = 12; x < 128; x += 32) {
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      }
    } else if (fabric === 'Aso-oke') {
      ctx.fillStyle = b; for (let x = 0; x < 128; x += 18) ctx.fillRect(x, 0, 7, 128);
      ctx.fillStyle = c; for (let x = 9; x < 128; x += 36) ctx.fillRect(x, 0, 3, 128);
    } else {
      ctx.strokeStyle = b; ctx.lineWidth = 2;
      for (let y = 0; y < 128; y += 12) for (let x = 0; x < 128; x += 12) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y + 6); ctx.lineTo(x, y + 12); ctx.lineTo(x - 6, y + 6); ctx.closePath(); ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.88 });
  }, [fabric, base]);
  return <primitive object={material} attach="material" />;
}

function HairModel({ style, color }: { style: Hair; color: string }) {
  const locks = style === 'Braids' ? 14 : style === 'Locs' ? 10 : 8;
  return <group>
    {['Braids', 'Long', 'Locs', 'Afro', 'Bun', 'Ponytail', 'Low cut', 'Gele', 'Classic'].includes(style) && (
      <mesh position={[0, 1.16, -0.025]} scale={style === 'Afro' ? [1.18, 1.08, 1.08] : [1, 0.95, 1]}>
        <sphereGeometry args={[0.285, 16, 12]} /><meshStandardMaterial color={color} roughness={1} />
      </mesh>
    )}
    {(style === 'Braids' || style === 'Long' || style === 'Locs') && Array.from({ length: locks }, (_, i) => {
      const angle = i / locks * Math.PI * 2;
      const length = style === 'Long' ? 0.8 : style === 'Locs' ? 0.95 : 0.72;
      return <mesh key={i} position={[Math.cos(angle) * 0.23, 0.83 - length * 0.2, Math.sin(angle) * 0.23]} rotation={[0, 0, -Math.cos(angle) * 0.12]}>
        <cylinderGeometry args={[style === 'Locs' ? 0.035 : 0.022, 0.024, length, 6]} /><meshStandardMaterial color={color} />
      </mesh>;
    })}
    {style === 'Bun' && <mesh position={[0, 1.42, -0.13]}><sphereGeometry args={[0.16, 12, 10]} /><meshStandardMaterial color={color} /></mesh>}
    {style === 'Ponytail' && <mesh position={[0.16, 0.9, -0.22]} rotation={[0.25, 0, -0.3]}><capsuleGeometry args={[0.07, 0.5, 4, 8]} /><meshStandardMaterial color={color} /></mesh>}
    {style === 'Gele' && <mesh position={[0, 1.38, -0.02]}><torusGeometry args={[0.23, 0.1, 8, 18]} /><meshStandardMaterial color="#2563eb" /></mesh>}
    {style === 'Classic' && <mesh position={[0, 1.0, 0.18]}><boxGeometry args={[0.43, 0.16, 0.09]} /><meshStandardMaterial color={color} /></mesh>}
  </group>;
}

function SimModel({ a }: { a: SimAppearance }) {
  const shirt = a.outfit === 'Office' ? '#111827' : a.outfit === 'Site work' ? '#f97316' :
    a.outfit === 'School' ? '#f8fafc' : a.outfit === 'Traditional' ? '#166534' :
    a.outfit === 'Casual' ? '#d6bda5' : a.accent;
  const trousers = a.outfit === 'School' ? '#1e3a8a' : a.outfit === 'Owambe' ? '#111827' :
    a.outfit === 'Traditional' ? '#9f1239' : '#334155';
  return <group position={[0, -1.12, 0]} scale={1.08}>
    {[-0.105, 0.105].map(x => <group key={x}>
      <mesh position={[x, 0.16, 0.07]} castShadow><boxGeometry args={[0.15, 0.28, 0.3]} /><meshStandardMaterial color="#4b2118" /></mesh>
      <mesh position={[x, 0.56, 0]} castShadow><capsuleGeometry args={[0.075, 0.58, 4, 8]} /><meshStandardMaterial color={a.skin} /></mesh>
    </group>)}
    <mesh position={[0, 1.25, 0]} castShadow><capsuleGeometry args={[0.25, 0.6, 5, 12]} /><PatternMaterial fabric={a.fabric} base={shirt} /></mesh>
    {(a.outfit === 'Owambe' || a.outfit === 'Traditional') && <mesh position={[0, 0.92, 0]} castShadow>
      <cylinderGeometry args={[0.28, 0.45, a.outfit === 'Owambe' ? 0.62 : 0.78, 12]} />
      <PatternMaterial fabric={a.fabric} base={trousers} />
    </mesh>}
    {a.outfit === 'Office' && <mesh position={[0, 1.3, 0.2]}><boxGeometry args={[0.09, 0.55, 0.025]} /><meshStandardMaterial color="#f8fafc" /></mesh>}
    {a.outfit === 'Site work' && <mesh position={[0, 1.62, 0.03]}><boxGeometry args={[0.58, 0.12, 0.34]} /><meshStandardMaterial color="#facc15" /></mesh>}
    <mesh position={[0, 1.72, 0]}><cylinderGeometry args={[0.075, 0.09, 0.2, 8]} /><meshStandardMaterial color={a.skin} /></mesh>
    <mesh position={[0, 2.0, 0]} scale={[0.78, 1, 0.82]} castShadow><sphereGeometry args={[0.25, 20, 16]} /><meshStandardMaterial color={a.skin} roughness={0.9} /></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * 0.08, 2.03, 0.195]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#1b120f" /></mesh>)}
    <mesh position={[0, 1.94, 0.205]}><boxGeometry args={[0.06, 0.035, 0.02]} /><meshStandardMaterial color="#5b3022" /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 0.34, 1.49, 0]}>
      <mesh position={[side * 0.05, -0.23, 0]} rotation={[0, 0, side * -0.12]} castShadow><capsuleGeometry args={[0.075, 0.43, 4, 8]} /><meshStandardMaterial color={a.skin} /></mesh>
      <mesh position={[side * 0.06, -0.5, 0.02]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color={a.skin} /></mesh>
    </group>)}
    <HairModel style={a.hairstyle} color={a.hairColor} />
  </group>;
}

function Choice<T extends string>({ value, selected, onClick, children }: {
  value: T; selected: T; onClick: (v: T) => void; children: React.ReactNode;
}) {
  return <button type="button" aria-pressed={value === selected} onClick={() => onClick(value)}
    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${value === selected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>{children}</button>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-2.5"><h3 className="text-sm font-semibold text-slate-600">{title}</h3>{children}</section>;
}

export default function CharacterCreator({ onComplete }: { onComplete?: (appearance: SimAppearance) => void }) {
  const [a, setA] = useState<SimAppearance>(INITIAL);
  const [step, setStep] = useState(0);
  const update = useCallback(<K extends keyof SimAppearance>(key: K, value: SimAppearance[K]) => setA(old => ({ ...old, [key]: value })), []);
  const randomize = () => setA(old => ({
    ...old, body: Math.random() > .5 ? 'Woman' : 'Man',
    hairstyle: HAIR[Math.floor(Math.random() * HAIR.length)],
    outfit: OUTFITS[Math.floor(Math.random() * OUTFITS.length)],
    fabric: FABRICS[Math.floor(Math.random() * FABRICS.length)],
    skin: SKINS[Math.floor(Math.random() * SKINS.length)],
    hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
  }));
  const finish = () => {
    try { localStorage.setItem('lagos-life-player-appearance', JSON.stringify(a)); } catch {}
    onComplete?.(a);
    if (!onComplete) window.dispatchEvent(new CustomEvent('lagos-life:character-created', { detail: a }));
  };

  return <main className="relative flex h-dvh min-h-160 w-full overflow-hidden bg-[#eaf3ff] text-slate-900">
    <button type="button" aria-label="Back" onClick={() => step ? setStep(step - 1) : history.back()} className="absolute left-5 top-5 z-20 h-11 w-11 rounded-full bg-white text-2xl shadow">‹</button>
    <header className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 text-center"><h1 className="text-lg font-extrabold">{['Look', 'Style', 'Finish'][step]}</h1><div className="mt-2 flex gap-1.5">{[0,1,2,3,4].map(n => <span key={n} className={`h-1.5 w-6 rounded-full ${n === step ? 'bg-emerald-500' : 'bg-slate-300'}`} />)}</div></header>
    <div className="relative min-w-0 flex-1">
      <Canvas shadows camera={{ position: [0, 1.1, 7.2], fov: 32 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}><color attach="background" args={['#eaf3ff']} /><ambientLight intensity={1.35} /><directionalLight position={[4, 7, 5]} intensity={2} castShadow /><directionalLight position={[-4, 3, -3]} intensity={0.55} color="#c6ddff" />
          <mesh position={[0, -1.28, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.45, 64]} /><meshStandardMaterial color="#d9dce1" /></mesh>
          <SimModel a={a} /><ContactShadows position={[0, -1.26, 0]} opacity={0.22} scale={5} blur={2.5} far={3} />
          <OrbitControls makeDefault target={[0, .15, 0]} enablePan={false} enableZoom minDistance={4.8} maxDistance={9} minPolarAngle={Math.PI / 2.25} maxPolarAngle={Math.PI / 1.95} rotateSpeed={.7} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-xs font-medium text-slate-500"><div className="text-xl">↕</div>Drag to spin</div>
    </div>
    <aside className="m-3 flex w-[min(40%,500px)] min-w-87.5 flex-col overflow-hidden rounded-[30px] bg-white/95 shadow-xl backdrop-blur-xl max-md:absolute max-md:inset-x-2 max-md:bottom-2 max-md:top-[51%] max-md:m-0 max-md:w-auto max-md:min-w-0">
      <div className="flex-1 space-y-5 overflow-y-auto p-5 pb-4">
        <div className="flex items-center rounded-full bg-slate-100 px-4 py-3"><input aria-label="Sim name" value={a.name} onChange={e => update('name', e.target.value.slice(0, 24))} placeholder="@paaka" className="w-full bg-transparent font-extrabold outline-none" /><span className="shrink-0 text-sm text-slate-400">your Sim's name</span></div>
        <Section title="Body"><div className="grid grid-cols-2 gap-2">{(['Woman','Man'] as Body[]).map(v => <Choice key={v} value={v} selected={a.body} onClick={x => update('body', x)}>{v}</Choice>)}</div></Section>
        <Section title="Hairstyle"><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{HAIR.map(v => <button key={v} type="button" onClick={() => update('hairstyle', v)} className={`flex min-h-18.75 flex-col items-center justify-center rounded-2xl border-2 p-2 text-xs font-semibold ${a.hairstyle === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-slate-100'}`}><span className="mb-1 text-2xl">{({Braids:'👩🏿‍🦱',Afro:'🧑🏿‍🦱',Bun:'👩🏿',Ponytail:'👱🏿‍♀️',Long:'👩🏿',Locs:'🧑🏿‍🦱','Low cut':'👨🏿',Gele:'👳🏿‍♀️',Classic:'👩🏿'} as Record<Hair,string>)[v]}</span>{v}</button>)}</div></Section>
        <Section title="Outfit"><div className="grid grid-cols-3 gap-2">{OUTFITS.map(v => <button key={v} type="button" onClick={() => update('outfit', v)} className={`flex min-h-18.75 flex-col items-center justify-center rounded-2xl border-2 p-2 text-xs font-semibold ${a.outfit === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-slate-100'}`}><span className="mb-1 text-2xl">{({Casual:'👕',Office:'🧥',Owambe:'👗','Site work':'🦺',School:'🎓',Traditional:'🥻'} as Record<Outfit,string>)[v]}</span>{v}</button>)}</div></Section>
        <Section title="Fabric"><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{FABRICS.map(v => <button key={v} type="button" onClick={() => update('fabric', v)} className={`flex flex-col gap-1 rounded-2xl border-2 p-1.5 text-[11px] font-semibold ${a.fabric === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-slate-100'}`}><span className="h-10 w-full rounded-xl" style={{background:`repeating-linear-gradient(45deg, ${FABRIC_COLORS[v][0]} 0 8px, ${FABRIC_COLORS[v][1]} 8px 13px, ${FABRIC_COLORS[v][2]} 13px 17px)`}} />{v}</button>)}</div></Section>
        <Section title="Skin tone"><div className="flex flex-wrap gap-2">{SKINS.map(v => <button key={v} type="button" aria-label={`Skin ${v}`} onClick={() => update('skin', v)} className={`h-9 w-9 rounded-full border-2 ${a.skin === v ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white shadow'}`} style={{backgroundColor:v}} />)}</div></Section>
        <Section title="Hair color"><div className="flex gap-2">{HAIR_COLORS.map(v => <button key={v} type="button" aria-label={`Hair color ${v}`} onClick={() => update('hairColor', v)} className={`h-8 w-8 rounded-full border-2 ${a.hairColor === v ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white shadow'}`} style={{backgroundColor:v}} />)}</div></Section>
      </div>
      <div className="flex gap-2 border-t border-slate-100 bg-white/90 p-4"><button type="button" onClick={randomize} title="Randomize" aria-label="Randomize appearance" className="h-14 w-14 shrink-0 rounded-full bg-slate-100 text-xl">⤨</button>{step < 2 ? <button type="button" onClick={() => setStep(s => Math.min(2, s + 1))} className="flex-1 rounded-full bg-emerald-500 px-5 py-4 font-extrabold text-white shadow-lg shadow-emerald-200">Continue</button> : <button type="button" onClick={finish} className="flex-1 rounded-full bg-emerald-500 px-5 py-4 font-extrabold text-white shadow-lg shadow-emerald-200">Create Sim</button>}</div>
    </aside>
  </main>;
}
