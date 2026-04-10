from rest_framework import serializers
from .models import Order, OrderItem
from apps.cart.models import CartItem


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_price', 'status', 'shipping_address', 'note', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'total_price', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        cart_items = CartItem.objects.filter(user=user).select_related('product')

        if not cart_items.exists():
            raise serializers.ValidationError('Cart is empty.')

        total = sum(item.subtotal for item in cart_items)
        order = Order.objects.create(
            user=user,
            total_price=total,
            **validated_data
        )

        for cart_item in cart_items:
            product = cart_item.product
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=str(product.image) if product.image else '',
                quantity=cart_item.quantity,
                price=product.price,
            )
            # Reduce stock, increase sold
            product.stock = max(0, product.stock - cart_item.quantity)
            product.sold += cart_item.quantity
            product.save(update_fields=['stock', 'sold'])

        cart_items.delete()
        return order


class OrderListSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    first_item_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'status', 'item_count', 'first_item_name', 'created_at']

    def get_item_count(self, obj):
        return obj.items.count()

    def get_first_item_name(self, obj):
        item = obj.items.first()
        return item.product_name if item else ''
