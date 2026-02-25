import React from 'react'
interface ViewButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const ViewButton = ({ active, onClick, icon }: ViewButtonProps) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${active ? 'bg-[rgb(var(--card))] shadow-sm text-[rgb(var(--primary))]' : 'text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text))]'}`}
  >
    {icon}
  </button>
)

export default ViewButton