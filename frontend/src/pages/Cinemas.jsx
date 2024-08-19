import Footer from "../components/Footer/Footer";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Image from '../assets/cinema.jpg'

export default function Cinemas() {
  return (
    <><NavbarComponent/>

    <img src={Image} alt="" />

    <div><h2>Cinemas</h2></div>

    
    <Footer/>
    </>
  )
}
