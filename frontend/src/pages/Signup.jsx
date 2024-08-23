import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Signup.module.css';
import NavbarComponent from '../components/Navbar/NavbarComponent';
import Footer from '../components/Footer/Footer';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: 'New York' // Fixed city input
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const validationErrors = {};
        if (!formData.name) {
            validationErrors.name = 'Name is required';
        }
        if (!formData.email) {
            validationErrors.email = 'Email is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.ok) {
                toast.success(result.message, {
                    position: 'top-right',
                    autoClose: 2000,
                });
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    city: 'Delhi'
                });
                window.location.href = '/';
            } else {
                toast.error(result.message, {
                    position: 'top-right',
                    autoClose: 2000,
                });
            }
        } catch (err) {
            console.log(err)
            toast.error('An error occurred. Please try again later.', {
                position: 'top-right',
                autoClose: 2000,
            });
        }
    };

    return (<>
    <NavbarComponent/>
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2>Sign Up</h2>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Your Name"
                        />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Your Email"
                        />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                        />
                    {errors.password && <span>{errors.password}</span>}
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Your Password"
                    />
                    {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                </div>
                <div>
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        readOnly
                        />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
        <Footer/>
                        </>
    );
}
