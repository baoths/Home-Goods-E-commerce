# Use Case Index - Home Goods E-commerce

## Overview
Tài liệu này chứa tất cả các use cases của hệ thống Home Goods E-commerce, mô tả chi tiết flow và technical implementation của từng chức năng.

## Use Case Categories

### 🌐 Public/Guest Features
| ID | Use Case | Description | Status |
|----|----------|-------------|--------|
| UC-001 | [Open Website](./UC-001-open-website.md) | Mở trang chủ lần đầu | ✅ Done |
| UC-002 | [User Login](./UC-002-user-login.md) | Đăng nhập hệ thống | ✅ Done |
| UC-004 | [View Category Products](./UC-004-view-category-products.md) | Xem sản phẩm theo danh mục (Nhà Bếp, v.v.) | ✅ Done |
| UC-003 | View Product Detail | Xem chi tiết 1 sản phẩm | 📝 TODO |
| UC-007 | User Register | Đăng ký tài khoản mới | 📝 TODO |
| UC-010 | Filter Products | Lọc sản phẩm theo giá, đánh giá | 📝 TODO |
| UC-011 | Search Products | Tìm kiếm sản phẩm | 📝 TODO |

### 👤 Customer Features (Requires Login)
| ID | Use Case | Description | Status |
|----|----------|-------------|--------|
| UC-005 | Add to Cart | Thêm sản phẩm vào giỏ hàng | 📝 TODO |
| UC-006 | View Cart | Xem giỏ hàng | 📝 TODO |
| UC-008 | User Logout | Đăng xuất | 📝 TODO |
| UC-009 | Update Profile | Cập nhật thông tin cá nhân | 📝 TODO |
| UC-012 | Upload Avatar | Upload avatar (Base64) | 📝 TODO |
| UC-013 | Checkout | Thanh toán đơn hàng | 📝 TODO |
| UC-014 | View Order History | Xem lịch sử đơn hàng | 📝 TODO |
| UC-015 | View Order Detail | Xem chi tiết đơn hàng | 📝 TODO |
| UC-016 | Cancel Order | Hủy đơn hàng | 📝 TODO |

### 👨‍💼 Admin Features (Admin Role Only)
| ID | Use Case | Description | Status |
|----|----------|-------------|--------|
| UC-020 | Admin Login | Đăng nhập với admin account | 📝 TODO |
| UC-021 | View Admin Dashboard | Xem dashboard thống kê | 📝 TODO |
| UC-022 | Manage Products | CRUD sản phẩm | 📝 TODO |
| UC-023 | Create Product | Tạo sản phẩm mới | 📝 TODO |
| UC-024 | Update Product | Sửa thông tin sản phẩm | 📝 TODO |
| UC-025 | Delete Product | Xóa sản phẩm | 📝 TODO |
| UC-026 | Upload Product Images | Upload multiple images | 📝 TODO |
| UC-027 | Manage Categories | CRUD danh mục | 📝 TODO |
| UC-028 | Create Category | Tạo danh mục mới | 📝 TODO |
| UC-029 | Update Category | Sửa danh mục | 📝 TODO |
| UC-030 | Delete Category | Xóa danh mục | 📝 TODO |
| UC-031 | Manage Users | View, edit, delete users | 📝 TODO |
| UC-032 | View User Detail | Xem chi tiết user | 📝 TODO |
| UC-033 | Update User Role | Thay đổi role user | 📝 TODO |
| UC-034 | Delete User | Xóa user | 📝 TODO |
| UC-035 | View All Orders | Xem tất cả đơn hàng | 📝 TODO |
| UC-036 | Update Order Status | Cập nhật trạng thái đơn hàng | 📝 TODO |

## Use Case Template

Mỗi use case document bao gồm:

### 1. Metadata
- **Mô tả**: Brief description
- **Actors**: Ai sử dụng chức năng này
- **Preconditions**: Điều kiện cần có trước khi thực hiện
- **Trigger**: Hành động kích hoạt use case

### 2. Main Flow
- Step-by-step flow chi tiết
- Code examples với TypeScript/TSX
- API calls và responses
- Database queries
- State management

### 3. UI/UX Details
- Component structure
- Forms và validations
- Loading states
- Error handling

### 4. Postconditions
- Success outcomes
- Failed outcomes
- System state changes

### 5. Alternative Flows
- Different paths user có thể đi
- Edge cases
- Error scenarios

### 6. Exception Flows
- Unexpected errors
- Network failures
- Database errors

### 7. Technical Details
- API endpoints
- Request/Response formats
- Database schemas
- Security considerations
- Performance optimizations

### 8. Related Use Cases
- Links to related documentation
- Dependencies
- Follow-up actions

## How to Use This Documentation

### For Developers
1. **Implementing new feature**: Read related use case first
2. **Debugging**: Check flow to understand expected behavior
3. **Code review**: Verify implementation matches documented flow
4. **Onboarding**: Start with UC-001 and follow the flow

### For QA/Testers
1. **Test cases**: Use flows to create test scenarios
2. **Bug reporting**: Reference use case ID
3. **Regression testing**: Follow alternative flows
4. **API testing**: Use documented endpoints

### For Product Managers
1. **Feature planning**: Reference for requirements
2. **User stories**: Convert flows to user stories
3. **Documentation**: Keep use cases updated with changes

## Contributing

### Adding New Use Case
1. Copy template structure
2. Follow naming convention: `UC-XXX-feature-name.md`
3. Include all sections
4. Add code examples
5. Link related use cases
6. Update this index

### Updating Existing Use Case
1. Check current implementation
2. Update flow if changed
3. Add version note if major change
4. Update "Last Updated" date

## Legend

- ✅ **Done**: Use case documented and implemented
- 📝 **TODO**: Not yet documented
- 🚧 **In Progress**: Being documented/implemented
- ⚠️ **Deprecated**: No longer used

## Quick Links

### Most Common Flows
1. [User Journey: Guest → Register → Login → Browse → Buy](./user-journey-guest-to-purchase.md) (TODO)
2. [Admin Journey: Login → Add Products → Manage Orders](./admin-journey-complete-workflow.md) (TODO)

### Technical References
- [API Documentation](./api-reference.md) (TODO)
- [Database Schema](./database-schema.md) (TODO)
- [Authentication Flow](./auth-flow.md) (TODO)
- [Image Upload Flow](./image-upload-flow.md) (TODO)

## Notes
- Tất cả use cases được viết bằng tiếng Việt để dễ hiểu
- Code examples sử dụng TypeScript
- Database queries sử dụng Prisma + SQL
- UI examples sử dụng React + TailwindCSS
