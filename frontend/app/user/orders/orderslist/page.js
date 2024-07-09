"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate } from '@/utils/dateUtils';

const UserOrderList = () => {
    const router = useRouter();
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        router.push("/user/logout");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [userOrdersData, setUserOrderData] = useState([]);
    const [error, setError] = useState(null);

    const UserOrderListData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/user/orderslist/`, {
                headers: headers,
            });
            setUserOrderData(response.data);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }

    useEffect(() => {
        UserOrderListData();
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <Link href="/user/orders/orderslist">User Order List</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mb-5">
                <div className="row">
                    <h5 className='mb-3 mt-3'>Orders List</h5><hr />
                    {error ? (
                        <div className="col-md-12">
                            <p>Error: {error.message}</p>
                        </div>
                    ) : userOrdersData.length === 0 ? (
                        <div className="col-md-12">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        userOrdersData.map(order => (
                            <div className="col-md-12" key={order.id}>
                                <Link href={`/user/orders/orderslist/${order.id}`}>
                                <div className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img
                                                src={order.product ? order.product.image : (order.accessories ? order.accessories.image : '')}
                                                className="img-fluid rounded-start"
                                                alt=""
                                                style={{ width: '80%' }}
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {order.product ? order.product.name : (order.accessories ? order.accessories.name : '')}
                                                </h5>
                                                <p className="card-text mt-5 fw-bold">Amount: {order.total_amount}</p>
                                                <p className="card-text mt-3"><small className="text-muted">Order Date: {formatDate(order.order_date)}</small></p>
                                                <p className="card-text mt-3 text-capitalize">Order Status: {order.order_status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default UserOrderList;
