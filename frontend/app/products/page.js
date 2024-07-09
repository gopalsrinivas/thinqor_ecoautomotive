"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Product() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [userCart, setUserCart] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.API_URL}/api/products/`);
                setProducts(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        const checkAuthentication = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthenticated(true);
                loadCartData();
            } else {
                setAuthenticated(false);
            }
        };

        const loadCartData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userID');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${process.env.API_URL}/api/user/carts/${userId}/`, { headers });

                if (Array.isArray(response.data.cart_items)) {
                    setUserCart(response.data.cart_items);
                } else {
                    console.error('Invalid cart data format:', response.data);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        const loadWishlistData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userID');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${process.env.API_URL}/api/user/wishlist/${userId}/`, { headers });
                if (Array.isArray(response.data)) {
                    const wishlistItems = {};
                    response.data.forEach((item) => {
                        if (item.product !== null) {
                            wishlistItems[item.product.id] = true;
                        }
                        
                    });
                    setIsInWishlist(wishlistItems);
                } else {
                    console.error('Invalid wishlist data format:', response.data);
                }
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        };

        checkAuthentication();
        fetchData();
        loadWishlistData();
    }, []);

    const isInUserCart = (productId) => {
        return userCart.some((item) => item.product && item.product.id === productId);
    };

    const handleToggleCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userID');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const isInCart = isInUserCart(productId);

            if (isInCart) {
                try {
                    const response = await axios.delete(`${process.env.API_URL}/api/user/cart/Deletecart-item/${userId}/${productId}`, { headers });
                    if (response.status === 204) {
                        const updatedCart = userCart.filter((item) => item.product && item.product.id !== productId);
                        setUserCart(updatedCart);
                        // toast.success('Item removed from the cart');
                    } else {
                        console.error('Error removing from cart - Unexpected status code:', response.status);
                        toast.error('Failed to remove the item from the cart. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error removing from cart:', error);
                    toast.error('Failed to remove the item from the cart. Please try again later.');
                }
            } else {
                const data = {
                    user: userId,
                    product: productId,
                    accessories: null,
                    is_active: true,
                    quantity: 1,
                };

                try {
                    const response = await axios.post(`${process.env.API_URL}/api/user/cart/Addcart-items/`, data, { headers });
                    if (response.status === 201) {
                        setUserCart([...userCart, { product: { id: productId } }]);
                        //toast.success('Item added to the cart');
                    } else {
                        console.error('Error adding to cart - Unexpected status code:', response.status);
                        toast.error('Failed to add the item to the cart. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    toast.error('Failed to add the item to the cart. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

    const handleHeartClick = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userID');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const isInProductWishlist = isInWishlist[productId];

            if (isInProductWishlist) {
                // Remove the product from the wishlist
                const response = await axios.delete(`${process.env.API_URL}/api/user/wishlist/${userId}/${productId}/`, { headers });

                if (response.status === 204) {
                    setIsInWishlist({ ...isInWishlist, [productId]: false });
                    // toast.success('Item removed from the wishlist');
                } else {
                    console.error('Error removing from wishlist - Unexpected status code:', response.status);
                    toast.error('Failed to remove the item from the wishlist. Please try again later.');
                }
            } else {
                // Add the product to the wishlist
                const data = {
                    user: userId,
                    product: productId,
                    accessories: null,
                    is_active: true,
                };

                // Log the data before making the POST request
                //console.log('Data to be sent:', data);

                const response = await axios.post(`${process.env.API_URL}/api/user/wishlist/`, data, { headers });

                if (response.status === 201) {
                    setIsInWishlist({ ...isInWishlist, [productId]: true });
                    //toast.success('Item added to the wishlist');
                } else {
                    console.error('Error adding to wishlist - Unexpected status code:', response.status);
                    toast.error('Failed to add the item to the wishlist. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };


    if (isLoading) {
        return (
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center"><h1>Loading...</h1></div>
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
                        <div className="text-center"><h1>Error: {error.message}</h1></div>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length===0){
        return(
            <div className="container mt-3 mb-5">
                <div className='row'>
                    <div className='col-md-12'>
                        <h3 className='text-center'>Product Detail Not Found</h3>
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
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <Link href="/products">Product</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </nav>
            <div className="container mt-4 mb-4">
                <ToastContainer />
                <h4>Products</h4>
                <hr />
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <div className="card h-100">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        className="d-block w-100 card-img-top"
                                        alt={product.name}
                                    />
                                ) : (
                                    <img
                                        src="/asset/images/default_image.jpg"
                                        className="d-block w-100 card-img-top"
                                        alt="Default Image"
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="text-start">{product.description}</p>
                                    <p className="card-text mt-3 mb-3">
                                        <b>Rs. {product.amount}.00</b>
                                    </p>
                                    <div className="d-flex">
                                        {authenticated ? (
                                            
                                            <>
                                                <button
                                                    className={`btn ${isInUserCart(product.id) ? 'btn-danger' : 'btn-primary'} btn-sm me-1`}
                                                    onClick={() => handleToggleCart(product.id)}
                                                >
                                                    {isInUserCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                                                </button>
                                                <Link href={`products/${product.id}`} className="btn btn-success me-1">
                                                    Book Now
                                                </Link>
                                                <span className="ml-4">
                                                    <i className={`cursor fa ${isInWishlist[product.id] ? 'fa-heart dhrt' : 'fa-heart-o'}`} onClick={() => handleHeartClick(product.id)}></i>
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/login" className="btn btn-primary me-1">
                                                    Add to Cart
                                                </Link>
                                                <Link href="/login" className="btn btn-success me-1">
                                                    Book Now
                                                </Link>
                                                <span className="ml-4">
                                                    <Link href="/login"><i className="cursor fa fa-heart-o"></i></Link>
                                                </span>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Product;
