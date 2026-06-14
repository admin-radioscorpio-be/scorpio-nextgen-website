// colofon.jsx — Colofon: wie zijn we + contactgegevens

function Colofon({ setRoute }) {
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
      <section data-screen-label="Colofon — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Colofon · Over Radio Scorpio</div>
            <h1>Wie<br/>zijn we</h1>
          </div>
          <div className="aside">
            // Sinds 18.08.1979<br/>
            <b>Oudste vrije radio</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              van België — nog steeds in de ether.
            </span>
          </div>
        </div>
      </section>

      <main className="shell" data-screen-label="Colofon — Content" style={{paddingTop: 0}}>

        {/* ABOUT ─────────────────────────────────────────── */}
        <div className="cf-about">
          <div className="cf-lead">
            <p>
              Wij zijn een Leuvense, onafhankelijke radiozender. De naam
              "Scorpio" slaat niet alleen op de schorpioen in het logo, maar
              verwijst als letterwoord ook naar de doelstellingen van de zender.
            </p>
            <div className="cf-acronym">
              <span className="cf-letters">S.C.O.R.P.I.O.</span>
              <span className="cf-expand">
                Socio-Culturele Organisatie voor Regionale Pluralistische
                Informatie-Overdracht
              </span>
            </div>
          </div>

          <div className="cf-body">
            <p>
              We kunnen met enige fierheid zeggen dat we de oudste vrije
              radiozender van België zijn (°1979-08-18) die vandaag nog in de
              ether is. De samenstelling van onze leden, zo'n dikke 140, bestaat
              uit een mooie mix van studenten en Leuvenaars. Dit zorgt voor een
              belangrijke lokale verankering in het Leuvense cultuurlandschap.
            </p>
            <p>
              Wat je op Radio Scorpio hoort is vrij uniek. Wij bieden de
              luisteraar wat op andere zenders geen of weinig plaats krijgt. We
              zijn een progressieve radio en zoeken de muzikale en experimentele
              kantjes van radio op. Overdag zenden we non-stop alternatieve
              muziek uit. In de vooravond bieden we nieuws en cultuur. Vanaf acht
              uur start een rist gespecialiseerde muziekprogramma's.
            </p>
            <p>
              Ook draait onze werking uitsluitend op supergemotiveerde, creatieve
              vrijwilligers. Last but not least mijden we alle ethervervuilende
              reclame op onze zender.
            </p>
            <a className="cf-wiki" href="https://nl.wikipedia.org/wiki/Radio_Scorpio"
               target="_blank" rel="noopener">
              Scorpio op Wikipedia →
            </a>
          </div>
        </div>

        {/* CONTACT ───────────────────────────────────────── */}
        <div id="colofon-contact" className="cf-contact">
          <div className="cf-contact-hd">
            <div className="eyebrow" style={{color:'var(--ink)'}}>// Contactgegevens</div>
            <h2>Vind ons.</h2>
          </div>

          <div className="cf-contact-grid">
            {/* address / legal */}
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

            {/* email directory */}
            <div className="cf-mails">
              {EMAILS.map(([label, mail], i) => (
                <a className="cf-mail-row" key={i} href={'mailto:' + mail}>
                  <span className="cf-mail-label">{label}</span>
                  <span className="cf-mail-addr">{mail}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

window.Colofon = Colofon;
