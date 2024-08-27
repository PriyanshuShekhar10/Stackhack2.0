import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Advertisement.module.css"; // Import the CSS module

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [adUrl, setAdUrl] = useState("");

  useEffect(() => {
    // Fetch the ads from the backend
    axios
      .get("http://localhost:8000/admin/ads")
      .then((response) => {
        setAds(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the ads!", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:8000/admin/ads",
        {
          AdvertUrl: adUrl, // This is the data being sent in the POST request
        },
        {
          withCredentials: true, // This is the Axios configuration to include cookies
        }
      )
      .then((response) => {
        setAds([...ads, response.data]); // Add the new ad to the list
        setAdUrl(""); // Clear the input field
      })
      .catch((error) => {
        console.error("There was an error submitting the ad!", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/admin/ads/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setAds(ads.filter((ad) => ad._id !== id)); // Remove the deleted ad from the list
      })
      .catch((error) => {
        console.error("There was an error deleting the ad!", error);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ad Management</h1>

      {/* Form to submit new ads */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={adUrl}
          onChange={(e) => setAdUrl(e.target.value)}
          placeholder="Enter Advertisement URL"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.submit}>
          Submit Ad
        </button>
      </form>

      {/* Display all ads */}
      <div className={styles.adsContainer}>
        {ads.map((ad) => (
          <div key={ad._id} className={styles.adItem}>
            <img
              src={ad.AdvertUrl}
              alt="Advertisement"
              className={styles.adImage}
            />
            <button
              onClick={() => handleDelete(ad._id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdManagement;
