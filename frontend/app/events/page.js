"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Events = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotificationData = () => {
        setLoading(true);
        setError(null);
        axios
            .get(`${process.env.API_URL}/api/notification/`)
            .then((response) => {
                setNotifications(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching data');
                setLoading(false);
                console.error('Error fetching data:', err);
            });
    };

    useEffect(() => {
        fetchNotificationData();
    }, []);

    if (loading) {
        return (
            <div className="container mt-3 mb-5">
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className='text-center'>Loading...</h3>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mt-3 mb-5">
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className='text-center'>Error: {error}</h3>
                    </div>
                </div>
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="container mt-3 mb-5">
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className='text-center'>No notifications found</h3>
                    </div>
                </div>
            </div>
        )
    }

    function truncateText(text, maxLength){
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '... '; 
        }
        return text;
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">Home</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <a href="/events">Events</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mt-3 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <h4>Events</h4>
                        <hr />
                        {notifications.map((notification) => (
                            <Link href={`/notificationdetail/${notification.id}`} key={notification.id}>
                                <div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">{notification.title}<hr/></h5>
                                            <p className="card-text">{truncateText(notification.description, 100)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Events;
