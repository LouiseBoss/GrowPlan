
import { Link } from 'react-router-dom';
import '../assets/scss/pages/NotFoundPage.scss';
import errorImage from '../assets/images/sad_plant.jpg'; 

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <img src={errorImage} alt="Växte lite fel" className="error-image" />
                <h1>Hoppsan!</h1>
                <p>Det verkar som att den här sidan har vissnat eller aldrig planterats.</p>
                <Link to="/" className="btn btn-primary-hero">Tillbaka till trädgården</Link>
            </div>
        </div>
    );
};

export default NotFoundPage;