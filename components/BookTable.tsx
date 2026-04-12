'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { Book, BookFormData } from '@/lib/types';
import { bookService } from '@/lib/bookService';
import { BookModal } from './BookModal';
import { useRouter } from 'next/navigation';

export function BookTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.fetchUserBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Please check your authentication.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBook(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await bookService.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete book:', err);
      alert('Failed to delete book');
    }
  };

  const handleSubmit = async (data: BookFormData) => {
    if (modalMode === 'create') {
      const newBook = await bookService.createBook(data);
      setBooks([newBook, ...books]);
      router.refresh();
    } else if (selectedBook) {
      const updatedBook = await bookService.updateBook(selectedBook.id, data);
      setBooks(books.map((book) => (book.id === selectedBook.id ? updatedBook : book)));
    }
  };

  const getInitialData = (): BookFormData | undefined => {
    if (!selectedBook) return undefined;
    return {
      title: selectedBook.title.rendered,
      featured_media: selectedBook.featured_media,
      featured_image: null,
      description: selectedBook.content.rendered.replace(/<[^>]*>/g, ''),
      image: selectedBook.acf?.book_image || '',
      url: selectedBook.book_url || '',
      featured_image_url: selectedBook.featured_image_url || null,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#01696f]" />
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-[var(--font-display)] text-[clamp(1.8rem,2.5vw,2.4rem)] text-[#28251d]">
          Your books
        </h1>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 h-[42px] rounded-full bg-[#01696f] text-white text-sm font-medium hover:bg-[#0c4e54] transition"
        >
          <Plus className="h-4 w-4" />
          Add book
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-[#fff4f4] border border-[#f5c2c2] text-[#b42318] px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {books.length === 0 ? (
        <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-12 text-center">
          <h3 className="font-[var(--font-display)] text-xl mb-2">
            No books yet
          </h3>
          <p className="text-[#6e6a63] mb-6">
            Add your published work to build credibility and attract more users.
          </p>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 h-[42px] rounded-full bg-[#01696f] text-white text-sm"
          >
            <Plus className="h-4 w-4" />
            Add your first book
          </button>
        </div>
      ) : (
        <>
          {/* TABLE VIEW */}
          <div className="hidden md:block bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#e5e2dc]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#28251d]">Cover</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#28251d]">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#28251d]">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#28251d]">Link</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#28251d]">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e5e2dc]">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-[#f3f2ef] transition">

                      {/* IMAGE */}
                      <td className="px-6 py-4">
                        {book.featured_image_url ? (
                          <img
                            src={book.featured_image_url}
                            alt={book.title.rendered}
                            className="h-16 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-12 bg-[#e5e2dc] rounded flex items-center justify-center text-xs text-[#a8a29e]">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* TITLE */}
                      <td className="px-6 py-4 font-medium text-[#28251d]">
                        {book.title.rendered}
                      </td>

                      {/* DESC */}
                      <td className="px-6 py-4 text-sm text-[#6e6a63] max-w-md truncate">
                        {book.content.rendered.replace(/<[^>]*>/g, '')}
                      </td>

                      {/* LINK */}
                      <td className="px-6 py-4">
                        {book.book_url ? (
                          <a
                            href={book.book_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#01696f] text-sm hover:underline"
                          >
                            View
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-[#a8a29e] text-sm">—</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-[#01696f] hover:bg-[#d7e7e5] rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(book.id)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              deleteConfirm === book.id
                                ? 'bg-red-600 text-white'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {deleteConfirm === book.id ? 'Confirm' : <Trash2 className="h-4 w-4" />}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE */}
          <div className="md:hidden space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-4 flex gap-4"
              >
                <div>
                  {book.featured_image_url ? (
                    <img
                      src={book.featured_image_url}
                      className="h-24 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-24 w-16 bg-[#e5e2dc] rounded flex items-center justify-center text-xs text-[#a8a29e]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-[#28251d]">
                    {book.title.rendered}
                  </div>

                  <div className="text-sm text-[#6e6a63] mt-1 line-clamp-2">
                    {book.content.rendered.replace(/<[^>]*>/g, '')}
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(book)}
                      className="px-3 py-1 text-xs rounded-full border border-[#d4d1ca]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(book.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        deleteConfirm === book.id
                          ? 'bg-red-600 text-white'
                          : 'text-red-600 border border-red-200'
                      }`}
                    >
                      {deleteConfirm === book.id ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={getInitialData()}
        mode={modalMode}
      />
    </div>
  );
}