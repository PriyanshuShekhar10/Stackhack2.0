import Footer from "../components/Footer/Footer";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import ScrollComponent from "../components/ScrollComponent/ScrollComponent";

export default function Home() {
  return (
   <>
   <NavbarComponent/>
   Book tickets
   <div style={{padding: '10rem'}}>
    
   <ScrollComponent />
   </div>
   <Footer/>
   </>
  )
}
