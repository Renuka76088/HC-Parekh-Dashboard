import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductManager = () => {
  const [products] = useState([
    { id: 1, name: 'Traditional Kanjivaram Silk Saree', category: 'Silk Sarees', price: 12500, stock: 45, image: null, status: 'Active' },
    { id: 2, name: 'Designer Banarasi Silk Saree', category: 'Banarasi', price: 18000, stock: 12, image: null, status: 'Active' },
    { id: 3, name: 'Floral Print Georgette Saree', category: 'Georgette', price: 3500, stock: 89, image: null, status: 'Draft' },
    { id: 4, name: 'Embroidered Wedding Collection', category: 'Bridal', price: 25000, stock: 5, image: null, status: 'Active' },
    { id: 5, name: 'Cotton Silk Blend Saree', category: 'Cotton Silk', price: 2800, stock: 120, image: null, status: 'Active' },
  ]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setAddModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 font-bold"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-100 group-hover:border-rose-100 transition-colors"></div>
                      <span className="font-semibold text-slate-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-tight">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock < 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Showing <span className="text-slate-800">1-5</span> of <span className="text-slate-800">124</span> products</p>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all shadow-sm">1</button>
            <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 transition-all shadow-sm">2</button>
            <button className="p-2 bg-rose-600 text-white font-bold rounded-lg shadow-lg shadow-rose-100">3</button>
            <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Add New Product</h3>
                <button 
                  onClick={() => setAddModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Product Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all" placeholder="e.g. Silk Saree" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Category</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all appearance-none cursor-pointer">
                      <option>Silk Sarees</option>
                      <option>Banarasi</option>
                      <option>Georgette</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Price (₹)</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Stock Quantity</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Description</label>
                  <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all resize-none" placeholder="Enter product details..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Product Images</label>
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-8 text-center group hover:border-rose-300 transition-colors cursor-pointer">
                    <Upload className="mx-auto text-slate-400 group-hover:text-rose-500 mb-2 transition-colors" size={32} />
                    <p className="text-slate-500 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/50">
                <button 
                  onClick={() => setAddModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 font-bold hover:bg-white rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button className="px-8 py-2.5 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                  Save Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CategoryManager = () => {
  const [categories] = useState([
    { id: 1, name: 'Silk Sarees', products: 245, status: 'Active' },
    { id: 2, name: 'Banarasi', products: 120, status: 'Active' },
    { id: 3, name: 'Georgette', products: 89, status: 'Active' },
    { id: 4, name: 'Bridal', products: 54, status: 'Active' },
    { id: 5, name: 'Cotton Silk', products: 167, status: 'Active' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Available Categories</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-100 font-bold text-sm">
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black group-hover:bg-rose-600 group-hover:text-white transition-colors">
                {cat.name[0]}
              </div>
              <button className="p-1 text-slate-300 hover:text-slate-600 group-hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-1">{cat.name}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">{cat.products} Products</span>
              <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
