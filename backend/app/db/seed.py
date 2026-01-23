"""Seed script for populating the database with test data."""
import asyncio
import uuid
from decimal import Decimal
from passlib.context import CryptContext

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import async_session_maker
from app.models import (
    User, UserRole, Category, Product, ProductVariant,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


# Sample data
CATEGORIES = [
    {"name": "Sneakers", "slug": "sneakers", "description": "Casual and athletic sneakers"},
    {"name": "Running", "slug": "running", "description": "Performance running shoes"},
    {"name": "Boots", "slug": "boots", "description": "Stylish boots for all occasions"},
    {"name": "Sandals", "slug": "sandals", "description": "Comfortable summer sandals"},
    {"name": "Formal", "slug": "formal", "description": "Elegant formal footwear"},
]

SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]

PRODUCTS = [
    {
        "name": "Nike Air Max 90",
        "slug": "nike-air-max-90",
        "description": "Iconic Nike Air Max 90 sneakers with visible Air cushioning for all-day comfort.",
        "price": Decimal("149.99"),
        "compare_at_price": Decimal("179.99"),
        "images": ["/images/products/nike-air-max-90-1.jpg", "/images/products/nike-air-max-90-2.jpg"],
        "brand": "Nike",
        "material": "Leather/Mesh",
        "color": "White/Red",
        "gender": "unisex",
        "category_slug": "sneakers",
        "is_featured": True,
    },
    {
        "name": "Adidas Ultraboost 22",
        "slug": "adidas-ultraboost-22",
        "description": "Premium running shoe with responsive Boost midsole technology.",
        "price": Decimal("189.99"),
        "images": ["/images/products/adidas-ultraboost-22-1.jpg"],
        "brand": "Adidas",
        "material": "Primeknit",
        "color": "Black",
        "gender": "unisex",
        "category_slug": "running",
        "is_featured": True,
    },
    {
        "name": "Timberland 6-Inch Premium",
        "slug": "timberland-6-inch-premium",
        "description": "Classic waterproof boots built for durability and style.",
        "price": Decimal("199.99"),
        "images": ["/images/products/timberland-6-inch-1.jpg"],
        "brand": "Timberland",
        "material": "Nubuck Leather",
        "color": "Wheat",
        "gender": "men",
        "category_slug": "boots",
        "is_featured": True,
    },
    {
        "name": "Birkenstock Arizona",
        "slug": "birkenstock-arizona",
        "description": "Legendary comfort with contoured cork-latex footbed.",
        "price": Decimal("99.99"),
        "images": ["/images/products/birkenstock-arizona-1.jpg"],
        "brand": "Birkenstock",
        "material": "Leather",
        "color": "Brown",
        "gender": "unisex",
        "category_slug": "sandals",
    },
    {
        "name": "Cole Haan Oxford",
        "slug": "cole-haan-oxford",
        "description": "Sophisticated Oxford shoes with Grand.OS comfort technology.",
        "price": Decimal("159.99"),
        "images": ["/images/products/cole-haan-oxford-1.jpg"],
        "brand": "Cole Haan",
        "material": "Leather",
        "color": "Black",
        "gender": "men",
        "category_slug": "formal",
    },
    {
        "name": "New Balance 574",
        "slug": "new-balance-574",
        "description": "Classic lifestyle sneaker with ENCAP midsole cushioning.",
        "price": Decimal("89.99"),
        "images": ["/images/products/nb-574-1.jpg"],
        "brand": "New Balance",
        "material": "Suede/Mesh",
        "color": "Grey/Navy",
        "gender": "unisex",
        "category_slug": "sneakers",
    },
    {
        "name": "Puma RS-X",
        "slug": "puma-rs-x",
        "description": "Retro-inspired running system sneakers with bold design.",
        "price": Decimal("119.99"),
        "images": ["/images/products/puma-rsx-1.jpg"],
        "brand": "Puma",
        "material": "Mesh/Leather",
        "color": "White/Blue",
        "gender": "unisex",
        "category_slug": "sneakers",
    },
    {
        "name": "ASICS Gel-Kayano 29",
        "slug": "asics-gel-kayano-29",
        "description": "Stability running shoe with advanced GEL technology.",
        "price": Decimal("159.99"),
        "images": ["/images/products/asics-kayano-29-1.jpg"],
        "brand": "ASICS",
        "material": "Engineered Mesh",
        "color": "Blue/Orange",
        "gender": "unisex",
        "category_slug": "running",
    },
    {
        "name": "Dr. Martens 1460",
        "slug": "dr-martens-1460",
        "description": "Iconic 8-eye boots with air-cushioned sole.",
        "price": Decimal("169.99"),
        "images": ["/images/products/dr-martens-1460-1.jpg"],
        "brand": "Dr. Martens",
        "material": "Smooth Leather",
        "color": "Black",
        "gender": "unisex",
        "category_slug": "boots",
        "is_featured": True,
    },
    {
        "name": "Converse Chuck Taylor All Star",
        "slug": "converse-chuck-taylor",
        "description": "Timeless canvas high-top sneakers since 1917.",
        "price": Decimal("59.99"),
        "images": ["/images/products/converse-chuck-1.jpg"],
        "brand": "Converse",
        "material": "Canvas",
        "color": "Black",
        "gender": "unisex",
        "category_slug": "sneakers",
    },
    {
        "name": "Vans Old Skool",
        "slug": "vans-old-skool",
        "description": "Classic skate shoe with signature side stripe.",
        "price": Decimal("69.99"),
        "images": ["/images/products/vans-oldskool-1.jpg"],
        "brand": "Vans",
        "material": "Suede/Canvas",
        "color": "Black/White",
        "gender": "unisex",
        "category_slug": "sneakers",
    },
    {
        "name": "Steve Madden Heels",
        "slug": "steve-madden-heels",
        "description": "Elegant stiletto heels for special occasions.",
        "price": Decimal("89.99"),
        "images": ["/images/products/steve-madden-heels-1.jpg"],
        "brand": "Steve Madden",
        "material": "Faux Leather",
        "color": "Nude",
        "gender": "women",
        "category_slug": "formal",
    },
]


