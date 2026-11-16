/**
 * Shared input styling so every registration field looks and behaves the same.
 */
export const textInputClass =
  'h-12 w-full rounded-xl border border-[#c3c6d7]/60 bg-[#f7f9fb] px-4 text-sm text-[#191c1e] outline-none transition-colors placeholder:text-[#737686] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] disabled:cursor-not-allowed disabled:opacity-60';

export const selectInputClass = `${textInputClass} appearance-none cursor-pointer pe-10`;

export const invalidInputClass =
  'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]';
