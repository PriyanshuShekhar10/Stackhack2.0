import Footer from "../components/Footer/Footer";
import LogoCarousel from "../components/LogoCarousel";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import ScrollComponent from "../components/ScrollComponent/ScrollComponent";
import "./home.css";

export default function Home() {
  return (
    <>
      <NavbarComponent />
      <LogoCarousel />
      <div className="padded-container">
        <ScrollComponent />
      </div>
      <Footer />
    </>
  );
}
