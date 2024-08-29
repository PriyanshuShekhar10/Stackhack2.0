import Footer from "../components/Footer/Footer";
import MovieComponent from "../components/Movie/MovieComponent";
import BookingComponent from "../components/Movie/BookingComponent.jsx";

import "./moviepage.css";

export default function Movie() {
  return (
    <>
      <MovieComponent />

      <BookingComponent />
      <Footer />
    </>
  );
}
