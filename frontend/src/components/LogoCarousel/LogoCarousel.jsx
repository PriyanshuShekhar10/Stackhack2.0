/* eslint-disable react/jsx-key */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./LogoCarousel.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const LogoCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
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

  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/ads")
      .then((response) => setAds(response.data))
      .catch((error) => {
        console.error("There was an error fetching the ads!", error);
      });
  }, []);

  console.log(ads);
  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {ads.map((ad, i) => (
          <div key={i} className={styles.slide}>
            <img
              src={ad.AdvertUrl}
              alt={`Ad ${i}`}
              className={styles.logoImage}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LogoCarousel;
