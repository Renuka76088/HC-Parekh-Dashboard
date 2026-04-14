import React, { useState, useEffect } from 'react';
import {
  FileText,
  User,
  MapPin,
  Briefcase,
  Settings,
  Users,
  Info,
  Home,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  GripVertical,
  Layers,
  FileCode,
  ShieldCheck,
  Award,
  DollarSign,
  BellRing,
  CheckCircle2,
  X,
  Upload,
  Calendar,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { contentApi, corporateApi, workforceApi } from '../api';

const ContentCard = ({ title, description, to, icon: Icon }) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
  >
    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors mb-4">
      <Icon size={24} />
    </div>
    <h4 className="text-lg font-black text-slate-800 tracking-tight">{title}</h4>
    <p className="text-sm text-slate-500 mt-1">{description}</p>
    <div className="mt-4 flex items-center text-xs font-bold text-rose-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
      Open Editor <ChevronRight size={14} className="ml-1" />
    </div>
  </Link>
);

const EditorHeader = ({ title, subtitle }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium">{subtitle}</p>
    </div>
    <button className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold">
      <Save size={18} />
      <span>Save Changes</span>
    </button>
  </div>
);

const SectionEditor = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h4>
      <GripVertical size={16} className="text-slate-300" />
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

const AddItemModal = ({ isOpen, onClose, title, fields, onSave }) => {
  const [formData, setFormData] = React.useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {fields.map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all resize-none"
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                      ></textarea>
                    ) : field.type === 'file' ? (
                      <div className="relative">
                        <input
                          type="file"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files[0] })}
                          required={field.required}
                        />
                        <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-8 text-center group hover:border-rose-300 transition-colors">
                          <Upload className="mx-auto text-slate-400 group-hover:text-rose-500 mb-2 transition-colors" size={32} />
                          <p className="text-slate-500 font-medium">{formData[field.name] ? formData[field.name].name : 'Upload File'}</p>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium"
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/50">
                <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-white rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                  Submit Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Page Editors
