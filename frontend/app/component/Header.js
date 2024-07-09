"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Function to fetch cart information and update the cart count
  const fetchCartInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      if (token && userId) {
        const response = await axios.get(`${process.env.API_URL}/api/user/carts/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartData = response.data;
        const totalCartProducts = cartData.cart_items.length > 0 ? cartData.total_cart_products : 0;
        //console.log(totalCartProducts);
        setCartCount(totalCartProducts);
        setUser(cartData);
      }
    } catch (error) {
      console.error("Error fetching cart data", error);
    }
  };

  useEffect(() => {
    fetchCartInfo();
    // Periodically fetch cart count every 1 second
    const cartCountInterval = setInterval(fetchCartInfo, 1000);
    return () => {
      // Cleanup the interval on component unmount
      clearInterval(cartCountInterval);
    };

  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="/asset/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="d-inline-block align-top"
            />
          </a>
          {/* <form className="d-flex ms-auto">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */}
          <div className="navbar-nav">
            <a className="nav-link mr-4" href="/user/cart">
              <i className="fa fa-shopping-cart fa-lg"></i>
              <span className="badge badge-pill badge-danger" id="cart-item-count">
                {cartCount}
              </span>
            </a>
            <a className="nav-link mr-4" href="#">
              <i className="fa fa-user fa-lg"></i>
              <br />
              <span>Dealer Signup</span>
            </a>
            {user ? (
              // Show profile dropdown only when authenticated
              <div className="nav-link dropdown dropdown-small">
                <i className="fa fa-user fa-lg"></i>
                <br />
                <a
                  data-toggle="dropdown"
                  data-hover="dropdown"
                  className="dropdown-toggle"
                  href="/user/profile/"
                >
                  <span className="key">{user.username}</span>
                  <span className="value"> </span>
                  <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown_link">
                    <Link href="/user/profile/">My Profile</Link>
                  </li>
                  <li className="dropdown_link">
                    <Link href="/user/cart">Cart</Link>
                  </li>
                  <li className="dropdown_link">
                    <Link href="/user/orders/orderslist">Orders</Link>
                  </li>
                  <li className="dropdown_link">
                    <Link href="/user/wishlist">Wishlist</Link>
                  </li>
                  <li className="dropdown_link">
                    <Link href="/user/changepassword/">Change Password</Link>
                  </li>
                  <li className="dropdown_link">
                    <Link href="/user/logout/">Logout</Link>
                  </li>
                </ul>
              </div>
            ) : (
              // Show login and register links when not authenticated
              <>
                <a className="nav-link mr-4" href="/register">
                  <i className="fa fa-user fa-lg"></i>
                  <br />
                  <span>Signup</span>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "white" }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-start"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav navbar-icons">
            <li className="nav-item">
              <a className="nav-link mr-5" href="/land">
                <i className="fa fa-home fa-lg"></i>
                <br />
                <b>Home</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/products">
                <i className="fa fa-bicycle fa-lg"></i>
                <br />
                <b>Products</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/accessories">
                <i className="bi bi-briefcase-fill"></i>
                <br />
                <b>Accessories</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/events">
                <i className="bi bi-calendar-check-fill"></i>
                <br />
                <b>Events</b>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle mr-5"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-certificate fa-lg"></i>
                <br />
                <b>Assurance</b>
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <a className="dropdown-item" href="#">
                  Warranty
                </a>
                <a className="dropdown-item" href="#">
                  Insurance
                </a>
                <a className="dropdown-item" href="#">
                  EMI
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/about">
                <i className="bi bi-person-vcard-fill"></i>
                <br />
                <b>About</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/login">
                <i className="fa fa-lock fa-lg"></i>
                <br />
                <b>Login</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="#">
                <i className="bi bi-file-play-fill"></i>
                <br />
                <b>Virtual Showroom</b>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mr-5" href="/contact">
                <i className="bi bi-person-vcard-fill"></i>
                <br />
                <b>Contact Us</b>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
