from flask import Flask, render_template, request, redirect, url_for, flash, session, g, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from the root .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "a_default_secret_key_for_development")

# Increase max content length to 16MB for avatar uploads
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Define the base URL of your Next.js API from environment variables
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:3000/api')


def _filter_user_for_session(user):
    """Filter user data to only include essential fields for session storage.
    Excludes avatarUrl to keep session cookie size small."""
    if not user:
        return None
    return {
        'id': user.get('id'),
        'name': user.get('name'),
        'email': user.get('email'),
        'phone': user.get('phone'),
        'address': user.get('address'),
        'role': user.get('role'),
        'createdAt': user.get('createdAt'),
        'hasAvatar': bool(user.get('avatarUrl'))  # Just store flag, not the actual data
    }


def _fetch_categories():
    """Helper function to fetch categories from API"""
    try:
        response = requests.get(f'{API_BASE_URL}/categories')
        response.raise_for_status()
        data = response.json()
        return data.get('categories', [])
    except requests.exceptions.RequestException as e:
        print(f"Could not fetch categories: {e}")
        return []


def _fetch_user_avatar(token):
    """Fetch current user's avatar from API"""
    if not token:
        return None
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{API_BASE_URL}/auth/me', headers=headers)
        response.raise_for_status()
        data = response.json()
        user = data.get('user', {})
        return user.get('avatarUrl')
    except requests.exceptions.RequestException as e:
        print(f"Could not fetch user avatar: {e}")
        return None


@app.before_request
def load_categories():
    """Load categories before each request so they are available in route handlers"""
    if 'all_categories' not in g:
        g.all_categories = _fetch_categories()
    
    # Load user avatar if logged in
    if 'current_user' in session and session['current_user'].get('hasAvatar'):
        g.user_avatar = _fetch_user_avatar(session.get('user_token'))
    else:
        g.user_avatar = None


@app.context_processor
def inject_categories():
    """Inject categories and user avatar into all templates"""
    return dict(
        all_categories=g.get('all_categories', []),
        user_avatar=g.get('user_avatar')
    )

@app.route('/')
def home():
    """
    Renders the home page with a list of products and banners.
    """
    products = []
    banners = []
    try:
        # Fetch products from the existing Next.js API
        products_response = requests.get(f"{API_BASE_URL}/products?featured=true&pageSize=8")
        products_response.raise_for_status()
        products_data = products_response.json()
        products = products_data.get('products', [])
        
        # Convert price from string to float for each product
        for product in products:
            if 'price' in product and isinstance(product['price'], str):
                try:
                    product['price'] = float(product['price'])
                except (ValueError, TypeError):
                    product['price'] = 0.0

        # Fetch active banners
        banners_response = requests.get(f"{API_BASE_URL}/banners")
        banners_response.raise_for_status()
        banners_data = banners_response.json()
        banners = banners_data.get('banners', [])

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        
    return render_template('index.html', products=products, banners=banners)

@app.route('/category/<slug>')
def category(slug):
    if slug == 'all':
        try:
            response = requests.get(f'{API_BASE_URL}/products')
            response.raise_for_status()
            data = response.json()
            products = data.get('products', [])
            
            # Convert price from string to float for each product
            for product in products:
                if 'price' in product and isinstance(product['price'], str):
                    try:
                        product['price'] = float(product['price'])
                    except (ValueError, TypeError):
                        product['price'] = 0.0
            
            category_name = 'All Products'
            return render_template('category.html', products=products, category_name=category_name, current_slug=slug, category=None)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching all products: {e}")
            return render_template('category.html', products=[], category_name='Error', error="Could not fetch products.", current_slug=slug, category=None)

    # Find the category object from the globally available list
    target_category = None
    if 'all_categories' in g:
        for cat in g.all_categories:
            if cat['slug'] == slug:
                target_category = cat
                break
    
    if not target_category:
        print(f"Category with slug '{slug}' not found in global list.")
        return render_template('category.html', products=[], category_name="Category Not Found", error="The category you are looking for does not exist.", current_slug=slug, category=None)

    # Fetch products for that category using its ID
    try:
        category_id = target_category['id']
        response = requests.get(f'{API_BASE_URL}/products/category/{category_id}')
        response.raise_for_status()
        data = response.json()
        products = data.get('products', [])
        
        # Convert price from string to float for each product
        for product in products:
            if 'price' in product and isinstance(product['price'], str):
                try:
                    product['price'] = float(product['price'])
                except (ValueError, TypeError):
                    product['price'] = 0.0
        
        return render_template('category.html', products=products, category_name=target_category['name'], current_slug=slug, category=target_category)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching products for category id {target_category.get('id')}: {e}")
        return render_template('category.html', products=[], category_name=target_category['name'], error="Could not fetch products for this category.", current_slug=slug, category=target_category)


