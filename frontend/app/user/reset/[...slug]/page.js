"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ResetPassword = ({ params }) => {
    const router = useRouter();
    const [uid, setUid] = useState(params.slug[0]);
    const [token, setUrlToken] = useState(params.slug[1]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const initialFormData = {
        password: '',
        password2: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear the error message when the user starts typing in the field
        setErrors({ ...errors, [name]: '' });
    };

    // Function to perform form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!formData.password2) {
            newErrors.password2 = 'Confirm Password is required';
        }

        if (formData.password !== formData.password2) {
            newErrors.password2 = 'Passwords do not match';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Function to handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            try {
                const response = await axios.post(`${process.env.API_URL}/api/user/reset-password/${uid}/${token}/`, formData);
                console.log('Response Data:', response.data);
                if (response.status === 200) {
                    setFormData(initialFormData);
                    setSuccessMessage('Password reset successful!');
                    setTimeout(() => setSuccessMessage(''), 5000);
                }
                router.push("/login");
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    // Handle validation errors
                    const validationErrors = error.response.data.errors;

                    // Display the validation errors on your UI
                    if (validationErrors) {
                        for (const field in validationErrors) {
                            if (Object.hasOwnProperty.call(validationErrors, field)) {
                                // Assuming you have an element to display errors with the same name as the field
                                setErrors({ ...errors, [field]: validationErrors[field][0] });
                            }
                        }
                    } else {
                        toast.error('An error occurred during the request. Please try again later.', { autoClose: 5000 });
                    }
                } else if (error.response && error.response.status === 404) {
                    toast.error('Invalid Reset Password form. Please try again.', { autoClose: 5000 });
                } else {
                    toast.error('An error occurred during the request. Please try again later.', { autoClose: 5000 });
                } 
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><a href="#">Reset Password</a></li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 mt-4">
                        <div className="shadow p-3 mb-5 mt-6 bg-body rounded bg-light">
                            <h6 className="text-center"><strong>Reset Password</strong></h6>
                            <form onSubmit={handleFormSubmit}>
                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <div className="form-group mt-2">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                                        id="password2"
                                        name="password2"
                                        value={formData.password2}
                                        onChange={handleChange}
                                        placeholder="Enter confirm password"
                                    />
                                    {errors.password2 && <p className="text-danger">{errors.password2}</p>}
                                </div>
                                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                    {loading ? 'Submitting in...' : 'Submit'}
                                </button>
                                <Link className="mt-3 float-right" href="/user/forgetpasswordsendmail">Change Email</Link>
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

export default ResetPassword;
