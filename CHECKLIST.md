# ✅ Developer Checklist

## 🎯 Setup Checklist

### Initial Setup
- [ ] Clone repository
- [ ] Đọc [GETTING_STARTED.md](GETTING_STARTED.md)
- [ ] Đăng ký NeonDB account
- [ ] Copy DATABASE_URL vào .env files
- [ ] Install Python dependencies
- [ ] Install Node dependencies
- [ ] Run Prisma migrations
- [ ] Seed database với mock data
- [ ] Test backend (http://localhost:8000/docs)
- [ ] Test frontend (http://localhost:3000)

### Understanding Architecture
- [ ] Đọc [CLEAN_ARCHITECTURE_EXPLAINED.md](CLEAN_ARCHITECTURE_EXPLAINED.md)
- [ ] Hiểu 4 layers: Domain, Application, Infrastructure, Presentation
- [ ] Hiểu SOLID principles
- [ ] Xem code examples trong `domain/entities.py`
- [ ] Xem code examples trong `application/use_cases.py`

---

## 🏗️ Development Checklist

### Khi Thêm Entity Mới
- [ ] Tạo entity class trong `domain/entities.py`
- [ ] Add business rules methods
- [ ] Tạo repository interface trong `domain/repositories.py`
- [ ] Implement repository trong `infrastructure/repositories/`
- [ ] Update Prisma schema nếu cần
- [ ] Run `npx prisma db push`

### Khi Thêm Use Case Mới
- [ ] Tạo DTO trong `application/dto.py`
- [ ] Tạo use case class trong `application/use_cases.py`
- [ ] Inject repository dependencies
- [ ] Implement execute() method
- [ ] Add error handling
- [ ] Write unit tests

### Khi Thêm API Endpoint
- [ ] Tạo route trong `presentation/api/routes/`
- [ ] Define request/response schemas
- [ ] Inject use case
- [ ] Add authentication nếu cần
- [ ] Add error handling
- [ ] Test với Postman/curl
- [ ] Update API documentation

### Khi Thêm Frontend Page
- [ ] Tạo page trong `app/`
- [ ] Implement UI components
- [ ] Add client-side validation
- [ ] Connect to API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test responsiveness

### Khi Xử Lý Images
- [ ] Use `prepareImageForUpload()` từ `lib/image.ts` (Frontend)
- [ ] Use `process_upload_image()` từ `image_utils.py` (Backend)
- [ ] Validate file type & size
- [ ] Compress images
- [ ] Store as base64 in database
- [ ] Handle errors gracefully

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Test entities business logic
- [ ] Test use cases
- [ ] Test utilities (image, password, jwt)
- [ ] Mock dependencies
- [ ] Aim for 80%+ coverage

### Integration Tests
- [ ] Test API endpoints
- [ ] Test database operations
- [ ] Test authentication flow
- [ ] Test file upload flow

### Manual Testing
- [ ] Test all user flows
- [ ] Test admin flows
- [ ] Test error cases
- [ ] Test on different browsers
- [ ] Test mobile responsiveness

---

## 📝 Code Quality Checklist

### Before Commit
- [ ] Code follows SOLID principles
- [ ] No hardcoded values (use config/env)
- [ ] Proper error handling
- [ ] Type hints (Python) / Types (TypeScript)
- [ ] Comments for complex logic
- [ ] Remove console.log / print statements
- [ ] No unused imports
- [ ] Format code (black, prettier)

### Code Review Checklist
- [ ] Single Responsibility - Each function does one thing
- [ ] DRY - No code duplication
- [ ] Naming is clear and descriptive
- [ ] Error handling is present
- [ ] Security considerations (no SQL injection, XSS, etc.)
- [ ] Performance considerations
- [ ] Tests are included

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Update .env.example
- [ ] Update documentation
- [ ] Update CHANGELOG (if exists)
- [ ] Security audit (dependencies)
- [ ] Performance optimization

### Environment Setup
- [ ] Production DATABASE_URL
- [ ] Strong SECRET_KEY
- [ ] Correct ALLOWED_ORIGINS
- [ ] All env variables set
- [ ] HTTPS enabled
- [ ] Logging configured

### Post-deployment
- [ ] Verify app is running
- [ ] Test critical paths
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Setup alerts

---

## 📚 Learning Checklist

### Clean Architecture
- [ ] Understand layers separation
- [ ] Understand dependency direction
- [ ] Know when to use each layer
- [ ] Can explain to others

### SOLID Principles
- [ ] Single Responsibility
- [ ] Open/Closed
- [ ] Liskov Substitution
- [ ] Interface Segregation
- [ ] Dependency Inversion

### Project Specifics
- [ ] Understand image to base64 flow
- [ ] Understand authentication flow
- [ ] Understand use case pattern
- [ ] Understand repository pattern
- [ ] Can add new features independently

---

## 🐛 Debugging Checklist

### When Something Breaks
- [ ] Check terminal/console logs
- [ ] Check browser network tab
- [ ] Check database connection
- [ ] Check environment variables
- [ ] Verify Prisma client is generated
- [ ] Check Python virtual environment is activated
- [ ] Restart dev servers
- [ ] Clear node_modules and reinstall
- [ ] Check [QUICK_START.md#troubleshooting](QUICK_START.md)

### Common Issues
- [ ] `Module not found` → Run `npm install` or `pip install`
- [ ] `Prisma client not found` → Run `npx prisma generate`
- [ ] `Database connection failed` → Check DATABASE_URL
- [ ] `Port already in use` → Change port or kill process
- [ ] `Import errors` → Check virtual environment

---

## 📊 Project Health Checklist

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review and close stale issues
- [ ] Refactor complex code
- [ ] Update documentation
- [ ] Backup database
- [ ] Review security advisories

### Metrics to Track
- [ ] Test coverage percentage
- [ ] API response times
- [ ] Error rates
- [ ] User growth
- [ ] Code quality scores

---

**Use this checklist to ensure quality and consistency! ✨**
