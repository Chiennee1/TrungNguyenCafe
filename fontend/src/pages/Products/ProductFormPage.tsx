import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2, Save, Star } from 'lucide-react';
import { SEO } from '../../components/SEO';

export function ProductFormPage() {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState([{ ingredient: '', amount: '', unit: 'g' }]);
  const [images, setImages] = useState<{ id: string; url: string; isPrimary: boolean; file?: File }[]>([]);

  const addIngredient = () => {
    setRecipe([...recipe, { ingredient: '', amount: '', unit: 'g' }]);
  };

  const removeIngredient = (index: number) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0, // First image is primary if list was empty
        file
      }));
      setImages([...images, ...newImages]);
    }
  };

  const setPrimaryImage = (id: string) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 max-w-5xl mx-auto"
    >
      <SEO title="Thêm Sản Phẩm Mới" description="Tạo sản phẩm mới và thiết lập công thức." />
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-coffee-100 rounded-full transition-colors text-coffee-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-coffee-dark">Thêm Món Mới</h1>
          <p className="text-text-muted mt-1">Nhập thông tin chi tiết và công thức định lượng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-coffee-100">
            <h2 className="text-xl font-serif font-bold text-coffee-dark mb-6">Thông Tin Cơ Bản</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-coffee-900 mb-2">Tên món</label>
                <input type="text" className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="VD: Cà Phê Sữa Đá" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-2">Danh mục</label>
                  <select className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none">
                    <option>Coffee</option>
                    <option>Tea</option>
                    <option>Freeze</option>
                    <option>Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-2">Giá bán (VNĐ)</label>
                  <input type="number" className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="35000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-900 mb-2">Mô tả</label>
                <textarea rows={3} className="block w-full pl-4 pr-4 py-3 border border-coffee-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-gold text-base bg-coffee-50/50 hover:bg-white focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-gold/10 outline-none" placeholder="Mô tả ngắn về sản phẩm..."></textarea>
              </div>
            </div>
          </div>

          {/* Recipe Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-coffee-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-coffee-dark">Công Thức (Định Lượng)</h2>
              <button onClick={addIngredient} className="flex items-center gap-1 text-sm font-medium text-gold hover:text-coffee-dark transition-colors">
                <Plus className="w-4 h-4" /> Thêm nguyên liệu
              </button>
            </div>
            
            <div className="space-y-3">
              {recipe.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input type="text" placeholder="Tên nguyên liệu (VD: Cà phê hạt)" className="flex-1 p-3 bg-coffee-50 border border-coffee-200 rounded-xl focus:border-gold outline-none text-sm" />
                  <input type="number" placeholder="Số lượng" className="w-24 p-3 bg-coffee-50 border border-coffee-200 rounded-xl focus:border-gold outline-none text-sm" />
                  <select className="w-24 p-3 bg-coffee-50 border border-coffee-200 rounded-xl focus:border-gold outline-none text-sm">
                    <option>g</option>
                    <option>ml</option>
                    <option>cái</option>
                  </select>
                  <button onClick={() => removeIngredient(index)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-4 italic">* Hệ thống sẽ tự động trừ kho dựa trên định lượng này khi có đơn hàng thành công.</p>
          </div>
        </div>

        {/* Right Column - Image & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-coffee-100">
            <h2 className="text-xl font-serif font-bold text-coffee-dark mb-6">Hình Ảnh</h2>
            
            <label className="border-2 border-dashed border-coffee-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-coffee-50 transition-colors cursor-pointer group mb-6 relative block">
              <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-coffee-900">Click để tải ảnh lên</p>
              <p className="text-xs text-coffee-400 mt-1">PNG, JPG (Max 2MB). Có thể chọn nhiều ảnh.</p>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 ${img.isPrimary ? 'border-gold shadow-md shadow-gold/20' : 'border-transparent'} group`}
                    >
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between items-start">
                          {!img.isPrimary ? (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); setPrimaryImage(img.id); }}
                              className="p-1.5 bg-white/20 hover:bg-gold text-white rounded-lg backdrop-blur-sm transition-colors text-xs font-medium flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" /> Đặt làm chính
                            </button>
                          ) : (
                            <span className="p-1.5 bg-gold text-coffee-dark rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                              <Star className="w-3 h-3 fill-coffee-dark" /> Ảnh chính
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeImage(img.id); }}
                            className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {img.isPrimary && (
                        <div className="absolute top-2 left-2 p-1.5 bg-gold text-coffee-dark rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm group-hover:hidden">
                          <Star className="w-3 h-3 fill-coffee-dark" /> Ảnh chính
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-coffee-100">
            <h2 className="text-xl font-serif font-bold text-coffee-dark mb-6">Trạng Thái</h2>
            <select className="w-full p-3 bg-coffee-50 border border-coffee-200 rounded-xl focus:border-gold outline-none mb-6">
              <option value="AVAILABLE">Đang Bán</option>
              <option value="OUT_OF_STOCK">Hết Hàng</option>
              <option value="HIDDEN">Ẩn Khỏi Menu</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2 py-4 bg-coffee-dark text-cream rounded-xl font-bold hover:bg-coffee-rich transition-colors shadow-lg shadow-coffee-dark/20"
            >
              <Save className="w-5 h-5" />
              Lưu Sản Phẩm
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
