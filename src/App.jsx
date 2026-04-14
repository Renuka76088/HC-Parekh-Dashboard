import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Info, 
  MapPin, 
  Briefcase, 
  Layers, 
  Users, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  LogOut,
  User,
  LayoutDashboard,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeAboutEditor, 
  ContactLocationEditor, 
  ServicesChargesEditor, 
  CorporateEditor, 
  HiringEditor,
  PageContentManager
} from './components/PageEditors';
import logo from '../public/logo.png'; 

// No placeholder components needed anymore

// No placeholder components needed anymore

const SidebarItem = ({ icon: Icon, label, to, active, collapsed, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
      active 
        ? 'bg-rose-50 text-rose-700 font-semibold border-r-4 border-rose-600 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-rose-600'
    } ${collapsed ? 'justify-center px-0' : ''}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'text-rose-600' : 'group-hover:text-rose-600'} ${collapsed ? 'scale-110' : ''}`}>
      <Icon size={22} />
    </div>
    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm tracking-wide whitespace-nowrap overflow-hidden"
      >
        {label}
      </motion.span>
    )}
    {collapsed && (
      <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </Link>
);

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: 'Overview', icon: Home, to: '/' },
    { label: 'About Us', icon: Info, to: '/about' },
    { label: 'Contact Us', icon: MapPin, to: '/contact' },
    { label: 'Services', icon: Briefcase, to: '/services' },
    { label: 'Corporate', icon: Layers, to: '/corporate' },
    { label: 'Hiring', icon: Plus, to: '/hiring' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col relative">
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-rose-600 shadow-sm z-50 hover:scale-110 transition-all"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className={`p-6 flex items-center transition-all duration-300 ${isSidebarOpen ? 'space-x-3' : 'justify-center px-0'}`}>
            <div className={` rounded-xl flex items-center justify-center text-white shadow-lg  transition-all duration-300 ${isSidebarOpen ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <span className="font-bold text-xl uppercase"><img src={logo} alt="" /></span>
            </div>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">HC Parekh</h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Admin Panel</p>
              </motion.div>
            )}
          </div>

          <nav className={`flex-1 space-y-2 mt-4 overflow-y-auto custom-scrollbar transition-all duration-300 ${isSidebarOpen ? 'px-4' : 'px-2 items-center'}`}>
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                collapsed={!isSidebarOpen}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className={`p-4 border-t border-slate-100 transition-all duration-300 ${isSidebarOpen ? '' : 'px-2'}`}>
            <button className={`w-full flex items-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all group ${isSidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-4'}`}>
              <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-96 group focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-400 transition-all">
              <Search size={18} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {menuItems.find(i => i.to === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-slate-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
            </header>

            <Routes>
              <Route path="/" element={<PageContentManager />} />
              <Route path="/about" element={<HomeAboutEditor />} />
              <Route path="/contact" element={<ContactLocationEditor />} />
              <Route path="/services" element={<ServicesChargesEditor />} />
              <Route path="/corporate" element={<CorporateEditor />} />
              <Route path="/hiring" element={<HiringEditor />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
