import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Mail, 
  Calendar, 
  User, 
  Phone, 
  MessageSquare,
  ChevronRight,
  Monitor,
  Smartphone,
  Upload,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BannerManager = () => {
  const [banners] = useState([
    { id: 1, title: 'Summer Collection 2026', subtitle: 'Experience the elegance of silk', device: 'Desktop', status: 'Active', image: null },
    { id: 2, title: 'Wedding Special', subtitle: 'Upto 40% Off on Bridal Wear', device: 'Mobile', status: 'Active', image: null },
    { id: 3, title: 'New Arrivals', subtitle: 'Check out the latest designs', device: 'Desktop', status: 'Scheduled', image: null },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Home Page Banners</h3>
          <p className="text-sm text-slate-500 font-medium">Manage headers and promotional sliders</p>
        </div>
        <button className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 font-bold">
          <Plus size={20} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
               <div className="text-slate-300 transform group-hover:scale-110 transition-transform">
                 <Upload size={48} />
               </div>
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm flex items-center space-x-2">
                 {banner.device === 'Desktop' ? <Monitor size={12} /> : <Smartphone size={12} />}
                 <span>{banner.device} Banner</span>
               </div>
               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                 banner.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
               }`}>
                 {banner.status}
               </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-black text-slate-800">{banner.title}</h4>
              <p className="text-slate-500 text-sm font-medium mt-1">{banner.subtitle}</p>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">P</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">S</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InquiryInbox = () => {
  const [inquiries] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', message: 'Looking for bulk purchase of Pure Silk Sarees for a boutique in Delhi.', date: 'Oct 24, 2025', status: 'Unread' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 91234 56789', message: 'Do you provide international shipping to UK?', date: 'Oct 23, 2025', status: 'Replied' },
    { id: 3, name: 'Anjali Gupta', email: 'anjali@example.com', phone: '+91 99887 76655', message: 'Price inquiry about the Banarasi wedding collection.', date: 'Oct 22, 2025', status: 'Unread' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
        {/* Inbox Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Search mail..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-100 font-medium" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {inquiries.map((inq) => (
              <div key={inq.id} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${inq.status === 'Unread' ? 'bg-rose-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-bold text-slate-800">{inq.name}</h5>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{inq.date}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">{inq.message}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${inq.status === 'Unread' ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{inq.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message View (Static for UI) */}
        <div className="flex-1 flex flex-col bg-slate-50/20">
          <div className="p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-xl">R</div>
              <div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight">Rahul Sharma</h4>
                <div className="flex items-center space-x-3 text-sm text-slate-500 font-medium">
                  <span className="flex items-center space-x-1"><Mail size={14} /> <span>rahul@example.com</span></span>
                  <span className="flex items-center space-x-1"><Phone size={14} /> <span>+91 98765 43210</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 border-t sm:border-t-0 pt-4 sm:pt-0">
               <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-colors">
                 <CheckCircle2 size={16} />
                 <span>Mark Read</span>
               </button>
               <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-slate-200 bg-white">
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-3xl space-y-8">
               <div className="flex items-center space-x-3 text-slate-400">
                 <Calendar size={18} />
                 <span className="text-sm font-bold uppercase tracking-widest">Message Received &bull; Oct 24, 2025 at 04:30 PM</span>
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center space-x-2">
                   <MessageSquare className="text-rose-500" size={24} />
                   <span>Bulk Inquiry for Pure Silk Sarees</span>
                 </h3>
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-slate-700 font-medium">
                   "Hello HC Parekh Team, I have been following your designs for a while and I am very impressed with the quality. I am looking to purchase pure silk sarees in bulk for my new boutique opening in South Delhi next month. 
                   <br /><br />
                   Could you please share your wholesale catalog and price list for bulk orders? I am particularly interested in Kanjivaram and Banarasi collections.
                   <br /><br />
                   Looking forward to hearing from you soon."
                 </div>
               </div>
               
               <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
                 <Clock size={16} />
                 <span>Awaiting your reply...</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
