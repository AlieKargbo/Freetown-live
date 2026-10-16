    <aside className="z-10 m-3 flex w-[min(40%,500px)] min-w-[350px] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl max-md:absolute max-md:inset-x-2 max-md:bottom-2 max-md:top-[53%] max-md:m-0 max-md:w-auto max-md:min-w-0 max-md:rounded-[26px] max-sm:top-[49%]">
      <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 pb-5 sm:p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-800">@</span>
          <input aria-label="Sim name" value={a.name} onChange={(e) => update('name', e.target.value.slice(0, 24))} placeholder="@paaka" maxLength={24}
            className="min-w-0 flex-1 bg-transparent text-sm font-extrabold outline-none placeholder:text-slate-400" />
          <span className="hidden shrink-0 text-xs text-slate-400 sm:block">Your Sim's name</span>
        </div>

        <Section title="Body" hint="Choose your look">
          <div className="grid grid-cols-2 gap-2">{(['Woman', 'Man'] as Body[]).map((v) => <Choice key={v} value={v} selected={a.body} onClick={(value) => update('body', value)}>{v}</Choice>)}</div>
        </Section>

        <Section title="Hairstyle">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{HAIR.map((v) => <button key={v} type="button" aria-pressed={a.hairstyle === v} onClick={() => update('hairstyle', v)}
            className={`flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${a.hairstyle === v ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-transparent bg-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50'}`}>
            <span className="text-xl" aria-hidden="true">{HAIR_EMOJI[v]}</span>{v}
          </button>)}</div>
        </Section>

        <Section title="Outfit">
          <div className="grid grid-cols-3 gap-2">{OUTFITS.map((v) => <button key={v} type="button" aria-pressed={a.outfit === v} onClick={() => update('outfit', v)}
            className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${a.outfit === v ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-transparent bg-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50'}`}>
            <span className="text-xl" aria-hidden="true">{OUTFIT_EMOJI[v]}</span>{v}
          </button>)}</div>
        </Section>

        <Section title="Fabric" hint="Pattern preview">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{FABRICS.map((v) => <button key={v} type="button" aria-pressed={a.fabric === v} onClick={() => update('fabric', v)}
            className={`flex min-w-0 flex-col gap-1.5 rounded-2xl border-2 p-1.5 text-[10px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-[11px] ${a.fabric === v ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-50'}`}>
            <span className="h-9 w-full rounded-xl border border-black/5" style={{ background: `repeating-linear-gradient(45deg, ${FABRIC_COLORS[v][0]} 0 8px, ${FABRIC_COLORS[v][1]} 8px 13px, ${FABRIC_COLORS[v][2]} 13px 17px)` }} />{v}
          </button>)}</div>
        </Section>

        <Section title="Skin tone">
          <div className="flex flex-wrap gap-3">{SKINS.map((v) => <button key={v} type="button" aria-label={`Skin tone ${v}`} aria-pressed={a.skin === v} onClick={() => update('skin', v)}
            className={`h-9 w-9 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${a.skin === v ? 'border-white ring-[3px] ring-emerald-500' : 'border-white shadow-md'}`} style={{ backgroundColor: v }} />)}</div>
        </Section>

        <Section title="Hair color">
          <div className="flex flex-wrap gap-3">{HAIR_COLORS.map((v) => <button key={v} type="button" aria-label={`Hair color ${v}`} aria-pressed={a.hairColor === v} onClick={() => update('hairColor', v)}
            className={`h-8 w-8 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${a.hairColor === v ? 'border-white ring-[3px] ring-emerald-500' : 'border-white shadow-md'}`} style={{ backgroundColor: v }} />)}</div>
        </Section>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 bg-white/95 p-3 sm:p-4">
        <button type="button" onClick={randomize} title="Randomize appearance" aria-label="Randomize appearance"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xl transition hover:rotate-12 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">⤨</button>
        {step < 2 ? <button type="button" onClick={() => setStep((s) => Math.min(2, s + 1))}
          className="flex-1 rounded-full bg-emerald-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">{step === 0 ? 'Continue' : 'Review Sim'} <span aria-hidden="true">→</span></button>
          : <button type="button" onClick={finish}
            className="flex-1 rounded-full bg-emerald-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">Create Sim <span aria-hidden="true">✓</span></button>}
      </div>
    </aside>