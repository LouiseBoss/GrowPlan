import { Routes, Route } from "react-router";
import TestDataPage from "./pages/testDataPage";
import AuthPage from "./pages/AuthPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import { useAuth } from './hooks/useAuth';
import OverviewPage from "./pages/OverviewPage";
import HomePage from "./pages/HomePage";
import PlantListPage from "./pages/PlantListPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Laddar användarstatus...</div>;
  }

 return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/testdata" element={<TestDataPage />} />
        <Route path="/plants" element={<PlantListPage />} />
        <Route path="/plant/:id" element={<PlantDetailPage />} />


        {/* Authentication/Inloggningssidor */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        {/* Skyddad Översikt (Används efter inloggning) */}
        <Route path="/overview" element={user ? <OverviewPage /> : <AuthPage />} />

        {/* Fångar alla okända URL:er */}
        <Route path="*" element={<h1>404 | Sidan hittades inte</h1>} />
      </Routes>

      {/* TOAST CONTAINER: Läggs utanför Routes så att den alltid är synlig */}
      <ToastContainer 
        position="top-right" // Position på skärmen (t.ex. nere till höger)
        autoClose={4000}       // Stängs automatiskt efter 4 sekunder
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
