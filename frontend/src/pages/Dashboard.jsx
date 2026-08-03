import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Boxes, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import ChartCard from '../components/ChartCard';

const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number(n)||0);
const compact = n => new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(Number(n)||0);
const palette = ['#6d4aff','#f27a8a','#8c78ff','#ffb3a7','#6bc8b4'];

export default function Dashboard() {
  const [options,setOptions] = useState(null);
  const [filters,setFilters] = useState({region:'All',category:'All',product:'All',startDate:'',endDate:''});
  const [data,setData] = useState({summary:{},monthly:[],categories:[],regions:[],products:[],transactions:[]});
  const [error,setError] = useState('');
  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([,v])=>v)), [filters]);

  useEffect(()=>{ api.options().then(setOptions).catch(e=>setError(e.message)); },[]);
  useEffect(()=>{
    Promise.all([api.summary(params),api.monthly(params),api.categories(params),api.regions(params),api.topProducts(params),api.transactions(params)])
      .then(([summary,monthly,categories,regions,products,transactions])=>setData({summary,monthly,categories,regions,products,transactions}))
      .catch(e=>setError(e.message));
  },[JSON.stringify(params)]);

  const latest = data.monthly[data.monthly.length-1];
  const previous = data.monthly[data.monthly.length-2];
  const growth = latest && previous ? ((Number(latest.revenue)-Number(previous.revenue))/Number(previous.revenue))*100 : 0;
  const target = latest ? Number(latest.revenue)*1.1 : 0;
  const achievement = latest ? Math.min(100, Number(latest.revenue)/target*100) : 0;

  return <div className="page-content">
    {error && <div className="error-box">{error}. Start the backend and make sure MySQL is running.</div>}
    <FilterBar filters={filters} setFilters={setFilters} options={options}/>
    <div className="stats-grid">
      <StatCard icon={<DollarSign size={20}/>} label="Total Revenue" value={money(data.summary.totalRevenue)} accent="purple" meta={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs previous month`}/>
      <StatCard icon={<ShoppingCart size={20}/>} label="Total Orders" value={compact(data.summary.totalOrders)} accent="pink" meta="Distinct orders in database"/>
      <StatCard icon={<Boxes size={20}/>} label="Units Sold" value={compact(data.summary.unitsSold)} accent="green" meta="Sum of quantities"/>
      <StatCard icon={<BarChart3 size={20}/>} label="Average Order Value" value={money(data.summary.averageOrderValue)} accent="orange" meta="Revenue ÷ distinct orders"/>
    </div>

    <div className="hero-grid">
      <ChartCard title="Sales Overview" subtitle="Revenue performance from the database" className="large-chart">
        <div className="chart-total"><div><span>Total Revenue</span><strong>{money(data.summary.totalRevenue)}</strong></div><div><span>Profit</span><strong>{money(data.summary.totalProfit)}</strong></div><div><span>MoM</span><strong className={growth>=0?'positive':'negative'}>{growth>=0?'+':''}{growth.toFixed(1)}%</strong></div></div>
        <ResponsiveContainer width="100%" height={300}><AreaChart data={data.monthly}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6d4aff" stopOpacity=".25"/><stop offset="100%" stopColor="#6d4aff" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="month" tickFormatter={m=>m?.slice(5)} axisLine={false} tickLine={false}/><YAxis tickFormatter={compact} axisLine={false} tickLine={false}/><Tooltip formatter={(v,n)=>[money(v),n==='revenue'?'Revenue':'Profit']}/><Area type="monotone" dataKey="revenue" stroke="#6d4aff" strokeWidth={3} fill="url(#salesFill)"/></AreaChart></ResponsiveContainer>
      </ChartCard>
      <section className="card monthly-card"><div className="card-head"><div><h3>Monthly Performance</h3><p>Latest available month</p></div><span className="soft-pill">Reference</span></div><div className="monthly-value">{money(latest?.revenue || 0)}</div><div className="target-row"><span>Reference target</span><b>{money(target)}</b></div><div className="progress"><span style={{width:`${achievement}%`}}/></div><div className="achievement"><strong>{achievement.toFixed(0)}%</strong><span>of reference target</span></div><p className="insight">{growth >= 0 ? 'Revenue is trending upward versus the previous month.' : 'Revenue is below the previous month. Check the regional and category breakdowns.'}</p></section>
    </div>

    <section><div className="section-heading"><div><h2>Product Performance</h2><p>Top products by revenue in the current filter.</p></div></div><div className="product-grid">{data.products.map((p,i)=><article className="product-card" key={p.id}><div className="product-icon"><Boxes size={19}/></div><div className="product-main"><strong title={p.name}>{p.name}</strong><span>{p.category} · SKU</span><div className="product-stats"><span>{compact(p.units)} units</span><b>{money(p.revenue)}</b></div><div className="progress thin"><span style={{width:`${Math.min(100, Number(p.revenue)/(Number(data.products[0]?.revenue)||1)*100)}%`}}/></div></div></article>)}</div></section>

    <div className="two-col">
      <ChartCard title="Category Performance" subtitle="Revenue share by category"><ResponsiveContainer width="100%" height={290}><PieChart><Pie data={data.categories} dataKey="revenue" nameKey="name" innerRadius={78} outerRadius={110} paddingAngle={3}>{data.categories.map((_,i)=><Cell key={i} fill={palette[i%palette.length]}/>)}</Pie><Tooltip formatter={v=>money(v)}/></PieChart></ResponsiveContainer><div className="legend">{data.categories.map((x,i)=><div key={x.name}><i style={{background:palette[i%palette.length]}}/><span>{x.name}</span><b>{x.percentage}%</b></div>)}</div></ChartCard>
      <ChartCard title="Regional Performance" subtitle="Revenue by sales region"><ResponsiveContainer width="100%" height={330}><BarChart data={data.regions} layout="vertical" margin={{left:10,right:20}}><XAxis type="number" tickFormatter={compact} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={70} axisLine={false} tickLine={false}/><Tooltip formatter={v=>money(v)}/><Bar dataKey="revenue" fill="#8c78ff" radius={[0,10,10,0]} barSize={26}/></BarChart></ResponsiveContainer></ChartCard>
    </div>

    <section className="card table-card"><div className="card-head"><div><h3>Recent Transactions</h3><p>Latest line items from the source dataset.</p></div></div>{data.transactions.length ? <div className="table-scroll"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Category</th><th>Amount</th><th>Ship Mode</th><th>Date</th></tr></thead><tbody>{data.transactions.map((t,i)=><tr key={`${t.orderId}-${i}`}><td className="mono">{t.orderId}</td><td>{t.customer}</td><td className="truncate">{t.product}</td><td>{t.category}</td><td><b>{money(t.amount)}</b></td><td><span className={`status ${t.status==='delivered'?'completed':t.status==='canceled'?'cancelled':t.status==='processing'?'processing':'neutral'}`}>{t.status}</span></td><td>{t.date}</td></tr>)}</tbody></table></div> : <div className="empty">No transactions match your filters.</div>}</section>
  </div>;
}
