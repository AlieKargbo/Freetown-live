'use client';
import {Text} from '@react-three/drei';
import { BuildingPins } from '@/app/components/zoned/BuildingImports';
import {UrbanLot} from '@/app/components/zoned/BuildingImports';
export const APARTMENTBLOCK_HEIGHT=6.2;
export default function ApartmentBlock({position}:{position:[number,number,number]}){
 const W=7.8,D=6.4,H=6.2;
 return <group position={position}><UrbanLot width={W+2.6} depth={D+4} walkwayWidth={2.1} walkwayDepth={1.8}>
 <mesh position={[0,H/2,-.45]} castShadow receiveShadow><boxGeometry args={[W,H,D]}/><meshStandardMaterial color="#d6d3d1" roughness={.8}/></mesh>
 <mesh position={[0,H+.07,-.45]} castShadow><boxGeometry args={[W+.2,.14,D+.2]}/><meshStandardMaterial color="#475569"/></mesh>
 {[-W*.28,W*.28].map(x=><mesh key={x} position={[x,H*.58,D/2-.4]}><boxGeometry args={[Math.min(1.15,W*.28),Math.min(1.15,H*.5),.05]}/><meshStandardMaterial color="#7dd3fc" roughness={.25}/></mesh>)}
 <mesh position={[0,H*.32,D/2+.02]}><boxGeometry args={[.85,H*.64,.06]}/><meshStandardMaterial color="#334155"/></mesh>
 <mesh position={[0,H+.3,D/2+.05]}><boxGeometry args={[W*.9,.4,.06]}/><meshStandardMaterial color="#0f172a"/></mesh>
 <Text position={[0,H+.3,D/2+.09]} fontSize={.17} color="#ffffff" anchorX="center" anchorY="middle">APARTMENT BLOCK</Text>
 {[1,2,3,4].flatMap(f=>[-1.8,0,1.8].map(x=><mesh key={`${f}-${x}`} position={[x,f*1.25,D/2+.035]}><boxGeometry args={[.85,.7,.045]}/><meshStandardMaterial color="#7dd3fc"/></mesh>))}
 <BuildingPins emoji="🏢" label="Apartment Block" height={H+.6}/>
 </UrbanLot></group>;
}
