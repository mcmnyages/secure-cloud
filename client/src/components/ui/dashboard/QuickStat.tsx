// components/ui/dashboard/QuickStat.tsx
import React from 'react'

interface QuickStatProps {
  label: string
  value: number
  icon: React.ReactNode
}

const QuickStat: React.FC<QuickStatProps> = ({ label, value, icon }) => (
  <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-6 rounded-3xl flex items-center gap-4 transition-transform hover:-translate-y-1">
    <div className="p-3 bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] rounded-2xl">{icon}</div>
    <div>
      <p className="text-xs font-bold text-[rgb(var(--text)/0.5)] uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
)

export default QuickStat