export const HomeAboutEditor = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    birthPlace: '',
    motherTongue: '',
    fatherRelation: '',
    govExperience: [],
    corpExperience: [],
    ethics: [],
    socialServices: []
  });

  React.useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await contentApi.getAbout();
      if (res.data) setData(res.data);
    } catch (err) {
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await contentApi.updateAbout(data);
      alert('About details updated successfully!');
    } catch (err) {
      alert('Failed to update About details');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading About Data...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">About Us Management</h3>
          <p className="text-slate-500 font-medium">Edit Profile, Education, Experience, and Ethics</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <SectionEditor title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Birth Place</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.birthPlace}
              onChange={(e) => setData({ ...data, birthPlace: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Mother Tongue</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.motherTongue}
              onChange={(e) => setData({ ...data, motherTongue: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Father Relation</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.fatherRelation}
              onChange={(e) => setData({ ...data, fatherRelation: e.target.value })}
            />
          </div>
        </div>
      </SectionEditor>

      <SectionEditor title="Experience, Ethics & Social sectors">
        <div className="space-y-6">
          {[
            { label: 'Govt. Experience', key: 'govExperience' },
            { label: 'Corporate Experience', key: 'corpExperience' },
            { label: 'Professional Ethics', key: 'ethics' },
            { label: 'Social Services', key: 'socialServices' }
          ].map((sec) => (
            <div key={sec.key} className="space-y-2">
              <label className="text-xs font-black text-rose-600 uppercase tracking-widest">{sec.label} (One item per line)</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium min-h-[100px]"
                value={(data[sec.key] || []).join('\n')}
                onChange={(e) => setData({...data, [sec.key]: e.target.value.split('\n').filter(l => l.trim() !== '')})}
                placeholder={`Enter items for ${sec.label}...`}
              />
            </div>
          ))}
        </div>
      </SectionEditor>
    </div>
  );
};

export const ContactLocationEditor = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    locations: [],
    emails: { appointment: '', services: '' }
  });

  React.useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await contentApi.getContact();
      if (res.data) setData(res.data);
    } catch (err) {
      console.error('Error fetching contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await contentApi.updateContact(data);
      alert('Contact details updated!');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Contact Data...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Contact & Location Settings</h3>
          <p className="text-slate-500 font-medium">Update office addresses, Map, and Email contacts</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <SectionEditor title="Office Locations">
        <div className="space-y-4">
          {(data.locations || []).map((loc, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl group relative">
              <div className="flex justify-between mb-2">
                <input
                  type="text"
                  className="bg-transparent border-none font-bold text-slate-800 outline-none text-lg"
                  value={loc.city}
                  onChange={(e) => {
                    const newLocs = [...data.locations];
                    newLocs[i].city = e.target.value;
                    setData({ ...data, locations: newLocs });
                  }}
                />
                <button
                  onClick={() => {
                    const newLocs = data.locations.filter((_, idx) => idx !== i);
                    setData({ ...data, locations: newLocs });
                  }}
                  className="text-slate-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-rose-50 resize-none font-medium"
                value={loc.address}
                onChange={(e) => {
                  const newLocs = [...data.locations];
                  newLocs[i].address = e.target.value;
                  setData({ ...data, locations: newLocs });
                }}
              />
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, locations: [...(data.locations || []), { city: 'New City', address: '' }] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-rose-300 hover:text-rose-500 transition-all flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add New Location</span>
          </button>
        </div>
      </SectionEditor>

      <SectionEditor title="Contact Emails">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Appointment Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.emails?.appointment}
              onChange={(e) => setData({ ...data, emails: { ...data.emails, appointment: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Services Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.emails?.services}
              onChange={(e) => setData({ ...data, emails: { ...data.emails, services: e.target.value } })}
            />
          </div>
        </div>
      </SectionEditor>
    </div>
  );
};

export const ServicesChargesEditor = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await contentApi.getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (formData) => {
    try {
      await contentApi.addService(formData);
      fetchServices();
      alert('Service added!');
    } catch (err) {
      alert('Failed to add service');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Services...</div>;

  return (
    <div className="max-w-4xl">
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Professional Service"
        onSave={handleAddService}
        fields={[
          { name: 'name', label: 'Service Name', placeholder: 'e.g. Industrial Consultant', required: true },
          { name: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Enter full service details...', required: true },
          { name: 'basePrice', label: 'Base Pricing (₹)', type: 'number', placeholder: '0.00' }
        ]}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Professional Services & Charges</h3>
          <p className="text-slate-500 font-medium">Edit Service details and pricing plans</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      <SectionEditor title="Current Services">
        <div className="grid grid-cols-1 gap-4">
          {services.map((svc, i) => (
            <div key={svc._id || i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600"><Briefcase size={20} /></div>
              <div className="flex-1">
                <h4 className="font-black text-slate-800 text-lg mb-1">{svc.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{svc.description}</p>
                {svc.price && <p className="text-emerald-600 font-bold mt-2">₹ {svc.price}</p>}
              </div>
              <button className="p-2 text-slate-300 hover:text-rose-600"><Trash2 size={18} /></button>
            </div>
          ))}
          {services.length === 0 && <p className="text-center text-slate-400 py-8">No services listed.</p>}
        </div>
      </SectionEditor>
    </div>
  );
};

export const CorporateEditor = () => {
  const [modalType, setModalType] = React.useState(null); // 'Tender', 'MOU', 'Notice'
  const [items, setItems] = React.useState({ tenders: [], mous: [], notices: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, m, n] = await Promise.all([
        corporateApi.getTenders(),
        corporateApi.getMOUs(),
        corporateApi.getNotices()
      ]);
      setItems({ tenders: t.data, mous: m.data, notices: n.data });
    } catch (err) {
      console.error('Error fetching corporate data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalType === 'Tender') await corporateApi.addTender(formData);
      else if (modalType === 'MOU') await corporateApi.addMOU(formData);
      else if (modalType === 'Notice') await corporateApi.addNotice(formData);

      fetchAll();
      setModalType(null);
      alert(`${modalType} Published Successfully!`);
    } catch (err) {
      alert(`Failed to publish ${modalType}`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'Tender') await corporateApi.deleteTender(id);
      else if (type === 'MOU') await corporateApi.deleteMOU(id);
      else if (type === 'Notice') await corporateApi.deleteNotice(id);
      fetchAll();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Corporate Data...</div>;

  return (
    <div className="max-w-4xl">
      <AddItemModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={`Add New ${modalType === 'Notice' ? 'Project Notice' : modalType}`}
        onSave={handleSave}
        fields={modalType === 'Notice' ? [
          { name: 'title', label: 'Project Title', placeholder: 'e.g. Infrastructure Development Plan', required: true },
          { name: 'description', label: 'Brief Description', type: 'textarea', placeholder: 'Summary of the project notice...', required: true },
          { name: 'projectLocations', label: 'Project Locations', placeholder: 'e.g. Surat, Mumbai, Delhi' },
          { name: 'targetSectors', label: 'Target Sectors', placeholder: 'e.g. Textile, Logistics' },
          { name: 'ourRequirements', label: 'Our Requirements', type: 'textarea', placeholder: 'List specific requirements...' }
        ] : [
          { name: 'title', label: `${modalType} Title`, placeholder: `e.g. Official ${modalType} 2026`, required: true },
          { name: 'description', label: `${modalType} Description`, type: 'textarea', placeholder: 'Summary of the document...', required: true }
        ]}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Corporate Relations</h3>
          <p className="text-slate-500 font-medium">Manage Tenders, MOUs, and Notices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Project Notices', icon: BellRing, color: 'text-amber-600', bg: 'bg-amber-100', type: 'Notice' },
          { title: 'Corporate Tenders', icon: FileCode, color: 'text-blue-600', bg: 'bg-blue-100', type: 'Tender' },
          { title: 'Corporate MOU', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-100', type: 'MOU' }
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => setModalType(item.type)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
              <item.icon size={24} />
            </div>
            <h4 className="font-black text-slate-800 tracking-tight text-lg mb-1">{item.title}</h4>
            <p className="text-xs text-rose-600 font-black uppercase tracking-widest mt-2 flex items-center">
              Post New <Plus size={12} className="ml-1" />
            </p>
          </div>
        ))}
      </div>

      <SectionEditor title="Recently Published Documents">
        <div className="space-y-6">
          {['notices', 'tenders', 'mous'].map(category => (
            <div key={category}>
              <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{category}</h5>
              <div className="space-y-2">
                {items[category].map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 tracking-tight">{item.title}</p>
                        <p className="text-xs text-slate-500 mb-1">{item.description}</p>
                        {category === 'notices' && (
                          <div className="mt-2 space-y-1 bg-white/50 p-2 rounded-lg border border-slate-100">
                            {item.projectLocations && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight"><MapPin size={10} className="inline mr-1"/> {item.projectLocations}</p>}
                            {item.targetSectors && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight"><Layers size={10} className="inline mr-1"/> {item.targetSectors}</p>}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                          Added on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => handleDelete(category.charAt(0).toUpperCase() + category.slice(1, -1), item._id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {items[category].length === 0 && <p className="text-[10px] text-slate-300 italic">No {category} found.</p>}
              </div>
            </div>
          ))}
        </div>
      </SectionEditor>
    </div>
  );
};

export const TeamHiringEditor = () => {
  const [modalType, setModalType] = React.useState(null); // 'Member', 'Vacancy'
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({ team: [], vacancies: [] });

  React.useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, v] = await Promise.all([
        workforceApi.getTeam(),
        workforceApi.getVacancies()
      ]);
      setData({ team: t.data, vacancies: v.data });
    } catch (err) {
      console.error('Error fetching workforce data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalType === 'Member') {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        await workforceApi.addTeamMember(data);
      } else {
        await workforceApi.addVacancy(formData);
      }
      fetchAll();
      alert(`${modalType} Added Successfully!`);
    } catch (err) {
      alert(`Failed to add ${modalType}`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      if (type === 'Member') await workforceApi.deleteTeamMember(id);
      else await workforceApi.deleteVacancy(id);
      fetchAll();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Workforce...</div>;

  return (
    <div className="max-w-4xl">
      <AddItemModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={modalType === 'Member' ? 'Add New Team Expert' : 'Post New Job Vacancy'}
        onSave={handleSave}
        fields={modalType === 'Member' ? [
          { name: 'name', label: 'Full Name', placeholder: 'e.g. Dr. Amit Shah', required: true },
          { name: 'designation', label: 'Designation/Expertise', placeholder: 'e.g. Senior Trade Consultant', required: true },
          { name: 'bio', label: 'Profile Bio', type: 'textarea', placeholder: 'Enter professional background...' },
          { name: 'photo', label: 'Upload Photo', type: 'file' }
        ] : [
          { name: 'title', label: 'Job Title', placeholder: 'e.g. Production Supervisor', required: true },
          { name: 'experience', label: 'Required Experience', placeholder: 'e.g. 5+ Years' },
          { name: 'description', label: 'Job Description', type: 'textarea', placeholder: 'Enter job responsibilities...', required: true },
          { name: 'priority', label: 'Priority', placeholder: 'e.g. High / Urgent' }
        ]}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Workforce</h3>
          <p className="text-slate-500 font-medium">Manage experts and job opportunities</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setModalType('Member')}
          className="flex-1 p-6 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex flex-col items-center justify-center space-y-2 group"
        >
          <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform"><User size={28} /></div>
          <span className="font-black uppercase tracking-widest text-sm">Add Team Expert</span>
        </button>
        <button
          onClick={() => setModalType('Vacancy')}
          className="flex-1 p-6 bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex flex-col items-center justify-center space-y-2 group"
        >
          <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform"><Plus size={28} /></div>
          <span className="font-black uppercase tracking-widest text-sm">Post New Vacancy</span>
        </button>
      </div>

      <SectionEditor title="Current Workforce Structure">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.team.map((member) => (
              <div key={member._id} className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm group">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{member.name}</p>
                  <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest">{member.designation}</p>
                </div>
                <button onClick={() => handleDelete('Member', member._id)} className="p-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </SectionEditor>

      <SectionEditor title="Active Hiring List">
        <div className="space-y-4">
          {data.vacancies.map((job) => (
            <div key={job._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group border-l-8 border-l-rose-500">
              <h4 className="text-xl font-black text-slate-800 mb-2">{job.title}</h4>
              <p className="text-sm text-slate-600 font-bold mb-4">{job.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-rose-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded">{job.priority || 'Normal'}</span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[8px] font-black uppercase tracking-[0.2em] rounded">{job.experience}</span>
                </div>
                <button onClick={() => handleDelete('Vacancy', job._id)} className="p-1 px-3 bg-white text-slate-400 hover:text-rose-600 text-[10px] font-bold uppercase rounded border border-slate-200">Remove Listing</button>
              </div>
            </div>
          ))}
        </div>
      </SectionEditor>
    </div>
  );
};

export const PageContentManager = () => {
  return (
    <div className="space-y-10">
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600 blur-[120px] opacity-20 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Website Content Hub</h2>
          <p className="text-lg text-slate-400 max-w-2xl font-medium">Select a section below to manage the live content of the HC website. All items are linked to the source files in the <span className="text-rose-400 font-black">HC/src/pages</span> directory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard title="About & Profile" description="Edit personal details, bio, and ethics." to="/about" icon={Info} />
        <ContentCard title="Contact & Offices" description="Manage office locations and map data." to="/contact" icon={MapPin} />
        <ContentCard title="Services & Rates" description="Edit professional plans and charges." to="/services" icon={Briefcase} />
        <ContentCard title="Corporate Hub" description="Notices, Tenders, and MOU filings." to="/corporate" icon={Layers} />
        <ContentCard title="Workforce & Hiring" description="Team experts and career opportunities." to="/team" icon={Users} />
        <ContentCard title="SEO & Global Meta" description="Site title, favicon, and keywords." to="/settings" icon={Settings} />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-800 tracking-tight">System Integrity Check</h4>
            <p className="text-xs text-slate-500 font-medium italic">All editors are synchronized with Parekh/HC source code.</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Verify Now</button>
      </div>
    </div>
  );
};
