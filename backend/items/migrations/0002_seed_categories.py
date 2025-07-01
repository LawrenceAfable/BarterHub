from django.db import migrations

def seed_categories(apps, schema_editor):
    Category = apps.get_model('items', 'Category')
    categories = [
        "Electronics", "Books", "Clothing", "Toys", "Home", "Sports", "Tools", "Garden", "Music", "Art",
        "Appliances", "Furniture", "Jewelry", "Automotive", "Pet Supplies", "Office Supplies", "Baby & Kids",
        "Health & Beauty", "Collectibles", "Food & Beverage", "Other"
    ]
    for cat in categories:
        Category.objects.get_or_create(name=cat)

class Migration(migrations.Migration):
    dependencies = [
        ('items', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories),
    ]
