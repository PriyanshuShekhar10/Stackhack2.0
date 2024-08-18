import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {

        e.preventDefault()


        // console.log(email, password)

        await signup(email, password)
    }

  return (

    <form className="signup" onSubmit={handleSubmit}>

        <h3>Sign up</h3>
        <label>Email: </label>
        <input value={email} type="email" onChange={(e) => {
            setEmail(e.target.value)
        }}/>

        <label>Password: </label>
        <input value={password} type="password" onChange={(e) => {
            setPassword(e.target.value)
        }}/>
        <button disabled={isLoading}>Sign up</button>
        {error && <div>Error: {error}</div>}
    </form>
  )
}


export default Signup