@app.route('/product/<product_id>')
def product_detail(product_id):
    """
    Renders the product detail page for a single product.
    """
    product = None
    related_products = []
    try:
        response = requests.get(f"{API_BASE_URL}/products/{product_id}")
        response.raise_for_status()
        product_data = response.json()
        product = product_data.get('product')

        # Convert price to float
        if product and 'price' in product and isinstance(product['price'], str):
            try:
                product['price'] = float(product['price'])
            except (ValueError, TypeError):
                product['price'] = 0.0
        
        # Fetch related products from the same category
        if product and product.get('category'):
            try:
                category_id = product['category'].get('id')
                if category_id:
                    rel_response = requests.get(f"{API_BASE_URL}/products/category/{category_id}")
                    if rel_response.status_code == 200:
                        rel_data = rel_response.json()
                        all_related = rel_data.get('products', [])
                        # Filter out current product and convert prices
                        for p in all_related:
                            if p.get('id') != product_id:
                                if 'price' in p and isinstance(p['price'], str):
                                    try:
                                        p['price'] = float(p['price'])
                                    except (ValueError, TypeError):
                                        p['price'] = 0.0
                                related_products.append(p)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching related products: {e}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching product {product_id}: {e}")
        
    return render_template('product_detail.html', product=product, related_products=related_products)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Renders the login page and handles form submission.
    """
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        try:
            response = requests.post(f"{API_BASE_URL}/auth/login", json={'email': email, 'password': password})
            
            if response.status_code == 200:
                data = response.json()
                session['user_token'] = data.get('token')
                session['current_user'] = _filter_user_for_session(data.get('user'))
                flash('Login successful!', 'success')
                return redirect(url_for('home'))
            else:
                error_message = response.json().get('message', 'Invalid credentials')
                flash(error_message, 'error')
                
        except requests.exceptions.RequestException as e:
            flash(f"Error connecting to authentication service: {e}", 'error')
            
    return render_template('login.html')

@app.route('/profile')
def profile():
    """
    Renders the user's profile page.
    """
    if 'current_user' not in session:
        flash('Please log in to view your profile.', 'warning')
        return redirect(url_for('login'))
        
    return render_template('profile.html')


@app.route('/profile/edit', methods=['GET', 'POST'])
def edit_profile():
    """
    Handles editing user profile.
    """
    if 'current_user' not in session:
        flash('Please log in to edit your profile.', 'warning')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        name = request.form.get('name')
        phone = request.form.get('phone')
        address = request.form.get('address')
        avatar_base64 = request.form.get('avatar_base64')
        
        payload = {
            'name': name,
            'phone': phone,
            'address': address
        }
        
        # Add avatar to payload if uploaded
        if avatar_base64:
            payload['avatar'] = avatar_base64
        
        try:
            token = session.get('user_token')
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.put(
                f"{API_BASE_URL}/auth/update-profile",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                # Update session with new user data (filtered to exclude large avatarUrl)
                session['current_user'] = _filter_user_for_session(data.get('user'))
                flash('Profile updated successfully!', 'success')
                return redirect(url_for('profile'))
            else:
                error_message = response.json().get('error', 'Failed to update profile')
                flash(error_message, 'error')
                
        except requests.exceptions.RequestException as e:
            flash(f"Error connecting to service: {e}", 'error')
    
    return render_template('edit_profile.html')


@app.route('/logout')
def logout():
    """
    Logs the user out by clearing the session.
    """
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))


@app.route('/refresh-session')
def refresh_session():
    """
    Refresh user session from API to get latest role/data.
    """
    if 'user_token' not in session:
        flash('Please login first', 'error')
        return redirect(url_for('login'))
    
    try:
        headers = {'Authorization': f'Bearer {session["user_token"]}'}
        response = requests.get(f'{API_BASE_URL}/auth/me', headers=headers)
        response.raise_for_status()
        data = response.json()
        user = data.get('user')
        if user:
            session['current_user'] = _filter_user_for_session(user)
            flash(f'Session refreshed! Role: {user.get("role")}', 'success')
        else:
            flash('Could not get user data', 'error')
    except requests.exceptions.RequestException as e:
        flash(f'Error refreshing session: {e}', 'error')
    
    return redirect(url_for('home'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    """
    Renders the registration page and handles form submission.
    """
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        phone = request.form.get('phone')
        address = request.form.get('address')

        payload = {
            'name': name,
            'email': email,
            'password': password,
            'phone': phone,
            'address': address
        }

        try:
            response = requests.post(f"{API_BASE_URL}/auth/register", json=payload)
            
            if response.status_code == 201:
                flash('Registration successful! Please log in.', 'success')
                return redirect(url_for('login'))
            else:
                error_data = response.json()
                # Handle nested error messages if they exist
                if 'error' in error_data and isinstance(error_data['error'], dict) and 'message' in error_data['error']:
                     flash(error_data['error']['message'], 'error')
                else:
                    flash(error_data.get('message', 'An error occurred during registration.'), 'error')

        except requests.exceptions.RequestException as e:
            flash(f"Error connecting to the registration service: {e}", 'error')

    return render_template('register.html')


def admin_required(f):
    """Decorator to require admin access for a route"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session.get('current_user')
        if not user:
            flash('Please login to access admin area', 'error')
            return redirect(url_for('login'))
        if user.get('role') != 'ADMIN':
            flash('You do not have permission to access admin area', 'error')
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/admin')
@admin_required
def admin():
    """
    Renders the admin dashboard page.
    """
    return render_template('admin.html')

