import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/main-layout";
import Home from "./pages/home";
import NonAuth from "./providers/NonAuth";
import RequireAuth from "./providers/RequireAuth";
import AuthForm from "./pages/auth";
import PersistAuth from "./providers/PersistAuth";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<PersistAuth />}>
            <Route element={<NonAuth />}>
              <Route path="/login" element={<AuthForm mode="login" />} />
              <Route path="/signup" element={<AuthForm mode="signup" />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
