'use client';

import React, { useState, useEffect } from 'react';

interface FormattedNumberInputProps {
  value: number | string;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  prefix?: string;
  min?: number;
  max?: number;
  emptyOnZero?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

export function FormattedNumberInput({
  value,
  onChange,
  placeholder = '0',
  className = '',
  prefix,
  min = 0,
  max,
  emptyOnZero = false,
  disabled = false,
  required = false,
  id,
  name,
  autoFocus,
}: FormattedNumberInputProps) {
  // Format numeric or raw value into thousands-separated string (e.g. 50000 -> "50,000")
  const formatValue = (v: number | string | undefined | null): string => {
    if (v === '' || v === null || v === undefined) return '';
    const cleanDigits = String(v).replace(/\D/g, '');
    if (!cleanDigits) return '';
    const num = parseInt(cleanDigits, 10);
    if (isNaN(num)) return '';
    if (num === 0 && emptyOnZero) return '';
    return num.toLocaleString('en-US');
  };

  const [displayValue, setDisplayValue] = useState<string>(() => formatValue(value));

  // Sync external changes
  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value, emptyOnZero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip non-digits strictly (no negative sign, no letters, no symbols)
    const rawDigits = e.target.value.replace(/\D/g, '');

    if (rawDigits === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    let num = parseInt(rawDigits, 10);
    if (isNaN(num)) num = 0;

    if (min !== undefined && num < min) {
      num = min;
    }
    if (max !== undefined && num > max) {
      num = max;
    }

    setDisplayValue(num.toLocaleString('en-US'));
    onChange(num);
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold select-none pointer-events-none text-xs">
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs transition ${
          prefix ? 'pl-8' : ''
        } ${className}`}
      />
    </div>
  );
}

export default FormattedNumberInput;
