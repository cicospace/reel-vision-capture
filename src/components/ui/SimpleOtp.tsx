
import React, { useRef } from 'react'

interface SimpleOtpProps {
  value: string
  onChange: (newValue: string) => void
  length?: number
}

export default function SimpleOtp({
  value,
  onChange,
  length = 6,
}: SimpleOtpProps) {
  const inputs = useRef<HTMLInputElement[]>([])
  const handleChange = (i: number, val: string) => {
    const chars = value.split('')
    chars[i] = val
    onChange(chars.join(''))
    if (val && inputs.current[i + 1]) inputs.current[i + 1].focus()
  }
  return (
    <div className="flex space-x-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          ref={el => el && (inputs.current[i] = el)}
          className="w-10 h-10 text-center bg-gray-700 text-white rounded"
        />
      ))}
    </div>
  )
}
