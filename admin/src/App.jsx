import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cinema from "./pages/Cinema";
import Advertisement from "./pages/Advertisement";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Movies from "./pages/Movies";
import SidebarComponent from "./components/SidebarComponent";
import "./App.css";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route
              path="*"
              element={
                <SidebarComponent>
                  <Routes>
                    <Route path="/advertisement" element={<Advertisement />} />
                    <Route path="/cinema" element={<Cinema />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/users" element={<Users />} />
                  </Routes>
                </SidebarComponent>
              }
            />
          </Route>
          {/* Routes with Sidebar */}

          {/* Login Route without Sidebar */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
