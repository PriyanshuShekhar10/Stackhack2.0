/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarComponent from '../components/Navbar/NavbarComponent';
import Footer from '../components/Footer/Footer';
import styles from './Login.module.css'; // Import the CSS module

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        // Check if the user is already authenticated
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('https://stackhack2-0-backend.onrender.com/auth/checklogin', {
                    withCredentials: true
                });

                if (response.data.ok) {
                    navigate('/login'); // Redirect to home page if authenticated
                }
            } catch (err) {
                console.error('Error checking login status:', err);
                // You can optionally handle this error if necessary
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('https://stackhack2-0-backend.onrender.com/auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.ok) {
                toast.success('Login successful');
                console.log('Login successful', response.data);
                navigate('/'); // Redirect to home page after successful login
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

    return (
        <>
            <NavbarComponent />
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

                    <a href='/signup' style={{'color': 'blue', 'padding-top': '2rem'}}>Don't have an account? Register here!</a>
                </div>  
            </div>
            <Footer />
        </>
    );
};

export default Login;
