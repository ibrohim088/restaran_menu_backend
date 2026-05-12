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
        // ─── AUTH ───────────────────────────────────────────────
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

        // ─── RESTAURANT ─────────────────────────────────────────
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

        // ─── CATEGORY ───────────────────────────────────────────
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

        // ─── MENU ITEM ──────────────────────────────────────────
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

        // ─── ADMIN ──────────────────────────────────────────────
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

        // ─── COMMON ─────────────────────────────────────────────
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

    // ─── PATHS ────────────────────────────────────────────────────
    paths: {

      // ══ AUTH ══════════════════════════════════════════════════════
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Tizimga kirish',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Muvaffaqiyatli kirish', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            401: { description: 'Email yoki parol noto\'g\'ri', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Access tokenni yangilash',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } },
          },
          responses: {
            200: { description: 'Yangi access token', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, accessToken: { type: 'string' } } } } } },
            401: { description: 'Yaroqsiz refresh token' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Joriy foydalanuvchi ma\'lumotlari',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Foydalanuvchi ma\'lumotlari', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Admin' } } } } } },
            401: { description: 'Token talab qilinadi' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Tizimdan chiqish',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Muvaffaqiyatli chiqish', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          },
        },
      },
      '/auth/change-password': {
        put: {
          tags: ['Auth'],
          summary: 'Parolni o\'zgartirish',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
          },
          responses: {
            200: { description: 'Parol yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
            400: { description: 'Eski parol noto\'g\'ri' },
          },
        },
      },

      // ══ ADMINS ════════════════════════════════════════════════════
      '/admins': {
        get: {
          tags: ['Admins'],
          summary: 'Barcha adminlarni olish (superadmin)',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Adminlar ro\'yxati', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Admin' } } } } } } },
          },
        },
        post: {
          tags: ['Admins'],
          summary: 'Yangi admin yaratish (superadmin)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fullName', 'email', 'password'],
                  properties: {
                    fullName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Admin yaratildi', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Admin' } } } } } },
          },
        },
      },
      '/admins/{id}': {
        get: {
          tags: ['Admins'],
          summary: 'ID bo\'yicha admin (superadmin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Admin', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Admin' } } } } } }, 404: { description: 'Topilmadi' } },
        },
        put: {
          tags: ['Admins'],
          summary: 'Adminni yangilash (superadmin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string' }, email: { type: 'string' } } } } } },
          responses: { 200: { description: 'Yangilandi' }, 404: { description: 'Topilmadi' } },
        },
        delete: {
          tags: ['Admins'],
          summary: 'Adminni o\'chirish (superadmin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'O\'chirildi' }, 404: { description: 'Topilmadi' } },
        },
      },
      '/admins/{id}/toggle': {
        patch: {
          tags: ['Admins'],
          summary: 'Admin statusini o\'zgartirish (superadmin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Status o\'zgartirildi' } },
        },
      },

      // ══ RESTAURANTS ═══════════════════════════════════════════════
      '/restaran': {
        get: {
          tags: ['Restaurants'],
          summary: 'Barcha restoranlarni olish (admin)',
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: 'Restoranlar ro\'yxati', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } } } } } } } },
        },
        post: {
          tags: ['Restaurants'],
          summary: 'Yangi restoran yaratish (admin)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    logo: { type: 'string', format: 'binary' },
                    banner: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Restoran yaratildi' } },
        },
      },
      '/restaran/{id}': {
        get: {
          tags: ['Restaurants'],
          summary: 'ID bo\'yicha restoran (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Restoran', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Restaurant' } } } } } }, 404: { description: 'Topilmadi' } },
        },
        put: {
          tags: ['Restaurants'],
          summary: 'Restoranni yangilash (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } },
          responses: { 200: { description: 'Yangilandi' } },
        },
        delete: {
          tags: ['Restaurants'],
          summary: 'Restoranni o\'chirish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'O\'chirildi' } },
        },
      },
      '/restaran/{id}/qr': {
        post: {
          tags: ['Restaurants'],
          summary: 'QR kod generatsiya qilish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'QR kod yaratildi' } },
        },
      },

      // ══ CATEGORIES ════════════════════════════════════════════════
      '/categories/restaurants/{restaurantId}': {
        get: {
          tags: ['Categories'],
          summary: 'Restoran kategoriyalarini olish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Kategoriyalar ro\'yxati', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } } } },
        },
        post: {
          tags: ['Categories'],
          summary: 'Yangi kategoriya yaratish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
          responses: { 201: { description: 'Kategoriya yaratildi' } },
        },
      },
      '/categories/{id}': {
        get: {
          tags: ['Categories'],
          summary: 'ID bo\'yicha kategoriya (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Kategoriya' }, 404: { description: 'Topilmadi' } },
        },
        put: {
          tags: ['Categories'],
          summary: 'Kategoriyani yangilash (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
          responses: { 200: { description: 'Yangilandi' } },
        },
        delete: {
          tags: ['Categories'],
          summary: 'Kategoriyani o\'chirish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'O\'chirildi' } },
        },
      },
      '/categories/{id}/toggle': {
        patch: {
          tags: ['Categories'],
          summary: 'Kategoriya statusini o\'zgartirish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Status o\'zgartirildi' } },
        },
      },

      // ══ MENU ITEMS ════════════════════════════════════════════════
      '/menu/categories/{categoryId}': {
        get: {
          tags: ['Menu'],
          summary: 'Kategoriya taomlarini olish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Taomlar ro\'yxati', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } } } } } } } },
        },
        post: {
          tags: ['Menu'],
          summary: 'Yangi taom yaratish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['name', 'price'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    weight: { type: 'string' },
                    calories: { type: 'string' },
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Taom yaratildi' } },
        },
      },
      '/menu/{id}': {
        get: {
          tags: ['Menu'],
          summary: 'ID bo\'yicha taom (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Taom', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/MenuItem' } } } } } }, 404: { description: 'Topilmadi' } },
        },
        put: {
          tags: ['Menu'],
          summary: 'Taomni yangilash (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
          responses: { 200: { description: 'Yangilandi' } },
        },
        delete: {
          tags: ['Menu'],
          summary: 'Taomni o\'chirish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'O\'chirildi' } },
        },
      },
      '/menu/{id}/toggle': {
        patch: {
          tags: ['Menu'],
          summary: 'Taom mavjudligini o\'zgartirish (admin)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Status o\'zgartirildi' } },
        },
      },

      // ══ PUBLIC ════════════════════════════════════════════════════
      '/public/menu/{restaurantId}': {
        get: {
          tags: ['Public'],
          summary: 'Ommaviy menyu (token talab qilinmaydi)',
          parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Restoran menyusi' } },
        },
      },
      '/public/menu/{restaurantId}/categories': {
        get: {
          tags: ['Public'],
          summary: 'Ommaviy kategoriyalar (token talab qilinmaydi)',
          parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Kategoriyalar ro\'yxati' } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger UI: ${config.BASE_URL}/api-docs`);
};