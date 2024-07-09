"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/dateUtils';

const UserOrderDetails = () => {
    const router = useRouter();
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !token) {
            router.push("/user/logout");
        }

        axios.get(`${process.env.API_URL}/api/user/latest-order/${userId}/`)
            .then((response) => {
                setOrder(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [userId, token, history]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {order ? (
                <div className="container mt-5 mb-5">
                    <div className="row">
                        <div className="col-md-12">
                            <p>Item Details</p><hr />
                            <div className="card mb-3">
                                <div className="row g-0">
                                    {order.product ? (
                                        <div className="col-md-4">
                                            <img src={order.product.image} className="img-fluid rounded-start" alt="Product" style={{ width: '100px', height: '80px' }} />
                                        </div>
                                    ) : null}
                                    {order.accessories ? (
                                        <div className="col-md-4">
                                            <img src={order.accessories.image} className="img-fluid rounded-start" alt="accessories" style={{ width: '100px', height: '80px' }} />
                                        </div>
                                    ) : null}
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {order.product ? order.product.name : order.accessories.name}
                                            </h5>
                                            <div><strong>Rs. {order.product ? order.product.amount : order.accessories.amount}.00</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>Order Details</p><hr />
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <table className="table table-striped table-hover border">
                                        <tbody>
                                            <tr>
                                                <td>Order ID</td>
                                                <td>{order.razorpay_order_id}</td>
                                                <td>Payment ID</td>
                                                <td>{order.razorpay_payment_id}</td>
                                            </tr>
                                            <tr>
                                                <td>Order Status</td>
                                                <td>{order.order_status}</td>
                                                <td>Order placed on</td>
                                                <td>{order.order_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Quantity</td>
                                                <td>{order.quantity}</td>
                                                <td>Discount</td>
                                                <td>{order.discount}</td>
                                            </tr>
                                            <tr>
                                                <td>Delivery Charges</td>
                                                <td>{order.deliverycharges}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            {/* <tr>
                                                <td>SubTotal Amount</td>
                                                <td>{order.total_amount} - {order.discount}</td>
                                                <td></td>
                                                <td></td>
                                            </tr> */}
                                            <tr>
                                                <td className='fw-bold'>Total Amount</td>
                                                <td className='fw-bold'>{order.total_amount}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p>Address Details</p><hr />
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <h6>Shipping Address</h6><hr />
                                        <p>
                                            {order.shippingAddress.name} <br />
                                            {order.shippingAddress.alternatephonenumber} <br />
                                            {order.shippingAddress.address} <br />
                                            {order.shippingAddress.country} <br />
                                            {order.shippingAddress.state} <br />
                                            {order.shippingAddress.city} <br />
                                            {order.shippingAddress.postal_code} <br />
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Billing Address</h6><hr />
                                        <p>
                                            {order.billingAddress.name}<br />
                                            {order.billingAddress.alternatephonenumber}<br />
                                            {order.billingAddress.address}<br />
                                            {order.billingAddress.country}<br />
                                            {order.billingAddress.state}<br />
                                            {order.billingAddress.city}<br />
                                            {order.billingAddress.postal_code}<br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p>Order Tracking Details</p><hr />
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-12">
                                        {order.user_order_trackings && Array.isArray(order.user_order_trackings) ? (
                                            <table className="table table-striped table-hover border">
                                                <thead>
                                                    <tr>
                                                        <th>S.no</th>
                                                        <th>Location</th>
                                                        <th>Description</th>
                                                        <th>Date and Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.user_order_trackings.map((detail, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{detail.location}</td>
                                                            <td>{detail.description}</td>
                                                            <td>{formatDate(detail.created_at)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className='text-center'>No order tracking details available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Order not found</p>
            )}
        </>
    );
};

export default UserOrderDetails;
