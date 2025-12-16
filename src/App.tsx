import { Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './hooks/useAuth';

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


function App() {
  const { loading } = useAuth(); 
  if (loading) {
    return <div>Laddar användarstatus...</div>;
  }

  return (
    <>
      <Navigation />
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

        </Route>

        <Route path="*" element={<h1>404 | Sidan hittades inte</h1>} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
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