import swaggerJsdoc from 'swagger-jsdoc';
import config from './src/shared/config.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QR Restoran Menyu API',
      version: '1.0.0',
      description: 'Restoran menyu tizimi uchun REST API dokumentatsiyasi',
    },
    servers: [{ url: config.BASE_URL, description: 'Server' }],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        LoginRequest: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email', example: 'admin@example.com' }, password: { type: 'string', minLength: 6, example: 'password123' } } },
        LoginResponse: { type: 'object', properties: { success: { type: 'boolean' }, accessToken: { type: 'string' }, refreshToken: { type: 'string' } } },
        ChangePasswordRequest: { type: 'object', required: ['oldPassword', 'newPassword'], properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } } },
        Restaurant: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, logoUrl: { type: 'string' }, bannerUrl: { type: 'string' }, isActive: { type: 'boolean' } } },
        Category: { type: 'object', properties: { _id: { type: 'string' }, restaurantId: { type: 'string' }, name: { type: 'string' }, imageUrl: { type: 'string' }, isActive: { type: 'boolean' }, orderIndex: { type: 'number' } } },
        MenuItem: { type: 'object', properties: { _id: { type: 'string' }, categoryId: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, isAvailable: { type: 'boolean' } } },
        Admin: { type: 'object', properties: { _id: { type: 'string' }, fullName: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['admin', 'superadmin'] }, isActive: { type: 'boolean' } } },
        SuccessMessage: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' } } },
        ErrorResponse: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } } },
      },
    },
    paths: {
      '/auth/login': { post: { tags: ['Auth'], summary: 'Tizimga kirish', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: { description: 'Muvaffaqiyatli' }, 401: { description: "Noto'g'ri ma'lumotlar" } } } },
      '/auth/refresh': { post: { tags: ['Auth'], summary: 'Token yangilash', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangi token' } } } },
      '/auth/me': { get: { tags: ['Auth'], summary: 'Joriy foydalanuvchi', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Foydalanuvchi' } } } },
      '/auth/logout': { post: { tags: ['Auth'], summary: 'Chiqish', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Chiqildi' } } } },
      '/auth/change-password': { put: { tags: ['Auth'], summary: "Parol o'zgartirish", security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } }, responses: { 200: { description: 'Yangilandi' } } } },
      '/admins': {
        get: { tags: ['Admins'], summary: 'Barcha adminlar', security: [{ BearerAuth: [] }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Admins'], summary: 'Admin yaratish', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['fullName', 'email', 'password'], properties: { fullName: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/admins/{id}': {
        get: { tags: ['Admins'], summary: 'Admin', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Admin' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Admins'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string' }, email: { type: 'string' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Admins'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/admins/{id}/toggle': { patch: { tags: ['Admins'], summary: "Status o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Yangilandi' } } } },
      '/restaran': {
        get: { tags: ['Restaurants'], summary: 'Barcha restoranlar', security: [{ BearerAuth: [] }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Restaurants'], summary: 'Restoran yaratish', security: [{ BearerAuth: [] }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/restaran/{id}': {
        get: { tags: ['Restaurants'], summary: 'Restoran', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restoran' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Restaurants'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, logo: { type: 'string', format: 'binary' }, banner: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Restaurants'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/restaran/{id}/qr': { post: { tags: ['Restaurants'], summary: 'QR kod', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'QR yaratildi' } } } },
      '/categories/restaurants/{restaurantId}': {
        get: { tags: ['Categories'], summary: 'Kategoriyalar', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Categories'], summary: 'Kategoriya yaratish', security: [{ BearerAuth: [] }], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/categories/{id}': {
        get: { tags: ['Categories'], summary: 'Kategoriya', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Kategoriya' }, 404: { description: 'Topilmadi' } } },
        put: { tags: ['Categories'], summary: 'Yangilash', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Yangilandi' } } },
        delete: { tags: ['Categories'], summary: "O'chirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "O'chirildi" } } },
      },
      '/categories/{id}/toggle': { patch: { tags: ['Categories'], summary: "Status o'zgartirish", security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Yangilandi' } } } },
      '/menu/categories/{categoryId}': {
        get: { tags: ['Menu'], summary: 'Taomlari', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: "Ro'yxat" } } },
        post: { tags: ['Menu'], summary: 'Taom yaratish', security: [{ BearerAuth: [] }], parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, weight: { type: 'string' }, calories: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Yaratildi' } } },
      },
      '/menu/{id}': {
        get: { tags: ['Menu'], summary: 'Taom', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Taom' }, 404: { description: 'Topilmadi' } } },
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
  // JSON spec
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(swaggerSpec);
  });

  // ✅ swagger-ui-express ishlatilmaydi — to'liq o'zimiz HTML yozamiz
  // Bu Vercel'da swaggerUi.serve muammosini hal qiladi
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>QR Restoran Menyu API</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
  <style>body{margin:0}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script>
  // CDN dan yuklanadi — Vercel static fayl muammosi yo'q
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }
  loadScript('https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js', function() {
    loadScript('https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js', function() {
      SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        deepLinking: true,
        persistAuthorization: true,
      });
    });
  });
  </script>
</body>
</html>`);
  });

  console.log('Swagger UI: ' + config.BASE_URL + '/api-docs');
};