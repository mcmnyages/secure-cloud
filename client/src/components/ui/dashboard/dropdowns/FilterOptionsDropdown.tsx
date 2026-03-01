import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  value: string | number
  label: string
}

type DropdownProps = {
  value: string | number
  onChange: (value: any) => void
  options: Option[]
  placeholder?: string
  label?: string
  className?: string
}

export default function FilterOptionsDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  label,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--text)/0.3)] whitespace-nowrap">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 px-3 py-1.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg text-xs font-bold hover:border-[rgb(var(--primary)/0.4)] transition-all min-w-[100px]"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={`transition-transform opacity-50 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[120px] rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-xl z-[110] overflow-hidden backdrop-blur-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                option.value === value 
                  ? "bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]" 
                  : "hover:bg-[rgb(var(--muted)/0.3)] text-[rgb(var(--text)/0.7)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}