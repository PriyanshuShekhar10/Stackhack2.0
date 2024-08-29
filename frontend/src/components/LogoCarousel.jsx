import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./LogoCarousel.module.css";

const LogoCarousel = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    // Fetch logos (advertisements) from the backend
    const fetchLogos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/admin/ads`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          setLogos(response.data.data);
        } else {
          console.error("Failed to fetch logos.");
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {logos.map((logo) => (
          <div key={logo._id} className={styles.slide}>
            <img src={logo.adUrl} alt="Logo" className={styles.logoImage} />
          </div>
        ))}
      </Slider>
      <p className={styles.description}>
        Get to know us in 120 Seconds, Watch the video!
      </p>
    </div>
  );
};

export default LogoCarousel;
