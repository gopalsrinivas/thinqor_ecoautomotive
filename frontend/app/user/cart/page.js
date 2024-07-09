"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Cart = () => {
    const router = useRouter();
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    const [userAddressData, setUserAddressData] = useState({});
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedTotalAmount, setUpdatedTotalAmount] = useState(0);

    if (!userId || !token) {
        router.push("/user/logout");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const fetchUserAddressData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/user/address/${userId}/`, {
                headers: headers,
            });
            setUserAddressData(response.data);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching user data');
        }
    };

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(
                `${process.env.API_URL}/api/user/carts/${userId}/`,
                { headers }
            );
            setCartData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
        fetchData();
        fetchUserAddressData();
    }, []);

    // Function to update cart after item deletion
    const updateCartAfterDeletion = (itemId, itemType, productId, accessoryId, deletedItem) => {
        // Filter out the deleted item from cart_items
        const updatedCartItems = cartData.cart_items.filter(item => item.id !== itemId);

        // Calculate the amount of the deleted item
        const deletedItemAmount = deletedItem.product ? deletedItem.product.amount : deletedItem.accessories.amount;

        // Calculate the updated total amount (subtract the deleted item's amount)
        const updatedTotalAmount = (cartData.total_cart_product_amount || 0) - deletedItemAmount;

        // Update the cartData state
        setCartData({
            ...cartData,
            cart_items: updatedCartItems,
            total_cart_product_amount: updatedTotalAmount,
            total_cart_products: updatedCartItems.length,
        });

        // Set the updated total amount to the state
        setUpdatedTotalAmount(updatedTotalAmount);
    };

    const handleDeleteItem = async (itemId, itemType, productId, accessoryId) => {
        try {
            const userId = localStorage.getItem('userID');
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            let response;

            if (itemType === 'product') {
                response = await axios.delete(
                    `${process.env.API_URL}/api/user/cart/Deletecart-item/${userId}/${productId}`,
                    { headers }
                );
            } else if (itemType === 'accessory') {
                response = await axios.delete(
                    `${process.env.API_URL}/api/user/cart/Deletecart-accessoryitem/${userId}/${accessoryId}`,
                    { headers }
                );
            }

            // Handle successful deletion
            const deletedItem = cartData.cart_items.find((item) => item.id === itemId);
            updateCartAfterDeletion(itemId, itemType, productId, accessoryId, deletedItem);

            // Log the updated total amount to the console
            console.log('Updated Total Amount:', updatedTotalAmount);

            // Show a success toast notification
            toast.success('Item deleted successfully', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            // Handle error if the deletion request fails.
            console.error('Error deleting item:', error);
            // Show an error toast notification
            toast.error('Error deleting item', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    // Function to calculate the total amount based on cart items
    const calculateTotalAmount = (cartItems) => {
        const productTotal = cartItems.reduce((total, item) => {
            return total + (item.product ? item.product.amount : 0);
        }, 0);

        const accessoryTotal = cartItems.reduce((total, item) => {
            return total + (item.accessories ? item.accessories.amount : 0);
        }, 0);

        // Calculate the updated total amount including delivery charge
        const updatedTotalAmount = productTotal + accessoryTotal + deliverycharge;

        return updatedTotalAmount;
    };


    // Payment gateway integration script Start
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

    // Complete order
    const complete_order = (paymentID, orderID, signature) => {
        axios({
            method: 'post',
            url: `${process.env.API_URL}/api/user/orders/cartsuccess/`,
            data: {
                "razorpay_payment_id": paymentID,
                "razorpay_order_id": orderID,
                "razorpay_signature": signature,
            }
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.status == 'success') {
                router.push(`/user/orders/cartorderdetails/${orderID}`);
            } else {
                router.push('/user/orders/failure');
            }
        })
        .catch((error) => {
            console.log(error.response.data);
        })
    }

    if (loading) {
        return (
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <h1>Error: {error}</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cartData || !cartData.cart_items || cartData.cart_items.length === 0) {
        return (
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <h1>Cart is empty.</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const email = userAddressData && userAddressData.email;
    const contact = userAddressData && userAddressData.phonenumber;
    const discount = 10;
    const deliverycharge = 10;
    const userID = localStorage.getItem('userID');
    const quantity = 1;
    const shippingAddressID = userAddressData && userAddressData.shipping_addresses && userAddressData.shipping_addresses.length > 0
        ? userAddressData.shipping_addresses[0].id
        : null;
    const billingAddressID = userAddressData && userAddressData.billing_addresses && userAddressData.billing_addresses.length > 0
        ? userAddressData.billing_addresses[0].id
        : null;

    // Initialize productIDs and accessoryIDs as arrays
    let productIDs = [];
    let accessoryIDs = [];

    // Initialize totalAmount
    let totalAmount = 0;

    if (cartData && cartData.cart_items) {
        // Calculate productIDs and accessoryIDs
        productIDs = cartData.cart_items.filter((item) => item.product).map((item) => item.product.id);

        accessoryIDs = cartData.cart_items.filter((item) => item.accessories).map((item) => item.accessories.id);

        // Calculate totalAmount
        totalAmount = productIDs.reduce((total, productId) => {
            const product = cartData.cart_items.find((item) => item.product && item.product.id === productId);
            return total + (product ? product.product.amount : 0);
        }, 0) + accessoryIDs.reduce((total, accessoryId) => {
            const accessory = cartData.cart_items.find((item) => item.accessories && item.accessories.id === accessoryId);
            return total + (accessory ? accessory.accessories.amount : 0);
        }, 0) + deliverycharge;
    }

    //console.log(email + '--' + contact + '--' + discount + '--' + userID + '--' + quantity + '--' + shippingAddressID + '--' + billingAddressID + '--' + deliverycharge + '--' + productIDs + '--' + accessoryIDs + '--' + totalAmount)

    function makePayment(e, userID, productIDs, accessoryIDs, quantity, totalAmount, discount, deliverycharge, shippingAddressID, billingAddressID) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('user', userID);
        formData.append('productID', productIDs);
        formData.append('accessoryID', accessoryIDs);
        formData.append('quantity', quantity);
        formData.append('totalAmount', totalAmount);
        formData.append('discount', discount);
        formData.append('deliverycharge', deliverycharge);
        formData.append('shippingAddressID', shippingAddressID);
        formData.append('billingAddressID', billingAddressID);

        //Log the form data to the console
        // console.log("Form Data:");
        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        async function paymentGateway() {
            try {
                const url = `${process.env.API_URL}/api/user/cartorders/`;
                const res = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });
                const jsonRes = await res.json();
                return jsonRes;
            } catch (error) {
                console.error('Error in paymentGateway:', error);
                return null;
            }
        }

        paymentGateway().then((res) => {
            //_________ call razorpay gateway ________
            if (res) {
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
            } else {
                // Handle the case where paymentGateway encountered an error
                console.error('Error in paymentGateway: Unable to fetch payment details.');
                // Display an error message to the user
                alert('Payment processing encountered an error. Please try again later.');
                // You can also redirect the user to an error page or take other actions.
            }
        });
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
                                <a href="/user/cart/">Cart</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mt-5 mb-5">
                <div className="row">
                    <h6>Address</h6><hr />
                    <div className="col-md-6 mb-3">
                        <h6>Shipping Addresses</h6><hr />
                        <div className='box-shadow'>
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
                    </div>
                    <div className="col-md-6 mb-3">
                        <h6>Billing Addresses</h6><hr />
                        <div className='box-shadow'>
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
                </div>

                <div className="row">
                    <div className="col-md-8">
                        {cartData.cart_items.map((item) => (
                            <div className="card mb-3" key={item.id}>
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {item.product ? (
                                            <img
                                                src={`${process.env.API_URL}${item.product.image}`}
                                                className="img-fluid rounded-start"
                                                alt="Product"
                                            />
                                        ) : (
                                            <img
                                                src={`${process.env.API_URL}${item.accessories.image}`}
                                                className="img-fluid rounded-start"
                                                alt="Accessories"
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {item.product ? item.product.name : item.accessories.name}
                                            </h5>
                                            <p className="card-text">
                                                {item.product
                                                    ? item.product.description
                                                    : item.accessories.description}
                                            </p>
                                            <div>
                                                <strong>
                                                    Rs. {item.product ? item.product.amount.toFixed(2) : item.accessories.amount.toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <span>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDeleteItem(
                                                item.id,
                                                item.product ? 'product' : 'accessory',
                                                item.product ? item.product.id : null,
                                                item.accessories ? item.accessories.id : null
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        <div className="box-shadow">
                            <p className="text-center">PRICE DETAILS</p>
                            <hr />
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Price ({cartData.total_cart_products} items):</td>
                                        <td></td>
                                        <td>Rs. {cartData.total_cart_product_amount ? cartData.total_cart_product_amount.toFixed(2) : "0.00"}</td>
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
                                    <tr>
                                        <td className="font-bold">Total Amount:</td>
                                        <td></td>
                                        <td className="font-bold">Rs. {(cartData.total_cart_product_amount + deliverycharge).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {(!userAddressData.shipping_addresses || userAddressData.shipping_addresses.length === 0 ||
                                !userAddressData.billing_addresses || userAddressData.billing_addresses.length === 0) ? (
                                <div>
                                    <button type="button" className="btn btn-primary" disabled>
                                        Add Address and Billing Address to Place Order
                                    </button>
                                    <Link className="text-danger mt-3" href='/user/shippingaddress'>
                                        Add address
                                    </Link>
                                </div>
                            ) : (
                                <button className="btn btn-primary" onClick={e => { makePayment(e, userID, productIDs, accessoryIDs, quantity, totalAmount, discount, deliverycharge, shippingAddressID, billingAddressID) }}>Place Order</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Cart;
