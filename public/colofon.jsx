// colofon.jsx — Contact: vind ons

function Colofon() {
  const EMAILS = [
    ["demo's, tracks (nl)",            'muziek@radioscorpio.be'],
    ["demo's, tracks (international)", 'music@radioscorpio.be'],
    ['regionaal nieuws, cultuurnieuws', 'nieuws@radioscorpio.be'],
    ['voorstel programma',             'programmatieraad@radioscorpio.be'],
    ['vrijwilligerswerk bij Scorpio',  'programmatieraad@radioscorpio.be'],
    ['algemene vragen',                'contact@radioscorpio.be'],
    ['technische vragen',              'techniek@radioscorpio.be'],
  ];

  return (
    <>
      <section data-screen-label="Contact — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Contact · Contacteer ons</div>
            <h1>Contacteer<br/>ons</h1>
          </div>
          <div className="aside">
            // Contactgegevens<br/>
            <b>Radio Scorpio VZW</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Stapelhuisstraat 13–15, Leuven
            </span>
          </div>
        </div>
      </section>

      <main className="shell" data-screen-label="Contact — Content" style={{paddingTop: 0, paddingBottom: 80}}>
        <div className="cf-contact-grid" style={{borderTop: '2px solid var(--ink)', marginTop: 8}}>
          <div className="cf-card">
            <div className="cf-org">v.z.w. Radio Scorpio</div>
            <address className="cf-addr">
              Stapelhuisstraat 13 – 15<br/>
              3000 Leuven
            </address>
            <dl className="cf-legal">
              <div>
                <dt>Rekeningnummer</dt>
                <dd>BE50 0010 7937 9018</dd>
              </div>
              <div>
                <dt>Ondernemingsnummer</dt>
                <dd>0420.094.033</dd>
              </div>
            </dl>
          </div>

          <div className="cf-mails">
            {EMAILS.map(([label, mail], i) => (
              <a className="cf-mail-row" key={i} href={'mailto:' + mail}>
                <span className="cf-mail-label">{label}</span>
                <span className="cf-mail-addr">{mail}</span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

window.Colofon = Colofon;
