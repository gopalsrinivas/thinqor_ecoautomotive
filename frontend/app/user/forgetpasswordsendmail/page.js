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

const ForgetPasswordSendMail = () => {
    const router = useRouter();
    const initialFormData = {
        email: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email are empty and set errors accordingly
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
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
            const response = await axios.post(`${process.env.API_URL}/api/user/send-reset-password-email/`, formData);
            // console.log('Response:', response);
            if (response.status === 200) {
                // Clear the form data
                setFormData(initialFormData);
                setSuccessMessage('Password Reset link sent. Please check your Email!');
                // Clear the success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('Invalid email. Please try again.', { autoClose: 5000 });
            } else {
                toast.error('An error occurred during the request. Please try again later.', { autoClose: 5000 });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4 mt-4">
                    <div className="shadow p-3 mb-5 mt-6 bg-body rounded bg-light">
                        <h6 className="text-center"><strong>Forget Password</strong></h6>
                        <form onSubmit={handleSubmit}>
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
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
                            <button type='submit' className='btn btn-primary mt-3' disabled={loading}>
                                {loading ? 'Submitting in...' : 'Submit'}
                            </button>
                            <Link className="mt-3 float-right" href="/login">Login</Link>
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
    );
};

export default ForgetPasswordSendMail;
