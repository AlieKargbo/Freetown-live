'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BusFront, CarFront, Footprints, MapPin } from 'lucide-react';
import { CURRENCY, game, TRAVEL_DURATION_MS, useGame } from './Store';

const RIDE_ICONS: Record<string, typeof BusFront> = {
  Trek: Footprints,
  Okada: CarFront,
  Keke: CarFront,
  Cab: CarFront,
  Danfo: BusFront,
};

export default function TravelTransition() {
  const trip = useGame((state) => state.travel);
  const [now, setNow] = useState(() => Date.now());
  const tripId = trip?.id;
  const tripStartedAt = trip?.startedAt;

  useEffect(() => {
    if (!tripId || tripStartedAt === undefined) return;

    const remaining = Math.max(0, tripStartedAt + TRAVEL_DURATION_MS - Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 40);
    const timeout = window.setTimeout(() => game.completeTravel(tripId), remaining);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [tripId, tripStartedAt]);

  if (!trip) return null;

  const RideIcon = RIDE_ICONS[trip.ride] ?? CarFront;
  const progress = Math.min(100, Math.max(0, ((now - trip.startedAt) / TRAVEL_DURATION_MS) * 100));
  const origin = trip.from?.name ?? 'City map';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Travelling from ${origin} to ${trip.to.name}`}>
      <section className="w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <RideIcon size={27} aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold text-slate-900">On your way</h2>
          <p className="mt-1 text-sm text-slate-500">Getting you to {trip.to.name}</p>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <div className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-3 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><MapPin size={14} />From</div>
            <p className="mt-1 truncate font-bold text-slate-800">{origin}</p>
          </div>
          <ArrowRight className="shrink-0 text-emerald-500" size={20} aria-hidden="true" />
          <div className="min-w-0 flex-1 rounded-2xl bg-emerald-50 px-3 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700"><MapPin size={14} />To</div>
            <p className="mt-1 truncate font-bold text-slate-800">{trip.to.name}</p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Travel progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>{trip.ride} · fare paid</span>
          <span className="font-bold text-slate-700">{CURRENCY}{trip.fare.toLocaleString('en')}</span>
        </div>
      </section>
    </div>
  );
}
