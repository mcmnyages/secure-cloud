import React from 'react'

interface QuickStatProps {
  label: string
  value: number
  icon: React.ReactNode
}

const QuickStat: React.FC<QuickStatProps> = ({ label, value, icon }) => {
  return (
    <div className="
      flex items-center gap-3
      px-3 py-2
      rounded-xl
      bg-[rgb(var(--card))]
      border border-[rgb(var(--border))]
      transition-all duration-200
      hover:bg-[rgb(var(--card)/0.7)]
    ">
      {/* Icon */}
      <div className="p-2 rounded-md bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]">
        {icon}
      </div>

      {/* Text */}
      <div className="leading-tight">
        <p className="text-xs text-[rgb(var(--text)/0.5)]">
          {label}
        </p>
        <p className="text-sm font-semibold">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default QuickStat