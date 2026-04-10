from rest_framework import serializers
from .models import Category, Product, ProductImage, Review
from apps.users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'original_price', 'discount_percent',
            'image', 'rating', 'review_count', 'sold', 'stock',
            'category_name', 'seller_name', 'is_active', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    seller = UserSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'category', 'category_id', 'name', 'description',
            'price', 'original_price', 'discount_percent', 'stock', 'sold',
            'image', 'images', 'rating', 'review_count', 'is_active',
            'reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'seller', 'sold', 'rating', 'review_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)
