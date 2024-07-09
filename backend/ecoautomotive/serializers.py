from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phonenumber', 'is_active','created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id', 'name', 'description', 'image', 'amount', 'is_active', 'created_at', 'updated_at']
    def validate_name(self, value):
        if self.instance:
            if self.instance.name == value:
                return value
        existing_product = Products.objects.filter(name=value).exclude(pk=self.instance.pk if self.instance else None).first()
        if existing_product:
            raise serializers.ValidationError("Name already exists.")
        return value

class AccessoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessories
        fields = '__all__'

    def validate_name(self, value):
        if self.instance:
            if self.instance.name == value:
                return value
        existing_product = Accessories.objects.filter(name=value).exclude(pk=self.instance.pk if self.instance else None).first()
        if existing_product:
            raise serializers.ValidationError("Name already exists.")
        return value
    
class SendEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SendEmail
        fields = '__all__'
class AddCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddCart
        fields = '__all__'
        
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    accessories = AccessoriesSerializer()
    class Meta:
        model = AddCart
        fields = ['id', 'product', 'accessories', 'quantity', 'created_at', 'updated_at', 'is_active', 'user']
class UserCartSerializer(serializers.ModelSerializer):
    total_cart_product_amount = serializers.SerializerMethodField()
    total_cart_products = serializers.SerializerMethodField()
    cart_items = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phonenumber', 'is_active', 'created_at', 'updated_at',
            'total_cart_product_amount', 'total_cart_products', 'cart_items'
        ]

    def get_total_cart_product_amount(self, obj):
        total_amount = 0.0
        for cart_item in obj.addcart_set.filter(is_active=True):  # Filter out inactive cart items
            if cart_item.product and hasattr(cart_item.product, 'amount'):
                total_amount += cart_item.product.amount * cart_item.quantity
            elif cart_item.accessories and hasattr(cart_item.accessories, 'amount'):
                total_amount += cart_item.accessories.amount * cart_item.quantity
        return total_amount

    def get_total_cart_products(self, obj):
        return obj.addcart_set.filter(is_active=True).count()  # Count only active cart items

    def get_cart_items(self, obj):
        cart_items = obj.addcart_set.filter(is_active=True)  # Fetch only active cart items
        return CartItemSerializer(cart_items, many=True).data
# Shipping Address    
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

# Billing Address 
class BillingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingAddress
        fields = '__all__'

# Combine Shipping and Billing address
class UserWithAddressesSerializer(serializers.ModelSerializer):
    shipping_addresses = ShippingAddressSerializer(many=True, read_only=True)
    billing_addresses = BillingAddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'phonenumber','email', 'shipping_addresses', 'billing_addresses']
        
class UserOrderTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrderTracking
        fields = '__all__'
        
class OrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")
    user = UserSerializer()
    product = ProductSerializer()
    accessories = AccessoriesSerializer()
    billingAddress = BillingAddressSerializer()
    shippingAddress = ShippingAddressSerializer()
    user_order_trackings = UserOrderTrackingSerializer(many=True)  
    class Meta:
        model = Orders
        fields = '__all__'
        
class CartOrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")
    user = UserSerializer()
    product = ProductSerializer()
    accessories = AccessoriesSerializer()
    billingAddress = BillingAddressSerializer()
    shippingAddress = ShippingAddressSerializer()
    user_order_trackings = UserOrderTrackingSerializer(many=True)

    class Meta:
        model = Orders
        fields = '__all__'

class UserOrderTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrderTracking
        fields = '__all__'

class NotificationScrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationScrollHome
        fields = '__all__'

class WishListItemSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    product = ProductSerializer()
    accessories = AccessoriesSerializer()
    class Meta:
        model = WishListItem
        fields = '__all__'
        
        
