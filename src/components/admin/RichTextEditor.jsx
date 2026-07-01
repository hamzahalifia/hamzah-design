/**
 * RichTextEditor.jsx — thin proxy
 * Re-exports TipTapEditor so WorkEditor.jsx doesn't need to change its import.
 * Quill has been replaced. This file keeps the same { value, onChange } API.
 */
export { default } from './TipTapEditor';
