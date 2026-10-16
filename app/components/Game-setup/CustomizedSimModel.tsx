'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';
import { FABRIC_COLORS, type Fabric, type SimAppearance } from './CharacterData';

function createFabricTexture(
    fabric: Fabric,
    [base, second, third]: [string, string, string],
): THREE.CanvasTexture | null {
    if (typeof document === 'undefined' || fabric === 'Plain') return null;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = base;
    context.fillRect(0, 0, size, size);

    if (fabric === 'Ankara') {
        const step = 32;
        context.strokeStyle = second;
        context.lineWidth = 4;
        for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
                context.beginPath();
                context.moveTo(x + step / 2, y + 4);
                context.lineTo(x + step - 4, y + step / 2);
                context.lineTo(x + step / 2, y + step - 4);
                context.lineTo(x + 4, y + step / 2);
                context.closePath();
                context.stroke();
                context.fillStyle = third;
                context.beginPath();
                context.arc(x + step / 2, y + step / 2, 3, 0, Math.PI * 2);
                context.fill();
            }
        }
    } else if (fabric === 'Adire') {
        context.strokeStyle = second;
        context.lineWidth = 3;
        for (let y = 32; y < size; y += 64) {
            for (let x = 32; x < size; x += 64) {
                for (let radius = 6; radius < 26; radius += 7) {
                    context.beginPath();
                    context.arc(x, y, radius, 0, Math.PI * 2);
                    context.stroke();
                }
            }
        }
    } else if (fabric === 'Aso-oke') {
        context.fillStyle = third;
        for (let y = 0; y < size; y += 16) context.fillRect(0, y, size, 6);
    } else if (fabric === 'Kente') {
        for (let y = 0; y < size; y += 64) {
            context.fillStyle = second;
            context.fillRect(0, y, size, 20);
            context.fillStyle = third;
            context.fillRect(0, y + 28, size, 8);
        }
        context.fillStyle = third;
        for (let x = 0; x < size; x += 32) {
            for (let y = 0; y < size; y += 64) context.fillRect(x, y + 4, 12, 12);
        }
    } else if (fabric === 'Lace') {
        context.strokeStyle = second;
        context.lineWidth = 2;
        for (let y = 12; y < size; y += 24) {
            for (let x = 12; x < size; x += 24) {
                context.beginPath();
                context.arc(x, y, 8, 0, Math.PI * 2);
                context.stroke();
            }
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function CustomizedSimModel({
    appearance,
    scale = 1,
}: {
    appearance: SimAppearance;
    scale?: number;
}) {
    const modelUrl = appearance.body === 'Woman'
        ? '/models/sim-woman.glb'
        : '/models/sim-man.glb';
    const { scene } = useGLTF(modelUrl);

    const character = useMemo(() => {
        const copy = clone(scene);
        copy.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            object.material = Array.isArray(object.material)
                ? object.material.map((material) => material.clone())
                : object.material.clone();
        });
        return copy;
    }, [scene]);

    useEffect(() => {
        const palette = FABRIC_COLORS[appearance.fabric];
        const fabricTexture = createFabricTexture(appearance.fabric, palette);
        const hairStyle = normalize(appearance.hairstyle);
        const outfit = normalize(appearance.outfit);

        character.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;

            object.castShadow = true;
            object.receiveShadow = true;
            if (object.name.startsWith('Hair_')) {
                object.visible = normalize(object.name.slice(5)) === hairStyle;
            }
            if (object.name.startsWith('Outfit_')) {
                object.visible = normalize(object.name.slice(7)) === outfit;
            }

            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];
            materials.forEach((material) => {
                if (!(material instanceof THREE.MeshStandardMaterial)) return;

                switch (material.name) {
                    case 'Mat_Skin':
                        material.color.set(appearance.skin);
                        break;
                    case 'Mat_Hair':
                        material.color.set(appearance.hairColor);
                        break;
                    case 'Mat_Top':
                        if (appearance.outfit === 'Office') {
                            material.color.set('#F8FAFC');
                            material.map = null;
                        } else if (fabricTexture) {
                            material.color.set('#FFFFFF');
                            material.map = fabricTexture;
                        } else {
                            material.color.set(palette[0]);
                            material.map = null;
                        }
                        break;
                    case 'Mat_Vest':
                        material.color.set('#FACC15');
                        material.map = null;
                        break;
                    case 'Mat_Bottom':
                        material.color.set('#0F172A');
                        break;
                    case 'Mat_Accent':
                        material.color.set(appearance.accent);
                        break;
                }

                material.needsUpdate = true;
            });
        });

        return () => fabricTexture?.dispose();
    }, [
        appearance,
        character,
    ]);

    return <primitive object={character} scale={scale} dispose={null} />;
}

useGLTF.preload('/models/sim-woman.glb');
useGLTF.preload('/models/sim-man.glb');