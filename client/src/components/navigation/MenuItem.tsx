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
      ${danger
        ? 'text-red-600 hover:bg-red-50'
        : 'text-gray-700 hover:bg-gray-100'}
      focus-visible:outline-none focus-visible:ring-2 ring-blue-500
    `}
  >
    {icon}
    {children}
  </button>
)

export default MenuItem
