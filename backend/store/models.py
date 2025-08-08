from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Category(models.Model):
    """
    Represents a product category. Categories can be nested.
    """
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, help_text="URL-friendly version of the name. Auto-generated if left blank.")
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    """
    Represents a product in the store.
    """
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, help_text="URL-friendly version of the name. Auto-generated if left blank.")
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_available = models.BooleanField(default=True, help_text="Is the product available for purchase?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    search_count = models.PositiveIntegerField(default=0, help_text="How many times the product has been searched.")

    class Meta:
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Stock(models.Model):
    """
    Manages the inventory for each product.
    """
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='stock')
    quantity = models.PositiveIntegerField(default=0, help_text="Available quantity.")
    low_stock_threshold = models.PositiveIntegerField(default=10, help_text="Threshold to consider stock as low.")

    class Meta:
        verbose_name_plural = "Stock"

    def __str__(self):
        return f"{self.product.name} - Quantity: {self.quantity}"

    @property
    def is_low_stock(self):
        """Returns True if the quantity is below or equal to the threshold."""
        return self.quantity <= self.low_stock_threshold

    @property
    def is_out_of_stock(self):
        """Returns True if the product is out of stock."""
        return self.quantity == 0

class Backorder(models.Model):
    """
    Represents a user's request for a product that is out of stock.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='backorders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='backorders')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    is_fulfilled = models.BooleanField(default=False, help_text="Has the backorder been fulfilled?")

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('product', 'user') # A user can have only one backorder per product

    def __str__(self):
        return f"Backorder for {self.quantity} of {self.product.name} by {self.user.username}"