@app.route('/admin/products')
@admin_required
def admin_products():
    """
    Renders the admin products management page.
    """
    products = []
    categories = []
    try:
        # Fetch all products from the API
        products_response = requests.get(f"{API_BASE_URL}/products?pageSize=100") # Fetch more products for admin view
        products_response.raise_for_status()
        products_data = products_response.json()
        products = products_data.get('products', [])
        
        # Convert price from string to float for each product
        for product in products:
            if 'price' in product and isinstance(product['price'], str):
                try:
                    product['price'] = float(product['price'])
                except (ValueError, TypeError):
                    product['price'] = 0.0
        
        # Fetch categories for the dropdown
        categories_response = requests.get(f"{API_BASE_URL}/categories")
        categories_response.raise_for_status()
        categories_data = categories_response.json()
        categories = categories_data.get('categories', [])

    except requests.exceptions.RequestException as e:
        print(f"Error fetching products for admin: {e}")
        
    return render_template('admin_products.html', products=products, categories=categories)

@app.route('/admin/categories')
@admin_required
def admin_categories():
    """
    Renders the admin categories management page.
    """
    categories = []
    try:
        # Fetch all categories from the API
        categories_response = requests.get(f"{API_BASE_URL}/categories")
        categories_response.raise_for_status()
        categories_data = categories_response.json()
        categories = categories_data.get('categories', [])

    except requests.exceptions.RequestException as e:
        print(f"Error fetching categories for admin: {e}")
        
    return render_template('admin_categories.html', categories=categories)

