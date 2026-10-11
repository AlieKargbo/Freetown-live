'use client';
import {Text} from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import {UrbanLot} from '@/app/components/zoned/BuildingImports';
export const ATM_HEIGHT=2.1;
export default function ATM({position}:{position:[number,number,number]}){
 const W=1.8,D=1.4,H=2.1;
 return <group position={position}><UrbanLot width={W+2.6} depth={D+4} walkwayWidth={2.1} walkwayDepth={1.8}>
 <mesh position={[0,H/2,-.45]} castShadow receiveShadow><boxGeometry args={[W,H,D]}/><meshStandardMaterial color="#cbd5e1" roughness={.8}/></mesh>
 <mesh position={[0,H+.07,-.45]} castShadow><boxGeometry args={[W+.2,.14,D+.2]}/><meshStandardMaterial color="#334155"/></mesh>
 {[-W*.28,W*.28].map(x=><mesh key={x} position={[x,H*.58,D/2-.4]}><boxGeometry args={[Math.min(1.15,W*.28),Math.min(1.15,H*.5),.05]}/><meshStandardMaterial color="#7dd3fc" roughness={.25}/></mesh>)}
 <mesh position={[0,H*.32,D/2+.02]}><boxGeometry args={[.85,H*.64,.06]}/><meshStandardMaterial color="#334155"/></mesh>
 <mesh position={[0,H+.3,D/2+.05]}><boxGeometry args={[W*.9,.4,.06]}/><meshStandardMaterial color="#0f172a"/></mesh>
 <Text position={[0,H+.3,D/2+.09]} fontSize={.17} color="#ffffff" anchorX="center" anchorY="middle">ATM</Text>
 <mesh position={[0,.75,D/2+.18]} castShadow><boxGeometry args={[.8,1.5,.35]}/><meshStandardMaterial color="#1e293b"/></mesh><mesh position={[0,1,D/2+.37]}><boxGeometry args={[.42,.28,.035]}/><meshStandardMaterial color="#7dd3fc" emissive="#0c4a6e" emissiveIntensity={.3}/></mesh>
 <BuildingPins emoji="🏧" label="ATM" height={H+.6}/>
 </UrbanLot></group>;
}
