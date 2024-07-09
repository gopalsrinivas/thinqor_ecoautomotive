"use client";
import React, { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        // Handle the logout logic here
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
       // Redirect to the login page
        window.location.href = '/';
    }, []);

    return null;
};

export default Logout;
