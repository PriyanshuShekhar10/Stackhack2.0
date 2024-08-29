import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Footer from "../components/Footer/Footer";
import styles from "./Profile.module.css"; // Create a CSS module for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/auth/getuser`,
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          setUser(response.data.data); // Assuming response.data.data contains the user object
        } else {
          toast.error(response.data.message);
          navigate("/login"); // Redirect to login if not authenticated
        }
      } catch (err) {
        toast.error("Failed to fetch user data");
        console.error("Error fetching user data:", err);
        navigate("/login"); // Redirect to login if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent />
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <h2>User Profile</h2>
          {user ? (
            <div className={styles.userDetails}>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>City:</strong> {user.city}
              </p>
              <h3>Bookings</h3>
              <ul>
                {user.bookings.length > 0 ? (
                  user.bookings.map((booking, index) => (
                    <li key={index}>{booking}</li>
                  ))
                ) : (
                  <li>No bookings found</li>
                )}
              </ul>
            </div>
          ) : (
            <p>User data not available</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
