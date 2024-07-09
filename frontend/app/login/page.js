"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function generateMetadata({ params }) {
    return {
        title: "Eco Automotive | About Us",
        description: 'Eco Automotive about us',
    }
}

const Login = () => {
    const router = useRouter();
    const initialFormData = {
        email: '',
        password: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear the error message when the user starts typing in the field
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email and password are empty and set errors accordingly
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Validate the email format
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            setErrors({ ...errors, email: 'Invalid email format' });
            setLoading(false); // Stop loading animation
            return;
        }

        try {
            const response = await axios.post(`${process.env.API_URL}/api/user/login/`, formData);
            // console.log('Response:', response);

            // Debugging: Log the values of token and msg
            // console.log('Token:', response.data.token);
            // console.log('Message:', response.data.msg);

            if (response.data.token && response.data.msg === 'Login Success') {
                try {
                    // Store the token in local storage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userID', response.data.userID)
                    router.push("/products");
                } catch (error) {
                    // Handle errors related to setting items in local storage
                    console.error('Error setting items in local storage:', error);
                    // You can also display a user-friendly error message here
                    router.push("/user/logout");
                }
            }
            // Display a success message
            toast.success('Login successful!', { autoClose: 5000 });
        } catch (error) {
            console.error('Login Error:', error.response);
            // Display a custom error message for "Invalid email or password"
            if (error.response && error.response.status === 404) {
                toast.error('Invalid email or password. Please try again.', { autoClose: 5000 });
            } else {
                // Handle unexpected errors gracefully
                toast.error('An error occurred during login. Please try again later.', {
                    autoClose: 5000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page"><a href="/login">Login</a></li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 mt-4">
                        <div className="shadow p-3 mb-5 mt-6 bg-body rounded bg-light">
                            <h6 className="text-center"><strong>Login Form</strong></h6>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-2">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email}</p>}
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </div>
                                <button type="submit" className="btn btn-primary mt-2 mb-3" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <Link className="float-right mt-3" href="/register">Signup</Link><br/>
                                <Link className="mt-5" href="/user/forgetpasswordsendmail">Forget Password</Link>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </>
    );
};

export default Login;