@app.route('/admin/users')
@admin_required
def admin_users():
    """
    Renders the admin users management page.
    """
    users = []
    try:
        # Fetch all users from the API (requires auth)
        headers = _get_auth_headers()
        users_response = requests.get(f"{API_BASE_URL}/users", headers=headers)
        users_response.raise_for_status()
        users_data = users_response.json()
        users = users_data.get('users', [])

    except requests.exceptions.RequestException as e:
        print(f"Error fetching users for admin: {e}")
        
    return render_template('admin_users.html', users=users)


@app.route('/admin/banners')
@admin_required
def admin_banners():
    """
    Renders the admin banners management page.
    """
    banners = []
    try:
        # Fetch all banners from the API
        banners_response = requests.get(f"{API_BASE_URL}/banners?all=true")
        banners_response.raise_for_status()
        banners_data = banners_response.json()
        banners = banners_data.get('banners', [])

    except requests.exceptions.RequestException as e:
        print(f"Error fetching banners for admin: {e}")
        
    return render_template('admin_banners.html', banners=banners)


# --------------------- Admin API Routes ---------------------

def _get_auth_headers():
    """Get authorization headers from session token"""
    token = session.get('user_token')
    if token:
        return {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    return {'Content-Type': 'application/json'}


@app.route('/api/admin/categories', methods=['POST'])
@app.route('/api/admin/categories/<category_id>', methods=['PUT', 'DELETE'])
def admin_api_categories(category_id=None):
    """API proxy for admin category CRUD operations"""
    headers = _get_auth_headers()
    try:
        if request.method == 'POST':
            response = requests.post(f"{API_BASE_URL}/categories", json=request.json, headers=headers)
        elif request.method == 'PUT':
            response = requests.put(f"{API_BASE_URL}/categories/{category_id}", json=request.json, headers=headers)
        elif request.method == 'DELETE':
            response = requests.delete(f"{API_BASE_URL}/categories/{category_id}", headers=headers)
        
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/products', methods=['POST'])
@app.route('/api/admin/products/<product_id>', methods=['PUT', 'DELETE'])
def admin_api_products(product_id=None):
    """API proxy for admin product CRUD operations"""
    headers = _get_auth_headers()
    try:
        if request.method == 'POST':
            response = requests.post(f"{API_BASE_URL}/products", json=request.json, headers=headers)
        elif request.method == 'PUT':
            response = requests.put(f"{API_BASE_URL}/products/{product_id}", json=request.json, headers=headers)
        elif request.method == 'DELETE':
            response = requests.delete(f"{API_BASE_URL}/products/{product_id}", headers=headers)
        
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/banners', methods=['POST'])
@app.route('/api/admin/banners/<banner_id>', methods=['PUT', 'DELETE'])
def admin_api_banners(banner_id=None):
    """API proxy for admin banner CRUD operations"""
    headers = _get_auth_headers()
    try:
        if request.method == 'POST':
            response = requests.post(f"{API_BASE_URL}/banners", json=request.json, headers=headers)
        elif request.method == 'PUT':
            response = requests.put(f"{API_BASE_URL}/banners/{banner_id}", json=request.json, headers=headers)
        elif request.method == 'DELETE':
            response = requests.delete(f"{API_BASE_URL}/banners/{banner_id}", headers=headers)
        
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/users/<user_id>', methods=['PUT', 'DELETE'])
def admin_api_users(user_id):
    """API proxy for admin user CRUD operations"""
    headers = _get_auth_headers()
    try:
        if request.method == 'PUT':
            response = requests.put(f"{API_BASE_URL}/users/{user_id}", json=request.json, headers=headers)
        elif request.method == 'DELETE':
            response = requests.delete(f"{API_BASE_URL}/users/{user_id}", headers=headers)
        
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
