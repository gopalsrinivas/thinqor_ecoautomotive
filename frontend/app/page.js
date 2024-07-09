"use client"
import React, { useState,useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [marqueeRunning, setMarqueeRunning] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleMouseOver = () => {
    setMarqueeRunning(false);
  };

  const handleMouseOut = () => {
    setMarqueeRunning(true);
  };

  const fetchData = () => {
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
    fetchData();
  }, []);

  return (
    <>
      <Marquee
        gradient
        speed={50}
        direction="left"
        pauseOnHover
        className="marqueescroll"
      >
        <ul>
          {loading ? (
            <li>Loading...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className='limarqueescroll'>
                <p><Link href={`/notificationdetail/${notification.id}`}>{notification.title}</Link></p>
              </li>
            ))
          )}
        </ul>
      </Marquee>
      <div>
        <img src="/asset/images/nav.jpg" className="img-fluid" alt="..." />
      </div>
    </>
  );
}