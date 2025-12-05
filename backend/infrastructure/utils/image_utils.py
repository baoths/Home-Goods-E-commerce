"""
Infrastructure Layer - Image Utilities
Helper functions for image processing and base64 conversion
"""

import base64
import io
from typing import Optional, Tuple
from PIL import Image


def image_to_base64(image_bytes: bytes, format: str = "JPEG") -> str:
    """
    Convert image bytes to base64 string with data URI scheme
    
    Args:
        image_bytes: Raw image bytes
        format: Image format (JPEG, PNG, etc.)
    
    Returns:
        Base64 encoded string with data URI
    """
    encoded = base64.b64encode(image_bytes).decode('utf-8')
    mime_type = f"image/{format.lower()}"
    return f"data:{mime_type};base64,{encoded}"


def base64_to_image(base64_string: str) -> Tuple[bytes, str]:
    """
    Convert base64 string to image bytes
    
    Args:
        base64_string: Base64 encoded image with or without data URI
    
    Returns:
        Tuple of (image_bytes, format)
    """
    # Remove data URI prefix if present
    if "base64," in base64_string:
        base64_data = base64_string.split("base64,")[1]
        # Extract mime type
        mime_part = base64_string.split(";")[0]
        format_str = mime_part.split("/")[1].upper()
    else:
        base64_data = base64_string
        format_str = "JPEG"
    
    image_bytes = base64.b64decode(base64_data)
    return image_bytes, format_str


def compress_image(
    image_bytes: bytes,
    max_width: int = 1200,
    max_height: int = 1200,
    quality: int = 85
) -> bytes:
    """
    Compress and resize image
    
    Args:
        image_bytes: Original image bytes
        max_width: Maximum width
        max_height: Maximum height
        quality: JPEG quality (1-100)
    
    Returns:
        Compressed image bytes
    """
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert RGBA to RGB if needed
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Resize if needed
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    # Save to bytes
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=quality, optimize=True)
    return output.getvalue()


def validate_image(image_bytes: bytes, max_size_mb: int = 5) -> Tuple[bool, Optional[str]]:
    """
    Validate image file
    
    Args:
        image_bytes: Image bytes to validate
        max_size_mb: Maximum file size in MB
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check file size
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        return False, f"Image size exceeds {max_size_mb}MB limit"
    
    # Check if it's a valid image
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        
        # Check format
        if img.format not in ['JPEG', 'PNG', 'GIF', 'WEBP']:
            return False, "Invalid image format. Allowed: JPEG, PNG, GIF, WEBP"
        
        return True, None
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"


def process_upload_image(
    base64_string: str,
    compress: bool = True,
    max_size_mb: int = 5
) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Process uploaded image from base64
    
    Args:
        base64_string: Base64 encoded image
        compress: Whether to compress the image
        max_size_mb: Maximum file size
    
    Returns:
        Tuple of (success, processed_base64, error_message)
    """
    try:
        # Convert to bytes
        image_bytes, format_str = base64_to_image(base64_string)
        
        # Validate
        is_valid, error = validate_image(image_bytes, max_size_mb)
        if not is_valid:
            return False, None, error
        
        # Compress if needed
        if compress:
            image_bytes = compress_image(image_bytes)
        
        # Convert back to base64
        processed_base64 = image_to_base64(image_bytes, format_str)
        return True, processed_base64, None
        
    except Exception as e:
        return False, None, f"Failed to process image: {str(e)}"
