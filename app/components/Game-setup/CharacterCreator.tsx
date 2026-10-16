'use client';

import { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    Center,
    ContactShadows,
    OrbitControls,
} from '@react-three/drei';

import Aside from './Aside';
import {
    FABRICS,
    FABRIC_COLORS,
    HAIR,
    HAIR_COLORS,
    INITIAL,
    OUTFITS,
    SKINS,
    type Body,
    type Fabric,
    type SimAppearance,
} from './CharacterData';
import CustomizedSimModel from './CustomizedSimModel';
import { useGame } from '../utils/Store';

export type { SimAppearance } from './CharacterData';

export type PlayerChoices = {
    appearance: SimAppearance;
    traits: string[];
    dream: string;
    birthOutcome: string;
    home: string;
};

const STEPS = [
    'Look',
    'Personality',
    'Dream',
    'Birth lottery',
    'Home',
];

export default function CharacterCreator({
    onComplete,
}: {
    onComplete?: (choices: PlayerChoices) => void;
}) {
    const signupUsername = useGame(state => state.playerUsername);
    const [appearance, setAppearance] = useState<SimAppearance>(() => ({
        ...INITIAL,
        name: signupUsername || INITIAL.name,
    }));

    const [step, setStep] = useState(0);
    const [traits, setTraits] = useState<string[]>([]);
    const [dream, setDream] = useState('');
    const [birthOutcome, setBirthOutcome] = useState('');
    const [home, setHome] = useState('Self-contain');

    const update = useCallback(
        <K extends keyof SimAppearance>(
            key: K,
            value: SimAppearance[K],
        ) => {
            setAppearance(current => ({
                ...current,
                [key]: value,
            }));
        },
        [],
    );

    const randomize = useCallback(() => {
        setAppearance(current => ({
            ...current,
            body: Math.random() > 0.5 ? 'Woman' : 'Man',
            hairstyle: HAIR[
                Math.floor(Math.random() * HAIR.length)
            ],
            outfit: OUTFITS[
                Math.floor(Math.random() * OUTFITS.length)
            ],
            fabric: FABRICS[
                Math.floor(Math.random() * FABRICS.length)
            ],
            skin: SKINS[
                Math.floor(Math.random() * SKINS.length)
            ],
            hairColor: HAIR_COLORS[
                Math.floor(Math.random() * HAIR_COLORS.length)
            ],
        }));
    }, []);

    const toggleTrait = (trait: string) => {
        setTraits(current => {
            if (current.includes(trait)) {
                return current.filter(item => item !== trait);
            }

            if (current.length >= 2) return current;

            return [...current, trait];
        });
    };

    const finish = () => {
        const choices: PlayerChoices = {
            appearance,
            traits,
            dream,
            birthOutcome,
            home,
        };

        try {
            localStorage.setItem(
                'freetong-life-player-choices',
                JSON.stringify(choices),
            );
            localStorage.setItem(
                'freetong-life-player-appearance',
                JSON.stringify(appearance),
            );
        } catch {
            // Continue even if browser storage is unavailable.
        }

        onComplete?.(choices);

        if (!onComplete) {
            window.dispatchEvent(
                new CustomEvent('freetong-life:character-created', {
                    detail: choices,
                }),
            );
        }
    };

    const canContinue =
        step === 0 ||
        (step === 1 && traits.length === 2) ||
        (step === 2 && Boolean(dream)) ||
        (step === 3 && Boolean(birthOutcome)) ||
        (step === 4 && Boolean(home));

    return (
        <main className="relative flex h-dvh min-h-0 w-full overflow-hidden bg-[#eaf3ff] text-slate-900">
            <button
                type="button"
                aria-label="Back"
                onClick={() => {
                    if (step > 0) {
                        setStep(current => current - 1);
                    } else {
                        history.back();
                    }
                }}
                className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow"
            >
                ‹
            </button>

            <header className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 text-center">
                <h1 className="text-lg font-extrabold">
                    {STEPS[step]}
                </h1>

                <div className="mt-2 flex gap-1.5">
                    {STEPS.map((_, index) => (
                        <span
                            key={index}
                            className={`h-1.5 w-6 rounded-full ${index <= step
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                                }`}
                        />
                    ))}
                </div>
            </header>

            <div className="relative min-w-0 flex-1">
                <Canvas
                    shadows
                    camera={{
                        position: [0, 1.1, 7.2],
                        fov: 32,
                    }}
                    dpr={[1, 1.75]}
                >
                    {/* <Suspense fallback={null}> */}
                        <color
                            attach="background"
                            args={['#eaf3ff']}
                        />

                        <ambientLight intensity={1.35} />

                        <directionalLight
                            position={[4, 7, 5]}
                            intensity={2}
                            castShadow
                        />

                        <directionalLight
                            position={[-4, 3, -3]}
                            intensity={0.55}
                            color="#c6ddff"
                        />

                        <mesh
                            position={[0, -1.28, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            receiveShadow
                        >
                            <circleGeometry args={[2.45, 64]} />
                            <meshStandardMaterial color="#d9dce1" />
                        </mesh>

                        <Center top position={[0, -1.28, 0]}>
                            <CustomizedSimModel appearance={appearance} scale={1.5} />
                        </Center>

                        <ContactShadows
                            position={[0, -1.26, 0]}
                            opacity={0.22}
                            scale={5}
                            blur={2.5}
                            far={3}
                        />

                        <OrbitControls
                            makeDefault
                            target={[0, 0.15, 0]}
                            enablePan={false}
                            enableZoom
                            minDistance={4.8}
                            maxDistance={9}
                            minPolarAngle={Math.PI / 2.25}
                            maxPolarAngle={Math.PI / 1.95}
                            rotateSpeed={0.7}
                        />
                    {/* </Suspense> */}
                </Canvas>

                <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-xs font-medium text-slate-500">
                    Drag to spin
                </div>
            </div>

            <Aside
                appearance={appearance}
                signupUsername={signupUsername}
                step={step}
                update={update}
                randomize={randomize}
                traits={traits}
                toggleTrait={toggleTrait}
                dream={dream}
                setDream={setDream}
                birthOutcome={birthOutcome}
                setBirthOutcome={setBirthOutcome}

                home={home}
                setHome={setHome}
                continueStep={() =>
                    setStep(current => Math.min(4, current + 1))
                }
                finish={finish}
                canContinue={canContinue}

            />
        </main>
    );
}
