//import './globals.css'
"use client";
import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Header from './component/Header'
import Footer from './component/Footer'
import Script from 'next/script'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import '../public/asset/css/font-awesome.min.css'
import '../public/asset/css/custom.css'
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eco Automotive',
  description: 'Eco Automotive',
}

export default function RootLayout({ children }) {
  const [totalCartProducts, setTotalCartProducts] = useState(0);
  // Function to fetch the total cart products count
  const fetchTotalCartProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${process.env.API_URL}/api/user/carts/${userId}/`, { headers });
      const { total_cart_products } = response.data;
      setTotalCartProducts(total_cart_products);
    } catch (error) {
      console.error("Error fetching total cart products:", error);
    }
  };

  // Call fetchTotalCartProducts when the component mounts
  useEffect(() => {
    fetchTotalCartProducts();
  }, []);

  return (
    <html lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha384-d7p1Lwu25KxvuBvSTZ9IvAz5BwRteXPt1P7Tfa0eb6aSZlDHc6/PY1Cw1TKB2+xU" crossorigin="anonymous" />
        <link href='http://fonts.googleapis.com/css?family=Titillium+Web:400,200,300,700,600' rel='stylesheet' type='text/css' />
        <link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:400,700,300' rel='stylesheet' type='text/css' />
        <link href='http://fonts.googleapis.com/css?family=Raleway:400,100' rel='stylesheet' type='text/css' />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous" />
      </Head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <script src="/asset/js/jquery_3.7.1.min.js"></script>
        <script src="/asset/js/bootstrap@4.6.2.min.js"></script>
        <script src="/asset/js/bootstrap_5.3.2.bundle.min.js"></script>
        <script src="/asset/js/jquery_3.7.1.slim.js"></script>
        <script src="/asset/js/popper.js_2.9.2.min.js"></script>
      </body>
    </html>
  )
}