async def seed_users(session: AsyncSession) -> dict[str, User]:
    """Seed admin and test users."""
    users = {}

    # Admin user
    admin = User(
        id=uuid.uuid4(),
        email="admin@footy.com",
        hashed_password=hash_password("admin123"),
        name="Admin User",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
    )
    session.add(admin)
    users["admin"] = admin

    # Test user
    test_user = User(
        id=uuid.uuid4(),
        email="user@footy.com",
        hashed_password=hash_password("user1234"),
        name="Test User",
        role=UserRole.USER,
        is_active=True,
        is_verified=True,
    )
    session.add(test_user)
    users["user"] = test_user

    await session.flush()
    return users


async def seed_categories(session: AsyncSession) -> dict[str, Category]:
    """Seed product categories."""
    categories = {}

    for cat_data in CATEGORIES:
        category = Category(
            id=uuid.uuid4(),
            **cat_data,
        )
        session.add(category)
        categories[cat_data["slug"]] = category

    await session.flush()
    return categories


async def seed_products(session: AsyncSession, categories: dict[str, Category]) -> list[Product]:
    """Seed products with variants."""
    products = []

    for prod_data in PRODUCTS:
        category_slug = prod_data.pop("category_slug")
        category = categories.get(category_slug)

        product = Product(
            id=uuid.uuid4(),
            category_id=category.id if category else None,
            **prod_data,
        )
        session.add(product)

        # Add size variants with random stock
        import random
        for size in SIZES:
            # Not all sizes for all products
            if random.random() > 0.3:  # 70% chance to have this size
                variant = ProductVariant(
                    id=uuid.uuid4(),
                    product_id=product.id,
                    size=size,
                    sku=f"{product.slug}-{size}",
                    stock=random.randint(0, 20),
                )
                session.add(variant)

        products.append(product)

    await session.flush()
    return products


async def seed_database():
    """Main seeding function."""
    print("Starting database seeding...")

    async with async_session_maker() as session:
        try:
            # Seed in order
            print("Seeding users...")
            users = await seed_users(session)
            print(f"  Created {len(users)} users")

            print("Seeding categories...")
            categories = await seed_categories(session)
            print(f"  Created {len(categories)} categories")

            print("Seeding products...")
            products = await seed_products(session, categories)
            print(f"  Created {len(products)} products")

            await session.commit()
            print("Database seeding completed successfully!")

        except Exception as e:
            await session.rollback()
            print(f"Error seeding database: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_database())
