"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function generateMetadata({ params }) {
    return {
        title: "Eco Automotive | Contact Us",
        description: 'Eco Automotive Contact us',
    }
}

const ContactForm = () => {
    const initialFormData = {
        name: '',
        phone_number: '',
        email: '',
        subject: '',
        message: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [contactFormError, setcontactFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isFormValid()) {
            try {
                setIsSubmitting(true); // Start form submission

                const response = await axios.post(`${process.env.API_URL}/api/send-email/`, formData);
                console.log('Registration successful', response.data);
                toast.success('Registration successfully completed!', { autoClose: 5000 });
                setFormData(initialFormData); // Reset the form
                setErrors({});
                setcontactFormError('');
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const responseData = error.response.data;
                    const newErrors = {};
                    setErrors(newErrors);
                } else {
                    setcontactFormError('An error occurred while submitting the form.');
                }
            } finally {
                setIsSubmitting(false); // End form submission
            }
        }
    };

    const isFormValid = () => {
        const newErrors = {};

        if (formData.name.trim() === '') {
            newErrors.name = 'Name is required';
        }

        if (formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phone_number.trim() === '') {
            newErrors.phone_number = 'Mobile is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Invalid mobile number (must be 10 digits)';
        }

        if (formData.subject.trim() === '') {
            newErrors.subject = 'Password is required';
        } else if (formData.subject.length < 8) {
            newErrors.subject = 'Subject is required';
        }

        if (formData.message.trim() === '') {
            newErrors.message = 'Password is required';
        } else if (formData.message.length < 8) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page"><a href="/contact">Contact</a></li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <ToastContainer /> {/* Container for toast notifications */}
            <div>
                <div className="contact-form-wrapper d-flex justify-content-center">
                    <form action="#" className="contact-form" onSubmit={handleSubmit}>
                        <h5 className="title">Contact us</h5>
                        <p className="description">
                            Feel free to contact us if you need any assistance, any help, or another question.
                        </p>
                        {contactFormError && <p className="text-danger">{contactFormError}</p>}
                        <div>
                            <input
                                type="text"
                                className={`form-control rounded border-white mb-3 form-input ${errors.name ? 'is-invalid' : ''}`}
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-danger">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="number"
                                className={`form-control rounded border-white mb-3 form-input ${errors.phone_number ? 'is-invalid' : ''}`}
                                name="phone_number"
                                placeholder="Phone number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                            {errors.phone_number && <p className="text-danger">{errors.phone_number}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                className={`form-control rounded border-white mb-3 form-input ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                />
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                className={`form-control rounded border-white mb-3 form-input ${errors.subject ? 'is-invalid' : ''}`}
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                            {errors.subject && <p className="text-danger">{errors.subject}</p>}
                        </div>
                        <div>
                            <textarea
                                name="message"
                                className={`form-control rounded border-white mb-3 form-text-area ${errors.message ? 'is-invalid' : ''}`}
                                rows="5"
                                cols="30"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                            {errors.message && <p className="text-danger">{errors.message}</p>}
                        </div>
                        <div className="submit-button-wrapper">
                            <input type="submit" disabled={isSubmitting} value={isSubmitting ? 'Sending......' : 'Send'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
   
};

export default ContactForm;
