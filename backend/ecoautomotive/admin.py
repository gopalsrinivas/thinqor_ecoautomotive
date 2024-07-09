from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from django.db.models import Sum

# Register your models here.
class ProductsFromAdmin(admin.ModelAdmin):
    list_display = ('id','name','amount','is_active','created_at')
    list_filter = ('name','is_active')
    ordering=("-id",)
admin.site.register(Products, ProductsFromAdmin)
class AccessoriesFormAdmin(admin.ModelAdmin):
    list_display = ('id','name','amount','is_active','created_at')
    list_filter = ('name','is_active')
    ordering=("-id",)
admin.site.register(Accessories, AccessoriesFormAdmin)

class ContactusFormAdmin(admin.ModelAdmin):
    list_display = ('id','name','subject','created_at')
    list_filter = ('name',)
    ordering=("-id",)
admin.site.register(SendEmail, ContactusFormAdmin)

# cart Details
class AddCartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'created_at', 'updated_at')
    list_filter = ('user', 'product', 'is_active')
    search_fields = ('user__username', 'product__name')
    ordering = ('-id',)
# Register the AddCart model with the custom admin class
admin.site.register(AddCart, AddCartAdmin)

#user base cart items
# class AddCartInline(admin.TabularInline):
#     model = AddCart
#     extra = 0

# class CustomUserAdmin(UserAdmin):
#     list_display = ('id', 'username', 'email', 'phonenumber', 'is_active', 'total_cart_product_amount', 'total_cart_products')
#     list_filter = ('is_active',)
#     ordering = ('-id',)
#     inlines = [AddCartInline]

#     def total_cart_product_amount(self, obj):
#         # Calculate the total cart product amount for the user
#         return obj.addcart_set.aggregate(total=Sum('product__amount'))['total'] or 0

#     def total_cart_products(self, obj):
#         # Calculate the total number of cart products for the user
#         return obj.addcart_set.count()

#     total_cart_product_amount.short_description = 'Total Cart Product Amount'
#     total_cart_products.short_description = 'Total Cart Products'

# # Register the User model with the custom admin view
# admin.site.register(User, CustomUserAdmin)

# User Shipping Address
# class ShippingAddressFormAdmin(admin.ModelAdmin):
#     list_display = ('id','alternatephonenumber','is_active','created_at')
#     list_filter = ('is_active',)
#     ordering=("-id",)
# admin.site.register(ShippingAddress, ShippingAddressFormAdmin)

# User Order List
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_username', 'get_user_email', 'get_user_phonenumber', 'razorpay_order_id', 'razorpay_payment_id', 'order_date', 'order_status_confirm', 'payment_status_confirm')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'

    def get_user_phonenumber(self, obj):
        # Assuming you have a 'phonenumber' field in your User model
        return obj.user.phonenumber
    get_user_phonenumber.short_description = 'Mobile No'

    # Customize the display of 'confirm' for order_status
    def order_status_confirm(self, obj):
        return 'Confirm' if obj.order_status == 'confirm' else ''
    order_status_confirm.short_description = 'Order Status'

    # Customize the display of 'confirm' for payment_status
    def payment_status_confirm(self, obj):
        return 'Confirm' if obj.payment_status == 'confirm' else ''
    payment_status_confirm.short_description = 'Payment Status'

    list_filter = ('order_status', 'payment_status')

    # Override the default queryset to only show rows where both status fields are 'confirm'
    def get_queryset(self, request):
        return super().get_queryset(request).filter(order_status='confirm', payment_status='confirm')

admin.site.register(Orders, OrdersAdmin)

# class UserOrderTrackingAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'display_order', 'location', 'description', 'created_at')
#     # Define a custom method to display order as 'id - order'
#     def display_order(self, obj):
#           return f'{obj.order.id} - {obj.order}'
#     display_order.short_description = 'Order'
#     # Override formfield_for_foreignkey to filter the choices
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "order":
#             # Filter the choices based on order_status and payment_status
#             filtered_orders = Orders.objects.filter(order_status='confirm', payment_status='confirm')
#             # Reverse the queryset to display orders in descending order by 'id'
#             kwargs["queryset"] = filtered_orders.order_by('-id')
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(UserOrderTracking, UserOrderTrackingAdmin)

class UserOrderTrackingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'display_order', 'location', 'description', 'created_at')
    def display_order(self, obj):
        return f'{obj.order.id} - {obj.order}'
    
    display_order.short_description = 'Order'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "order":
            filtered_orders = Orders.objects.filter(order_status='confirm', payment_status='confirm')
            kwargs["queryset"] = filtered_orders.order_by('-id')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(UserOrderTracking, UserOrderTrackingAdmin)

class NotificationScrollAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'created_at', 'updated_at', 'is_active')
    list_filter = ('title', 'is_active')
    ordering = ('-id',)
# Register the AddCart model with the custom admin class
admin.site.register(NotificationScrollHome, NotificationScrollAdmin)





