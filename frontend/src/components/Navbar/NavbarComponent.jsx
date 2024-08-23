import { useState, useEffect } from "react";
import {
  CButton,
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
  CForm,
  CFormInput,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { toast } from "react-toastify";

export default function NavbarComponent() {
  const [visible, setVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Call the /checklogin API to check if the user is authenticated
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          "https://stackhack2-0-backend.onrender.com/auth/checklogin",
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }
        );
        const data = await response.json();

        if (data.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [isAuthenticated]); 

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://stackhack2-0-backend.onrender.com/auth/logout",
        {
          method: "GET",
          credentials: "include", // Include cookies in the request
        }
      );
      const data = await response.json();
      setIsAuthenticated(false);

      if (data.ok) {
        setIsAuthenticated(false);
        toast.info("You've been logged out!");
      }
    } catch (error) {
      toast.error(error);
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <CNavbar expand="lg" className="bg-transparent">
        <CContainer fluid className="padded-container">
          <CNavbarToggler
            style={{ color: "white", borderColor: "white" }}
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CNavbarBrand
            href="/"
            className="new-amsterdam-regular"
            style={{ color: "white", fontSize: "2rem" }}
          >
            ScreenCode
          </CNavbarBrand>
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="monospace-text me-auto mb-2 mb-lg-0">
              <CNavItem>
                <CNavLink style={{ color: "white" }} href="/films" active>
                  Films
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink style={{ color: "white" }} href="/cinemas">
                  Cinemas
                </CNavLink>
              </CNavItem>
              <CNavItem>
                {isAuthenticated && (
                  <CNavLink style={{ color: "blue" }} href="/profile">
                    My Profile
                  </CNavLink>
                )}
              </CNavItem>
            </CNavbarNav>
            <CForm className="monospace-text d-flex me-3">
              <CFormInput
                type="search"
                className="me-2"
                placeholder="Search Movies"
              />
              <CButton
                style={{ color: "white", width: "5px" }}
                type="submit"
                color=""
                variant="outline"
              >
                🔍
              </CButton>
            </CForm>
            {isAuthenticated ? (
              <CNavLink style={{ color: "blue" }}>
                    <button className="button-6 monospace-text" onClick={handleLogout}>Logout</button>
                  </CNavLink>
            ) : (
              <CNavLink style={{ color: "white" }} href="/login">
                    <button className="button-6 monospace-text">Login</button>
                  </CNavLink>
            )}
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
}


