'use client';
import {Text} from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import {UrbanLot} from '@/app/components/zoned/BuildingImports';
export const KIOSK_HEIGHT=2.2;
export default function Kiosk({position}:{position:[number,number,number]}){
 const W=2.4,D=2.2,H=2.2;
 return <group position={position}><UrbanLot width={W+2.6} depth={D+4} walkwayWidth={2.1} walkwayDepth={1.8}>
 <mesh position={[0,H/2,-.45]} castShadow receiveShadow><boxGeometry args={[W,H,D]}/><meshStandardMaterial color="#f59e0b" roughness={.8}/></mesh>
 <mesh position={[0,H+.07,-.45]} castShadow><boxGeometry args={[W+.2,.14,D+.2]}/><meshStandardMaterial color="#7c2d12"/></mesh>
 {[-W*.28,W*.28].map(x=><mesh key={x} position={[x,H*.58,D/2-.4]}><boxGeometry args={[Math.min(1.15,W*.28),Math.min(1.15,H*.5),.05]}/><meshStandardMaterial color="#7dd3fc" roughness={.25}/></mesh>)}
 <mesh position={[0,H*.32,D/2+.02]}><boxGeometry args={[.85,H*.64,.06]}/><meshStandardMaterial color="#334155"/></mesh>
 <mesh position={[0,H+.3,D/2+.05]}><boxGeometry args={[W*.9,.4,.06]}/><meshStandardMaterial color="#0f172a"/></mesh>
 <Text position={[0,H+.3,D/2+.09]} fontSize={.17} color="#ffffff" anchorX="center" anchorY="middle">NEIGHBORHOOD KIOSK</Text>
 <mesh position={[0,H+.08,-.35]} castShadow><coneGeometry args={[W*.72,.55,4]}/><meshStandardMaterial color="#dc2626"/></mesh>
 <BuildingPins emoji="🏪" label="Neighborhood Kiosk" height={H+.6}/>
 </UrbanLot></group>;
}
