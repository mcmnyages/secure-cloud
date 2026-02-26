import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  value: string
  label: string
}

type DropdownProps = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const selected = options.find((o) => o.value === value)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          p-3 md:p-2.5
          rounded-xl
          bg-[rgb(var(--background))]
          border border-[rgb(var(--border))]
          text-sm
          font-medium
          flex items-center justify-between
          outline-none
          transition-colors
          hover:border-[rgb(var(--foreground)/0.3)]
        "
      >
        <span>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform opacity-50 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
              absolute
              mt-2
              w-full
              rounded-xl
              border border-[rgb(var(--border))]
              bg-[rgb(var(--card))]
              shadow-xl
              z-50
              overflow-hidden
              backdrop-blur-sm
            "
        >
          {options.map((option) => {
            const isActive = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`
                  w-full
                  text-left
                  px-4 py-2.5
                  text-sm
                  transition-colors
                  ${isActive
                    ? "bg-[rgb(var(--muted))] font-semibold"
                    : "hover:bg-[rgb(var(--muted))]"
                  }
                `}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}