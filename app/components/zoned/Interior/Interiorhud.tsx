'use client';

import { useEffect, useState } from 'react';
import type { BuildingInfo } from '../../utils/Info';
import { CURRENCY, game, playersIn, useGame } from '../../utils/Store';

import { PLAYER_HOME_INFO } from './playerHomeInfo';

const number = new Intl.NumberFormat('en');



const roundBtn = 'flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 hover:bg-slate-200';

export default function InteriorHud({ info }: { info: BuildingInfo }) {
    const money = useGame((s) => s.money);
    const [text, setText] = useState('');
    const [open, setOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const players = playersIn(info.id);

    const send = () => {
        const t = text.trim();
        if (!t) return;
        game.say(t);
        setText('');
    };

    const share = async () => {
        try {
            await navigator.clipboard.writeText(`${location.origin}${location.pathname}?b=${info.id}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard can be blocked; ignore */
        }
    };

    return (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between">
            {/* Top: status bar + venue banner */}
            <div className="flex flex-col items-center gap-3 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                {/* <div className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full bg-white/90 py-2 pl-5 pr-2 shadow-lg backdrop-blur">
                    <div className="flex min-w-0 items-center gap-4 text-sm">
                        <Clock />
                        <span className="hidden font-semibold text-emerald-500 sm:inline">😊 Happy</span>
                        <span className="hidden items-center gap-1.5 font-semibold text-emerald-600 md:flex">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            {players} here now
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-800">
                            {CURRENCY}
                            {number.format(money)}
                        </span>
                    </div>
                </div> */}

                {/* {info.banner && (
                    <div className="pointer-events-auto w-full max-w-md rounded-3xl bg-slate-900/70 px-4 py-3 text-white shadow-lg backdrop-blur">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800">
                                <span>{info.emoji}</span>
                                {info.name}
                            </span>
                            {info.banner.badge && (
                                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold tracking-wide text-slate-900">{info.banner.badge}</span>
                            )}
                        </div>
                        <p className="mt-2 text-lg font-bold leading-snug">{info.banner.line}</p>
                    </div>
                )} */}
            </div>
            
        </div>
    );
}