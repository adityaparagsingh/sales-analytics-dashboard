# Sales Analytics Dashboard

A full-stack Sales Analytics Dashboard built with **React, JavaScript,
CSS, Node.js, Express, and MySQL**.

The application combines a polished SaaS-style analytics interface with
JWT authentication and a real historical e-commerce dataset. The
frontend communicates with a REST API, and the dashboard metrics are
calculated from transaction records stored in MySQL.

------------------------------------------------------------------------

## 1. Project Overview

This project is designed as a college-level **Web Development + Data
Analytics** application.

It demonstrates:

-   React frontend development
-   Responsive UI/UX design
-   React Router navigation
-   Reusable React components
-   Recharts data visualization
-   REST API development
-   Node.js and Express
-   MySQL database design
-   SQL aggregation and filtering
-   JWT-based authentication
-   bcrypt password hashing
-   Real historical e-commerce data
-   CSV-to-MySQL data import
-   Dashboard KPI calculations
-   Search and filtering
-   Product, customer, order, analytics, and report views

### High-level architecture

``` text
                   ┌─────────────────────────────┐
                   │        React Frontend       │
                   │                             │
                   │  Login / Dashboard / Pages  │
                   │  Charts / Tables / Filters  │
                   └──────────────┬──────────────┘
                                  │
                           HTTP / REST API
                                  │
                   ┌──────────────▼──────────────┐
                   │       Node.js + Express     │
                   │                             │
                   │ Authentication / API Routes │
                   │ SQL Queries / JWT Middleware │
                   └──────────────┬──────────────┘
                                  │
                               mysql2
                                  │
                   ┌──────────────▼──────────────┐
                   │            MySQL             │
                   │                             │
                   │ users + sales transaction    │
                   │ data                         │
                   └─────────────────────────────┘
```

------------------------------------------------------------------------

# 2. Technology Stack

## Frontend

-   React 18
-   JSX
-   JavaScript
-   CSS
-   Vite
-   React Router
-   Recharts
-   Lucide React

## Backend

-   Node.js
-   Express
-   MySQL2
-   JSON Web Tokens (JWT)
-   bcryptjs
-   dotenv
-   CORS
-   csv-parse
-   Nodemon

## Database

-   MySQL 8.x recommended

------------------------------------------------------------------------

# 3. Data Source

The application uses the **Olist Brazilian E-Commerce Public Dataset**.

The dataset contains approximately 100,000 anonymized Brazilian
e-commerce orders from 2016--2018 and includes information such as:

-   Orders
-   Order status
-   Purchase timestamps
-   Customers
-   Customer locations
-   Products
-   Product categories
-   Item prices
-   Freight values

Dataset reference:

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

The seed script downloads the required CSV files from a public GitHub
mirror of the Olist dataset and transforms them before importing them
into MySQL.

### Important data clarification

This is **real historical commercial data**, not live business data.

It is:

-   Real historical transaction data
-   Publicly available
-   Anonymized
-   From 2016--2018
-   Not connected to a live Olist account
-   Not updated in real time

Therefore, the project should be described in a presentation as:

> "A Sales Analytics Dashboard using a real anonymized historical
> e-commerce dataset stored in MySQL and accessed through a Node.js REST
> API."

Do not describe it as a live sales monitoring system.

------------------------------------------------------------------------

# 4. Project Structure

