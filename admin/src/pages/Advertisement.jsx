import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

export default function Advertisement() {
  const [ads, setAds] = useState([]);
  const [formData, setFormData] = useState({ adUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/ads", {
        withCredentials: true,
      });
      if (response.data.ok) {
        setAds(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `http://localhost:8000/admin/ads/${selectedAd._id}`
        : "http://localhost:8000/admin/ads";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](url, formData, {
        withCredentials: true,
      });

      if (response.data.ok) {
        alert(
          isEditing
            ? "Advertisement updated successfully!"
            : "Advertisement created successfully!"
        );
        fetchAds();
        setFormData({ adUrl: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving advertisement:", error);
    }
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setFormData({ adUrl: ad.adUrl });
    setIsEditing(true);
  };

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/admin/ads/${adId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          alert("Advertisement deleted successfully!");
          fetchAds();
        }
      } catch (error) {
        console.error("Error deleting advertisement:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>{isEditing ? "Edit Advertisement" : "Add New Advertisement"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Advertisement URL:</label>
            <input
              type="text"
              name="adUrl"
              value={formData.adUrl}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">
            {isEditing ? "Update Advertisement" : "Create Advertisement"}
          </button>
        </form>

        <h2>Advertisements List</h2>
        {ads.length > 0 ? (
          <ul>
            {ads.map((ad) => (
              <li key={ad._id}>
                <a href={ad.adUrl} target="_blank" rel="noopener noreferrer">
                  {ad.adUrl}
                </a>
                <button onClick={() => handleEdit(ad)}>Edit</button>
                <button onClick={() => handleDelete(ad._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No advertisements available.</p>
        )}
      </div>
    </>
  );
}
