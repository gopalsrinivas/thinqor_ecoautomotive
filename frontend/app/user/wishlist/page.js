"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Wishlist = () => {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('userID');
    
    const fetchItemsData = () => {
        setLoading(true);
        setError(null);
        axios
            .get(`${process.env.API_URL}/api/user/wishlist/${userId}/`) 
            .then((response) => {
                setItems(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching data');
                setLoading(false);
                console.error('Error fetching data:', err);
            });
    };

    useEffect(() => {
        fetchItemsData();
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

    if (items.length === 0) {
        return (
            <div className="container mt-3 mb-5">
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className='text-center'>No Wishlist found</h3>
                    </div>
                </div>
            </div>
        )
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
                                <a href="/user/wishlist">Wishlist</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mt-4 mb-4">
                <h4>Wishlist</h4>
                <hr />
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {items.map((item) => (
                        <div className="col" key={item.id}>
                            <div className="card h-100">
                                <img
                                    src={item.product ? item.product.image : item.accessories.image}
                                    className="d-block w-100 card-img-top"
                                    alt={item.product ? item.product.name : item.accessories.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.product ? item.product.name : item.accessories.name}</h5>
                                    <p className="text-start">
                                        {item.product ? item.product.description : item.accessories.description}
                                    </p>
                                    <p className="card-text mt-3 mb-3">
                                        <b>Rs. {item.product ? item.product.amount : item.accessories.amount}.00</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Wishlist;
