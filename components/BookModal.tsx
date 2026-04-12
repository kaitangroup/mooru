'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { BookFormData } from '@/lib/types';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData?: BookFormData;
  mode: 'create' | 'edit';
}

export function BookModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: BookModalProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    featured_media: 0,
    image: '',
    url: '',
    featured_image: null,
    featured_image_url: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        url: '',
        featured_image: null,
        featured_media: 0,
        featured_image_url: null,
      });
    }

    setSelectedFile(null);
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        featured_image_url: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        featured_image: selectedFile || null,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      {/* MODAL */}
      <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="p-8">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl text-[#28251d]">
                {mode === 'create' ? 'Add a new book' : 'Edit book'}
              </h2>
              <p className="text-sm text-[#6e6a63] mt-1">
                Share your published work to build credibility.
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-[#a8a29e] hover:text-[#28251d] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <label className="block text-sm mb-2 text-[#28251d]">
                Book title
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-white"
                placeholder="Enter book title"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm mb-2 text-[#28251d]">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md border border-[#d4d1ca] bg-white"
                placeholder="Brief description of your book"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm mb-2 text-[#28251d]">
                Cover image
              </label>

              {formData.featured_image_url && (
                <div className="mb-3">
                  <img
                    src={formData.featured_image_url}
                    className="h-24 w-20 object-cover rounded-md border"
                  />
                  {selectedFile && (
                    <p className="text-xs text-[#6e6a63] mt-1">
                      New image selected — will replace old one
                    </p>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[44px] rounded-md border border-[#d4d1ca] bg-[#fbfbf9] flex items-center justify-center gap-2 text-sm"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : 'Choose image'}
              </button>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm mb-2 text-[#28251d]">
                Book link
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-white"
                placeholder="https://example.com"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-[#fff4f4] border border-[#f5c2c2] text-[#b42318] px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">

              <button
                type="button"
                onClick={onClose}
                className="px-5 h-[42px] rounded-full border border-[#d4d1ca] text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 h-[42px] rounded-full bg-[#01696f] text-white text-sm flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Add book' : 'Save changes'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}