import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/**
 * FormShell — unified layout for all admin create/edit forms.
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {string} backPath
 * @param {string|null} error
 * @param {boolean} loading
 * @param {boolean} isValid
 * @param {function} onSubmit
 * @param {string} submitLabel - defaults to "Save"
 * @param {React.ReactNode} children
 * @param {File|null} imageFile - optional, passed for image upload
 * @param {function} setImageFile
 */
export default function FormShell({
  title,
  subtitle,
  backPath,
  error,
  loading,
  isValid,
  onSubmit,
  submitLabel = 'Save',
  children,
  imageFile,
  setImageFile,
}) {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setImageFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-ink-500 hover:text-laterite-500 text-xs font-mono transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">
            {title.split(' ')[0]}
          </span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">{title}</h1>
          {subtitle && <p className="text-ink-500 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-2.5 border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
          <ExclamationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image upload zone (only if imageFile prop is provided) */}
      {setImageFile && (
        <div
          className={`border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? 'border-laterite-500 bg-laterite-50' : 'border-border bg-parchment-50 hover:border-laterite-400'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imageFile ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="h-28 border border-border object-contain"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setImageFile(null); }}
                className="px-3 py-1 text-xs border border-status-danger/40 text-status-danger hover:bg-status-danger/5 transition-colors"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-ink-400">
              <PhotoIcon className="h-10 w-10 mb-2" />
              <span className="text-sm">Drag &amp; drop or click to upload an image</span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        <div className="bg-white border border-border p-6 space-y-8">{children}</div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 border border-border text-ink-800 text-sm hover:bg-parchment-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full sm:w-auto px-6 py-2.5 bg-soil-900 text-parchment-50 text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-parchment-50/30 border-t-parchment-50 animate-spin" />
                Saving…
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * FormSection — consistent section heading.
 */
export function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-ink-500 border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}