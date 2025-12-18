import { Routes, Route } from "react-router-dom";

// Pages
import PlusOneTV from "@/pages/home";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<PlusOneTV />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
