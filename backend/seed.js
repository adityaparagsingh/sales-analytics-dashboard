import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

const SOURCES = {
  orders: 'https://raw.githubusercontent.com/Athospd/work-at-olist-data/master/datasets/olist_orders_dataset.csv',
  items: 'https://raw.githubusercontent.com/Athospd/work-at-olist-data/master/datasets/olist_order_items_dataset.csv',
  products: 'https://raw.githubusercontent.com/Athospd/work-at-olist-data/master/datasets/olist_products_dataset.csv',
  customers: 'https://raw.githubusercontent.com/Athospd/work-at-olist-data/master/datasets/olist_customers_dataset.csv',
  translations: 'https://raw.githubusercontent.com/Athospd/work-at-olist-data/master/datasets/product_category_name_translation.csv'
};

const stateRegions = {
  AC:'North', AL:'Northeast', AP:'North', AM:'North', BA:'Northeast', CE:'Northeast', DF:'Central-West', ES:'Southeast', GO:'Central-West',
  MA:'Northeast', MT:'Central-West', MS:'Central-West', MG:'Southeast', PA:'North', PB:'Northeast', PR:'South', PE:'Northeast', PI:'Northeast',
  RJ:'Southeast', RN:'Northeast', RS:'South', RO:'North', RR:'North', SC:'South', SP:'Southeast', SE:'Northeast', TO:'North'
};

async function download(name, url) {
  const file = path.join(dataDir, name);
  try {
    const existing = await fs.stat(file);
    if (existing.size > 100) return file;
  } catch {}
  console.log(`Downloading ${name}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed for ${name}: ${response.status}`);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, await response.text(), 'utf8');
  return file;
}

const readCsv = async file => parse(await fs.readFile(file, 'utf8'), { columns:true, skip_empty_lines:true, bom:true });

async function seed() {
  await fs.mkdir(dataDir, { recursive:true });
  const files = await Promise.all(Object.entries(SOURCES).map(([name,url]) => download(`${name}.csv`,url)));
  const [orders,items,products,customers,translations] = await Promise.all(files.map(readCsv));

  const customerMap = new Map(customers.map(c => [c.customer_id, c]));
  const productMap = new Map(products.map(p => [p.product_id, p]));
  const translationMap = new Map(translations.map(t => [t.product_category_name, t.product_category_name_english]));
  const orderMap = new Map(orders.map(o => [o.order_id, o]));

  const rows = [];
  for (const item of items) {
    const order = orderMap.get(item.order_id);
    const customer = order ? customerMap.get(order.customer_id) : null;
    const product = productMap.get(item.product_id);
    if (!order || !customer || !product) continue;
    const category = translationMap.get(product.product_category_name) || product.product_category_name || 'Uncategorized';
    const price = Number(item.price) || 0;
    const freight = Number(item.freight_value) || 0;
    rows.push([
      item.order_id,
      order.order_purchase_timestamp?.replace('T',' ').slice(0,19),
      order.order_status,
      customer.customer_id,
      customer.customer_unique_id,
      customer.customer_city,
      customer.customer_state,
      stateRegions[customer.customer_state] || 'Other',
      item.product_id,
      category,
      price,
      freight,
      price,
      1
    ]);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM sales');
    await conn.query('DELETE FROM users');

    const cols = '(order_id,order_date,order_status,customer_id,customer_unique_id,customer_city,customer_state,region,product_id,category,price,freight_value,sales,quantity)';
    const batchSize = 500;
    for (let i=0;i<rows.length;i+=batchSize) {
      const batch = rows.slice(i,i+batchSize);
      const placeholders = batch.map(()=>'(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
      const values = batch.flat();
      await conn.execute(`INSERT INTO sales ${cols} VALUES ${placeholders}`, values);
      if ((i+batch.length)%5000===0 || i+batch.length===rows.length) console.log(`Inserted ${i+batch.length} / ${rows.length} sales items`);
    }

    const passwordHash = await bcrypt.hash('Admin@12345',12);
    await conn.execute('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',['Alex Morgan','admin@salesdashboard.com',passwordHash,'admin']);
    await conn.commit();
    console.log('\nSeed complete.');
    console.log('Source: Olist Brazilian E-Commerce Public Dataset');
    console.log('Login: admin@salesdashboard.com');
    console.log('Password: Admin@12345');
    console.log(`Orders available: ${orders.length}`);
    console.log(`Item-level sales rows imported: ${rows.length}`);
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); await pool.end(); }
}

seed().catch(e=>{ console.error('\nSeed failed:',e); process.exit(1); });
