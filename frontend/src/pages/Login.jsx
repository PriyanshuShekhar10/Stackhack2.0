import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarComponent from '../components/Navbar/NavbarComponent';
import Footer from '../components/Footer/Footer';
import styles from './Login.module.css'; // Import the CSS module

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.ok) {
                toast.success('Login successful');
                console.log('Login successful', response.data);
                // Redirect or perform other actions
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message || 'An error occurred during login.');
            } else if (err.request) {
                toast.error('No response from server. Check your network connection.');
            } else {
                toast.error('Error setting up login request.');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (<>
            <NavbarComponent/>
        <div className={styles.container}>
            <div className={`${styles.formContainer} monospace-text`}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
            <Footer/>
                            </>
    );
};

export default Login;
