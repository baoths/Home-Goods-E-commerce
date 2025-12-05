# Use Case: User Login (Đăng Nhập)

## Mô tả
Người dùng đăng nhập vào hệ thống bằng email và password.

## Actors
- Visitor (Khách vãng lai chưa đăng nhập)

## Preconditions
- User đã có tài khoản (đã đăng ký)
- User chưa đăng nhập

## Trigger
User click nút "Đăng Nhập" hoặc truy cập /login

## Main Flow

### 1. Navigate to Login Page
```
User Action: Click "Đăng Nhập" button
Current URL: Any page
Target URL: http://localhost:3000/login
File: frontend/app/login/page.tsx
```

### 2. Initialize Login Form
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: ''
})
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
```

### 3. Render Login Form
```tsx
<form onSubmit={handleSubmit}>
  <input 
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    placeholder="Email"
    required
  />
  
  <input 
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({...formData, password: e.target.value})}
    placeholder="Mật khẩu"
    required
  />
  
  <button type="submit" disabled={loading}>
    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
  </button>
</form>

<p>
  Chưa có tài khoản? 
  <Link href="/register">Đăng ký ngay</Link>
</p>
```

### 4. User Submits Form
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  
  try {
    // Call auth API
    const response = await authApi.login(formData)
    
    // Success - redirect
    router.push('/')
  } catch (err: any) {
    setError(err.message || 'Đăng nhập thất bại')
  } finally {
    setLoading(false)
  }
}
```

### 5. API Call - Login
```typescript
File: frontend/lib/api/auth.ts

async login(credentials: LoginCredentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error)
  }
  
  // Store user data and token in localStorage
  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('token', data.token)
  
  return data
}
```

### 6. Backend API - Verify Credentials
```typescript
File: frontend/app/api/auth/login/route.ts

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // Step 6.1: Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    return NextResponse.json(
      { error: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    )
  }
  
  // Step 6.2: Verify password
  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    return NextResponse.json(
      { error: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    )
  }
  
  // Step 6.3: Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '30m' }
  )
  
  // Step 6.4: Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user
  
  return NextResponse.json({
    user: userWithoutPassword,
    token
  })
}
```

**Database Query:**
```sql
SELECT 
  id,
  email,
  password,
  name,
  role,
  phone,
  avatar,
  address,
  createdAt,
  updatedAt
FROM "User"
WHERE email = 'user@example.com'
LIMIT 1;
```

### 7. Store Authentication Data
```typescript
Success Response:
{
  user: {
    id: "user-123",
    email: "user@example.com",
    name: "John Doe",
    role: "CUSTOMER",
    phone: null,
    avatar: null,
    address: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

localStorage:
- key "user" = JSON.stringify(user)
- key "token" = token string
```

### 8. Redirect to Homepage
```typescript
router.push('/')
```

### 9. Homepage Updates UI
```typescript
File: frontend/app/page.tsx

useEffect(() => {
  const userData = authApi.getStoredUser()
  if (userData) {
    setUser(userData)  // Update state
  }
}, [])
```

**UI Changes:**
- ❌ "Đăng Nhập" + "Đăng Ký" buttons → Hidden
- ✅ User avatar + name + dropdown menu → Shown
- ✅ "Giỏ hàng" link → Active
- ✅ "Thêm vào giỏ" buttons → Functional

## Postconditions

### Successful Login
- ✅ User data stored in localStorage
- ✅ JWT token stored in localStorage
- ✅ Redirected to homepage
- ✅ Header shows user info
- ✅ User can access protected features

### Failed Login
- ❌ Error message displayed
- ❌ Form remains on page
- ❌ User can try again
- ❌ localStorage empty

## Alternative Flows

### A1: Invalid Email Format
```
1. User enters: "invalidemail"
2. HTML5 validation triggers
3. Browser shows: "Please include '@' in email address"
4. Form doesn't submit
```

### A2: Empty Fields
```
1. User leaves email or password empty
2. HTML5 required validation triggers
3. Browser shows: "Please fill out this field"
4. Form doesn't submit
```

### A3: Wrong Email
```
1. User enters: "notexist@example.com"
2. API searches database
3. User not found
4. Return 401: "Email hoặc mật khẩu không đúng"
5. Frontend displays error message
6. Form remains, user can retry
```

### A4: Wrong Password
```
1. User enters correct email but wrong password
2. API finds user
3. bcrypt.compare() returns false
4. Return 401: "Email hoặc mật khẩu không đúng"
5. Frontend displays error message
```

### A5: Network Error
```
1. User submits form
2. Fetch request fails (no internet, server down)
3. Catch error
4. Display: "Không thể kết nối. Vui lòng thử lại."
5. loading = false
```

### A6: Token Expired (Later Login Attempt)
```
1. User logged in 30 minutes ago
2. Token has expired
3. User tries to access protected route
4. Backend verifies token → expired
5. Return 401
6. Frontend redirects to /login
7. Clear localStorage
```

## Exception Flows

### E1: Database Connection Failed
```
1. API tries to query database
2. Prisma connection fails
3. Catch error
4. Return 500: "Lỗi hệ thống. Vui lòng thử lại sau."
5. Frontend displays error
```

### E2: JWT Secret Not Configured
```
1. Backend tries to sign token
2. process.env.JWT_SECRET is undefined
3. jwt.sign() throws error
4. Return 500: "Server configuration error"
```

## Security Considerations

### Password Handling
```typescript
// ✅ GOOD: Password hashed with bcrypt
const hashedPassword = await bcrypt.hash(password, 10)

// ✅ GOOD: Compare hashed passwords
const isValid = await bcrypt.compare(plainPassword, hashedPassword)

// ❌ BAD: Never store plain text passwords
// ❌ BAD: Never return password in API response
const { password, ...userWithoutPassword } = user
```

### JWT Token
```typescript
// Token structure:
Header: { alg: "HS256", typ: "JWT" }
Payload: { 
  id: "user-123",
  email: "user@example.com",
  role: "CUSTOMER",
  iat: 1234567890,
  exp: 1234569690  // 30 minutes later
}
Signature: HMACSHA256(header + payload + secret)
```

### Error Messages
```typescript
// ✅ GOOD: Generic error message
"Email hoặc mật khẩu không đúng"

// ❌ BAD: Reveals too much info
"Email không tồn tại"  // Attacker knows email is not registered
"Mật khẩu sai"  // Attacker knows email exists
```

## Technical Details

### API Endpoint
```
POST /api/auth/login

Request Headers:
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Success Response (200):
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error Response (401):
{
  "error": "Email hoặc mật khẩu không đúng"
}

Error Response (500):
{
  "error": "Lỗi hệ thống. Vui lòng thử lại sau."
}
```

### localStorage Structure
```javascript
// key: "user"
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "phone": null,
  "avatar": null,
  "address": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

// key: "token"
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzMzNDM2MDAwLCJleHAiOjE3MzM0Mzc4MDB9.xyz..."
```

### Form Validation
```typescript
// Client-side validation
- email: type="email", required
- password: type="password", required, minLength=6

// Server-side validation
- email: valid email format
- password: exists and not empty
- user exists in database
- password matches hashed password
```

## Related Use Cases
- [UC-007: User Register](./UC-007-user-register.md)
- [UC-008: User Logout](./UC-008-user-logout.md)
- [UC-009: Update Profile](./UC-009-update-profile.md)
- [UC-001: Open Website](./UC-001-open-website.md)

## Notes
- Token expires after 30 minutes
- User must re-login after expiration
- Password minimum length: 6 characters
- Email must be unique trong database
- Case-insensitive email comparison
