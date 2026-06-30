// programmas.jsx — Programs page

const SCHEDULE_API = 'https://public.radioscorpio.be/api/time/schema/list';
const NONSTOP_ID   = 25;
const DAY_ABBR     = { Maandag:'MA', Dinsdag:'DI', Woensdag:'WO', Donderdag:'DO', Vrijdag:'VR', Zaterdag:'ZA', Zondag:'ZO' };
const DAYS         = ['MA','DI','WO','DO','VR','ZA','ZO'];
const MONTHS_NL    = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

function fmtWeekLabel(details, nav) {
  if (!details.length) return '';
  const d0 = details[0].programmatiecolumn.date;
  const d1 = details[details.length - 1].programmatiecolumn.date;
  const [, d0m] = d0.split('/').map(Number);
  const [d1d, d1m] = d1.split('/').map(Number);
  const d0d = d0.split('/')[0];
  const year = nav.thisweekstart ? new Date(nav.thisweekstart * 1000).getFullYear() : '';
  const month = MONTHS_NL[d1m - 1];
  // ISO week number
  const dt = new Date(nav.thisweekstart * 1000);
  const jan4 = new Date(dt.getFullYear(), 0, 4);
  const weekNum = Math.ceil(((dt - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `Week ${weekNum} · ${d0d} — ${d1d} ${month} ${year}`;
}

function useSchedule(startDate) {
  const [schedule, setSchedule] = React.useState(null);
  const [loading, setLoading]   = React.useState(true);
  const [error, setError]       = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    const body = startDate ? JSON.stringify({ startlistdate: startDate }) : '{}';
    fetch(SCHEDULE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(r => r.json())
      .then(json => {
        const details = json?.programmatielijn?.details ?? [];
        const nav     = json?.programmatielijn?.navigatie?.navigatieblok ?? {};

        // Day abbreviation → date string (dd/mm)
        const datesByDay = {};
        details.forEach(col => {
          const c = col.programmatiecolumn;
          datesByDay[DAY_ABBR[c.day] ?? c.day] = c.date;
        });

        // Flatten all blocks
        const allBlocks = [];
        details.forEach(col => {
          const c        = col.programmatiecolumn;
          const dayShort = DAY_ABBR[c.day] ?? c.day;
          c.blokken.forEach(blok => {
            const b = blok.programmatieblok;
            allBlocks.push({
              id:        b.id,
              showid:    b.showid,
              name:      b.showName,
              day:       dayShort,
              dayFull:   c.day,
              date:      c.date,
              start:     b.startClockCalc,
              end:       b.endClockCalc,
              time:      `${b.startClockCalc}–${b.endClockCalc}`,
              imageURL:  b.imageURL || '',
              linkURL:   b.linkURL  || '',
              isNonstop: b.showid === NONSTOP_ID,
              genres:    b.genres || [],
            });
          });
        });

        // Rooster lookup: "MA_20:00" → block
        const byDaySlot = {};
        allBlocks.forEach(b => { byDaySlot[`${b.day}_${b.start}`] = b; });

        // Rooster time slots = unique start times of all shows, sorted
        const slotSet = new Set();
        allBlocks.forEach(b => { slotSet.add(b.start); });
        const slots = Array.from(slotSet).sort((a, z) => {
          const [ah, am] = a.split(':').map(Number);
          const [zh, zm] = z.split(':').map(Number);
          return (ah * 60 + am) - (zh * 60 + zm);
        });

        // Grid: unique shows (first occurrence per showid)
        const seenIds = new Set();
        const uniqueShows = [];
        allBlocks.forEach(b => {
          if (!seenIds.has(b.showid)) {
            seenIds.add(b.showid);
            uniqueShows.push(b);
          }
        });

        const allGenres = json?.programmatielijn?.allGenres ?? [];

        setSchedule({ allBlocks, byDaySlot, slots, uniqueShows, allGenres, datesByDay, nav,
                      weekLabel: fmtWeekLabel(details, nav) });
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [startDate]);

  return { schedule, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────

function Programmas({ setRoute, navigate, hashParam, setOdTarget }) {
  const [genre, setGenre]           = React.useState('Alles');
  const [view, setView]             = React.useState('lijst');
  const [hoveredGroup, setHovered]  = React.useState(null);
  const [startDate, setStartDate]   = React.useState(hashParam || null);
  const { schedule, loading, error } = useSchedule(startDate);

  function goToOD(showid) {
    navigate('ondemand', String(showid));
  }

  // Only show full-page spinner on the very first load (no data yet)
  if (loading && !schedule) return (
    <div style={{ padding:'120px 0', textAlign:'center', color:'var(--mute)' }}>
      Programma laden…
    </div>
  );

  if (error && !schedule) return (
    <div style={{ padding:'120px 0', textAlign:'center', color:'var(--mute)' }}>
      Kon programma niet laden.
    </div>
  );

  // During week navigation: loading=true but schedule still holds the previous week's data
  const isRefreshing = loading && !!schedule;

  const { allBlocks, byDaySlot, slots, uniqueShows, allGenres, datesByDay, nav, weekLabel } = schedule;

  const genreChips = ['Alles', ...allGenres];

  // Shared nav button style
  const navBtnStyle = (enabled) => ({
    background: 'none', border: 'none', color: 'inherit', lineHeight: 1,
    fontSize: 18, padding: '2px 10px',
    cursor: enabled && !isRefreshing ? 'pointer' : 'not-allowed',
    opacity: enabled && !isRefreshing ? 1 : 0.3,
  });

  const selfNav = React.useRef(false);
  function goWeek(dateStr) {
    if (dateStr && !isRefreshing) {
      selfNav.current = true;
      setStartDate(dateStr);
      navigate('programmas', dateStr);
    }
  }

  React.useEffect(() => {
    if (selfNav.current) { selfNav.current = false; return; }
    setStartDate(hashParam || null);
  }, [hashParam]);

  // Lijst: blocks sorted by day order then time, filtered by genre
  const dayOrder = Object.fromEntries(DAYS.map((d, i) => [d, i]));
  const listBlocks = (genre === 'Alles' ? allBlocks : allBlocks.filter(p => p.genres.includes(genre)))
    .sort((a, b) => dayOrder[a.day] - dayOrder[b.day] || a.start.localeCompare(b.start));

  return (
    <>
      <section data-screen-label="02 Programmas — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Programma's · {weekLabel}</div>
            <h1>
              168 uur,<br/>
              <span style={{color:'var(--mute)'}}>20+ stemmen.</span>
            </h1>
          </div>
          <div className="aside">
            // Gids<br/>
            <b>{uniqueShows.length} programma's</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Filter, blader, ontdek.
            </span>
          </div>
        </div>

        {/* Genre chips — wrapping, rooster/lijst toggle pinned to its own row */}
        <div className="chips" style={{flexWrap:'wrap', rowGap:6}}>
          {genreChips.map(g => (
            <button key={g}
                    className={"chip" + (genre === g ? ' is-active' : '')}
                    onClick={() => setGenre(g)}>
              {g}
            </button>
          ))}
          <div style={{width:'100%', display:'flex', justifyContent:'flex-end', marginTop:2}}>
            {['rooster','lijst'].map(v => (
              <button key={v}
                      className={"chip" + (view === v ? ' is-active' : '')}
                      onClick={() => setView(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="shell" data-screen-label="02 Programmas — Content" style={{paddingTop:0}}>

        {/* Week navigation — shared for both rooster and lijst ───────── */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',
                     borderTop:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)',
                     padding:'4px 8px'}}>
          <button style={navBtnStyle(!!nav?.prevweekmondaystr)}
                  onClick={() => goWeek(nav?.prevweekmondaystr)}>
            «
          </button>
          <span style={{fontSize:11, opacity: isRefreshing ? 0.4 : 0.55,
                        letterSpacing:'0.08em', textTransform:'uppercase', transition:'opacity 0.15s'}}>
            {weekLabel}
          </span>
          <button style={navBtnStyle(!!nav?.nextweekmondaystr)}
                  onClick={() => goWeek(nav?.nextweekmondaystr)}>
            »
          </button>
        </div>

        {/* Content fades slightly while a new week is loading ───────── */}
        <div style={{opacity: isRefreshing ? 0.45 : 1, transition:'opacity 0.15s', pointerEvents: isRefreshing ? 'none' : 'auto'}}>

        {/* Lijst view ─────────────────────────────────────── */}
        {view === 'lijst' && (
          <div style={{borderTop:'1px solid var(--ink)'}}>
            {listBlocks.map((p, i) => (
              <div key={p.id} className="prog-row"
                   style={{cursor: 'pointer'}}
                   onClick={() => goToOD(p.showid)}>
                <span className="day">{p.day}</span>
                <span className="time">{p.time}</span>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="prog-row-dj" style={{marginTop:4, color:'var(--mute)'}}>
                    {p.date}
                  </div>
                </div>
                <span className="gen">{p.genres.length ? p.genres.join(', ') : '—'}</span>
                <span className="arr">→</span>
              </div>
            ))}
          </div>
        )}

        {/* Rooster view ────────────────────────────────────── */}
        {view === 'rooster' && (() => {
          function toMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
          // Build map: "DAY_slot" → parent block (for continuation slots)
          const contMap = new Map();
          allBlocks.forEach(b => {
            const startMins = toMins(b.start);
            let endMins = toMins(b.end);
            if (endMins <= startMins) endMins += 1440;
            slots.forEach(slot => {
              let slotM = toMins(slot);
              if (slotM <= startMins) slotM += 1440;
              if (slotM > startMins && slotM < endMins) contMap.set(`${b.day}_${slot}`, b);
            });
          });
          return (
            <div className="tg-wrap">
              <div className="tg">
                <div className="h">/ tijd</div>
                {DAYS.map(d => (
                  <div key={d} className="h day">
                    <span>{d}</span>
                    {datesByDay?.[d] && <span style={{display:'block', fontSize:10, fontWeight:400, opacity:0.6, marginTop:2}}>{datesByDay[d]}</span>}
                  </div>
                ))}
                {slots.map((slot, si) => {
                  const nextSlot = slots[si + 1];
                  return (
                    <React.Fragment key={slot}>
                      <div className="t" style={nextSlot && DAYS.some(d => contMap.has(`${d}_${nextSlot}`)) ? {borderBottom:'none'} : {}}>
                        {slot}
                      </div>
                      {DAYS.map(d => {
                        const cellKey    = `${d}_${slot}`;
                        const isCont     = contMap.has(cellKey);
                        const parentBlock = isCont ? contMap.get(cellKey) : byDaySlot[cellKey];
                        const groupKey   = parentBlock ? `${d}_${parentBlock.start}` : null;
                        const isHovered  = groupKey && hoveredGroup === groupKey;
                        const nextCont   = nextSlot ? contMap.get(`${d}_${nextSlot}`) : null;
                        const nextIsCont = nextCont && parentBlock && nextCont.start === parentBlock.start;
                        const genreActive = genre !== 'Alles';
                        const isMatch = genreActive && parentBlock && parentBlock.genres.includes(genre);
                        const isDim   = genreActive && parentBlock && !parentBlock.genres.includes(genre);
                        return (
                          <div key={d} className="cell"
                               title={parentBlock ? `${parentBlock.name} · ${parentBlock.start}–${parentBlock.end}` : ''}
                               style={{
                                 cursor: parentBlock ? 'pointer' : 'default',
                                 ...(nextIsCont ? {borderBottom:'none'} : {}),
                                 ...(isHovered  ? {background:'var(--ink)', color:'var(--accent)'} : {}),
                                 ...(!isHovered && isMatch ? {background:'var(--accent)', color:'var(--ink)'} : {}),
                                 ...(!isHovered && isDim   ? {opacity:0.2} : {}),
                               }}
                               onMouseEnter={() => groupKey && setHovered(groupKey)}
                               onMouseLeave={() => setHovered(null)}
                               onClick={() => parentBlock && goToOD(parentBlock.showid)}>
                            {isCont
                              ? null
                              : parentBlock
                                ? parentBlock.name
                                : <span style={{color:'var(--mute)', fontWeight:400}}>—</span>
                            }
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })()}

        </div>{/* end opacity wrapper */}

        {/* Spotlight bar ─────────────────────────────────── */}
        <div style={{
          marginTop:64, marginBottom:64,
          border:'1px solid var(--ink)',
          display:'grid', gridTemplateColumns:'1fr 1.4fr',
          background:'var(--ink)', color:'var(--paper)',
        }}>
          <div style={{padding:'48px 40px', borderRight:'1px solid var(--paper)'}}>
            <div className="eyebrow" style={{color:'var(--accent)', marginBottom:14}}>// In de schijnwerper</div>
            <h3 style={{fontSize:54, lineHeight:0.9, marginBottom:18}}>
              Word DJ<br/>bij Scorpio.
            </h3>
            <p style={{fontSize:14, color:'rgba(244,242,236,0.65)', maxWidth:340, marginBottom:24}}>
              We zoeken doorlopend nieuwe stemmen voor onze antenne. Niet de juiste
              stem? Mixen, monteren, opnemen, schrijven — er is altijd plek.
            </p>
            <button className="play-cta" style={{borderColor:'var(--accent)'}} onClick={() => navigate('vrijwilliger')}>
              <span className="ico"><Ic.arrow/></span>
              Schrijf je in
            </button>
          </div>
          <div style={{padding:'48px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignContent:'center'}}>
            {[
              ['72',  'vrijwilligers achter de knoppen'],
              ['46',  'jaar onafhankelijke radio'],
              ['168', 'uur uitzending per week'],
              ['0',   'reclameblokken'],
            ].map(([n, t]) => (
              <div key={t}>
                <div style={{fontFamily:'Archivo', fontWeight:900, fontSize:88, lineHeight:0.85, letterSpacing:'-0.05em'}}>{n}</div>
                <div className="eyebrow" style={{color:'rgba(244,242,236,0.6)', marginTop:8}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

window.Programmas = Programmas;
