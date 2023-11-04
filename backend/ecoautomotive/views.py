from django.shortcuts import render
from rest_framework import generics,status
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from account.models import User
from django.shortcuts import get_object_or_404,get_list_or_404
from rest_framework.generics import RetrieveAPIView,ListAPIView
from django.http import Http404
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import RetrieveAPIView
from django.db import IntegrityError
import razorpay
from rest_framework import status
from django.conf import settings
import pdb
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db import transaction
import logging

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))

# Create your views here.
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Products.objects.all().filter(is_active=True).order_by('id')
    serializer_class = ProductSerializer

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
            
class AccessoriesListCreateView(generics.ListCreateAPIView):
    queryset = Accessories.objects.all().filter(is_active=True).order_by('id')
    serializer_class = AccessoriesSerializer

class AccessoriesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Accessories.objects.all()
    serializer_class = AccessoriesSerializer

class SendEmailListCreateView(generics.ListCreateAPIView):
    queryset = SendEmail.objects.all() 
    serializer_class = SendEmailSerializer
    def post(self, request, *args, **kwargs):
        serializer = SendEmailSerializer(data=request.data)
        if serializer.is_valid():
            # Send the email
            name = serializer.validated_data['name']
            phone_number = serializer.validated_data['phone_number']
            email = serializer.validated_data['email']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']
            title = "Contact Form from Thinqor Solutions"

            # Format the email body as an HTML table with a border
            email_body = f"""
                <html>
                    <body>
                        <table border="1" cellpadding="20" cellspacing="1" width="50%">
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{name}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <td><strong>Phone Number:</strong></td>
                                <td>{phone_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Subject:</strong></td>
                                <td>{subject}</td>
                            </tr>
                            <tr>
                                <td><strong>Message:</strong></td>
                                <td>{message}</td>
                            </tr>
                        </table>
                    </body>
                </html>
            """

            try:
                send_mail(
                    title,
                    '',  # Leave the message empty, as the content is in HTML format
                    settings.EMAIL_HOST_USER,  # From email
                    ['gopalsrinivas.b@gmail.com','bharatkumars@thinqorsolutions.com'],  # Recipient list
                    html_message=email_body,  # Specify the email content as HTML
                    fail_silently=False,
                )

                # Store email data in the database
                email_data = SendEmail(
                    name=name,
                    phone_number=phone_number,
                    email=email,
                    subject=subject,
                    message=message,
                )
                email_data.save()

                return Response({'message': 'Email sent and stored successfully'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserCartView(APIView):
#     def get(self, request):
#         users = User.objects.all()
#         data = []

#         for user in users:
#             cart_items = AddCart.objects.filter(user=user)
#             total_cart_product_amount = cart_items.aggregate(Sum('product__amount'))['product__amount__sum'] or 0
#             total_cart_products = cart_items.count()

#             user_data = {
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "phonenumber": user.phonenumber,
#                 "is_active": user.is_active,
#             }

#             cart_item_data = CartItemSerializer(cart_items, many=True).data

#             user_cart_data = {
#                 "user_data": user_data,
#                 "cart_items": cart_item_data,
#                 "total_cart_product_amount": total_cart_product_amount,
#                 "total_cart_products": total_cart_products,
#             }

#             data.append(user_cart_data)

#         return Response(data, status=status.HTTP_200_OK)

# All user cart List
class UserCartView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserCartSerializer

    def list(self, request, *args, **kwargs):
        try:
            users = self.get_queryset()
            data = []

            for user in users:
                cart_items = AddCart.objects.filter(user=user)
                total_cart_product_amount = cart_items.aggregate(Sum('product__amount'))['product__amount__sum'] or 0
                total_cart_products = cart_items.count()

                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "phonenumber": user.phonenumber,
                    "is_active": user.is_active,
                }

                cart_item_data = CartItemSerializer(cart_items, many=True).data

                user_cart_data = {
                    "user_data": user_data,
                    "cart_items": cart_item_data,
                    "total_cart_product_amount": total_cart_product_amount,
                    "total_cart_products": total_cart_products,
                }

                data.append(user_cart_data)

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# single user cart list view
class SingleUserCartView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserCartSerializer
    lookup_field = 'pk'
    
# user cart item create view
class AddCartItemView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = AddCart.objects.all()
    serializer_class = AddCartSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddCartAccessoryItemView(generics.ListCreateAPIView):
     # permission_classes = [IsAuthenticated]
    queryset = AddCart.objects.all()
    serializer_class = AddCartSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Remove from Products
class RemoveFromCartProductView(APIView):
    def delete(self, request, user_id, product_id, format=None):
        try:
            # Find the cart item with the given user ID and product ID
            cart_item = AddCart.objects.get(user=user_id, product=product_id)
            # Delete the cart item
            cart_item.delete()
            # Optionally, you can return a success response
            return Response({'message': 'Cart item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except AddCart.DoesNotExist:
            # If the cart item doesn't exist, return a not found response
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

# Remove from Accessories
class RemoveFromCartAccessoriesView(APIView):
    def delete(self, request, user_id, accessories_id, format=None):
        try:
            # Find the cart item with the given user ID and product ID
            cart_item = AddCart.objects.get(user=user_id, accessories=accessories_id)
            # Delete the cart item
            cart_item.delete()
            # Optionally, you can return a success response
            return Response({'message': 'Cart item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except AddCart.DoesNotExist:
            # If the cart item doesn't exist, return a not found response
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
     # permission_classes = [IsAuthenticated]
    queryset = AddCart.objects.all()
    serializer_class = AddCartSerializer
    
class UserCartListView(generics.ListAPIView):
    #permission_classes = [IsAuthenticated]
    serializer_class = AddCartSerializer

    def get_queryset(self):
        user = self.request.user
        return AddCart.objects.filter(user=user)
class ShippingAddressListView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Create and save the shipping address
            serializer = self.get_serializer(data=request.data)
            print(serializer);
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            # Return a success response
            return Response({'message': 'Shipping address created successfully'}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            if 'user' in e.detail and 'A shipping address already exists for this user.' in e.detail['user']:
                return Response({'error': 'A shipping address already exists for this user.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'An error occurred while creating the shipping address'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except IntegrityError as e:
            return Response({'error': 'An error occurred while creating the shipping address'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        
class ShippingAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
     # permission_classes = [IsAuthenticated]
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
class BillingAddressListView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = BillingAddress.objects.all()
    serializer_class = BillingAddressSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Create and save the billing address
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            # Return a success response
            return Response({'message': 'Billing address created successfully'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            if 'user' in e.detail and 'A billing address already exists for this user.' in e.detail['user']:
                return Response({'error': 'A billing address already exists for this user.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'An error occurred while creating the billing address'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except IntegrityError as e:
            return Response({'error': 'An error occurred while creating the billing address'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
class BillingAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
     # permission_classes = [IsAuthenticated]
    queryset = BillingAddress.objects.all()
    serializer_class = BillingAddressSerializer
class UserWithAddressesView(RetrieveAPIView):
     # permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserWithAddressesSerializer
    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            shipping_addresses = ShippingAddress.objects.filter(user=user)
            billing_addresses = BillingAddress.objects.filter(user=user)

            user_serializer = self.get_serializer(user)
            shipping_serializer = ShippingAddressSerializer(shipping_addresses, many=True)
            billing_serializer = BillingAddressSerializer(billing_addresses, many=True)

            response_data = user_serializer.data
            response_data['shipping_addresses'] = shipping_serializer.data
            response_data['billing_addresses'] = billing_serializer.data

            return Response(response_data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
@csrf_exempt
def new_order(request):
    if request.method == "POST":
        try:
            userID = request.POST['user']
            productID = request.POST.get('productID', None)
            accessoryID = request.POST.get('accessoryID', None)
            amount = int(request.POST['totalAmount'])
            famount=float(amount)
            formatted_amount = f"{famount:.2f}"
            discount = int(request.POST['discount'])
            fdiscount=float(discount)
            formatted_discount = f"{fdiscount:.2f}"
            deliverycharge = int(request.POST['deliverycharge'])
            fdeliverycharge=float(deliverycharge)
            formatted_deliverycharge = f"{fdeliverycharge:.2f}"
            quantity = int(request.POST['quantity'])
            shippingAddressID = int(request.POST['shippingAddressID'])
            billingAddressID = int(request.POST['billingAddressID'])
            print(f"userID: {userID}, productID: {productID}, accessoryID: {accessoryID}, amount: {formatted_amount}, discount: {formatted_discount}, deliverycharge: {formatted_deliverycharge}, quantity: {quantity}, shippingAddressID: {shippingAddressID}, billingAddressID: {billingAddressID}")
            # Get instances from the database, handle exceptions if not found
            try:
                user_instance = get_object_or_404(User, pk=userID)
                if productID is not None:
                    product_instance = get_object_or_404(Products, pk=productID)
                else:
                    product_instance = None
                if accessoryID is not None:
                    accessory_instance = get_object_or_404(Accessories, pk=accessoryID)
                else:
                    accessory_instance = None
                shipping_address_instance = get_object_or_404(ShippingAddress, pk=shippingAddressID)
                billing_address_instance = get_object_or_404(BillingAddress, pk=billingAddressID)
            except:
                return JsonResponse({'error': 'Invalid user, product, or address ID.'}, status=400)
            new_order_response = razorpay_client.order.create({
                "amount": amount * 100,
                "currency": "INR",
                "payment_capture": "1"
            })
            order = Orders.objects.create(
                        user=user_instance,
                        product=product_instance,
                        accessories=accessory_instance,
                        total_amount=formatted_amount,
                        discount=formatted_discount,
                        deliverycharges=formatted_deliverycharge,
                        quantity=quantity,
                        shippingAddress=shipping_address_instance,
                        billingAddress=billing_address_instance,
                        razorpay_payment_id='',
                        razorpay_signature='',
                        payment_status='pending',
                        order_status='pending',
                        razorpay_order_id=new_order_response['id']
            )
            serializer = OrderSerializer(order)
            response_data = {
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "order": new_order_response,
                "order_data": serializer.data
            }
            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)    
    
class order_callback(APIView):
    def post(self, request):
        try:
            rzpay_payment_id = request.data.get("razorpay_payment_id")
            rzpay_order_id = request.data.get("razorpay_order_id")
            rzpay_signature = request.data.get("razorpay_signature")
            #print(rzpay_payment_id + "<br>" + rzpay_order_id + "<br>" + rzpay_signature)
            # Get order by payment_id which we've created earlier with isPaid=False
            order = get_object_or_404(Orders, razorpay_order_id=rzpay_order_id)
            # Create the data dictionary to pass to the Razorpay client for signature verification
            data = {
                'razorpay_order_id': rzpay_order_id,
                'razorpay_payment_id': rzpay_payment_id,
                'razorpay_signature': rzpay_signature
            }
            # Verify the payment signature with Razorpay client
            check = razorpay_client.utility.verify_payment_signature(data)
            if check:
                # Signature is valid, proceed with payment confirmation
                order.razorpay_payment_id = rzpay_payment_id
                order.razorpay_signature = rzpay_signature
                order.payment_status = "confirm"
                order.order_status = 'confirm'
                order.save()
                res_data = {
                    "message": "Payment successfully received!",
                    "status": "success",
                    "orderID": rzpay_order_id,
                }
                # Define conditions using Q objects
                condition1 = Q(order_status='confirm')
                condition2 = Q(payment_status='confirm')
                condition3 = Q(razorpay_order_id=rzpay_order_id)
                # Combine conditions using the '&' (AND) operator
                combined_condition = condition1 & condition2 & condition3
                # Query to retrieve specific orders based on the combined condition
                orderdetails = Orders.objects.prefetch_related('user','product','accessories', 'billingAddress','shippingAddress').values(
                                 'user__username','user__email','user__phonenumber',
                                 'product__name','product__amount',
                                 'accessories__name','accessories__amount',
                                 'shippingAddress__name','shippingAddress__alternatephonenumber','shippingAddress__address','shippingAddress__country','shippingAddress__state','shippingAddress__city','shippingAddress__postal_code',
                                 'billingAddress__name','billingAddress__alternatephonenumber','billingAddress__address','billingAddress__country','billingAddress__state','billingAddress__city','billingAddress__postal_code',
                                 'quantity','total_amount','discount','deliverycharges','order_date','razorpay_order_id','razorpay_payment_id','order_status','payment_status'
                                 ).filter(combined_condition)
                
                # Extract the first item from the queryset (if it exists)
                if orderdetails:
                    order = orderdetails[0]
                    
                    name = order['user__username']
                    email = order['user__email']
                    phone_number = order['user__phonenumber']
                    Item_name = order['product__name']
                    Item_amount = order['product__amount']
                    Item_name2 = order['accessories__name']
                    Item_amount2 = order['accessories__amount']
                    Order_ID = order['razorpay_order_id']
                    Payment_ID = order['razorpay_payment_id']
                    Order_status = order['order_status']
                    Order_place_On = order['order_date'].strftime("%d %B %Y %I:%M %p")
                    quantity = order['quantity']
                    discount = order['discount']
                    deliverychanges = order['deliverycharges']
                    totalamount = order['total_amount']
                    shname = order['shippingAddress__name']
                    shmobileno = order['shippingAddress__alternatephonenumber']
                    shcountry = order['shippingAddress__country']
                    shstate = order['shippingAddress__state']
                    shcity = order['shippingAddress__city']
                    shpincode = order['shippingAddress__postal_code']
                    biname = order['billingAddress__name']
                    bimobileno = order['billingAddress__alternatephonenumber']
                    bicountry = order['billingAddress__country']
                    bistate = order['billingAddress__state']
                    bicity = order['billingAddress__city']
                    bipincode = order['billingAddress__postal_code']
                    
                    subject = "Your order has been successfully placed."
                    # Construct the email body Booking details sent to the customer
                    email_body = f"""
                    <html>
                        <body>
                            <table border="1" cellpadding="20" cellspacing="0" width="100%">
                                <tr>
                                    <td colspan="4" style="text-align:center">User Details</td>
                                </tr>
                                <tr>
                                    <td><strong>Name:</strong><br/>{name}</td>
                                    <td><strong>Email:</strong><br/>{email}</td>
                                    <td><strong>Phone Number:</strong><br/>{phone_number}</td>
                                </tr>
                                <tr>
                                    <td colspan="6" style="text-align:center">Item Details</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Item Name:</strong><br/>{Item_name}</td>
                                    <td colspan="2"><strong>Item amount:</strong><br/>{Item_amount}</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Item Name:</strong><br/>{Item_name2}</td>
                                    <td colspan="2"><strong>Item amount:</strong><br/>{Item_amount2}</td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="text-align:center">Order Details</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Order ID</strong><br/>{Order_ID}</td>
                                    <td colspan="2"><strong>Payment ID</strong><br/>{Payment_ID}</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Order Status</strong><br/>{Order_status}</td>
                                    <td colspan="2"><strong>Order placed on</strong><br/>{Order_place_On}</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Quantity</strong><br/>{quantity}</td>
                                    <td colspan="2"><strong>Discount</strong><br/>{discount}</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Delivery Charges</strong><br/>{deliverychanges}</td>
                                    <td colspan="2"><strong>Total Amount</strong><br/>{totalamount}</td>
                                </tr>
                                <tr>
                                    <td colspan="6" style="text-align:center">Address Details</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><strong>Shipping Address</strong><br/>
                                       {shname},{shmobileno},{shcountry},{shstate},{shcity},{shpincode}
                                    </td>
                                    <td colspan="2"><strong>Billing Address</strong><br/>
                                        {biname},{bimobileno},{bicountry},{bistate},{bicity},{bipincode}
                                    </td>
                                </tr>
                                </table>

                        </body>
                    </html>
                """
                # Send the email
                send_mail(
                    subject,
                    '',  # Leave the message empty, as the content is in HTML format
                    settings.EMAIL_HOST_USER,  # From email
                    ['gopalsrinivas.b@gmail.com',email],  # Recipient list
                    html_message=email_body,  # Specify the email content as HTML
                    fail_silently=False,
                )
                
                return Response(res_data, status=status.HTTP_200_OK)
            else:
                # Signature is not valid, handle the error
                error_message = 'Invalid payment signature'
                return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Orders.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
class LatestOrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    lookup_field = 'user_id'

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            order = Orders.objects.filter(user_id=user_id, order_status='confirm').latest('order_date')
            return order
        except Orders.DoesNotExist:
            raise Http404("Order does not exist")

class CartOrderDetailView(ListAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'razorpay_order_id'

    def get_queryset(self):
        order_id = self.kwargs.get('razorpay_order_id')
        logging.info(f"Order ID from URL: {order_id}")
        # Use Q objects to filter by order ID and order status
        orders = Orders.objects.filter(
            Q(razorpay_order_id=order_id) & Q(order_status='confirm')
        )
        # Use select_related to fetch related product and accessories
        orders = orders.select_related('product', 'accessories')
        # Use distinct to ensure uniqueness
        orders = orders.distinct()
        return orders
    
class UserOrdersListView(generics.ListAPIView):
    queryset = Orders.objects.filter(order_status='confirm',payment_status='confirm').order_by('-id')
    serializer_class=OrderSerializer
class UserOrderRetrieveView(generics.RetrieveAPIView):
    queryset = Orders.objects.filter(order_status='confirm',payment_status='confirm').order_by('-id')
    serializer_class = OrderSerializer
class NotificationScrollListCreateView(generics.ListCreateAPIView):
    queryset = NotificationScrollHome.objects.filter(is_active=True).order_by('-id')
    serializer_class = NotificationScrollSerializer

class NotificationScrollRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NotificationScrollHome.objects.filter(is_active=True)
    serializer_class = NotificationScrollSerializer

class UserWishlistListView(generics.ListAPIView):
    serializer_class = WishListItemSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')  # Make sure the URL parameter matches your URL configuration
        try:
            queryset = WishListItem.objects.filter(user=user_id, is_active=True)
            return queryset
        except WishListItem.DoesNotExist:
            return Response({"error": "Wishlist not found for this user."}, status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class WishListItemListCreateView(generics.ListCreateAPIView):
    queryset = WishListItem.objects.filter(is_active=True)
    serializer_class = WishListItemSerializer

    def create(self, request, *args, **kwargs):
        try:
            user_id = request.data.get('user')
            product_id = request.data.get('product')
            accessory_id = request.data.get('accessories')
            
            print(str(user_id) + ' -- ' + str(product_id) + ' -- ' + str(accessory_id))
            
            user = User.objects.get(id=user_id)
            product = Products.objects.get(id=product_id) if product_id else None
            accessory = Accessories.objects.get(id=accessory_id) if accessory_id else None
            
            print(str(user) + ' -- ' + str(product) + ' -- ' + str(accessory))

            # Create a new WishListItem
            wish_list_item = WishListItem(
                user=user,
                product=product,
                accessories=accessory,
                is_active=True
            )
            wish_list_item.save()

            return Response({"message": "WishListItem created successfully."}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Products.DoesNotExist:
            return Response({"error": "Product or accessory not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

           
class WishListItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WishListItemSerializer

    def get_object(self):
        userId = self.kwargs['userId']
        productId = self.kwargs['productId']
        try:
            # Attempt to retrieve the specific WishListItem
            return WishListItem.objects.get(user=userId, product=productId, is_active=True)
        except WishListItem.DoesNotExist:
            raise Http404("WishListItem does not exist")

    def perform_destroy(self, instance):
        try:
            # Perform a permanent (hard) delete
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(data={"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AccessoryWishListItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WishListItemSerializer

    def get_object(self):
        userId = self.kwargs['userId']
        accessoryId = self.kwargs['accessoryId']
        try:
            # Attempt to retrieve the specific WishListItem
            return WishListItem.objects.get(user=userId, accessories=accessoryId, is_active=True)
        except WishListItem.DoesNotExist:
            raise Http404("WishListItem does not exist")

    def perform_destroy(self, instance):
        try:
            # Perform a permanent (hard) delete
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(data={"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def new_cartorder(request):
    if request.method == "POST":
        try:
            # Extract request data
            userID = request.POST['user']
            productID = request.POST.get('productID', "")
            accessoryID = request.POST.get('accessoryID', "")
            totalAmount = float(request.POST['totalAmount'])
            discount = float(request.POST['discount'])
            deliverycharge = float(request.POST['deliverycharge'])
            quantity = int(request.POST['quantity'])
            shippingAddressID = int(request.POST['shippingAddressID'])
            billingAddressID = int(request.POST['billingAddressID'])

            # Handle productID and accessoryID
            productIDs = [int(id) for id in productID.split(',') if id]
            accessoryIDs = [int(id) for id in accessoryID.split(',') if id]

            # Initialize product_instances and accessory_instances
            product_instances = []
            accessory_instances = []

            # Get user, shipping address, and billing address instances
            user_instance = get_object_or_404(User, pk=userID)
            shipping_address_instance = get_object_or_404(ShippingAddress, pk=shippingAddressID)
            billing_address_instance = get_object_or_404(BillingAddress, pk=billingAddressID)

            # Get product instances
            if productIDs:
                product_instances = Products.objects.filter(pk__in=productIDs)

            # Get accessory instances
            if accessoryIDs:
                accessory_instances = Accessories.objects.filter(pk__in=accessoryIDs)

            # Create a new order in Razorpay
            new_order_response = razorpay_client.order.create({
                "amount": int(totalAmount * 100),  # Convert totalAmount to integer cents
                "currency": "INR",
                "payment_capture": 1
            })

            # Create orders for each product instance
            for product_instance in product_instances:
                order = Orders.objects.create(
                    user=user_instance,
                    product=product_instance,
                    accessories=None,
                    total_amount=totalAmount,
                    discount=discount,
                    deliverycharges=deliverycharge,
                    quantity=quantity,
                    shippingAddress=shipping_address_instance,
                    billingAddress=billing_address_instance,
                    razorpay_payment_id='',
                    razorpay_signature='',
                    payment_status='pending',
                    order_status='pending',
                    razorpay_order_id=new_order_response['id']
                )

            # If there are accessory instances, insert them individually with the same product instance
            for accessory_instance in accessory_instances:
                order = Orders.objects.create(
                    user=user_instance,
                    product=None,  # Set product to None
                    accessories=accessory_instance,
                    total_amount=totalAmount,
                    discount=discount,
                    deliverycharges=deliverycharge,
                    quantity=quantity,
                    shippingAddress=shipping_address_instance,
                    billingAddress=billing_address_instance,
                    razorpay_payment_id='',
                    razorpay_signature='',
                    payment_status='pending',
                    order_status='pending',
                    razorpay_order_id=new_order_response['id']
                )

                
            serializer = OrderSerializer(order)
            response_data = {
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "order": new_order_response,
                "order_data": serializer.data
            }
            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
class cartorder_callback(APIView):
    def post(self, request):
        try:
            rzpay_payment_id = request.data.get("razorpay_payment_id")
            rzpay_order_id = request.data.get("razorpay_order_id")
            rzpay_signature = request.data.get("razorpay_signature")
            
            # Retrieve all orders with the same razorpay_order_id
            orders_to_update = Orders.objects.filter(razorpay_order_id=rzpay_order_id)
            for order in orders_to_update:
                order.razorpay_payment_id = rzpay_payment_id
                order.razorpay_signature = rzpay_signature
                order.payment_status = "confirm"
                order.order_status = 'confirm'
                order.save()
            # Change Flag addcart false
            orders_to_update = Orders.objects.filter(razorpay_order_id=rzpay_order_id)
            for order in orders_to_update:
                user_id = order.user_id
                # Update the is_active field to False for the specified user's AddCart items
                #AddCart.objects.filter(user=user_id).update(is_active=False)
                AddCart.objects.filter(user=user_id).delete()
            res_data = {
                "message": "Payment successfully received!",
                "status": "success",
                "orderID": rzpay_order_id,
            }
            return Response(res_data, status=status.HTTP_200_OK)
        except Orders.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
