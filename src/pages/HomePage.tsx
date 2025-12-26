import React from 'react';
import { Link } from 'react-router-dom';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import '../assets/scss/pages/HomePage.scss';
import plantAnimation from '../assets/animations/plant.lottie';

import { SlCalender } from "react-icons/sl";
import { GiGreenhouse } from "react-icons/gi";
import { TbSnowflake } from "react-icons/tb";
import { ImHeart } from "react-icons/im";
import { MdOutlineMenuBook } from "react-icons/md";
import { TfiPencilAlt } from "react-icons/tfi";

interface FeatureBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => (
    <div className="feature-box">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const PRIMARY_ICON_COLOR = "#3A4A3D";
const ICON_SIZE = 40;

const HomePage = () => {
    return (
        <div className="home-page-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Din personliga trädgårdskamrat</h1>
                    <p>
                        Planera, följ upp och sköt om dina växter med lätthet – oavsett om de står i trädgården eller i fönstret.
                        Från säsongsbetonade sysslor till personliga önskelistor, allt du behöver för att skapa ditt eget gröna paradis.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth" className="btn btn-primary-hero">Starta din trädgård</Link>
                        <Link to="/plants" className="btn btn-secondary-hero">Utforska växter</Link>
                    </div>
                </div>

                <div className="hero-image-placeholder">
                    <div className="lottie-animation-container" style={{ width: '100%', height: '400px' }}>
                        <DotLottiePlayer
                            src={plantAnimation}
                            autoplay
                            loop
                        />
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Allt dina växter behöver</h2>
                <p className="subtitle">Enkla verktyg som hjälper dina växter att frodas året runt</p>

                <div className="features-grid">
                    <FeatureBox
                        icon={<SlCalender size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Säsongskalender"
                        description="Håll koll på dina trädgårdssysslor med vår månatliga/årliga översikt som täcker vattning, beskärning och gödsling."
                    />
                    <FeatureBox
                        icon={<TfiPencilAlt size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Personliga uppgifter"
                        description="Skapa anpassade uppgifter specifikt för dina behov och spåra viktiga skötselaktiviteter för dina växter"
                    />
                    <FeatureBox
                        icon={<ImHeart size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Växtönskelista"
                        description="Dröm och planera din perfekta trädgård. Spara växter du vill skaffa"
                    />
                    <FeatureBox
                        icon={<GiGreenhouse size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Inomhus och Utomhus"
                        description="Sköt om både dina krukväxter inomhus och utomhusrabatter med specialiserade skötselguider för varje miljö."
                    />
                    <FeatureBox
                        icon={<TbSnowflake size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Vinterförvaring"
                        description="Skydda dina växter under de kalla månaderna. Planera för korrekt förvaring av krukväxter, täckning av täckmaterial och allmän vintervård."
                    />
                    <FeatureBox
                        icon={<MdOutlineMenuBook size={ICON_SIZE} color={PRIMARY_ICON_COLOR} />}
                        title="Skötselråd"
                        description="Få tillgång till omfattande skötselinformation och bästa praxis för vattning, solljus och jord"
                    />
                </div>
            </section>

            <section className="how-it-works-section">
                <h2>Hur det funkar</h2>
                <p className="subtitle">Börja din trädgårdsresa i tre enkla steg</p>
                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <h3>Skapa din profil</h3>
                        <p>Registrera dig, konfigurera din första trädgård så att den spårar allt åt dig.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <h3>Lägg till dina växter</h3>
                        <p>Bygg upp ditt trädgårdsinventarium och lägg till de specifika växter du äger, för att få prognoser för framtida uppgifter.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">3</span>
                        <h3>Se dem växa</h3>
                        <p>Följ din personliga plan, slutför uppgifter och se din trädgård frodas under alla årstiderna.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;