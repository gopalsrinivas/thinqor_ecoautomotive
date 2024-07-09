"use client";
import React, { useState, useEffect } from 'react';
import Menu from '../menu/page';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const ShippingAddress = () => {
    const router = useRouter();
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        router.push("/user/logout");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const [shippingData, setShippingData] = useState({
        name: '',
        alternatephonenumber: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        user: userId,
    });

    const [billingData, setBillingData] = useState({
        name: '',
        alternatephonenumber: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        user: userId,
    });

    const [shippingEditMode, setShippingEditMode] = useState(false);
    const [billingEditMode, setBillingEditMode] = useState(false);
    const [editingShippingAddressId, setEditingShippingAddressId] = useState(null);
    const [editingBillingAddressId, setEditingBillingAddressId] = useState(null);

    const [useBillingAsShipping, setUseBillingAsShipping] = useState(false);
    const [userData, setUserData] = useState({});

    const handleUseBillingChange = (e) => {
        const value = e.target.value === 'yes';
        setUseBillingAsShipping(value);

        if (value) {
            setBillingData({ ...shippingData });
        } else {
            setBillingData({
                name: '',
                alternatephonenumber: '',
                address: '',
                country: '',
                state: '',
                city: '',
                postal_code: '',
                user: userId,
            });
        }
    };

    const clearShippingFormData = () => {
        setShippingData({
            name: '',
            alternatephonenumber: '',
            address: '',
            country: '',
            state: '',
            city: '',
            postal_code: '',
            user: userId,
        });
    };

    const clearBillingFormData = () => {
        setBillingData({
            name: '',
            alternatephonenumber: '',
            address: '',
            country: '',
            state: '',
            city: '',
            postal_code: '',
            user: userId,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const shippingAddressApi = `${process.env.API_URL}/api/user/shipping-address/`;
        const billingAddressApi = `${process.env.API_URL}/api/user/billing-address/`;

        const updatePromises = [];

        if (shippingEditMode) {
            // Update Shipping Address
            updatePromises.push(
                axios
                    .put(`${shippingAddressApi}${editingShippingAddressId}/`, shippingData, { headers })
                    .then((response) => {
                        console.log('Shipping Address Updated:', response.data);
                        clearShippingFormData();
                        setShippingEditMode(false);
                        toast.success('Shipping address updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error updating shipping address:', error);
                        //toast.error('An error occurred while updating the shipping address');
                    })
            );
        } else {
            // Create a New Shipping Address
            updatePromises.push(
                axios
                    .post(shippingAddressApi, shippingData, { headers })
                    .then((response) => {
                        console.log('Shipping Address Submitted:', response.data);
                        clearShippingFormData();
                        toast.success('Shipping address created successfully');
                    })
                    .catch((error) => {
                        console.error('Error submitting shipping address:', error);
                        //toast.error('An error occurred while adding the shipping address');
                    })
            );
        }

        if (billingEditMode) {
            // Update Billing Address
            updatePromises.push(
                axios
                    .put(`${billingAddressApi}${editingBillingAddressId}/`, billingData, { headers })
                    .then((response) => {
                        console.log('Billing Address Updated:', response.data);
                        clearBillingFormData();
                        setBillingEditMode(false);
                        toast.success('Billing address updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error updating billing address:', error);
                        //toast.error('An error occurred while updating the billing address');
                    })
            );
        } else {
            // Create a New Billing Address
            updatePromises.push(
                axios
                    .post(billingAddressApi, billingData, { headers })
                    .then((response) => {
                        console.log('Billing Address Submitted:', response.data);
                        clearBillingFormData();
                        toast.success('Billing address created successfully');
                    })
                    .catch((error) => {
                        console.error('Error submitting billing address:', error);
                        //toast.error('An error occurred while adding the billing address');
                    })
            );
        }

        Promise.all(updatePromises).then(() => {
            fetchUserData();
        });
    };


    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/user/address/${userId}/`, {
                headers: headers,
            });
            setUserData(response.data);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching user data');
        }
    };

    const handleEditShippingAddress = (address) => {
        setShippingEditMode(true);
        setShippingData({ ...address });
        setEditingShippingAddressId(address.id);

        // Scroll to the "Shipping Address" section smoothly
        const shippingAddressSection = document.getElementById("shippingform");
        if (shippingAddressSection) {
            shippingAddressSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleEditBillingAddress = (address) => {
        setBillingEditMode(true);
        setBillingData({ ...address });
        setEditingBillingAddressId(address.id);
        // Scroll to the "Billing Address" section smoothly
        const billingAddressSection = document.getElementById("billingform");
        if (billingAddressSection) {
            billingAddressSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleDeleteShippingAddress = async (addressId) => {
        try {
            await axios.delete(`${process.env.API_URL}/api/user/shipping-address/${addressId}/`, {
                headers: headers,
            });
            const updatedShippingAddresses = userData.shipping_addresses.filter(
                (address) => address.id !== addressId
            );
            setUserData({ ...userData, shipping_addresses: updatedShippingAddresses });
            toast.success('Shipping address deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the shipping address');
        }
    };

    const handleDeleteBillingAddress = async (addressId) => {
        try {
            await axios.delete(`${process.env.API_URL}/api/user/billing-address/${addressId}/`, {
                headers: headers,
            });
            const updatedBillingAddresses = userData.billing_addresses.filter(
                (address) => address.id !== addressId
            );
            setUserData({ ...userData, billing_addresses: updatedBillingAddresses });
            toast.success('Billing address deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the billing address');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <a href="/user/shippingaddress/">Shipping Address</a>
                            </li>
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
                        <h6>Address</h6>
                        <hr />

                        <div className="row">
                            <div className="col-md-4 box-shadow">
                                <h6>Shipping Addresses</h6>
                                <hr />
                                {userData?.shipping_addresses?.length > 0 ? (
                                    <div>
                                        {userData.shipping_addresses.map((address, index) => (
                                            <div key={index}>
                                                <p>Name: {address.name}</p>
                                                <p>Alternate Phone Number: {address.alternatephonenumber}</p>
                                                <p>Address: {address.address}</p>
                                                <p>Country: {address.country}</p>
                                                <p>State: {address.state}</p>
                                                <p>City: {address.city}</p>
                                                <p>Postal Code: {address.postal_code}</p>
                                                <hr />
                                                <button className="btn btn-primary" onClick={() => handleEditShippingAddress(address)}>Edit</button>
                                                <button className="btn btn-danger float-right" onClick={() => handleDeleteShippingAddress(address.id)}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No shipping data available</p>
                                )}
                            </div>

                            <div className="col-md-4 box-shadow">
                                <h6>Billing Addresses</h6>
                                <hr />
                                {userData && userData.billing_addresses?.length > 0 ? (
                                    <div>
                                        {userData.billing_addresses.map((address, index) => (
                                            <div key={index}>
                                                <p>Name: {address.name}</p>
                                                <p>Alternate Phone Number: {address.alternatephonenumber}</p>
                                                <p>Address: {address.address}</p>
                                                <p>Country: {address.country}</p>
                                                <p>State: {address.state}</p>
                                                <p>City: {address.city}</p>
                                                <p>Postal Code: {address.postal_code}</p>
                                                <hr />
                                                <button className="btn btn-primary" onClick={() => handleEditBillingAddress(address)}>Edit</button>
                                                <button className="btn btn-danger float-right" onClick={() => handleDeleteBillingAddress(address.id)}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No billing data available</p>
                                )}
                            </div>
                        </div>

                        <div className="container mt-3 mb-3 box-shadow">
                            <h6 id="shippingform">Shipping Address</h6>
                            <hr />
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-4"> 
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipName">Name</label>
                                            <input
                                                type="text"
                                                id="shipName"
                                                value={shippingData.name}
                                                className="form-control"
                                                onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipPhoneNumber">Phone Number</label>
                                            <input
                                                type="text"
                                                id="shipPhoneNumber"
                                                className="form-control"
                                                value={shippingData.alternatephonenumber}
                                                onChange={(e) => setShippingData({ ...shippingData, alternatephonenumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="shipAddress">Address</label>
                                    <textarea
                                        id="shipAddress"
                                        className="form-control"
                                        value={shippingData.address}
                                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipCountry">Country</label>
                                            <input
                                                type="text"
                                                id="shipCountry"
                                                className="form-control"
                                                value={shippingData.country}
                                                onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipState">State</label>
                                            <input
                                                type="text"
                                                id="shipState"
                                                className="form-control"
                                                value={shippingData.state}
                                                onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipCity">City</label>
                                            <input
                                                type="text"
                                                id="shipCity"
                                                className="form-control"
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="shipPostalCode">Postal Code</label>
                                            <input
                                                type="text"
                                                id="shipPostalCode"
                                                className="form-control"
                                                value={shippingData.postal_code}
                                                onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="useBilling"
                                        id="useBillingYes"
                                        value="yes"
                                        checked={useBillingAsShipping}
                                        onChange={handleUseBillingChange}
                                    />
                                    <label className="form-check-label" htmlFor="useBillingYes">
                                        Yes (Use Billing Address as Shipping Address)
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="useBilling"
                                        id="useBillingNo"
                                        value="no"
                                        checked={!useBillingAsShipping}
                                        onChange={handleUseBillingChange}
                                    />
                                    <label className="form-check-label" htmlFor="useBillingNo">
                                        No (Enter separate Billing Address)
                                    </label>
                                </div>
                                <br />
                                <h6 id="billingform">Billing Address</h6>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billName">Name</label>
                                            <input
                                                type="text"
                                                id="billName"
                                                className="form-control"
                                                value={billingData.name}
                                                onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billPhoneNumber">Phone Number</label>
                                            <input
                                                type="text"
                                                id="billPhoneNumber"
                                                className="form-control"
                                                value={billingData.alternatephonenumber}
                                                onChange={(e) => setBillingData({ ...billingData, alternatephonenumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-outline mb-2">
                                    <label className="form-label" htmlFor="billAddress">Address</label>
                                    <textarea
                                        id="billAddress"
                                        className="form-control"
                                        value={billingData.address}
                                        onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billCountry">Country</label>
                                            <input
                                                type="text"
                                                id="billCountry"
                                                className="form-control"
                                                value={billingData.country}
                                                onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billState">State</label>
                                            <input
                                                type="text"
                                                id="billState"
                                                className="form-control"
                                                value={billingData.state}
                                                onChange={(e) => setBillingData({ ...billingData, state: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billCity">City</label>
                                            <input
                                                type="text"
                                                id="billCity"
                                                className="form-control"
                                                value={billingData.city}
                                                onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="billPostalCode">Postal Code</label>
                                            <input type="text"
                                                id="billPostalCode"
                                                className="form-control"
                                                value={billingData.postal_code}
                                                onChange={(e) => setBillingData({ ...billingData, postal_code: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShippingAddress;
