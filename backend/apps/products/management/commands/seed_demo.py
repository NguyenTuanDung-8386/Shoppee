"""
Management command: python manage.py seed_demo
Creates demo user + sample products for testing.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
import random

User = get_user_model()

DEMO_PRODUCTS = [
    ("iPhone 15 Pro Max 256GB", "electronics", 999.00, 1299.00, 50, "Latest flagship smartphone with titanium design and A17 Pro chip."),
    ("Samsung Galaxy S24 Ultra", "electronics", 1199.00, 1399.00, 30, "Premium Android flagship with built-in S Pen and 200MP camera."),
    ("Sony WH-1000XM5 Headphones", "electronics", 279.00, 349.00, 80, "Industry-leading noise cancelling wireless headphones."),
    ("MacBook Air M3 13-inch", "electronics", 1099.00, 1299.00, 25, "Incredibly thin and light laptop with Apple M3 chip."),
    ("Nike Air Max 270", "fashion", 110.00, 150.00, 100, "Breathable running shoes with large Air unit heel."),
    ("Levi's 501 Original Fit Jeans", "fashion", 59.99, 89.99, 200, "The original and most iconic Levi's jeans. Classic straight fit."),
    ("Adidas Originals Hoodie", "fashion", 65.00, 90.00, 150, "Comfortable cotton blend hoodie with iconic three-stripe design."),
    ("IKEA KALLAX Shelf Unit", "home", 79.99, None, 40, "Versatile shelf unit that also works as a room divider."),
    ("Dyson V15 Detect Vacuum", "home", 699.00, 799.00, 20, "Detects and counts dust particles, adjusts suction power automatically."),
    ("Nespresso Vertuo Pop Coffee", "home", 89.00, 120.00, 60, "Compact coffee machine with centrifusion technology."),
    ("The Ordinary Niacinamide Serum", "beauty", 12.90, None, 500, "High-Strength Vitamin and Mineral Blemish Formula."),
    ("CeraVe Moisturising Cream", "beauty", 18.99, 24.99, 300, "24-hour moisturiser with three essential ceramides."),
    ("Yoga Mat Premium Non-Slip", "sports", 45.00, 65.00, 120, "Eco-friendly, non-slip yoga mat for all skill levels."),
    ("Resistance Bands Set", "sports", 24.99, 39.99, 200, "Set of 5 resistance bands for home workouts."),
    ("Atomic Habits by James Clear", "books", 16.99, 24.99, 400, "Tiny Changes, Remarkable Results. #1 New York Times bestseller."),
    ("LEGO Technic Ferrari Daytona", "toys", 129.99, 159.99, 35, "Faithfully recreated LEGO model of the iconic Ferrari racing car."),
    ("Instant Ramen Variety Pack 30x", "food", 19.99, None, 250, "Assorted flavour instant ramen noodles. Pack of 30."),
    ("Protein Powder Whey Vanilla", "sports", 54.99, 69.99, 90, "Premium whey protein isolate, 25g protein per serving."),
    ("Air Fryer 5.5L XL", "home", 79.99, 109.99, 70, "Large capacity digital air fryer with 8 preset cooking modes."),
    ("Wireless Mechanical Keyboard", "electronics", 89.99, 129.99, 60, "Compact TKL layout with RGB backlight and tactile switches."),
]

class Command(BaseCommand):
    help = 'Seed demo data: categories + products + demo user'

    def handle(self, *args, **options):
        # Create demo seller
        seller, created = User.objects.get_or_create(
            email='seller@demo.com',
            defaults={
                'username': 'DemoSeller',
                'is_seller': True,
                'phone': '+1234567890',
                'address': '123 Demo Street, Demo City',
            }
        )
        if created:
            seller.set_password('demo1234')
            seller.save()
            self.stdout.write(self.style.SUCCESS('Created seller@demo.com / demo1234'))

        # Create demo buyer
        buyer, created = User.objects.get_or_create(
            email='buyer@demo.com',
            defaults={'username': 'DemoBuyer'}
        )
        if created:
            buyer.set_password('demo1234')
            buyer.save()
            self.stdout.write(self.style.SUCCESS('Created buyer@demo.com / demo1234'))

        # Ensure categories exist
        cat_map = {}
        for name, slug, icon in [
            ('Electronics','electronics','📱'), ('Fashion','fashion','👗'),
            ('Home','home','🏠'), ('Beauty','beauty','💄'),
            ('Sports','sports','⚽'), ('Books','books','📚'),
            ('Toys','toys','🧸'), ('Food','food','🍜'),
        ]:
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon})
            cat_map[slug] = cat

        # Create products
        count = 0
        for name, cat_slug, price, orig_price, stock, desc in DEMO_PRODUCTS:
            if not Product.objects.filter(name=name).exists():
                Product.objects.create(
                    seller=seller,
                    category=cat_map.get(cat_slug),
                    name=name,
                    description=desc,
                    price=price,
                    original_price=orig_price,
                    stock=stock,
                    sold=random.randint(10, 500),
                    rating=round(random.uniform(3.5, 5.0), 2),
                    review_count=random.randint(5, 200),
                    is_active=True,
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {count} demo products.'))
        self.stdout.write(self.style.SUCCESS('\nDemo credentials:\n  seller@demo.com / demo1234\n  buyer@demo.com  / demo1234'))
