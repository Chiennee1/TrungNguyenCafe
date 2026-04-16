import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react';
import { SEO } from '../../components/SEO';

import axiosInstance from '../../utils/axiosInstance';

export function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const mapped = res.data.map((p: any) => ({
          id: p.productId,
          name: p.name,
          price: p.price,
          category: p.categoryName || 'Đồ Uống',
          status: p.status === 1 ? 'AVAILABLE' : 'OUT_OF_STOCK',
          stock: 100 // placeholder since stock is handled in inventory mostly
        }));
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-7xl mx-auto"
    >
      <SEO title="Quản Lý Sản Phẩm" description="Danh sách sản phẩm và menu." />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Thực Đơn & Sản Phẩm</h1>
          <p className="text-text-muted mt-1">Quản lý danh sách món, giá bán và trạng thái.</p>
        </div>
        <Link to="/products/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-coffee-dark text-cream px-6 py-3 rounded-xl font-medium hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20"
          >
            <Plus className="w-5 h-5" />
            Thêm Món Mới
          </motion.button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-coffee-100 overflow-hidden">
        <div className="p-6 border-b border-coffee-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-transparent focus:border-gold/50 rounded-xl outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-coffee-50 text-coffee-700 rounded-xl font-medium hover:bg-coffee-100 transition-colors">
            <Filter className="w-5 h-5" />
            Lọc
          </button>
        </div>

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
              ) : products.map((product) => (
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
                      <button className="p-2 text-coffee-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-coffee-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </motion.div>
  );
}
