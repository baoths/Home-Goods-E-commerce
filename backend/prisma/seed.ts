import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data in a specific order to avoid foreign key constraints
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Cleared existing data');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@homegoods.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '0901234567',
      role: UserRole.ADMIN,
      avatarUrl: 'https://via.placeholder.com/150/3b82f6/FFFFFF?text=Admin',
      address: '123 Admin Street, Hanoi, Vietnam',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      password: hashedPassword,
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      role: UserRole.CUSTOMER,
      avatarUrl: 'https://via.placeholder.com/150/10b981/FFFFFF?text=User+A',
      address: '456 Customer St, Ho Chi Minh City, Vietnam',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      password: hashedPassword,
      name: 'Trần Thị B',
      phone: '0923456789',
      role: UserRole.CUSTOMER,
      avatarUrl: 'https://via.placeholder.com/150/f59e0b/FFFFFF?text=User+B',
      address: '789 Buyer Rd, Da Nang, Vietnam',
    },
  });

  console.log('✅ Created users');

  // Create Categories
  const kitchenware = await prisma.category.create({
    data: {
      name: 'Đồ Dùng Nhà Bếp',
      slug: 'do-dung-nha-bep',
      description: 'Các sản phẩm phục vụ nấu nướng và bảo quản thực phẩm',
      imageUrl: 'https://via.placeholder.com/400/ef4444/FFFFFF?text=Kitchen',
    },
  });

  const furniture = await prisma.category.create({
    data: {
      name: 'Nội Thất',
      slug: 'noi-that',
      description: 'Bàn ghế, tủ kệ và các đồ nội thất gia đình',
      imageUrl: 'https://via.placeholder.com/400/8b5cf6/FFFFFF?text=Furniture',
    },
  });

  const cleaning = await prisma.category.create({
    data: {
      name: 'Đồ Vệ Sinh',
      slug: 'do-ve-sinh',
      description: 'Dụng cụ và hóa chất làm sạch nhà cửa',
      imageUrl: 'https://via.placeholder.com/400/06b6d4/FFFFFF?text=Cleaning',
    },
  });

  const decor = await prisma.category.create({
    data: {
      name: 'Đồ Trang Trí',
      slug: 'do-trang-tri',
      description: 'Đồ trang trí nội thất, tạo điểm nhấn cho ngôi nhà',
      imageUrl: 'https://via.placeholder.com/400/ec4899/FFFFFF?text=Decor',
    },
  });

  console.log('✅ Created categories');

  // Create Products
  const products = await Promise.all([
    // Kitchenware
    prisma.product.create({
      data: {
        name: 'Bộ Nồi Inox 5 Món',
        slug: 'bo-noi-inox-5-mon',
        description: 'Bộ nồi inox cao cấp 5 món, chống dính, dùng được cho bếp từ. Chất liệu inox 304 an toàn, bền đẹp.',
        price: 1299000,
        discount: 15,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/400/f97316/FFFFFF?text=Pot+Set',
        imageUrls: [
          'https://via.placeholder.com/600x800/f97316/FFFFFF?text=Pot+1',
          'https://via.placeholder.com/600x800/fb923c/FFFFFF?text=Pot+2',
        ],
        featured: true,
        categoryId: kitchenware.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chảo Chống Dính 28cm',
        slug: 'chao-chong-dinh-28cm',
        description: 'Chảo chống dính cao cấp, lớp phủ Teflon bền, không chứa PFOA. Tay cầm cách nhiệt.',
        price: 399000,
        discount: 10,
        stock: 100,
        imageUrl: 'https://via.placeholder.com/400/ea580c/FFFFFF?text=Pan',
        imageUrls: ['https://via.placeholder.com/600x800/ea580c/FFFFFF?text=Pan+1'],
        featured: true,
        categoryId: kitchenware.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bình Đựng Nước Thủy Tinh 1.5L',
        slug: 'binh-dung-nuoc-thuy-tinh',
        description: 'Bình đựng nước thủy tinh cao cấp, nắp kín, giữ lạnh tốt. Thiết kế sang trọng.',
        price: 159000,
        discount: 0,
        stock: 200,
        imageUrl: 'https://via.placeholder.com/400/0ea5e9/FFFFFF?text=Jug',
        imageUrls: ['https://via.placeholder.com/600x800/0ea5e9/FFFFFF?text=Jug+1'],
        featured: false,
        categoryId: kitchenware.id,
      },
    }),

    // Furniture
    prisma.product.create({
      data: {
        name: 'Bàn Làm Việc Gỗ Cao Su',
        slug: 'ban-lam-viec-go-cao-su',
        description: 'Bàn làm việc gỗ cao su tự nhiên, thiết kế hiện đại, 2 ngăn kéo. Kích thước 120x60cm.',
        price: 2499000,
        discount: 20,
        stock: 30,
        imageUrl: 'https://via.placeholder.com/400/92400e/FFFFFF?text=Desk',
        imageUrls: [
          'https://via.placeholder.com/600x800/92400e/FFFFFF?text=Desk+1',
          'https://via.placeholder.com/600x800/78350f/FFFFFF?text=Desk+2',
        ],
        featured: true,
        categoryId: furniture.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ghế Xoay Văn Phòng',
        slug: 'ghe-xoay-van-phong',
        description: 'Ghế xoay văn phòng cao cấp, có tựa lưng, tay vịn điều chỉnh. Đệm êm ái.',
        price: 1799000,
        discount: 15,
        stock: 45,
        imageUrl: 'https://via.placeholder.com/400/1e40af/FFFFFF?text=Chair',
        imageUrls: ['https://via.placeholder.com/600x800/1e40af/FFFFFF?text=Chair+1'],
        featured: false,
        categoryId: furniture.id,
      },
    }),

    // Cleaning
    prisma.product.create({
      data: {
        name: 'Máy Hút Bụi Cầm Tay',
        slug: 'may-hut-bui-cam-tay',
        description: 'Máy hút bụi cầm tay không dây, công suất mạnh, pin lithium 2200mAh.',
        price: 899000,
        discount: 25,
        stock: 60,
        imageUrl: 'https://via.placeholder.com/400/059669/FFFFFF?text=Vacuum',
        imageUrls: ['https://via.placeholder.com/600x800/059669/FFFFFF?text=Vacuum+1'],
        featured: true,
        categoryId: cleaning.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bộ Cây Lau Nhà Xoay 360',
        slug: 'bo-cay-lau-nha-xoay-360',
        description: 'Bộ cây lau nhà xoay 360 độ, có thùng vắt, đầu lau bông cotton siêu thấm.',
        price: 299000,
        discount: 0,
        stock: 150,
        imageUrl: 'https://via.placeholder.com/400/0891b2/FFFFFF?text=Mop',
        imageUrls: ['https://via.placeholder.com/600x800/0891b2/FFFFFF?text=Mop+1'],
        featured: false,
        categoryId: cleaning.id,
      },
    }),

    // Decor
    prisma.product.create({
      data: {
        name: 'Tranh Treo Tường Canvas',
        slug: 'tranh-treo-tuong-canvas',
        description: 'Tranh canvas in UV hiện đại, khung nhôm cao cấp. Kích thước 60x80cm.',
        price: 599000,
        discount: 10,
        stock: 75,
        imageUrl: 'https://via.placeholder.com/400/be123c/FFFFFF?text=Painting',
        imageUrls: [
          'https://via.placeholder.com/600x800/be123c/FFFFFF?text=Painting+1',
          'https://via.placeholder.com/600x800/9f1239/FFFFFF?text=Painting+2',
        ],
        featured: true,
        categoryId: decor.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chậu Cây Cảnh Gốm Sứ',
        slug: 'chau-cay-canh-gom-su',
        description: 'Chậu cây cảnh gốm sứ Bát Tràng, men trắng ngà, có lỗ thoát nước.',
        price: 179000,
        discount: 5,
        stock: 120,
        imageUrl: 'https://via.placeholder.com/400/15803d/FFFFFF?text=Plant+Pot',
        imageUrls: ['https://via.placeholder.com/600x800/15803d/FFFFFF?text=Pot+1'],
        featured: false,
        categoryId: decor.id,
      },
    }),
  ]);

  console.log('✅ Created products');

  // Create Banners
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Giảm Giá Mùa Đông 2024',
        subtitle: 'Giảm đến 50% toàn bộ đồ gia dụng',
        imageUrl: 'https://via.placeholder.com/1200x400/dc2626/FFFFFF?text=Winter+Sale+2024',
        link: '/category/do-dung-nha-bep',
        order: 1,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Nội Thất Hiện Đại',
        subtitle: 'Làm mới ngôi nhà của bạn với phong cách tối giản',
        imageUrl: 'https://via.placeholder.com/1200x400/7c3aed/FFFFFF?text=Modern+Furniture',
        link: '/category/noi-that',
        order: 2,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Miễn Phí Vận Chuyển',
        subtitle: 'Cho mọi đơn hàng trên 500.000đ',
        imageUrl: 'https://via.placeholder.com/1200x400/0891b2/FFFFFF?text=Free+Shipping',
        link: '/products',
        order: 3,
        active: true,
      },
    }),
     prisma.banner.create({
      data: {
        title: 'Back to School',
        subtitle: 'Trang bị góc học tập đầy đủ tiện nghi',
        imageUrl: 'https://via.placeholder.com/1200x400/f59e0b/FFFFFF?text=Back+to+School',
        link: '/category/noi-that',
        order: 4,
        active: false, // This banner is inactive
      },
    }),
  ]);

  console.log('✅ Created banners');

  // Create Sample Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      userId: customer1.id,
      status: OrderStatus.DELIVERED,
      totalAmount: 1698000,
      shippingFee: 30000,
      discountAmount: 254700, // 15% discount
      finalAmount: 1473300,
      shippingName: customer1.name,
      shippingPhone: customer1.phone!,
      shippingAddress: customer1.address!,
      note: 'Giao giờ hành chính',
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: products[0].id, // Bộ Nồi Inox
        quantity: 1,
        price: 1299000,
        discount: 15,
        subtotal: 1104150,
      },
      {
        orderId: order1.id,
        productId: products[1].id, // Chảo
        quantity: 1,
        price: 399000,
        discount: 10,
        subtotal: 359100,
      },
    ],
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-002',
      userId: customer2.id,
      status: OrderStatus.PROCESSING,
      totalAmount: 2499000,
      shippingFee: 50000,
      discountAmount: 499800, // 20% discount
      finalAmount: 2049200,
      shippingName: customer2.name,
      shippingPhone: customer2.phone!,
      shippingAddress: customer2.address!,
      note: 'Gọi trước khi giao',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: products[3].id, // Bàn Làm Việc
      quantity: 1,
      price: 2499000,
      discount: 20,
      subtotal: 1999200,
    },
  });

  console.log('✅ Created orders');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Categories: ${await prisma.category.count()}`);
  console.log(`- Products: ${await prisma.product.count()}`);
  console.log(`- Banners: ${await prisma.banner.count()}`);
  console.log(`- Orders: ${await prisma.order.count()}`);
  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@homegoods.com / password123');
  console.log('Customer: customer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