``` text
sales-analytics-db/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   │
│   └── src/
│       ├── components/
│       │   ├── ChartCard.jsx
│       │   ├── FilterBar.jsx
│       │   └── StatCard.jsx
│       │
│       ├── pages/
│       │   ├── Analytics.jsx
│       │   ├── Customers.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Orders.jsx
│       │   ├── Products.jsx
│       │   ├── Reports.jsx
│       │   └── Settings.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── db.js
│   ├── server.js
│   ├── seed.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   └── routes/
│       ├── auth.js
│       ├── dashboard.js
│       └── entities.js
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

# 5. Requirements

Before running the application, install:

### Node.js

Recommended:

-   Node.js 18+
-   Node.js 20 LTS+
-   Node.js 22 LTS+

Check:

``` bash
node -v
npm -v
```

### MySQL

Recommended:

-   MySQL 8.x

Check:

``` bash
mysql --version
```

Make sure the MySQL server is running before running the backend.

------------------------------------------------------------------------

# 6. Installation

## Step 1: Extract the project

Extract:

``` text
sales-analytics-db.zip
```

Then open the extracted folder in VS Code.

------------------------------------------------------------------------

# 7. Database Setup

## Step 1: Start MySQL

Make sure MySQL is running.

On macOS with Homebrew, one possible command is:

``` bash
brew services start mysql
```

If MySQL was installed another way, start it using that installation's
method.

------------------------------------------------------------------------

## Step 2: Create the database

From the project root:

``` bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL root password when prompted.

The script creates:

``` text
sales_analytics
```

and the following tables:

``` text
users
sales
```

------------------------------------------------------------------------

# 8. Database Schema

## users

Stores application users.

``` text
id
name
email
password_hash
role
created_at
```

Passwords are stored as bcrypt hashes.

------------------------------------------------------------------------

## sales

Stores transaction/item-level sales records.

``` text
id
order_id
order_date
order_status
customer_id
customer_unique_id
customer_city
customer_state
region
product_id
category
price
freight_value
sales
quantity
```

Indexes are included for commonly filtered columns such as:

-   order date
-   region
-   category
-   product
-   customer
-   order
-   status

These indexes improve query performance.

------------------------------------------------------------------------

# 9. Backend Configuration

Go into the backend folder:

``` bash
cd backend
```

Install dependencies:

``` bash
npm install
```

Create the environment file:

``` bash
cp .env.example .env
```

Open:

``` text
backend/.env
```

Configure it:

``` env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=sales_analytics

JWT_SECRET=replace_this_with_a_long_random_secret
```

### Example

``` env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MySQLPassword123

DB_NAME=sales_analytics

JWT_SECRET=super_long_random_secret_for_development
```

Do not commit `.env` to GitHub.

The project `.gitignore` already excludes it.

------------------------------------------------------------------------

# 10. Import the Real Dataset

The project includes an automated seed script.

From:

``` text
backend/
```

run:

``` bash
npm run seed
```

The script will:

1.  Create the local data directory.
2.  Download the required Olist CSV files.
3.  Parse the CSV files.
4.  Join orders with customers.
5.  Join orders with products.
6.  Translate product categories.
7.  Map Brazilian states to regions.
8.  Convert item prices into sales records.
9.  Insert the transaction records into MySQL.
10. Create the demo admin user.

The first run requires an internet connection because the CSV files are
downloaded.

------------------------------------------------------------------------

# 11. What the Seed Script Imports

The script uses these source datasets:

``` text
olist_orders_dataset.csv
olist_order_items_dataset.csv
olist_products_dataset.csv
olist_customers_dataset.csv
product_category_name_translation.csv
```

The source data is transformed into the application's `sales` table.

### Example transformation

The original dataset has relationships such as:

``` text
Order
  │
  ├── Customer
  │
  └── Order Items
         │
         └── Product
```

The seed process combines these relationships so the dashboard can
efficiently query transaction-level records.

------------------------------------------------------------------------

# 12. Region Calculation

The Olist dataset contains Brazilian state codes.

The application maps those state codes into broader regions.

For example:

``` text
SP → Southeast
RJ → Southeast
PR → South
RS → South
BA → Northeast
GO → Central-West
AM → North
```

This allows the dashboard to display:

-   North
-   Northeast
-   Central-West
-   Southeast
-   South

instead of relying on arbitrary regions.

------------------------------------------------------------------------

# 13. Demo Login

The seed script creates an administrator account.

