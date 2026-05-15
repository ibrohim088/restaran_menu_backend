import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './src/shared/config.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QR Restoran Menyu API',
      version: '1.0.0',
      description: 'Restoran menyu tizimi uchun REST API dokumentatsiyasi',
    },
    servers: [
      {
        url: config.BASE_URL,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    fullName: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['superadmin', 'admin'] },
                  },
                },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
          },
        },
        Restaurant: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            logoUrl: { type: 'string' },
            bannerUrl: { type: 'string' },
            isActive: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            restaurantId: { type: 'string' },
            name: { type: 'string' },
            imageUrl: { type: 'string' },
            isActive: { type: 'boolean' },
            orderIndex: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            categoryId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            price: { type: 'number' },
            weight: { type: 'string' },
            calories: { type: 'string' },
            isAvailable: { type: 'boolean' },
            isPopular: { type: 'boolean' },
            orderIndex: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'superadmin'] },
            isActive: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/login': {
        post: { tags: ['Auth'], summary: 'Tizimga kirish', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: { description: 'Muvaffaqiyatli kirish', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } }, 401: { description: "Email yoki parol noto'g'ri" } } },
      },
      '/auth/refresh': {
        post: { tags: ['Auth'], summary: 'Access tokenni yangilash', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangi access token' }, 401: { description: 'Yaroqsiz refresh token' } } },
      },
      '/auth/me': {
        get: { tags: ['Auth'], summary: "Joriy foydalanuvchi ma'lumotlari", security: [{ BearerAuth: [] }], responses: { 200: { description: "Foydalanuvchi ma'lumotlari" }, 401: { description: 'Token talab qilinadi' } } },
      },
      '/auth/logout': {
        post: { tags: ['Auth'], summary: 'Tizimdan chiqish', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Muvaffaqiyatli chiqish' } } },
      },
      '/auth/change-password': {
        put: { tags: ['Auth'], summary: "Parolni o'zgartirish", security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } }, responses: { 200: { description: 'Parol yangilandi' }, 400: { description: "Eski parol noto'g'ri" } } },
      },
      '/admins': {
        get: { tags: ['Admins'], summary: 'Barcha adminlarni olish (superadmin)', security: [{ BearerAuth: [] }], responses: { 200: { description: "Adminlar ro'yxati" } } },
        post: { tags: ['Admins'], summary: 'Yangi admin yaratish (superadmin)', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['fullName', 'email', 'password'], properties: { fullName: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6 } } } } } }, responses: { 201: { description: 'Admin yaratildi' } } },
      },
      '/admins/{id}': {
        get: { tags: ['Admins'], summary: "ID bo'yicha admin", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Admin' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Admins'], summary: 'Adminni yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string' }, email: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Admins'], summary: "Adminni o'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/admins/{id}/toggle': {
        patch: { tags: ['Admins'], summary: "Admin statusini o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Status o'zgartirildi" } } },
      },
      '/restaran': {
        get: { tags: ['Restaurants'], summary: 'Barcha restoranlarni olish', security: [{ BearerAuth: [] }], responses: { 200: { description: "Restoranlar ro'yxati" } } },
        post: { tags: ['Restaurants'], summary: 'Yangi restoran yaratish', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Restoran yaratildi' } } },
      },
      '/restaran/{id}': {
        get: { tags: ['Restaurants'], summary: "ID bo'yicha restoran", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restoran' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Restaurants'], summary: 'Restoranni yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Restaurants'], summary: "Restoranni o'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/restaran/{id}/qr': {
        post: { tags: ['Restaurants'], summary: 'QR kod generatsiya', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'QR kod yaratildi' } } },
      },
      '/categories/restaurants/{restaurantId}': {
        get: { tags: ['Categories'], summary: 'Restoran kategoriyalari', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Kategoriyalar ro'yxati" } } },
        post: { tags: ['Categories'], summary: 'Yangi kategoriya', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Kategoriya yaratildi' } } },
      },
      '/categories/{id}': {
        get: { tags: ['Categories'], summary: "ID bo'yicha kategoriya", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Kategoriya' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Categories'], summary: 'Kategoriyani yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Categories'], summary: "Kategoriyani o'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/categories/{id}/toggle': {
        patch: { tags: ['Categories'], summary: "Kategoriya statusini o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Status o'zgartirildi" } } },
      },
      '/menu/categories/{categoryId}': {
        get: { tags: ['Menu'], summary: 'Kategoriya taomları', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Taomlar ro'yxati" } } },
        post: { tags: ['Menu'], summary: 'Yangi taom yaratish', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Taom yaratildi' } } },
      },
      '/menu/{id}': {
        get: { tags: ['Menu'], summary: "ID bo'yicha taom", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Taom' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Menu'], summary: 'Taomni yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Menu'], summary: "Taomni o'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/menu/{id}/toggle': {
        patch: { tags: ['Menu'], summary: "Taom mavjudligini o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Status o'zgartirildi" } } },
      },
      '/public/menu/{restaurantId}': {
        get: { tags: ['Public'], summary: 'Ommaviy menyu (token kerak emas)', parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restoran menyusi' } } },
      },
      '/public/menu/{restaurantId}/categories': {
        get: { tags: ['Public'], summary: 'Ommaviy kategoriyalar (token kerak emas)', parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Kategoriyalar ro'yxati" } } },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions = {
  customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
  customJs: [
    'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js',
  ],
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  console.log(`Swagger UI: ${config.BASE_URL}/api-docs`);
};
