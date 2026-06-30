// home.jsx — Radio Scorpio homepage

// --- MOCK announcement data (would come from data file / CMS) ---------
const ANNOUNCEMENTS = [
  {
    id: 'quiz-2026',
    kicker: '14 maart · Ontmoetingscentrum Genadedal',
    title: 'Scorpio Muziek Quiz',
    cta: 'Schrijf je in',
    start: '2026-01-01T00:00',
    end:   '2026-03-31T23:59',
  },
];
function activeAnnouncement() {
  const now = new Date();
  return ANNOUNCEMENTS.find(a => now >= new Date(a.start) && now <= new Date(a.end)) || null;
}

// --- Hero chip: compact event card in the right column ----------------
function EventChipCard({ a, onClick }) {
  if (!a) return null;
  return (
    <div style={{
      border:'var(--hair) solid var(--ink)', background:'var(--paper)',
      width:300, maxWidth:'100%',
    }}>
      <div style={{
        background:'var(--accent)', color:'var(--ink)',
        padding:'8px 14px',
        fontFamily:'"JetBrains Mono", monospace', fontSize:11,
        letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600,
        borderBottom:'var(--hair) solid var(--ink)',
      }}>✦ Aankondiging</div>
      <div style={{padding:'16px 16px 18px', color:'var(--ink)'}}>
        <div style={{
          fontFamily:'"Archivo", sans-serif', fontWeight:800,
          fontSize:24, lineHeight:1.05, letterSpacing:'-0.01em',
        }}>{a.title}</div>
        <div style={{
          fontFamily:'"JetBrains Mono", monospace', fontSize:12,
          letterSpacing:'0.06em', marginTop:8, opacity:0.7,
        }}>{a.kicker}</div>
        <a onClick={onClick} style={{
          display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer',
          marginTop:16, background:'var(--ink)', color:'var(--paper)',
          padding:'9px 16px',
          fontFamily:'"JetBrains Mono", monospace', fontSize:12,
          letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600,
        }}>{a.cta} <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

function Home({ setRoute, playing, setPlaying, nowPlaying }) {
  const ann = activeAnnouncement();
  const onAnnClick = () => setRoute && setRoute('home'); // placeholder target
  return (
    <>
      {/* HERO ─────────────────────────────────────────────── */}
      <section className="hero" data-screen-label="01 Home — Hero">
        <div className="grid"/>
        <svg className="scorpion" viewBox="0 0 100 80" aria-hidden="true">
          {/* very rough scorpion silhouette */}
          <path d="M20 50 Q25 35 45 38 Q55 35 65 40 Q72 38 75 45 Q70 50 72 55 Q78 50 85 52 Q82 60 75 58 Q72 65 65 62 Q60 70 55 65 Q50 70 45 65 Q35 70 30 60 Q22 60 20 50 Z M75 45 Q85 30 90 18 Q92 12 88 8 Q92 14 90 22 Q86 32 78 42 Z" fill="currentColor"/>
        </svg>
        <div className="inner">
                <div className="hero-head">
            <div>
              <h1>
                RADIO<br/>SCORPIO<br/><em>106<sup style={{fontSize:'0.5em', verticalAlign:'top', lineHeight:1}}>FM</sup></em>
              </h1>   
            <div className="meta">
              <div>
                <b>Sinds 1979</b>
                <span>Vrijwilligersradio Leuven</span>
              </div>
              <div>
                <b>168 uur / week</b>
                <span>Non-stop programma</span>
              </div>
              <div>
                <b>72 vrijwilligers</b>
                <span>Aan de knoppen</span>
              </div>
              <div>
                <b>20+ programma's</b>
                <span>Geen reclame</span>
              </div>
            </div>
          </div>
          </div>
           {ann && (
            <div className="hero-ann">
              <EventChipCard a={ann} onClick={onAnnClick}/>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

window.Home = Home;
