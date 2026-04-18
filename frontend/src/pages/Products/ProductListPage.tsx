import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, X, Save, ChevronDown } from 'lucide-react';
import { SEO } from '../../components/SEO';
import axiosInstance from '../../utils/axiosInstance';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryId: string | null;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

interface Category {
  categoryId: string;
  name: string;
}

interface EditForm {
  name: string;
  categoryId: string;
  price: string;
  description: string;
  status: string;
}

export function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Edit modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: '', categoryId: '', price: '', description: '', status: '1' });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get('/products?activeOnly=false'),
        axiosInstance.get('/categories'),
      ]);
      const mapped: Product[] = prodRes.data.map((p: any) => ({
        id: p.productId,
        name: p.name,
        price: p.price,
        category: p.categoryName || '—',
        categoryId: p.categoryId ?? null,
        status: p.status === 1 ? 'AVAILABLE' : 'OUT_OF_STOCK',
      }));
      setProducts(mapped);
      setCategories(catRes.data);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Derived filtered list
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !filterCategory || p.categoryId === filterCategory;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  // ── Edit ─────────────────────────────────────────────────────
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setEditError('');
    setEditForm({
      name: p.name,
      categoryId: p.categoryId ?? '',
      price: String(p.price),
      description: '',
      status: p.status === 'AVAILABLE' ? '1' : '0',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    if (!editForm.name.trim()) { setEditError('Tên sản phẩm không được để trống.'); return; }
    if (!editForm.price || isNaN(Number(editForm.price))) { setEditError('Giá không hợp lệ.'); return; }

    setIsSaving(true);
    setEditError('');
    try {
      await axiosInstance.put(`/products/${editingProduct.id}`, {
        name: editForm.name.trim(),
        categoryId: editForm.categoryId || null,
        description: editForm.description || null,
        price: Number(editForm.price),
        status: Number(editForm.status),
      });
      setEditingProduct(null);
      await fetchAll();
    } catch (e: any) {
      setEditError(e?.response?.data?.title || 'Lỗi khi cập nhật sản phẩm.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/products/${deletingId}`);
      setDeletingId(null);
      await fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeFiltersCount = [filterCategory, filterStatus].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-7xl mx-auto"
    >
      <SEO title="Quản Lý Sản Phẩm" description="Danh sách sản phẩm và menu." />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Thực Đơn &amp; Sản Phẩm</h1>
          <p className="text-text-muted mt-1">Quản lý danh sách món, giá bán và trạng thái.</p>
        </div>
        <Link to="/products/new">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-coffee-dark text-cream px-6 py-3 rounded-xl font-medium hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20">
            <Plus className="w-5 h-5" /> Thêm Món Mới
          </motion.button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-coffee-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 rounded-xl outline-none transition-all"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeFiltersCount > 0
                  ? 'bg-gold text-coffee-dark'
                  : 'bg-coffee-50 text-coffee-700 hover:bg-coffee-100'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
              Lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-coffee-100 p-5 z-20 w-64 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-coffee-600 uppercase tracking-wider mb-2 block">Danh mục</label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full p-2 border border-coffee-200 rounded-xl text-sm outline-none focus:border-gold"
                  >
                    <option value="">Tất cả</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-coffee-600 uppercase tracking-wider mb-2 block">Trạng thái</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-coffee-200 rounded-xl text-sm outline-none focus:border-gold"
                  >
                    <option value="">Tất cả</option>
                    <option value="AVAILABLE">Đang Bán</option>
                    <option value="OUT_OF_STOCK">Hết Hàng</option>
                  </select>
                </div>
                <button
                  onClick={() => { setFilterCategory(''); setFilterStatus(''); }}
                  className="w-full text-xs text-red-500 hover:underline text-left"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-coffee-50/50 text-coffee-600 text-sm uppercase tracking-wider">
                <th className="p-6 font-medium">Tên Sản Phẩm</th>
                <th className="p-6 font-medium">Danh Mục</th>
                <th className="p-6 font-medium">Giá Bán</th>
                <th className="p-6 font-medium">Trạng Thái</th>
                <th className="p-6 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-6 text-center text-coffee-400">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-coffee-400">Không có sản phẩm nào.</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-coffee-50/30 transition-colors">
                  <td className="p-6 font-medium text-coffee-950">{product.name}</td>
                  <td className="p-6 text-coffee-600">{product.category}</td>
                  <td className="p-6 font-bold text-gold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.status === 'AVAILABLE' ? 'Đang Bán' : 'Hết Hàng'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-coffee-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(product.id)}
                        className="p-2 text-coffee-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-coffee-dark">Chỉnh Sửa Sản Phẩm</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-coffee-50 rounded-full">
                <X className="w-5 h-5 text-coffee-600" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{editError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee-900 mb-1">Tên món *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="block w-full px-4 py-3 border border-coffee-200 rounded-xl outline-none focus:border-gold text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">Danh mục</label>
                  <select
                    value={editForm.categoryId}
                    onChange={e => setEditForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="block w-full px-4 py-3 border border-coffee-200 rounded-xl outline-none focus:border-gold"
                  >
                    <option value="">— Không có —</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    className="block w-full px-4 py-3 border border-coffee-200 rounded-xl outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-900 mb-1">Trạng thái</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="block w-full px-4 py-3 border border-coffee-200 rounded-xl outline-none focus:border-gold"
                >
                  <option value="1">Đang Bán</option>
                  <option value="0">Hết Hàng</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 border border-coffee-200 rounded-xl text-coffee-700 hover:bg-coffee-50 transition-colors font-medium">
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 py-3 bg-coffee-dark text-cream rounded-xl font-bold hover:bg-coffee-rich transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-serif font-bold text-coffee-dark mb-2">Xác Nhận Xóa</h2>
            <p className="text-text-muted mb-6">Sản phẩm sẽ bị ẩn khỏi menu (soft-delete). Bạn có chắc không?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-3 border border-coffee-200 rounded-xl text-coffee-700 hover:bg-coffee-50 font-medium">
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
