import { Routes, Route } from "react-router-dom";

// Pages
import PlusOneTV from "@/pages/home";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin-view/admin-layout";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<PlusOneTV />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminLayout />} />  
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
