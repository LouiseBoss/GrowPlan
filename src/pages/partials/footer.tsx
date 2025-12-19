import { PiPlant, PiArrowUpLight } from "react-icons/pi"; // Lagt till en pil
import { FaInstagram, FaFacebook, FaPinterest } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../assets/scss/pages/footer.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <footer className="main-footer">

            <button className="scroll-to-top" onClick={scrollToTop} title="Gå till toppen">
                <PiArrowUpLight />
            </button>

            <div className="footer-content">
                <div className="footer-section brand">
                    <div className="footer-logo">
                        <PiPlant />
                        <span className="logo-text">GrowPlan</span>
                    </div>
                    <p>Din personliga guide till en blomstrande trädgård, zon för zon.</p>
                </div>

                <div className="footer-section links">
                    <h4>Navigering</h4>
                    <ul>
                        <li><Link to="/">Hem</Link></li>
                        <li><Link to="/plants">Hitta växter</Link></li>
                        <li><Link to="/garden">Min trädgård</Link></li>
                    </ul>
                </div>

                <div className="footer-section social">
                    <h4>Följ oss</h4>
                    <div className="social-icons">
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaPinterest /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} GrowPlan. Alla rättigheter reserverade.</p>
            </div>
        </footer>
    );
};

export default Footer;