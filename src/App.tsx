import { Routes, Route } from "react-router";
import TestDataPage from "./pages/testDataPage";
import ImageTestPage from "./pages/imageTestPage";

function App() {
  return (
    <Routes>
      <Route path="/testdata" element={<TestDataPage />} />
      <Route path="/imagetest" element={<ImageTestPage />} />
      <Route path="*" element={<h1>Välkommen till GrowPlan 🌿</h1>} />
    </Routes>
  );
}

export default App;
