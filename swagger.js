import swaggerJsdoc from 'swagger-jsdoc';
import config from './src/shared/config.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QR Restoran Menyu API',
      version: '2.0.0',
      description: 'Restoran uchun QR kodli menyu tizimi - to‘liq backend API',
      contact: {
        name: 'Ibrogim',
        email: 'your@email.com',
      },
    },
    servers: [
      {
        url: config.BASE_URL || 'http://localhost:8000',
        description: 'Local Development Server',
      },
      {
        url: 'https://restaran-menu-backend.vercel.app',
        description: 'Production Server (Vercel)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Tokenni quyidagicha kiriting: Bearer <token>',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'superadmin@qrmenu.uz' },
            password: { type: 'string', example: '123456', minLength: 6 },
          },
        },
        Restaurant: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            logoUrl: { type: 'string' },
            coverUrl: { type: 'string' },
            isActive: { type: 'boolean', default: true },
            qrCodeUrl: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            restaurantId: { type: 'string' },
            name: { type: 'string' },
            imageUrl: { type: 'string' },
            isActive: { type: 'boolean', default: true },
            orderIndex: { type: 'number', default: 0 },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            categoryId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            imageUrl: { type: 'string' },
            weight: { type: 'string' },
            calories: { type: 'string' },
            isAvailable: { type: 'boolean', default: true },
            isPopular: { type: 'boolean', default: false },
          },
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Tizimga kirish',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Muvaffaqiyatli kirish' },
            401: { description: 'Noto‘g‘ri login yoki parol' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh token orqali yangi access token olish',
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Joriy foydalanuvchi ma’lumotlari',
          security: [{ BearerAuth: [] }],
        },
      },
      '/restaran': {
        get: { tags: ['Restaurants'], summary: 'Adminning restoranlari', security: [{ BearerAuth: [] }] },
        post: { tags: ['Restaurants'], summary: 'Yangi restoran yaratish', security: [{ BearerAuth: [] }] },
      },
      '/restaran/{id}/qr': {
        post: {
          tags: ['Restaurants'],
          summary: 'QR kod generatsiya qilish',
          security: [{ BearerAuth: [] }],
        },
      },
      '/categories/restaurants/{restaurantId}': {
        get: { tags: ['Categories'], summary: 'Restoran kategoriyalari', security: [{ BearerAuth: [] }] },
        post: { tags: ['Categories'], summary: 'Yangi kategoriya yaratish', security: [{ BearerAuth: [] }] },
      },
      '/menu/categories/{categoryId}': {
        get: { tags: ['Menu'], summary: 'Kategoriyadagi taomlar', security: [{ BearerAuth: [] }] },
        post: { tags: ['Menu'], summary: 'Yangi taom qo‘shish', security: [{ BearerAuth: [] }] },
      },
      '/public/menu/{restaurantId}': {
        get: {
          tags: ['Public'],
          summary: 'Ommaviy menyu (QR orqali ochiladigan sahifa)',
        },
      },
    },
  },
  apis: ['./src/router/*.js'], // Agar JSDoc qo‘shsangiz avtomatik qo‘shiladi
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app) => {
  // Swagger JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Zamonaviy Swagger UI sahifasi
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Restoran Menyu API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #0f172a;
            font-family: 'Segoe UI', system-ui, sans-serif;
          }
          #swagger-ui {
            max-width: 1480px;
            margin: 0 auto;
          }
          .swagger-ui .topbar {
            background-color: #1e2937;
          }
          .swagger-ui .topbar .download-url-wrapper {
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/api-docs/swagger.json',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout",
              deepLinking: true,
              persistAuthorization: true,
              displayRequestDuration: true,
              docExpansion: "list",
              tryItOutEnabled: true,
              defaultModelsExpandDepth: 1,
              syntaxHighlight: {
                activate: true,
                theme: "monokai"
              }
            });
          };
        </script>
      </body>
      </html>
    `);
  });

  console.log(`Swagger UI: ${config.BASE_URL}/api-docs`);
  console.log(`Swagger JSON: ${config.BASE_URL}/api-docs/swagger.json`);
};