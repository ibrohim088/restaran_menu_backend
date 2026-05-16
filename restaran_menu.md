# THIS IS QR RESTARAN MENU 
.md — это краткая шпаргалка и руководство пользователя, которая всегда лежит под рукой в корне проекта.

# Backend Server Base URL 
base url - http://localhost:8000

# Swagger UI Opening URL 
swagger url - http://localhost:8000/api-docs/

# QR RESTRAN MENU STARTING PROCESS

npm run seed - for creating first (super admin)
npm run dev - for starting server

# THIS BACKEND PROGRAM - NODE PACKAGE MODULE

bcryptjs - FOR HASHING AND COMPARE PASSWORD
cors - FOR CONNECTION FRONTEND AND BACKEND
dotenv - FOR SEEN AND WATCHING AND NORMAL WORKING WITH .ENV FILE
express - EXTENSIONS FOR NODE JS
joi - FOR VALIDATION SCHEMA
jsonwebtoken - FOR WORKING WITH JWT - WITH JWT WE WORKING WITH AUTH_N (Authentication) AND AUTH_Z (Authorization) 
mongoose - FOR WORKING WITH MONGODB
multer - FOR WORKING WITH UPLOAD FILE AND IMAGES
qrcode - FOR GENERATION QR CODE
swagger-jsdoc - FOR SWAGGER
swagger-ui-express - FOR SWAGGER


# WITH THIS KEYBOORD COMMAND YOU WATCHING BACKEND FLOWCHART DESIGN
CTRL + SHIFT + P: MermaidChat: Preview Diagram

# QR Restaran Menu Backend - file struckture

b-menu/
├── app.js                          # Asosiy entry point
├── package.json
├── package-lock.json
├── vercel.json
├── swagger.js                      # Swagger konfiguratsiyasi
├── seed.js                         # SuperAdmin yaratish
├── .env
├── .gitignore
├── flowchart.mmd                   # Mermaid diagrammasi
├── qr_restaran_menu_postman_collection.json
├── restaran_menu.txt
├── uploads/                        # Yuklangan fayllar
│   ├── images/
│   └── qr/
└── src/
    ├── controller/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── categoryController.js
    │   ├── menuController.js
    │   ├── publicController.js
    │   └── restaranController.js
    ├── db/
    │   ├── index.js
    │   └── network.js
    ├── middleware/
    │   ├── auth.js
    │   ├── erorrHandler.js
    │   └── upload.js
    ├── router/
    │   ├── admin.js
    │   ├── auth.js
    │   ├── category.js
    │   ├── menu.js
    │   ├── public.js
    │   └── restaran.js
    ├── schema/
    │   ├── Category.js
    │   ├── MenuItem.js
    │   ├── Restaran.js
    │   └── User.js
    ├── shared/
    │   └── config.js
    ├── util/
    │   └── createToken.js
    └── validator/
        ├── adminValidator.js
        ├── authValidator.js
        ├── categoryValidator.js
        ├── menuValidator.js
        └── restaurantValidator.js