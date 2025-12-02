import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{ padding: 30 }}>

            <section style={{ marginBottom: 40, textAlign: 'center' }}>
                <h1>Välkommen till GrowPlan 🌿</h1>
                <p>Hitta din perfekta växt, lär dig hur du tar hand om den och planera ditt schema.</p>
                <div style={{ marginTop: 20 }}>
                    <Link to="/auth" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                        Skapa konto / Logga in
                    </Link>
                </div>
            </section>

            <section style={{ border: '1px solid #eee', padding: 20, borderRadius: '8px', marginBottom: 40 }}>
                <h2>Se funktioner innan du loggar in:</h2>
                <ul>
                    <li>✅ **Sök & Filtrera:** Hela vår växtkatalog är tillgänglig för sökning.</li>
                    <li>❌ **Personlig kalender:** Låst! Spara dina växter och få smarta påminnelser.</li>
                    <li>❌ **Önskelista:** Låst! Håll koll på växter du vill köpa i framtiden.</li>
                    <li>❌ **Min Trädgård:** Låst! Se en översikt av allt du äger.</li>
                </ul>
                <p style={{ marginTop: 15 }}>*Du behöver ett konto för att låsa upp de personliga funktionerna.</p>
            </section>

            <section>
                <h2>Sök i vår katalog (Publikt):</h2>

            </section>
        </div>
    );
}

export default HomePage;