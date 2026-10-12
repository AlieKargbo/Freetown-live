'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Login() {
	const [message, setMessage] = useState('');

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage('Sign-in is not connected to an authentication service yet. Your credentials were not sent.');
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#eaf4f2] px-4 py-10">
			<section className="w-full max-w-md rounded-2xl border border-emerald-950/10 bg-white p-7 shadow-xl shadow-emerald-950/10 sm:p-9">
				<Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700">
					<ArrowLeft size={16} aria-hidden="true" /> Freetown Life
				</Link>

				<div className="mt-8">
					<p className="text-xs font-bold uppercase text-emerald-700">Freetown Life</p>
					<h1 className="mt-2 text-3xl font-extrabold text-slate-900">Welcome back</h1>
					<p className="mt-2 text-sm text-slate-600">Log in to return to your place in the city.</p>
				</div>

				<form className="mt-7 space-y-4" onSubmit={handleSubmit}>
					<label className="block text-sm font-semibold text-slate-700">
						Email
						<input name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
					</label>
					<label className="block text-sm font-semibold text-slate-700">
						Password
						<input name="password" type="password" autoComplete="current-password" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
					</label>
					{message && <p role="status" className="text-sm text-amber-800">{message}</p>}
					<button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
						Log in <ArrowRight size={17} aria-hidden="true" />
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-600">
					New to Freetown Life? <Link href="/signup" className="font-bold text-emerald-700 hover:underline">Create an account</Link>
				</p>
			</section>
		</main>
	);
}
