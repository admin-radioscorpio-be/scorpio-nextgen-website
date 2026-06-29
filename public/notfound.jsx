// notfound.jsx — 404 page

function NotFound({ navigate }) {
  return (
    <>
      <section data-screen-label="404 — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ 404</div>
            <h1>
              We hebben<br/>
              <span style={{color:'var(--mute)'}}>veel.</span>
            </h1>
          </div>
          <div className="aside">
            // Niet gevonden<br/>
            <b>Maar niet dit.</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Moet iets heel<br/>obscuur zijn.
            </span>
          </div>
        </div>
      </section>

      <main className="shell" style={{paddingTop:0, paddingBottom:120}}>
        <div style={{
          borderTop: '1px solid var(--ink)',
          paddingTop: 48,
          maxWidth: 680,
        }}>
          <p style={{
            fontFamily: '"Archivo", sans-serif',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 500,
            lineHeight: 1.45,
            marginBottom: 40,
          }}>
            We leveren 168 uur radio per week, twintig-plus stemmen en een archief
            vol niche. Maar de pagina die je zocht bestaat niet — of toch niet meer.
          </p>
          <button className="play-cta" onClick={() => navigate('home')}>
            <span className="ico"><Ic.arrow/></span>
            Terug naar home
          </button>
        </div>
      </main>
    </>
  );
}

window.NotFound = NotFound;
