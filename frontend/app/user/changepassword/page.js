"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../menu/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function generateMetadata({ params }) {
    return {
        title: "Eco Automotive | Change Password",
        description: 'Eco Automotive Change Password',
    }
}

const ChangePassword = () => {
    const router = useRouter();
    const [oldpassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldpasswordError, setOldPasswordError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userID');
        if (!token && !userid) {
            // Redirect to the login page or perform any logout action here
            // For example, you can use a router to navigate to the login page
            router.push("/user/logout");
        }
    }, []);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Clear the password error message
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        // Clear the confirmPassword error message
        setConfirmPasswordError('');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        // Reset the error message
        setErrorMessage(null);

        // Password validation
        if (!oldpassword) {
            setOldPasswordError('Old Password is required.');
            return;
        } else {
            setOldPasswordError(null); // Clear the error message
        }

        if (!password) {
            setPasswordError('Password is required.');
            return;
        } else {
            setPasswordError(null); // Clear the error message
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Confirm Password is required.');
            return;
        } else {
            setConfirmPasswordError(null); // Clear the error message
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        } else {
            setConfirmPasswordError(null); // Clear the error message
        }

        const token = localStorage.getItem('token');
        const authHeaderValue = `Bearer ${token}`;

        try {
            const response = await axios.post(
                `${process.env.API_URL}/api/user/changepassword/`,
                {
                    oldpassword: oldpassword,
                    password: password,
                    password2: confirmPassword,
                },
                {
                    headers: {
                        Authorization: authHeaderValue,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Handle a successful response here
            if (response.status === 200) {
                toast.success('Password changed successfully.');
                setOldPassword('');
                setPassword('');
                setConfirmPassword('');
            } else {
                toast.error('Old password Invalid.');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                // Update the error message state variable
                setErrorMessage(err.response.data.detail || 'Old password Invalid.');
                //toast.error(err.response.data.detail || 'Password change failed.');
            } else {
                // Update the error message state variable
                setErrorMessage('Old password Invalid');
                //toast.error('Password change failed.');
            }
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page"><a href="/user/changepassword/">Change Password</a></li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mt-5 mb-5">
                <div className='row'>
                    <div className='col-md-3'>
                        <Menu />
                    </div>
                    <div className='col-md-9'>
                        <h6>Change Password</h6><hr />
                        {errorMessage && (
                            <div className="alert alert-danger text-center" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form className='shadow-lg p-3 mb-5 bg-body rounded' onSubmit={handleChangePassword}>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Old Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${oldpasswordError ? 'is-invalid' : ''}`}
                                    id="oldpassword"
                                    name="oldpassword"
                                    value={oldpassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                {oldpasswordError && <p className="text-danger">{oldpasswordError}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {passwordError && <p className="text-danger">{passwordError}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cmpassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                                {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
                            </div>
                            <button type="submit" className="btn btn-primary">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
};

export default ChangePassword;
