import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Utility function to convert image to base64
function createMockBase64Image(color: string, text: string): string {
  // This is a minimal SVG as base64 for mock data
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${color}"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.user.deleteMany();

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
      avatar: createMockBase64Image('#3b82f6', 'Admin'),
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
      avatar: createMockBase64Image('#10b981', 'User 1'),
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
      avatar: createMockBase64Image('#f59e0b', 'User 2'),
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
      image: createMockBase64Image('#ef4444', '🍳'),
    },
  });

  const furniture = await prisma.category.create({
    data: {
      name: 'Nội Thất',
      slug: 'noi-that',
      description: 'Bàn ghế, tủ kệ và các đồ nội thất gia đình',
      image: createMockBase64Image('#8b5cf6', '🪑'),
    },
  });

  const cleaning = await prisma.category.create({
    data: {
      name: 'Đồ Vệ Sinh',
      slug: 'do-ve-sinh',
      description: 'Dụng cụ và hóa chất làm sạch nhà cửa',
      image: createMockBase64Image('#06b6d4', '🧹'),
    },
  });

  const decor = await prisma.category.create({
    data: {
      name: 'Đồ Trang Trí',
      slug: 'do-trang-tri',
      description: 'Đồ trang trí nội thất, tạo điểm nhấn cho ngôi nhà',
      image: createMockBase64Image('#ec4899', '🎨'),
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
        image: createMockBase64Image('#f97316', 'Nồi Inox'),
        images: [
          createMockBase64Image('#f97316', 'Nồi 1'),
          createMockBase64Image('#fb923c', 'Nồi 2'),
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
        image: createMockBase64Image('#ea580c', 'Chảo'),
        images: [createMockBase64Image('#ea580c', 'Chảo')],
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
        image: createMockBase64Image('#0ea5e9', 'Bình Nước'),
        images: [createMockBase64Image('#0ea5e9', 'Bình')],
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
        image: createMockBase64Image('#92400e', 'Bàn Gỗ'),
        images: [
          createMockBase64Image('#92400e', 'Bàn 1'),
          createMockBase64Image('#78350f', 'Bàn 2'),
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
        image: createMockBase64Image('#1e40af', 'Ghế'),
        images: [createMockBase64Image('#1e40af', 'Ghế')],
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
        image: createMockBase64Image('#059669', 'Máy Hút'),
        images: [createMockBase64Image('#059669', 'Máy')],
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
        image: createMockBase64Image('#0891b2', 'Cây Lau'),
        images: [createMockBase64Image('#0891b2', 'Cây')],
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
        image: createMockBase64Image('#be123c', 'Tranh'),
        images: [
          createMockBase64Image('#be123c', 'Tranh 1'),
          createMockBase64Image('#9f1239', 'Tranh 2'),
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
        image: createMockBase64Image('#15803d', 'Chậu Cây'),
        images: [createMockBase64Image('#15803d', 'Chậu')],
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
        image: createMockBase64Image('#dc2626', 'Winter Sale 2024'),
        link: '/products',
        order: 1,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Nội Thất Hiện Đại',
        subtitle: 'Làm mới ngôi nhà của bạn',
        image: createMockBase64Image('#7c3aed', 'Modern Furniture'),
        link: '/category/noi-that',
        order: 2,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Miễn Phí Vận Chuyển',
        subtitle: 'Cho đơn hàng trên 500.000đ',
        image: createMockBase64Image('#0891b2', 'Free Shipping'),
        link: '/products',
        order: 3,
        active: true,
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