``` text
Email:
admin@salesdashboard.com

Password:
Admin@12345
```

The password is hashed with bcrypt before being inserted into MySQL.

### Important

This account is intended for local development/demo purposes.

Change the credentials before deploying the application publicly.

------------------------------------------------------------------------

# 14. Start the Backend

From:

``` text
backend/
```

run:

``` bash
npm run dev
```

The backend should start on:

``` text
http://localhost:5000
```

You should see:

``` text
API running at http://localhost:5000
```

You can also run the production-style command:

``` bash
npm start
```

------------------------------------------------------------------------

# 15. Start the Frontend

Open a **second terminal**.

From the project root:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start Vite:

``` bash
npm run dev
```

The frontend normally runs at:

``` text
http://localhost:5173
```

Open that address in your browser.

------------------------------------------------------------------------

# 16. Login Flow

The login process works as follows:

``` text
User enters email/password
          ↓
React sends POST /api/auth/login
          ↓
Express receives credentials
          ↓
MySQL finds the user
          ↓
bcrypt compares password
          ↓
JWT token is generated
          ↓
React stores authentication token
          ↓
User enters protected dashboard
```

If authentication fails, the login page displays an error instead of
opening the dashboard.

------------------------------------------------------------------------

# 17. Protected Routes

The application protects dashboard routes.

Main routes:

``` text
/login
/
 /analytics
/products
/customers
/orders
/reports
/settings
```

The login route is public.

The dashboard and other application pages require authentication.

If the user is not authenticated, they are redirected to:

``` text
/login
```

------------------------------------------------------------------------

# 18. API Endpoints

## Authentication

### Login

``` http
POST /api/auth/login
```

Example body:

``` json
{
  "email": "admin@salesdashboard.com",
  "password": "Admin@12345"
}
```

### Current user

``` http
GET /api/auth/me
```

Requires:

``` http
Authorization: Bearer <JWT>
```

------------------------------------------------------------------------

# 19. Dashboard APIs

### Summary

``` http
GET /api/dashboard/summary
```

Returns metrics such as:

-   Total revenue
-   Total orders
-   Units sold
-   Average order value

------------------------------------------------------------------------

### Sales trend

``` http
GET /api/dashboard/sales
```

Returns sales grouped over time.

------------------------------------------------------------------------

### Category performance

``` http
GET /api/dashboard/categories
```

Returns category-level revenue information.

------------------------------------------------------------------------

### Regional performance

``` http
GET /api/dashboard/regions
```

Returns revenue grouped by region.

------------------------------------------------------------------------

### Product performance

``` http
GET /api/dashboard/products
```

Returns product-level sales information.

------------------------------------------------------------------------

### Recent transactions

``` http
GET /api/dashboard/transactions
```

Returns recent transaction records.

------------------------------------------------------------------------

# 20. Entity APIs

The backend also provides APIs for:

### Products

``` http
GET /api/entities/products
```

### Customers

``` http
GET /api/entities/customers
```

### Orders

``` http
GET /api/entities/orders
```

These endpoints support the frontend's tables, search, and filters.

------------------------------------------------------------------------

# 21. How Dashboard KPIs Are Calculated

The application does not simply hardcode dashboard numbers.

## Total Revenue

Conceptually:

``` sql
SELECT SUM(sales)
FROM sales;
```

------------------------------------------------------------------------

## Total Orders

The application counts distinct order IDs:

``` sql
SELECT COUNT(DISTINCT order_id)
FROM sales;
```

This is important because one order can contain multiple products.

------------------------------------------------------------------------

## Units Sold

Conceptually:

``` sql
SELECT SUM(quantity)
FROM sales;
```

------------------------------------------------------------------------

## Average Order Value

Conceptually:

``` text
Total Revenue / Total Orders
```

------------------------------------------------------------------------

# 22. Filtering

The dashboard supports filtering using database queries.

Typical filters include:

