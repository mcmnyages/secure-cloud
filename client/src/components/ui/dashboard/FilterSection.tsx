import React from "react"

interface FilterSectionProps {
    label: string;
    children: React.ReactNode;
}


const FilterSection = ({ label, children }: FilterSectionProps) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black uppercase tracking-tighter text-[rgb(var(--text)/0.4)]">{label}</p>
    {children}
  </div>
)
export default FilterSection