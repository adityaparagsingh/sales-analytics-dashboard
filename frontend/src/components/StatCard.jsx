import React from 'react';
export default function StatCard({ icon, label, value, accent = 'purple', meta = 'Calculated from database' }) {
  return <article className={`stat-card ${accent}`}><div className="stat-icon">{icon}</div><div><p>{label}</p><h2>{value}</h2><small>{meta}</small></div></article>;
}
