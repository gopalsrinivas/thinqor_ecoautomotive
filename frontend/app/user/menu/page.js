import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Menu = () => {
    const currentRoute = usePathname();

    return (
        <>
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active text-center" aria-current="true">
                    Menu
                </a>
                <Link href="/user/profile" className={currentRoute === "/user/profile" ? "list-group-item list-group-item-action active-sidemenu" : "list-group-item list-group-item-action"}>My Profile</Link>
                <Link href="/user/shippingaddress" className={currentRoute === "/user/shippingaddress" ? "list-group-item list-group-item-action active-sidemenu" : "list-group-item list-group-item-action"}>Shipping Address</Link>
                <Link href="/user/cart" className="list-group-item list-group-item-action">Cart</Link>
                <Link href="/user/orders/orderslist" className="list-group-item list-group-item-action">Orders</Link>
                <Link href="/user/wishlist" className="list-group-item list-group-item-action">Wishlist</Link>
                <Link href="/user/changepassword" className={currentRoute === "/user/changepassword" ? "list-group-item list-group-item-action active-sidemenu" : "list-group-item list-group-item-action"}>Change Password</Link>
                <Link href="/user/logout" className={currentRoute === "/user/logout" ? "list-group-item list-group-item-action active-sidemenu" : "list-group-item list-group-item-action"} >Logout</Link>
            </div>
        </>
    )
}

export default Menu