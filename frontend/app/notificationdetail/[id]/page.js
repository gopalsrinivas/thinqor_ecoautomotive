'use client';
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { formatDate } from '@/utils/dateUtils';

const NotificationDetails = ({ params }) => {
  const NotificationId = params.id;
  const [notificationData, setNotificationData] = useState(null);
  const [error, setError] = useState(null);

  const fetchNotificationDetailsData = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/notification/${NotificationId}`);
      setNotificationData(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  useEffect(() => {
    fetchNotificationDetailsData();
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">
                <Link href={`/notificationDetail/${NotificationId}`}>Notification Details</Link>
              </li>
            </ol>
          </nav>
        </div>
      </nav>
      <div className="container mb-4 mt-4">
        <div className="row">
          <div className="col-md-12">
            <h6>Notification Details</h6><hr />
            <div className='card'>
            {error ? (
              <p>Error:{error.message}</p>
            ) : notificationData ? (
              <div>
                    <h5>{notificationData.title}</h5>
                    <p className='text-justify'>{notificationData.description}</p>
                  <hr />
                    <p>Created on:{formatDate(notificationData.created_at)}</p>
              </div>
            ) : (
              <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationDetails
