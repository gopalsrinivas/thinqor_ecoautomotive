"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../../menu/page';

const EditProfile = ({ params }) => {
    const router = useRouter(); // Initialize the useRouter hook

    const userId = params.id
    console.log(userId); // Verify that userId is correctly obtained from props

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phonenumber: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            // Handle the case where the user is not authenticated or ID is missing
            router.push("/user/logout"); // Use router.push for redirection
            return;
        }

        axios
            .get(`${process.env.API_URL}/api/user/profile/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const { username, email, phonenumber } = response.data;
                setFormData({ username, email, phonenumber });
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    // Clear the token from local storage and redirect to the login page
                    localStorage.removeItem('token');
                    router.push("/user/logout"); // Use router.push for redirection
                } else {
                    setError(error);
                }
            });
    }, [userId, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${process.env.API_URL}/api/user/profile/${userId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle the successful update here, e.g., show a success message
            console.log('Profile updated successfully');
            // Redirect to the user's profile page after successful update
            router.push("/user/profile"); // Use router.push for redirection
        } catch (error) {
            setError(error);
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
                            <li className="breadcrumb-item active" aria-current="page"><a href="/user/profile/">Edit Profile</a></li>
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
                        <h6>Edit Profile</h6><hr/>
                        <form onSubmit={handleSubmit} className='shadow-lg p-3 mb-5 bg-body rounded'>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phonenumber" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phonenumber"
                                    name="phonenumber"
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
