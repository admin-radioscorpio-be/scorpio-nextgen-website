// cookies.jsx — Cookiebeleid

function CookieBeleid() {
  return (
    <>
      <section data-screen-label="Cookies — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Cookiebeleid</div>
            <h1>Cookies</h1>
          </div>
          <div className="aside">
            // Laatste update<br/>
            <b>15 juni 2026</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Alleen functionele cookies.<br/>Geen tracking.
            </span>
          </div>
        </div>
      </section>

      <main className="shell ck-doc" data-screen-label="Cookies — Beleid" style={{paddingTop:0, paddingBottom:80}}>

        <section className="ck-section">
          <h2>1. Introductie</h2>
          <p>
            Op onze site, <a href="https://www.radioscorpio.be">https://www.radioscorpio.be</a> (hierna: "de site"),
            wordt gebruikgemaakt van cookies. In dit document informeren wij je over het gebruik van cookies op onze site.
          </p>
          <p>
            Wij zijn Radio Scorpio VZW, een onafhankelijke, niet-commerciële radiozender zonder advertentiemodel.
            Wij plaatsen uitsluitend functionele cookies die noodzakelijk zijn voor het goed functioneren van de site.
            Wij plaatsen geen tracking- of marketingcookies en maken geen gebruik van advertentienetwerken.
          </p>
        </section>

        <section className="ck-section">
          <h2>2. Wat zijn cookies?</h2>
          <p>
            Een cookie is een klein bestand dat samen met pagina's van deze site wordt verzonden en door je browser
            op je apparaat wordt opgeslagen. De daarin opgeslagen informatie kan tijdens een volgend bezoek terug
            worden gestuurd naar onze server.
          </p>
        </section>

        <section className="ck-section">
          <h2>3. Functionele cookies</h2>
          <p>
            Functionele cookies zorgen ervoor dat bepaalde onderdelen van de site goed werken en dat je voorkeuren
            worden onthouden. Wij plaatsen functionele cookies zonder dat je hier afzonderlijk toestemming voor hoeft
            te geven, omdat deze strikt noodzakelijk zijn voor het functioneren van de site.
          </p>
          <p>
            Concreet gebruiken wij een cookie om je cookievoorkeur (accepteren of weigeren) op te slaan, zodat
            de toestemmingsvraag niet bij elk bezoek opnieuw verschijnt.
          </p>
        </section>

        <section className="ck-section">
          <h2>4. Geplaatste cookies</h2>
          <div className="ck-table">
            <div className="ck-row ck-row-hd">
              <span>Dienst</span>
              <span>Categorie</span>
              <span>Doel</span>
            </div>
            <div className="ck-row">
              <span>radioscorpio.be</span>
              <span className="ck-tag">Functioneel</span>
              <span>Opslaan van cookievoorkeur</span>
            </div>
          </div>
          <p style={{marginTop:20}}>
            Wij maken momenteel geen gebruik van statistieken- of marketingcookies. Mocht dit in de toekomst
            veranderen, dan passen wij dit beleid aan en vragen wij voorafgaand je toestemming.
          </p>
        </section>

        <section className="ck-section">
          <h2>5. Cookies in- en uitschakelen</h2>
          <p>
            Je kunt via je internetbrowser cookies uitschakelen of verwijderen. Raadpleeg de helpfunctie van je
            browser voor de exacte stappen. Let op: als je functionele cookies uitschakelt, is het mogelijk dat
            onderdelen van de site niet meer correct werken.
          </p>
          <p>
            Als je cookies in je browser verwijdert, wordt je cookievoorkeur gewist en verschijnt bij een
            volgend bezoek opnieuw de toestemmingsvraag.
          </p>
        </section>

        <section className="ck-section">
          <h2>6. Je rechten met betrekking tot persoonsgegevens</h2>
          <p>Je hebt de volgende rechten met betrekking tot je persoonsgegevens:</p>
          <ul className="ck-list">
            <li>Het recht om te weten waarom je persoonsgegevens nodig zijn, wat ermee gebeurt en hoe lang ze worden bewaard.</li>
            <li>Recht op inzage: je kunt een verzoek indienen om inzage in de gegevens die we van je verwerken.</li>
            <li>Recht op rectificatie en aanvulling: je hebt het recht om je persoonlijke gegevens aan te vullen, te corrigeren, te verwijderen of te blokkeren.</li>
            <li>Recht op intrekking: als je ons toestemming geeft om je gegevens te verwerken, heb je het recht om die toestemming in te trekken en je gegevens te laten verwijderen.</li>
            <li>Recht op overdraagbaarheid: je hebt het recht om je persoonlijke gegevens op te vragen en over te dragen aan een andere verwerkingsverantwoordelijke.</li>
            <li>Recht op bezwaar: je kunt bezwaar maken tegen de verwerking van je gegevens.</li>
          </ul>
          <p>
            Om deze rechten uit te oefenen, neem je contact op via de onderstaande contactgegevens.
            Je hebt ook het recht om een klacht in te dienen bij de toezichthoudende autoriteit,
            de <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">Gegevensbeschermingsautoriteit</a>.
          </p>
        </section>

        <section className="ck-section">
          <h2>7. Contactinformatie</h2>
          <p>
            Voor vragen of opmerkingen over ons cookiebeleid kun je contact met ons opnemen:
          </p>
          <div className="ck-contact">
            <div><b>Scorpio VZW</b></div>
            <div>Stapelhuisstraat 13–15</div>
            <div>3000 Leuven, België</div>
            <div style={{marginTop:8}}>
              <a href="https://www.radioscorpio.be">https://www.radioscorpio.be</a>
            </div>
            <div><a href="mailto:contact@radioscorpio.be">contact@radioscorpio.be</a></div>
          </div>
        </section>

      </main>
    </>
  );
}

window.Cookies = CookieBeleid;
