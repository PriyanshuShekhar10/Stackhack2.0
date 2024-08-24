import Footer from "../components/Footer/Footer";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Image from '../assets/cinema.jpg'

export default function Cinemas() {
  return (
    <><NavbarComponent/>

    <img src={Image} alt="" style={{width: '100vw'}} />

    <div><h2>Cinemas</h2></div>

    
    <Footer/>
    </>
  )
}
