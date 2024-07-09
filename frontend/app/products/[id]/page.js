"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductBooking = ({ params }) => {
    const router = useRouter();
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
        router.push("/user/logout");
    }
    const { id: productId } = params;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [userAddressData, setUserAddressData] = useState({});
    const [product, setProduct] = useState(null);

    const fetchUserAddressData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/user/address/${userId}/`, {
                headers: headers,
            });
            setUserAddressData(response.data);
            // Check if there is at least one shipping address and one billing address.
            if (
                (!userAddressData.shipping_addresses || userAddressData.shipping_addresses.length === 0) ||
                (!userAddressData.billing_addresses || userAddressData.billing_addresses.length === 0)
            ) {
                toast.error('Please add both a shipping address and a billing address before placing the order.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching user data');
        }
    };

    const fetchProductDetailsData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/products/${productId}`, {
                headers: headers,
            });
            setProduct(response.data);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching product data');
        }
    };

    // Payment gateintegration script Start
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // complete order
    const complete_order = (paymentID, orderID, signature) => {
        axios({
            method: 'post',
            url: `${process.env.API_URL}/api/user/orders/success/`,
            data: {
                "razorpay_payment_id": paymentID,
                "razorpay_order_id": orderID,
                "razorpay_signature": signature,
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.status == 'success') {
                    router.push(`/user/orders/orderdetails`);
                } else {
                    router.push('/user/orders/failure');
                }
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
        fetchUserAddressData();
        fetchProductDetailsData();
    }, []);

    const email = userAddressData && userAddressData.email;
    const contact = userAddressData && userAddressData.phonenumber;
    const discount = 10;
    const deliverycharge = 10;
    const userID = localStorage.getItem('userID');
    const productID = productId;
    const totalAmount = (product && product.amount || 0) + deliverycharge;
    const quantity = 1;
    const shippingAddressID = userAddressData && userAddressData.shipping_addresses && userAddressData.shipping_addresses.length > 0 ? userAddressData.shipping_addresses[0].id : null;
    const billingAddressID = userAddressData && userAddressData.billing_addresses && userAddressData.billing_addresses.length > 0 ? userAddressData.billing_addresses[0].id : null;
    
    function makePayment(e, userID, productID, quantity, totalAmount, discount, deliverycharge, shippingAddressID, billingAddressID) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('user', userID);
        formData.append('productID', productID);
        formData.append('quantity', quantity);
        formData.append('totalAmount', totalAmount);
        formData.append('discount', discount);
        formData.append('deliverycharge', deliverycharge);
        formData.append('shippingAddressID', shippingAddressID);
        formData.append('billingAddressID', billingAddressID);

        async function paymentGateway() {
            const url = `${process.env.API_URL}/api/user/orders/`;
            const res = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            const jsonRes = await res.json();
            return jsonRes;
        }

        paymentGateway().then((res) => {
            //_________ call razorpay gateway ________
            var options = {
                key: res['razorpay_key'],
                totalAmount: res['order']['totalAmount'],
                name: "Ecoautomative",
                image: "https://example.com/your_logo",
                description: "Test Transaction",
                currency: res['order']['currency'],
                prefill: {
                    email: email,
                    contact: contact,
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#0000FF',
                },
                order_id: res['order']['id'],
                handler: function (response) {
                    //complete order
                    complete_order(
                        response.razorpay_payment_id,
                        response.razorpay_order_id,
                        response.razorpay_signature
                    )
                },
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        });
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <Link href="/product">Product Booking</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="row mt-3 mb-3">
                            <h6>Address</h6>
                            <hr />
                            <div className="col-md-5 box-shadow">
                                <h6>Shipping Addresses</h6>
                                <hr />
                                {userAddressData?.shipping_addresses?.length > 0 ? (
                                    <div>
                                        {userAddressData.shipping_addresses.map((address, index) => (
                                            <div key={index}>
                                                <div>{address.name}</div>
                                                <div>{address.alternatephonenumber}</div>
                                                <div>{address.address}</div>
                                                <div>{address.country}</div>
                                                <div>{address.state}</div>
                                                <div>{address.city}</div>
                                                <div>{address.postal_code}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No shipping data available</p>
                                )}
                            </div>
                            <div className="col-md-5 box-shadow">
                                <h6>Billing Addresses</h6>
                                <hr />
                                {userAddressData && userAddressData.billing_addresses?.length > 0 ? (
                                    <div>
                                        {userAddressData.billing_addresses.map((address, index) => (
                                            <div key={index}>
                                                <div>{address.name}</div>
                                                <div>{address.alternatephonenumber}</div>
                                                <div>{address.address}</div>
                                                <div>{address.country}</div>
                                                <div>{address.state}</div>
                                                <div>{address.city}</div>
                                                <div>{address.postal_code}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No billing data available</p>
                                )}
                            </div>
                        </div>
                        <h6>Product Details</h6>
                        <hr />
                        {product && (
                            <div className="row g-0">
                                <div className="col-md-4 p-3">
                                    <img src={product.image} className="img-fluid rounded-start img-thumbnail" alt={product.name} />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="box-shadow">
                            <p className="text-center fw-bold">PRICE DETAILS</p>
                            <hr />
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Price:</td>
                                        <td></td>
                                        <td>Rs.{product && product.amount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Discount:</td>
                                        <td></td>
                                        <td>Rs. <small>-{discount.toFixed(2)}</small></td>
                                    </tr>
                                    <tr>
                                        <td>Delivery Charges:</td>
                                        <td></td>
                                        <td>Rs. {deliverycharge.toFixed(2)}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>SubTotal Amount:</td>
                                        <td></td>
                                        <td>Rs. {((product && product.amount || 0) + deliverycharge + discount).toFixed(2)}</td>
                                    </tr> */}
                                    <tr>
                                        <td className="fw-bold">Total Amount:</td>
                                        <td></td>
                                        <td className="fw-bold">Rs. {((product && product.amount || 0) + deliverycharge).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {(!userAddressData.shipping_addresses || userAddressData.shipping_addresses.length === 0 ||
                                !userAddressData.billing_addresses || userAddressData.billing_addresses.length === 0) ? (
                                <div>
                                    <button type="button" className="btn btn-primary" disabled>
                                        Add Address and Billing Address to Place Order <br />
                                    </button>
                                    <Link className="text-danger mt-3" href='/user/shippingaddress'>Add address</Link>
                                </div>
                            ) : (
                                    <button className="btn btn-primary" onClick={e => { makePayment(e, userID, productID, quantity, totalAmount, discount, deliverycharge, shippingAddressID, billingAddressID) }}>Placed order</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductBooking;
