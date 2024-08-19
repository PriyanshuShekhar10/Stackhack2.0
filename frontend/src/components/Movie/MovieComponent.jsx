// import React from 'react'
import { useParams } from "react-router-dom";
// import {  useState, useEffect } from "react";

import "./movie.css";
import YoutubeModal from "../YoutubeModal";
import { useState } from "react";
// import NavbarComponent from "../../components/Navbar/NavbarComponent";

const moviesData = {
  movies: [
    {
      id: "1",
      title: "Alien : Romulus",
      director: "Fede Alvarez",
      cast: ["Cailee Spaeny", "Isabela Merced", "Archie Renaux"],
      synopsis:
        "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
      posterUrl:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Alien_Romulus_2024_%28poster%29.jpg",
        trailer: 'https://www.youtube.com/watch?v=x0XDEhP4MQs',
      coverUrl:
        "https://npr.brightspotcdn.com/dims3/default/strip/false/crop/1300x730+0+0/resize/1100/quality/85/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F37%2F8f%2F4372aeea436abb53f929d28a781f%2Fg-alienromulus-3216-1-4875ffa5.jpg",
    },
    {
      id: "2",
      title: "Interstellar Journey",
      director: "Christopher Nolan",
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      synopsis:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl:
        "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        coverUrl: 'https://i.ytimg.com/vi/6W6XMvYH0Xs/sddefault.jpg'
    },
  ],
};

export default function MovieComponent() {

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { id } = useParams();
  // const [movie, setMovie] = useState(null)
  console.log(id);
  // setMovie(moviesData.movies[0])
  const movie = moviesData.movies[id];

  // useEffect(() => {
  //         fetch(`http://localhost:3000/movie/:${id}`).then(response => response.json()).then(data => setMovie(data)).catch(error => console.log(error))
  // }, [id])
  // if (!movie) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div>
      {/* <NavbarComponent/> */}
      <div className="movie-container  ">
        <div className="cover-image-container">
          <img className="cover-image inset-shadow" src={movie.coverUrl} alt="" />
        </div>

        <div className="movie-details">
          <div className="movie-main">
            <img className="poster" src={movie.posterUrl} alt={movie.title} />
            <div className="title new-amsterdam-regular"><h1>{  movie.title.toUpperCase()}</h1></div>
            
          </div>
          <div className="movie-other-details monospace-text">
            <p>
              <strong>DIRECTORS:</strong> <br /><br />
              {movie.director}
            </p>
            <p>
              <strong>CAST:</strong>
              <br /> <br />{movie.cast.join(", ")}
            </p>
            <p>
              <strong>SYNOPSIS:</strong>
              <br /><br /> {movie.synopsis}
            </p>
            <div className="mobile-trailer show">
              <button className="button-86"><a href={movie.trailer}>Watch Trailer</a></button>
            </div>
             <div className="trailer-button hide">
              <button className="button-86" onClick={!modalIsOpen ?openModal: closeModal} >{!modalIsOpen ?'Watch': 'Close'} Trailer</button>
            </div>
            <YoutubeModal
            isOpen={modalIsOpen}
            onClose={closeModal}
            videoId={movie.trailer.split('=')[1]}
            />
          </div>
        </div>
        
      </div>
      
    </div>
  );
}