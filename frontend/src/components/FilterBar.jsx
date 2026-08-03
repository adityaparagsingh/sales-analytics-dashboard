import React from 'react';
import { RotateCcw } from 'lucide-react';
export default function FilterBar({ filters, setFilters, options }) {
  const update = (key, value) => setFilters(f => ({...f, [key]: value}));
  return <div className="filter-card">
    <div className="filter-title"><span>Filters</span><button className="text-button" onClick={() => setFilters({region:'All',category:'All',product:'All',startDate:'',endDate:''})}><RotateCcw size={15}/> Reset</button></div>
    <label>Date from<input type="date" value={filters.startDate} min={options?.dates?.minDate || ''} max={options?.dates?.maxDate || ''} onChange={e=>update('startDate',e.target.value)}/></label>
    <label>Date to<input type="date" value={filters.endDate} min={options?.dates?.minDate || ''} max={options?.dates?.maxDate || ''} onChange={e=>update('endDate',e.target.value)}/></label>
    <label>Region<select value={filters.region} onChange={e=>update('region',e.target.value)}><option>All</option>{(options?.regions||[]).map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Category<select value={filters.category} onChange={e=>update('category',e.target.value)}><option>All</option>{(options?.categories||[]).map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Product / SKU<select value={filters.product} onChange={e=>update('product',e.target.value)}><option>All</option>{(options?.products||[]).map(x=><option key={x}>{x}</option>)}</select></label>
  </div>;
}
