import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {

        e.preventDefault()
        await login(email, password)
        // console.log(email, password)
    }

  return (

    <form className="login" onSubmit={handleSubmit}>

        <h3>Login</h3>
        <label>Email: </label>
        <input value={email} type="email" onChange={(e) => {
            setEmail(e.target.value)
        }}/>

        <label>Password: </label>
        <input value={password} type="password" onChange={(e) => {
            setPassword(e.target.value)
        }}/>
        <button disabled={isLoading}>Login</button>
        {error && <div>Error: {error}</div>}
    </form>
  )
}


export default Login