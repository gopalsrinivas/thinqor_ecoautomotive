from django.urls import path
from .views import *
from . import views

urlpatterns = [
    # products
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product-detail'),
    # Accessories
    path('accessories/', AccessoriesListCreateView.as_view(), name='product-list'),
    path('accessories/<int:pk>/', AccessoriesRetrieveUpdateDestroyView.as_view(), name='product-detail'),
    # SendEmail
    path('send-email/', SendEmailListCreateView.as_view(), name='send-email'),    
    # cart details
    path('user/cart/Addcart-items/', AddCartItemView.as_view(), name='user-cart-item-list-create'),
    path('user/cart/Addcart-accessoryitems/', AddCartAccessoryItemView.as_view(), name='user-cart-Accessoryitem-list-create'),
    path('user/cart/Addcart-items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('user/cart/Deletecart-item/<int:user_id>/<int:product_id>/', RemoveFromCartProductView.as_view(), name='remove_cart_Product_item'),
    path('user/cart/Deletecart-accessoryitem/<int:user_id>/<int:accessories_id>/', RemoveFromCartAccessoriesView.as_view(), name='remove_cart_Accessories_item'),
    path('user/carts/<int:pk>/', SingleUserCartView.as_view(), name='single-user-cart'),
    # Shipping Address
    path('user/shipping-address/', ShippingAddressListView.as_view(), name='shipping-address-list'),
    path('user/shipping-address/<int:pk>/', ShippingAddressDetailView.as_view(), name='shipping-address-detail'),
    path('user/billing-address/', BillingAddressListView.as_view(), name='billing-address-list'),
    path('user/billing-address/<int:pk>/', BillingAddressDetailView.as_view(), name='billing-address-detail'),
    path('user/address/<int:pk>/', UserWithAddressesView.as_view(), name='user-with-addresses'),
    # Users orders
    path("user/orders/", views.new_order,name="razorpay-New-order-api"),
    path("user/orders/success/",order_callback.as_view(),name="razorpay-complete-order-api"),
    path('user/latest-order/<int:user_id>/', LatestOrderDetailView.as_view(), name='latest-order-detail'),
    path('user/cartorder/<str:razorpay_order_id>/', CartOrderDetailView.as_view(), name='Cartorder-detail'),
    path('user/orderslist/', UserOrdersListView.as_view(), name='order-list'),
    path('user/ordersview/<int:pk>/', UserOrderRetrieveView.as_view(), name='order-retrieve'),
    path("user/cartorders/", views.new_cartorder,name="razorpay-New-cartorder-api"),
    path("user/orders/cartsuccess/",cartorder_callback.as_view(),name="razorpay-complete-order-api"),
    # Notification Scroll
    path('notification/', NotificationScrollListCreateView.as_view(), name='notification-list-create'),
    path('notification/<int:pk>/', NotificationScrollRetrieveUpdateDestroyView.as_view(), name='notification-detail'),
    # Wish List Item
    path('user/wishlist/', views.WishListItemListCreateView.as_view(), name='wishlist-list'),
    path('user/wishlist/<int:userId>/<int:productId>/', views.WishListItemRetrieveUpdateDestroyView.as_view(), name='Productwishlist-delete'),
    path('user/awishlist/<int:userId>/<int:accessoryId>/', views.AccessoryWishListItemRetrieveUpdateDestroyView.as_view(), name='Accessorywishlist-delete'),
    path('user/wishlist/<int:user_id>/', UserWishlistListView.as_view(), name='user-wishlist-list'),
]
