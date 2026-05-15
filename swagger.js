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
            data: { type: 'object', properties: { user: { type: 'object', properties: { id: { type: 'string' }, fullName: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['superadmin', 'admin'] } } } } },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string', minLength: 6 } },
        },
        Restaurant: {
          type: 'object',
          properties: { _id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, logoUrl: { type: 'string' }, bannerUrl: { type: 'string' }, isActive: { type: 'boolean' }, created_at: { type: 'string', format: 'date-time' } },
        },
        Category: {
          type: 'object',
          properties: { _id: { type: 'string' }, restaurantId: { type: 'string' }, name: { type: 'string' }, imageUrl: { type: 'string' }, isActive: { type: 'boolean' }, orderIndex: { type: 'number' }, created_at: { type: 'string', format: 'date-time' } },
        },
        MenuItem: {
          type: 'object',
          properties: { _id: { type: 'string' }, categoryId: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, imageUrl: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, isAvailable: { type: 'boolean' }, isPopular: { type: 'boolean' }, orderIndex: { type: 'number' }, created_at: { type: 'string', format: 'date-time' } },
        },
        Admin: {
          type: 'object',
          properties: { _id: { type: 'string' }, fullName: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['admin', 'superadmin'] }, isActive: { type: 'boolean' }, created_at: { type: 'string', format: 'date-time' } },
        },
        SuccessMessage: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' } } },
        ErrorResponse: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } } },
      },
    },
    paths: {
      '/auth/login': { post: { tags: ['Auth'], summary: 'Tizimga kirish', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: { description: 'Muvaffaqiyatli kirish' }, 401: { description: "Noto'g'ri ma'lumotlar" } } } },
      '/auth/refresh': { post: { tags: ['Auth'], summary: 'Access tokenni yangilash', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangi access token' }, 401: { description: 'Yaroqsiz token' } } } },
      '/auth/me': { get: { tags: ['Auth'], summary: "Joriy foydalanuvchi ma'lumotlari", security: [{ BearerAuth: [] }], responses: { 200: { description: 'Foydalanuvchi' }, 401: { description: 'Token kerak' } } } },
      '/auth/logout': { post: { tags: ['Auth'], summary: 'Tizimdan chiqish', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Chiqildi' } } } },
      '/auth/change-password': { put: { tags: ['Auth'], summary: "Parolni o'zgartirish", security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } }, responses: { 200: { description: 'Parol yangilandi' } } } },
      '/admins': {
        get: { tags: ['Admins'], summary: 'Barcha adminlar (superadmin)', security: [{ BearerAuth: [] }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Admins'], summary: 'Yangi admin (superadmin)', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['fullName', 'email', 'password'], properties: { fullName: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/admins/{id}': {
        get: { tags: ['Admins'], summary: "ID bo'yicha admin", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Admin' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Admins'], summary: 'Adminni yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string' }, email: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Admins'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/admins/{id}/toggle': { patch: { tags: ['Admins'], summary: "Status o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Yangilandi' } } } },
      '/restaran': {
        get: { tags: ['Restaurants'], summary: 'Barcha restoranlar', security: [{ BearerAuth: [] }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Restaurants'], summary: 'Yangi restoran', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/restaran/{id}': {
        get: { tags: ['Restaurants'], summary: "ID bo'yicha restoran", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restoran' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Restaurants'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Restaurants'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/restaran/{id}/qr': { post: { tags: ['Restaurants'], summary: 'QR kod', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'QR yaratildi' } } } },
      '/categories/restaurants/{restaurantId}': {
        get: { tags: ['Categories'], summary: 'Restoran kategoriyalari', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Categories'], summary: 'Yangi kategoriya', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/categories/{id}': {
        get: { tags: ['Categories'], summary: "ID bo'yicha kategoriya", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Kategoriya' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Categories'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Categories'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/categories/{id}/toggle': { patch: { tags: ['Categories'], summary: "Status o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Yangilandi' } } } },
      '/menu/categories/{categoryId}': {
        get: { tags: ['Menu'], summary: 'Kategoriya taomlari', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Menu'], summary: 'Yangi taom', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/menu/{id}': {
        get: { tags: ['Menu'], summary: "ID bo'yicha taom", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Taom' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Menu'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Menu'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/menu/{id}/toggle': { patch: { tags: ['Menu'], summary: "Mavjudlikni o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Yangilandi' } } } },
      '/public/menu/{restaurantId}': { get: { tags: ['Public'], summary: 'Ommaviy menyu', parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Menyu' } } } },
      '/public/menu/{restaurantId}/categories': { get: { tags: ['Public'], summary: 'Ommaviy kategoriyalar', parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Ro'yxat" } } } },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  // ✅ JSON spec endpoint — frontend yoki test uchun
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // ✅ Swagger UI — to'liq HTML o'zimiz yozamiz (Vercel CSP muammosi yo'q)
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Restoran Menyu API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout',
        deepLinking: true,
        persistAuthorization: true,
      });
    };
  </script>
</body>
</html>`);
  });

  console.log(`Swagger UI: ${config.BASE_URL}/api-docs`);
};