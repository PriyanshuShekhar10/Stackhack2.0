import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Movie from "./pages/Movie"
import Cinemas from "./pages/Cinemas"
import Home from "./pages/Home"
import Films from "./pages/Films"
// import GoogleLoginButton from "./components/GoogleLoginButton"

function App() {

  return (
    <Routes>
       <Route path='/login' element={<Login/>} />
       <Route path='/signup' element={<Signup/>} />
       <Route path="/movie/:id" element={<Movie />} />
       <Route path="/cinemas" element={<Cinemas />} />
       <Route path="/films" element={<Films />} />

       <Route path="/" element={<Home />} />

    </Routes>
  )
}

export default App



