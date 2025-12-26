import { Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import plantAnimation from './assets/animations/loading.lottie';
import "./assets/scss/main.scss";

import ProtectedRoute from './components/ProtectedRoute';

import AuthPage from "./pages/AuthPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import OverviewPage from "./pages/OverviewPage";
import HomePage from "./pages/HomePage";
import PlantListPage from "./pages/PlantListPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import CalendarPage from "./pages/CalendarPage";
import Navigation from "./pages/partials/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import GardenPage from "./pages/MyGardenPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./pages/partials/footer";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
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
      )}
      <div className="app-wrapper">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plants" element={<PlantListPage />} />
            <Route path="/plant/:id" element={<PlantDetailPage />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />

      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        theme="light"
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;