``` text
Date
Region
Category
Product
```

Instead of downloading the entire database into React and filtering
everything in the browser, the backend can apply filters at the SQL
layer.

Conceptually:

``` text
React filter
     ↓
API request
     ↓
Express
     ↓
SQL WHERE conditions
     ↓
MySQL
     ↓
Filtered result
     ↓
React chart/table
```

This approach is more appropriate for larger datasets.

------------------------------------------------------------------------

# 23. Frontend Pages

## Dashboard

Displays:

-   Revenue
-   Orders
-   Units sold
-   AOV
-   Sales trend
-   Category performance
-   Regional performance
-   Product performance
-   Recent transactions

------------------------------------------------------------------------

## Analytics

Displays additional sales analytics and charts.

------------------------------------------------------------------------

## Products

Displays products and their sales information.

------------------------------------------------------------------------

## Customers

Displays customer-related analytics.

------------------------------------------------------------------------

## Orders

Displays transaction/order records.

------------------------------------------------------------------------

## Reports

Displays report-style summaries and export functionality.

------------------------------------------------------------------------

## Settings

Contains application preference/profile UI.

------------------------------------------------------------------------

# 24. UI Design

The interface is based on the provided visual reference.

The design language uses:

-   Soft lavender background
-   White cards
-   Purple primary accent
-   Pink/coral secondary accent
-   Large rounded corners
-   Soft shadows
-   Generous whitespace
-   Clean typography
-   Responsive layouts
-   Modern SaaS dashboard styling

The fitness-related content from the original reference is not used.

The visual language is adapted for business intelligence and sales
analytics.

------------------------------------------------------------------------

# 25. Responsive Design

The frontend is designed for:

``` text
1440px desktop
1280px desktop
1024px tablet/laptop
768px tablet
480px mobile
375px mobile
```

On smaller screens:

-   Dashboard cards stack
-   Charts resize
-   Tables become horizontally scrollable
-   Navigation becomes compact
-   Filters wrap/stack
-   Header becomes smaller

------------------------------------------------------------------------

# 26. Common Commands

## Frontend

Install:

``` bash
cd frontend
npm install
```

Development:

``` bash
npm run dev
```

Production build:

``` bash
npm run build
```

Preview production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

## Backend

Install:

``` bash
cd backend
npm install
```

Development:

``` bash
npm run dev
```

Production-style start:

``` bash
npm start
```

Seed database:

``` bash
npm run seed
```

------------------------------------------------------------------------

# 27. Complete First-Time Setup

If you are setting up the project for the first time, follow this exact
sequence.

### Terminal 1: Database

Make sure MySQL is running.

Then from the project root:

``` bash
mysql -u root -p < database/schema.sql
```

------------------------------------------------------------------------

### Terminal 2: Backend

``` bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`.

Then:

``` bash
npm run seed
```

After seeding:

``` bash
npm run dev
```

------------------------------------------------------------------------

### Terminal 3: Frontend

``` bash
cd frontend
npm install
npm run dev
```

Open:

``` text
http://localhost:5173
```

Login:

``` text
Email: admin@salesdashboard.com
Password: Admin@12345
```

------------------------------------------------------------------------

# 28. Troubleshooting

## MySQL access denied

If you see:

``` text
Access denied for user 'root'
```

check:

``` env
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
```

Test MySQL directly:

``` bash
mysql -u root -p
```

------------------------------------------------------------------------

## MySQL server not running

Check:

``` bash
mysqladmin -u root -p ping
```

On Homebrew:

``` bash
brew services list
```

Start MySQL if necessary:

``` bash
brew services start mysql
```

------------------------------------------------------------------------

## Port 5000 already in use

If Express reports:

``` text
EADDRINUSE
```

find the process using the port or change:

``` env
PORT=5001
```

If you change the backend port, make sure the frontend API base URL is
updated accordingly.

------------------------------------------------------------------------

## Port 5173 already in use

