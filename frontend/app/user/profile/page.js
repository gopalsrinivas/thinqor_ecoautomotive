"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Menu from '../menu/page';
import { formatDate } from '@/utils/dateUtils';
import { redirect } from 'next/navigation'

const UserProfile = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('token');
    // Check if the token exists
    if (!token) {
      // If the token is not found, redirect to the login page
      router.push("/user/logout");
      return;
    }
    // Configure axios to include the token in the request headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Fetch user profile data from the API
    axios
      .get(`${process.env.API_URL}/api/user/profile/`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        // Check if the error status code indicates an invalid or expired token
        if (error.response && error.response.status === 401) {
          // Clear the token from local storage and redirect to the login page
          localStorage.removeItem('token');
          router.push("/user/logout");
        } else {
          // Handle other errors
          setError(error);
        }
      });
  });

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page"><a href="/user/profile/">My Profile</a></li>
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
            <h6>My Profile</h6><hr />
            <table className="table table-striped table-hover table-bordered">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{user ? user.username : 'Loading...'}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{user ? user.email : 'Loading...'}</td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>{user ? user.phonenumber : 'Loading...'}</td>
                </tr>
                <tr>
                  <td>User Status</td>
                  <td>{user ? (user.is_active ? 'Active' : 'Inactive') : 'Loading...'}</td>
                </tr>
                <tr>
                  <td>Created at</td>
                  <td>{user ? formatDate(user.created_at) : 'Loading...'}</td>
                </tr>
                <tr>
                  <td colSpan={2} className='text-center'>
                    {user && <Link href={`/user/profile/${user.id}`} className="btn btn-success">Edit</Link>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
