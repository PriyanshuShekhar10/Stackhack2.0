import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import {
  FaBars,
  FaBook,
  FaTh,
  FaThinkPeaks,
  FaTv,
  FaUsers,
} from "react-icons/fa";
import { MdMovieEdit } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

export default function SidebarComponent({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Call the /checklogin API to check if the user is authenticated
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/admin/checklogin", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();

        if (data.ok) {
          setIsAuthenticated(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Make a request to the backend to invalidate the session
      const response = await fetch("http://localhost:8000/admin/logout", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();

      if (data.ok) {
        // Remove the cookie from the browser
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login after successful logout
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItem = [
    { path: "/", name: "Dashboard", icon: <FaTh /> },
    { path: "/advertisement", name: "Advertisement", icon: <FaThinkPeaks /> },
    { path: "/cinema", name: "Cinema", icon: <FaTv /> },
    { path: "/movies", name: "Movies", icon: <MdMovieEdit /> },
    { path: "/reservations", name: "Reservations", icon: <FaBook /> },
    { path: "/users", name: "Users", icon: <FaUsers /> },
    {
      path: "#",
      name: "Logout",
      icon: (
        <div style={{ color: "white" }} onClick={handleLogout}>
          <CiLogout />
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            ScreenCode
          </h1>
          <div style={{ marginLeft: isOpen ? "30px" : 0 }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>

        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
          >
            <div className="items" style={{ fontSize: "20px" }}>
              {item.icon}
            </div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>

      <main>{children}</main>
    </div>
  );
}
