import React from 'react'

const MenuItem = ({
  icon,
  children,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full flex items-center gap-2
      px-4 py-2 text-sm rounded-md mx-1
      transition

      ${
        danger
          ? `
            text-[rgb(var(--danger))]
            hover:bg-[rgb(var(--danger)/0.1)]
          `
          : `
            text-[rgb(var(--text))]
            hover:bg-[rgb(var(--card))]
          `
      }

      focus-visible:outline-none
      focus-visible:ring-2
      ring-[rgb(var(--primary))]
    `}
  >
    {icon}
    {children}
  </button>
)

export default MenuItem