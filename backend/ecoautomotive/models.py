from django.db import models
from django.utils import timezone
from account.models import User
from django.core.exceptions import ValidationError

# Products
class Products(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='public/products')
    amount = models.FloatField()
    quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "1. Products"
        verbose_name_plural = "1. Products"

    def __str__(self):
        return self.name
    
# Accessories
class Accessories(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='public/accessories')
    amount = models.FloatField()
    quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "2. Accessories"
        verbose_name_plural = "2. Accessories"

    def __str__(self):
        return self.name
    
class SendEmail(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "3. Contact us Form"
        verbose_name_plural = "3. Contact us Form"

    def __str__(self):
        return f"{self.name} - {self.subject}"

class AddCart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True)
    accessories = models.ForeignKey(Accessories, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        verbose_name = "4. Add to Cart"
        verbose_name_plural = "4. Add to Cart"

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

# User Shipping Address
class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    alternatephonenumber = models.CharField(max_length=100, help_text="Format: +1234567890")
    address = models.TextField()
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10, help_text="Format: 12345")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.user.username} - {self.alternatephonenumber}"

class ShippingAddress(Address):
    class Meta:
        verbose_name = "5. Shipping Address"
        verbose_name_plural = "5. Shipping Addresses"
        unique_together = ('user',)
        
    def clean(self):
        # Check if a shipping address already exists for this user and raise an error if it does
        existing_address = ShippingAddress.objects.filter(user=self.user).exclude(pk=self.pk)
        if existing_address.exists():
            raise ValidationError('A shipping address already exists for this user.')

class BillingAddress(Address):
    class Meta:
        verbose_name = "6. Billing Address"
        verbose_name_plural = "6. Billing Addresses"
        unique_together = ('user',)
        
    def clean(self):
        # Check if a billing address already exists for this user and raise an error if it does
        existing_address = BillingAddress.objects.filter(user=self.user).exclude(pk=self.pk)
        if existing_address.exists():
            raise ValidationError('A billing address already exists for this user.')

# User Order Model
class Orders(models.Model):
    user = models.ForeignKey(User, related_name='cust_name', on_delete=models.CASCADE)
    product = models.ForeignKey(Products, related_name='product_details', on_delete=models.CASCADE,null=True, blank=True)
    accessories = models.ForeignKey(Accessories, related_name='accessories_details', on_delete=models.CASCADE,null=True, blank=True)
    quantity = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    deliverycharges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    billingAddress = models.ForeignKey(BillingAddress, related_name='billing_address', on_delete=models.CASCADE)
    shippingAddress = models.ForeignKey(ShippingAddress, related_name='shipping_address', on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    razorpay_payment_id = models.CharField(max_length=500, null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=500, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=500, null=True, blank=True)
    order_status_choices = [
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('confirm', 'Confirm'),
        ('on_the_way', 'On the way'),
        ('delivered', 'Delivered'),
    ]
    order_status = models.CharField(max_length=20, choices=order_status_choices, default="pending")
    payment_status_choices = [
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
        ('confirm', 'Confirm'),
    ]
    payment_status = models.CharField(max_length=50, choices=payment_status_choices, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        verbose_name = "7. Order"
        verbose_name_plural = "7. Orders"

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class UserOrderTracking(models.Model):
    user = models.ForeignKey(User, related_name='userorder_trackings', on_delete=models.CASCADE)
    order = models.ForeignKey(Orders, related_name="user_order_trackings", on_delete=models.CASCADE)
    location = models.CharField(max_length=500, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        verbose_name = "8. OrderTracking"
        verbose_name_plural = "8. OrdersTracking"
        
    def __str__(self):
        return f"OrderTracking #{self.id} - {self.user.username}"

class NotificationScrollHome(models.Model):
    title= models.CharField(max_length=500, blank=True, null=True)
    description=models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        verbose_name = "9. Notification Scroll"
        verbose_name_plural = "9. Notification Scroll"
        
    def __str__(self):
        return f"Nofitication #{self.id} - {self.title}"

class WishListItem(models.Model):
    user = models.ForeignKey(User, related_name='wishlist_user', on_delete=models.CASCADE)
    product = models.ForeignKey(Products, related_name='wishlist_product', on_delete=models.CASCADE, null=True)
    accessories = models.ForeignKey(Accessories, related_name='wishlist_accessories', on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        verbose_name = "10. Wish list items"
        verbose_name_plural = "10. Wish list items"

    def __str__(self):
        return f"{self.user.username} - {self.product.name} - {self.accessories.name}"

    


