"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/dateUtils';

const CartOrderDetails = ({ params }) => {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const orderID = params.id;
    let totalQuantity = 0;
    orders.forEach((order) => {
        totalQuantity += order.quantity;
    });

    const cartOrder = () => {
        axios
            .get(`${process.env.API_URL}/api/user/cartorder/${orderID}/`)
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        cartOrder();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!orders || orders.length === 0) {
        return <p>Order not found</p>;
    }

    // Group orders by razorpay_order_id
    const groupedOrders = {};

    orders.forEach((order) => {
        if (!groupedOrders[order.razorpay_order_id]) {
            groupedOrders[order.razorpay_order_id] = {
                order: order,
                user_order_trackings: [],
            };
        }

        if (Array.isArray(order.user_order_trackings)) {
            groupedOrders[order.razorpay_order_id].user_order_trackings.push(...order.user_order_trackings);
        }
    });

    const consolidatedOrders = Object.values(groupedOrders);

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-12">
                    <p>Item Details</p>
                    <hr />
                    {orders.map((order) => (
                        <div key={order.id}>
                            {order.product && (
                                <div className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img src={order.product.image} className="img-fluid rounded-start" alt={order.product.name} style={{ width: '100px', height: '80px' }} />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{order.product.name}</h5>
                                                <div><strong>Rs. {order.product.amount}.00</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {order.accessories && (
                                <div className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img src={order.accessories.image} className="img-fluid rounded-start" alt={order.accessories.name} style={{ width: '100px', height: '80px' }} />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{order.accessories.name}</h5>
                                                <div><strong>Rs. {order.accessories.amount}.00</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <p>Order Details</p>
                    <hr />
                    <div className="card mb-3">
                        <div className="row g-0">
                            <table className="table table-striped table-hover border">
                                <tbody>
                                    <tr>
                                        <td>Order ID</td>
                                        <td>{orders[0].razorpay_order_id}</td>
                                        <td>Payment ID</td>
                                        <td>{orders[0].razorpay_payment_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Order Status</td>
                                        <td>{orders[0].order_status}</td>
                                        <td>Order placed on</td>
                                        <td>{orders[0].order_date}</td>
                                    </tr>
                                    <tr>
                                        <td>Quantity <small>({totalQuantity} items)</small></td>
                                        <td>{orders[0].quantity}</td>
                                        <td>Discount</td>
                                        <td>{orders[0].discount}</td>
                                    </tr>
                                    <tr>
                                        <td>Delivery Charges</td>
                                        <td>{orders[0].deliverycharges}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className='fw-bold'>Total Amount</td>
                                        <td className='fw-bold'>{orders[0].total_amount}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p>Address Details</p>
                    <hr />
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-6">
                                <h6>Shipping Address</h6>
                                <hr />
                                <p>
                                    {orders[0].shippingAddress.name} <br />
                                    {orders[0].shippingAddress.alternatephonenumber} <br />
                                    {orders[0].shippingAddress.address} <br />
                                    {orders[0].shippingAddress.country} <br />
                                    {orders[0].shippingAddress.state} <br />
                                    {orders[0].shippingAddress.city} <br />
                                    {orders[0].shippingAddress.postal_code} <br />
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h6>Billing Address</h6>
                                <hr />
                                <p>
                                    {orders[0].billingAddress.name} <br />
                                    {orders[0].billingAddress.alternatephonenumber} <br />
                                    {orders[0].billingAddress.address} <br />
                                    {orders[0].billingAddress.country} <br />
                                    {orders[0].billingAddress.state} <br />
                                    {orders[0].billingAddress.city} <br />
                                    {orders[0].billingAddress.postal_code} <br />
                                </p>
                            </div>
                        </div>
                    </div>
                    <p>Order Tracking Details</p>
                    <hr />
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-12">
                                {consolidatedOrders.map((consolidatedOrder, index) => (
                                    <div key={index}>
                                        <h6>Order {consolidatedOrder.order.razorpay_order_id} - Tracking Details</h6>
                                        {consolidatedOrder.user_order_trackings.length > 0 ? (
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
                                                    {consolidatedOrder.user_order_trackings.map((detail, detailIndex) => (
                                                        <tr key={detailIndex}>
                                                            <td>{detailIndex + 1}.</td>
                                                            <td>{detail.location}</td>
                                                            <td>{detail.description}</td>
                                                            <td>{formatDate(detail.created_at)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className='text-center'>No tracking details available</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartOrderDetails;
