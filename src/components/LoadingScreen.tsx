import { DotLottiePlayer } from '@dotlottie/react-player';
import plantAnimation from '../assets/animations/loading.lottie';

const LoadingScreen = () => (
    <div className="loading-overlay">
        <div className="loader-content">
            <div className="lottie-player">
                <DotLottiePlayer
                    src={plantAnimation}
                    autoplay
                    loop
                />
            </div>
            <p>Grönskan förbereds...</p>
        </div>
    </div>
);

export default LoadingScreen;