Vite may automatically select another available port.

Check the terminal output and open the URL Vite provides.

------------------------------------------------------------------------

## Seed script cannot download data

The seed script requires internet access on its first run.

If the download fails:

1.  Check your internet connection.
2.  Try the command again.
3.  Check that the source URLs are reachable.
4.  If necessary, manually download the Olist CSV files and place them
    in:

``` text
backend/data/
```

The expected filenames are:

``` text
orders.csv
items.csv
products.csv
customers.csv
translations.csv
```

------------------------------------------------------------------------

## Login does not work

Make sure:

1.  MySQL is running.
2.  The database exists.
3.  `npm run seed` completed successfully.
4.  The backend is running.
5.  The frontend is using the correct backend URL.
6.  You are using:

``` text
admin@salesdashboard.com
Admin@12345
```

------------------------------------------------------------------------

## Dashboard shows no data

Check the backend terminal.

Then test the database:

``` sql
USE sales_analytics;

SELECT COUNT(*) FROM sales;
```

If the result is:

``` text
0
```

run:

``` bash
cd backend
npm run seed
```

again.

------------------------------------------------------------------------

# 29. Resetting the Database

If you want to completely recreate the database:

``` bash
mysql -u root -p
```

Then:

``` sql
DROP DATABASE sales_analytics;
```

Exit MySQL:

``` sql
exit;
```

Recreate the schema:

``` bash
mysql -u root -p < database/schema.sql
```

Then reseed:

``` bash
cd backend
npm run seed
```

WARNING: This deletes the application's current database data.

------------------------------------------------------------------------

# 30. Security Notes

This project is intended for development/college-project use.

Before production deployment, improve:

-   JWT secret management
-   HTTPS
-   Rate limiting
-   CORS restrictions
-   Input validation
-   Refresh-token strategy
-   Secure cookie configuration
-   Password reset
-   Email verification
-   Role-based authorization
-   SQL query validation
-   Production logging
-   Error sanitization

Never commit:

``` text
.env
```

to GitHub.

Never hardcode production database passwords or JWT secrets.

------------------------------------------------------------------------

# 31. Suggested GitHub Structure

For GitHub, keep:

``` text
frontend/
backend/
database/
README.md
.gitignore
```

Do NOT commit:

``` text
node_modules/
.env
backend/data/
```

The dataset is downloaded by the seed process rather than being bundled
into the repository.

------------------------------------------------------------------------

# 32. How the Project Demonstrates Data Analytics

The application can be explained as a small analytics pipeline:

``` text
Real Dataset
     ↓
Data Extraction
     ↓
Data Transformation
     ↓
Data Loading
     ↓
MySQL
     ↓
SQL Aggregation
     ↓
REST API
     ↓
React
     ↓
Data Visualization
```

### ETL

The seed script performs a basic ETL process:

**Extract**

Downloads CSV datasets.

**Transform**

-   Joins orders, customers, products, and categories
-   Converts prices into numeric values
-   Converts timestamps
-   Maps states to regions
-   Creates transaction-level records

**Load**

Inserts transformed records into MySQL.

------------------------------------------------------------------------

# 33. Possible Future Improvements

The project can be extended with:

### Authentication

-   User registration
-   Forgot password
-   Email verification
-   Role-based access
-   Admin/analyst/viewer permissions

### Analytics

-   Year-over-year growth
-   Month-over-month growth
-   Customer lifetime value
-   Customer retention
-   Repeat purchase rate
-   Cohort analysis
-   RFM analysis
-   Profit analytics
-   Forecasting

### Data Science

A Python service could later be added:

``` text
MySQL
   ↓
Python / Pandas
   ↓
Machine Learning
   ↓
Sales Forecast
   ↓
Express API
   ↓
React Dashboard
```

Possible models:

-   Linear regression
-   Random forest
-   Time-series forecasting
-   Customer segmentation

### Infrastructure

Later you could deploy:

