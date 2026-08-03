# Sales Analytics Dashboard - React + Node + MySQL

A full-stack Sales Analytics Dashboard with:

- React + JSX + JavaScript + plain CSS
- Vite
- Node.js + Express
- MySQL
- JWT authentication + bcrypt password hashing
- Recharts
- Lucide React
- Responsive lavender / purple / coral SaaS UI
- Database-backed KPIs, charts, filters, search, products, customers and orders

## Data source

This version uses the **Brazilian E-Commerce Public Dataset by Olist**, a real anonymised commercial dataset containing about 100,000 orders from 2016-2018. Olist describes it as real commercial data. The importer joins orders, order items, products, customers and English category translations, then loads the item-level sales facts into MySQL.

Official dataset page:
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Dataset documentation:
https://github.com/spdrio/Brazilian-E-Commerce-Public-Dataset-by-Olist

The project derives a broad Brazilian region (North, Northeast, Central-West, Southeast, South) from the customer's state abbreviation. Revenue is shown in BRL because Olist's price/payment data are Brazilian marketplace values.

## Project structure

```text
sales-analytics-db/
├── backend/
│   ├── data/                  # downloaded by npm run seed
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
└── README.md
```

## 1. Requirements

Install:

- Node.js 18+
- MySQL 8+
- VS Code (recommended)

## 2. Create the MySQL database

Start MySQL.

From the project root:

```bash
mysql -u root -p < database/schema.sql
```

If your MySQL command is not available, open MySQL Workbench and run the contents of `database/schema.sql`.

## 3. Configure backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=sales_analytics
JWT_SECRET=use_a_long_random_secret_here
```

## 4. Install backend dependencies

```bash
npm install
```

## 5. Load the real dataset into MySQL

```bash
npm run seed
```

The seed script downloads the public Olist CSV files, joins them, and imports the resulting item-level sales rows into MySQL.

It also creates the demo login:

```text
Email:    admin@salesdashboard.com
Password: Admin@12345
```

## 6. Start backend

Keep the backend terminal open:

```bash
npm run dev
```

API:

```text
http://localhost:5000
```

## 7. Start frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 8. Login

Use:

```text
admin@salesdashboard.com
Admin@12345
```

After login, the React dashboard calls Express APIs. Express queries MySQL, and the returned values populate the KPI cards, charts, filters and tables.

## Data flow

```text
Olist public dataset
        ↓
seed.js / ETL
        ↓
MySQL sales table
        ↓
Node + Express REST API
        ↓
JWT-protected requests
        ↓
React dashboard
        ↓
Recharts + tables + KPIs
```

## Important note

This is **real anonymised commercial data**, but it is historical public data, not a live Olist production API. The application will only change when the database changes or the dataset is reseeded.

For a production deployment, move the JWT secret and database credentials to environment variables managed by the hosting platform, enable HTTPS, use secure httpOnly cookies for refresh tokens, and do not use the demo password.
