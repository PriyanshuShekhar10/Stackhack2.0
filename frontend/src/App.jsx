import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Movie from "./pages/Movie"
// import GoogleLoginButton from "./components/GoogleLoginButton"

function App() {

  return (
    <Routes>
       <Route path='/login' element={<Login/>} />
       <Route path='/signup' element={<Signup/>} />
       <Route path="/movie/:id" element={<Movie />} />
       
    </Routes>
  )
}

export default App



