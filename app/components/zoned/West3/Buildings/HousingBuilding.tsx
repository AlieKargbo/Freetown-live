'use client';
import { Text } from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import {UrbanLot} from '@/app/components/zoned/BuildingImports';
export type HousingLevel='low'|'middle'|'high';
const cfg={
 low:{color:'#d6b58c',roof:'#8b5e3c',label:'LOW-INCOME HOME',emoji:'🏠',w:6.8,d:5.8,h:2.8},
 middle:{color:'#c7b08b',roof:'#6b6258',label:'MIDDLE-INCOME HOME',emoji:'🏡',w:6.8,d:5.8,h:3.6},
 high:{color:'#e5e7eb',roof:'#334155',label:'HIGH-INCOME HOME',emoji:'🏘️',w:7.8,d:6.6,h:4.2}
};
export default function HousingBuilding({position,level,variant='A'}:{position:[number,number,number];level:HousingLevel;variant?:'A'|'B'}) {
 const c=cfg[level],{w,d,h}=c;
 return <group position={position}><UrbanLot width={w+2.7} depth={d+4} walkwayWidth={2.2} walkwayDepth={1.7}>
  <mesh position={[0,h/2,-.65]} castShadow receiveShadow><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={c.color} roughness={.82}/></mesh>
  <mesh position={[0,h+.08,-.65]} castShadow><boxGeometry args={[w+.22,.16,d+.22]}/><meshStandardMaterial color={c.roof}/></mesh>
  {[-w*.28,w*.28].map(x=><mesh key={x} position={[x,h*.62,d/2-.62]}><boxGeometry args={[.9,.8,.05]}/><meshStandardMaterial color="#7dd3fc" roughness={.25}/></mesh>)}
  <mesh position={[0,h*.27,d/2-.59]}><boxGeometry args={[.85,h*.54,.06]}/><meshStandardMaterial color="#475569"/></mesh>
  <mesh position={[0,h*.7,d/2+.02]}><boxGeometry args={[1.7,.12,.85]}/><meshStandardMaterial color={c.roof}/></mesh>
  {variant==='B' && <mesh position={[w*.3,h*.28,-d*.12]} castShadow><boxGeometry args={[w*.35,h*.56,d*.72]}/><meshStandardMaterial color={c.color}/></mesh>}
  <Text position={[0,h+.34,d/2+.12]} fontSize={.15} color="#ffffff" anchorX="center" anchorY="middle">{c.label}</Text>
  <BuildingPins emoji={c.emoji} label={c.label} height={h+.65}/>
 </UrbanLot></group>;
}