``` text
React → Vercel
Express → Render/Railway
MySQL → PlanetScale/Aiven/Railway/etc.
```

depending on the hosting requirements and current provider availability.

------------------------------------------------------------------------

# 34. Recommended College Presentation Explanation

A concise project explanation:

> "Sales Analytics Dashboard is a full-stack business intelligence
> application built using React, Node.js, Express, and MySQL. The system
> uses a real anonymized historical e-commerce dataset. Transaction data
> is transformed and stored in MySQL, while REST APIs expose aggregated
> sales information to the React dashboard. Users authenticate through
> JWT-based login and can analyze revenue, orders, products, categories,
> customers, regions, and transactions through interactive
> visualizations and filters."

------------------------------------------------------------------------

# 35. Key Learning Outcomes

After completing this project, you can demonstrate knowledge of:

### Frontend

-   React components
-   Props
-   State
-   Effects
-   Routing
-   Forms
-   API calls
-   Conditional rendering
-   Data visualization
-   Responsive CSS

### Backend

-   Express
-   REST APIs
-   Middleware
-   Authentication
-   JWT
-   Password hashing
-   Environment variables
-   Error handling

### Database

-   MySQL
-   Tables
-   Primary keys
-   Indexes
-   SQL aggregation
-   Filtering
-   GROUP BY
-   JOIN concepts
-   Relational data

### Data Analytics

-   ETL
-   Data cleaning
-   Aggregation
-   KPI calculation
-   Trend analysis
-   Category analysis
-   Regional analysis
-   Product analysis

------------------------------------------------------------------------

# 36. Final Architecture

The finished project can be summarized as:

``` text
                    SALES ANALYTICS DASHBOARD

                             USER
                              │
                              ▼
                     ┌─────────────────┐
                     │  React + Vite   │
                     │                 │
                     │ Login           │
                     │ Dashboard       │
                     │ Analytics       │
                     │ Products        │
                     │ Customers       │
                     │ Orders          │
                     │ Reports         │
                     │ Settings        │
                     └────────┬────────┘
                              │
                         REST / JSON
                              │
                              ▼
                     ┌─────────────────┐
                     │ Node + Express  │
                     │                 │
                     │ Auth API        │
                     │ Dashboard API   │
                     │ Entity API      │
                     └────────┬────────┘
                              │
                           mysql2
                              │
                              ▼
                     ┌─────────────────┐
                     │      MySQL      │
                     │                 │
                     │ users           │
                     │ sales           │
                     └────────┬────────┘
                              ▲
                              │
                        ETL / Seed
                              │
                              │
                     ┌────────┴────────┐
                     │ Olist Dataset   │
                     │                 │
                     │ Orders          │
                     │ Customers       │
                     │ Products        │
                     │ Order Items     │
                     └─────────────────┘
```

------------------------------------------------------------------------

# 37. License / Dataset Attribution

The application code in this project is intended as an educational
project.

The underlying Olist dataset is a separate third-party dataset. Review
the dataset's current terms and attribution requirements before
redistributing the raw dataset or using it commercially.

Dataset:

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

------------------------------------------------------------------------

# 38. Quick Start Cheat Sheet

After the initial setup, you only need:

### Terminal 1

``` bash
cd sales-analytics-db/backend
npm run dev
```

### Terminal 2

``` bash
cd sales-analytics-db/frontend
npm run dev
```

Then open:

``` text
http://localhost:5173
```

Login:

``` text
admin@salesdashboard.com
Admin@12345
```

------------------------------------------------------------------------

## Project Status

**Frontend:** Complete

**Backend:** Complete

**MySQL integration:** Complete

**JWT authentication:** Complete

**Real historical dataset:** Integrated through seed process

**Dashboard analytics:** Implemented

**Responsive UI:** Implemented

**Production deployment:** Not included

**Live business data:** Not included

**Machine learning/forecasting:** Future enhancement
