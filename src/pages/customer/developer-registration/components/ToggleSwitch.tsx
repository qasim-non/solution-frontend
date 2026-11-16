import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6] focus-visible:ring-offset-2 ${
        checked ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? 'end-1' : 'start-1'
        }`}
      />
    </button>
  );
};
