import { HashRouter, Routes, Route } from "react-router-dom";
import { ProtectedPage } from "./components/ProtectedPage";
import { RootLayout } from "@/RootLayout";
import "./index.css";
//Pages
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { DashboardPage } from "@/pages/Dashboard";
import { NewCompetition } from "./pages/NewCompetition";
import { CompanyPage } from "./pages/CompanyPage";
// import { Live } from "./pages/Live";
// import { ManageCompetitions } from "./pages/ManageCompetitions";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedPage />}>
          <Route index element={<DashboardPage />} />1
          <Route path="/new-competition" element={<NewCompetition />} />
          <Route path="/companies" element={<CompanyPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
