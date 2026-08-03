import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

function buildWhere(query) {
  const clauses=[]; const params=[];
  if(query.region && query.region!=='All'){clauses.push('region = ?');params.push(query.region)}
  if(query.category && query.category!=='All'){clauses.push('category = ?');params.push(query.category)}
  if(query.product && query.product!=='All'){clauses.push('product_id = ?');params.push(query.product)}
  if(query.startDate){clauses.push('DATE(order_date) >= ?');params.push(query.startDate)}
  if(query.endDate){clauses.push('DATE(order_date) <= ?');params.push(query.endDate)}
  return {sql:clauses.length?`WHERE ${clauses.join(' AND ')}`:'',params};
}

router.get('/summary',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT COALESCE(SUM(sales),0) totalRevenue,COUNT(DISTINCT order_id) totalOrders,COALESCE(SUM(quantity),0) unitsSold,COALESCE(SUM(sales)/NULLIF(COUNT(DISTINCT order_id),0),0) averageOrderValue,COALESCE(SUM(sales),0)-COALESCE(SUM(freight_value),0) grossAfterFreight FROM sales ${sql}`,params);res.json(r[0])}catch(e){res.status(500).json({message:'Could not load summary.',error:e.message})}});
router.get('/monthly',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT DATE_FORMAT(order_date,'%Y-%m') month,ROUND(SUM(sales),2) revenue,COUNT(DISTINCT order_id) orders,SUM(quantity) units,ROUND(SUM(freight_value),2) freight FROM sales ${sql} GROUP BY DATE_FORMAT(order_date,'%Y-%m') ORDER BY month`,params);res.json(r)}catch(e){res.status(500).json({message:'Could not load monthly data.',error:e.message})}});
router.get('/categories',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT category name,ROUND(SUM(sales),2) revenue,SUM(quantity) units FROM sales ${sql} GROUP BY category ORDER BY revenue DESC`,params);const total=r.reduce((s,x)=>s+Number(x.revenue),0);res.json(r.map(x=>({...x,percentage:total?Number((Number(x.revenue)*100/total).toFixed(1)):0})))}catch(e){res.status(500).json({message:'Could not load categories.',error:e.message})}});
router.get('/regions',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT region name,ROUND(SUM(sales),2) revenue,SUM(quantity) units FROM sales ${sql} GROUP BY region ORDER BY revenue DESC`,params);res.json(r)}catch(e){res.status(500).json({message:'Could not load regions.',error:e.message})}});
router.get('/products',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT product_id id,product_id name,category,ROUND(AVG(price),2) price, SUM(quantity) units,ROUND(SUM(sales),2) revenue,ROUND(SUM(freight_value),2) freight FROM sales ${sql} GROUP BY product_id,category ORDER BY revenue DESC LIMIT 8`,params);res.json(r)}catch(e){res.status(500).json({message:'Could not load products.',error:e.message})}});
router.get('/transactions',async(req,res)=>{try{const {sql,params}=buildWhere(req.query);const [r]=await pool.execute(`SELECT order_id orderId,SUBSTRING(customer_unique_id,1,10) customer,product_id product,category,ROUND(sales,2) amount,quantity,region,order_status status,DATE_FORMAT(order_date,'%Y-%m-%d') date FROM sales ${sql} ORDER BY order_date DESC,id DESC LIMIT 20`,params);res.json(r)}catch(e){res.status(500).json({message:'Could not load transactions.',error:e.message})}});
router.get('/search',async(req,res)=>{try{const q=`%${req.query.q||''}%`;if(!req.query.q)return res.json([]);const [p]=await pool.execute(`SELECT 'product' type,product_id id,product_id label,category detail FROM sales WHERE product_id LIKE ? GROUP BY product_id,category LIMIT 5`,[q]);const [c]=await pool.execute(`SELECT 'customer' type,customer_unique_id id,SUBSTRING(customer_unique_id,1,14) label,region detail FROM sales WHERE customer_unique_id LIKE ? GROUP BY customer_unique_id,region LIMIT 5`,[q]);const [o]=await pool.execute(`SELECT 'order' type,order_id id,order_id label,order_status detail FROM sales WHERE order_id LIKE ? GROUP BY order_id,order_status LIMIT 5`,[q]);res.json([...p,...c,...o].slice(0,12))}catch(e){res.status(500).json({message:'Search failed.',error:e.message})}});
router.get('/options',async(_req,res)=>{try{const [[regions],[categories],[products],[dates]]=await Promise.all([pool.query('SELECT DISTINCT region FROM sales ORDER BY region'),pool.query('SELECT DISTINCT category FROM sales ORDER BY category'),pool.query('SELECT DISTINCT product_id FROM sales ORDER BY product_id LIMIT 1000'),pool.query('SELECT MIN(order_date) minDate,MAX(order_date) maxDate FROM sales')]);res.json({regions:regions.map(x=>x.region),categories:categories.map(x=>x.category),products:products.map(x=>x.product_id),dates:dates[0]})}catch(e){res.status(500).json({message:'Could not load filter options.',error:e.message})}});
export default router;
