"use client";
import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function generateMetadata({ params }) {
    return {
        title: "Eco Automotive | Signup",
        description: 'Eco Automotive Signup',
    }
}

const Register = () => {
    const router = useRouter();
    const initialFormData = {
        username: '',
        email: '',
        phonenumber: '',
        password: '',
        password2: '',
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

        if (formData.username.trim() === '') {
            newErrors.username = 'Username is required';
        }

        if (formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phonenumber.trim() === '') {
            newErrors.phonenumber = 'Mobile is required';
        } else if (!/^[0-9]{10}$/.test(formData.phonenumber)) {
            newErrors.phonenumber = 'Invalid mobile number (must be 10 digits)';
        }

        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (formData.password2.trim() === '') {
            newErrors.password2 = 'Confirm Password is required';
        } else if (formData.password2.length < 8) {
            newErrors.password2 = 'Password must be at least 8 characters long';
        }

        if (formData.password2 !== formData.password) {
            newErrors.password2 = 'Passwords do not match';
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
            const response = await axios.post(`${process.env.API_URL}/api/user/register/`, formData);
            if (response.data.token && response.data.msg === 'Registration Success') {
                // Store the access token and user ID in local storage
                localStorage.setItem('token', response.data.token.access);
                localStorage.setItem('userID', response.data.userID);
                // Redirect to the desired page or perform any other necessary actions
                router.push("/products");
            } else {
                // Handle the case where the token is not available
                router.push("/user/logout");
            }

            // Display a success message
            toast.success('Registration successful', { autoClose: 5000 });
            setFormData(initialFormData); // Reset the form
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const responseData = error.response.data;
                const newErrors = {};

                if (responseData.error && responseData.error.email) {
                    newErrors.email = responseData.error.email;
                }

                if (responseData.error && responseData.error.phonenumber) {
                    newErrors.phonenumber = responseData.error.phonenumber;
                }
                setErrors(newErrors);
            } else {
                // Handle unexpected errors gracefully
                toast.error('An error occurred during registration. Please try again later.', {
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
                            <li className="breadcrumb-item active" aria-current="page"><a href="/register">Register</a></li>
                        </ol>
                    </nav>
                </div>
            </nav>

        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4 mt-4">
                    <div className="shadow p-3 mb-5 mt-6 bg-body rounded bg-light">
                        <h6 className="text-center"><strong>Register Form</strong></h6>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mt-2">
                                <label htmlFor="username">User Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    id="username"
                                    name="username"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                {errors.username && <p className="text-danger">{errors.username}</p>}
                            </div>
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
                                <label htmlFor="phonenumber">Phone Number</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
                                    id="phonenumber"
                                    name="phonenumber"
                                    placeholder="Enter phone number"
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                />
                                {errors.phonenumber && <p className="text-danger">{errors.phonenumber}</p>}
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
                            <div className="form-group mt-2">
                                <label htmlFor="password2">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                                    id="password2"
                                    name="password2"
                                    placeholder="Enter Confirm Password"
                                    value={formData.password2}
                                    onChange={handleChange}
                                />
                                {errors.password2 && <p className="text-danger">{errors.password2}</p>}
                            </div>
                                <button type="submit" className="btn btn-primary mt-2 mb-3" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                            <Link href="/login" className="float-right mt-2">Login</Link><br/>
                            <Link className="mt-5" href="/user/forgetpasswordsendmail">Forget Password</Link>
                        </form>
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
        </>
    );
};

export default Register;
