import { Routes, Route } from "react-router";
import TestDataPage from "./pages/testDataPage";
import ImageTestPage from "./pages/imageTestPage";
import AuthPage from "./pages/AuthPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import { useAuth } from './hooks/useAuth';
import OverviewPage from "./pages/OverviewPage";
import HomePage from "./pages/HomePage";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Laddar användarstatus...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/testdata" element={<TestDataPage />} />
      <Route path="/imagetest" element={<ImageTestPage />} />

      {/* 2. Authentication/Inloggningssidor */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />

      {/* 3. Skyddad Översikt (Används efter inloggning) */}
      {/* Om inloggad: Visa OverviewPage. Om utloggad: Skicka tillbaka till AuthPage/Login */}
      <Route path="/overview" element={user ? <OverviewPage /> : <AuthPage />}
      />

      {/* Fångar alla okända URL:er */}
      <Route path="*" element={<h1>404 | Sidan hittades inte</h1>} />
    </Routes>
  );
}

export default App;
