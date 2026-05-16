# 🍽️ QR Restoran Menu — Backend API

> Bu fayл — loyiha bo'yicha qisqacha qo'llanma. Doim loyiha ildizida saqlanadi.

---

## 🌐 Asosiy URL manzillar

| Maqsad | URL |
|---|---|
| **Backend Server** | `http://localhost:8000` |
| **Swagger UI** | `http://localhost:8000/api-docs/` |

---

## 🚀 Loyihani ishga tushirish

```bash
# 1. Paketlarni o'rnatish
npm install

# 2. Dastlabki SuperAdmin yaratish
npm run seed

# 3. Serverni ishga tushirish (development)
npm run dev
```

---

## ⚙️ MongoDB URL sozlash

`.env` faylidagi `MONGO_URL` — bu MongoDB ulanish manzili.  
U yerda standart URL turadi. Siz uni o'z MongoDB URL manzilingizga almashtiring.

```env
MONGO_URL=your_mongodb_url_here
```

> **Yangi URL olish:** MongoDB Atlas saytiga kiring yoki AI yordamida yangi URL oling.

---

## 📦 O'rnatilgan paketlar

| Paket | Vazifasi |
|---|---|
| `bcryptjs` | Parolni xashlash va solishtirish |
| `cors` | Frontend va backend ulanishi |
| `dotenv` | `.env` fayl bilan ishlash |
| `express` | Node.js uchun web framework |
| `joi` | Ma'lumot validatsiyasi |
| `jsonwebtoken` | JWT — Autentifikatsiya (AuthN) va Avtorizatsiya (AuthZ) |
| `mongoose` | MongoDB bilan ishlash (ODM) |
| `multer` | Fayl va rasm yuklash |
| `qrcode` | QR kod generatsiya qilish |
| `swagger-jsdoc` | Swagger dokumentatsiyasi |
| `swagger-ui-express` | Swagger UI interfeysi |

---

## 🗂️ Fayl tuzilmasi

```bash
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
├── README.md
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
```

---

## 🔐 Rol tizimi

```bash
superadmin  →  Adminlarni boshqaradi
admin       →  O'z restoroni, kategoriyalari va taomlarini boshqaradi
public      →  Token shart emas (QR skanerlagan mijozlar)
```

---

## 📮 Postman Collection — import qilish

1. **Postman** ilovasini yoki brauzer versiyasini oching
2. Collection ro'yxatida **uchta nuqta (⋯)** belgisiga bosing
3. **Import** tugmasini tanlang
4. Ochilgan oynaga `qr_restaran_menu_postman_collection.json` faylini tashlang (drag & drop yoki fayl tanlash orqali)

> Collection versiyasi: **v2.1** — Postman va Insomnia da ishlaydi.

---

## 📊 Flowchart diagrammasini ko'rish

VS Code da `flowchart.mmd` faylini ochib, quyidagi buyruqni bajaring:

```bash
CTRL + SHIFT + P  →  MermaidChat: Preview Diagram
```