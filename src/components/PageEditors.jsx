import React, { useState, useEffect } from 'react';
import {
  MapPin, Briefcase, Settings, Info, Save, Plus, Trash2,
  ChevronRight, GripVertical, Layers, FileCode, ShieldCheck,
  BellRing, X, Edit, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contentApi, corporateApi, workforceApi, webMarketApi } from '../api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ─── Quill Config ───────────────────────────────────────────────────────────
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet'
];

// ─── Helper ─────────────────────────────────────────────────────────────────
const toArr = (v) => Array.isArray(v) ? v : (v ? [v] : []);

// ─── StringListEditor ────────────────────────────────────────────────────────
// Renders an inline list of strings — each item editable/deletable,
// with an Add row at the bottom. Fully controlled via values/onChange props.
const StringListEditor = ({ label, values, onChange, placeholder = 'Type and press Add or Enter...' }) => {
  const [input, setInput] = useState('');
  const safe = toArr(values);

  const add = () => {
    const t = input.trim();
    if (t) { onChange([...safe, t]); setInput(''); }
  };

  const update = (i, val) => {
    const u = [...safe]; u[i] = val; onChange(u);
  };

  const remove = (i) => onChange(safe.filter((_, j) => j !== i));

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-1">
          {label}
        </label>
      )}

      {/* Existing items */}
      <div className="space-y-1.5">
        {safe.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 w-5 text-right shrink-0">{i + 1}.</span>
            <input
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
              value={val}
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 px-3 py-2 bg-slate-50 border border-dashed border-rose-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-rose-100 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-black hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  );
};

// ─── ItemModal ────────────────────────────────────────────────────────────────
// Generic modal. fields: [{ name, label, type, placeholder, required, options }]
// type can be: 'text' | 'textarea' | 'select' | 'stringlist'
// Key fix: initializes from initialData only when isOpen changes (open event),
// preventing state reset while the user is typing inside the modal.
const ItemModal = ({ isOpen, onClose, title, fields = [], initialData = {}, onSave }) => {
  const [form, setForm] = useState({});

  // Re-initialize ONLY when the modal is opened (not on every parent re-render)
  useEffect(() => {
    if (!isOpen) return;
    const init = {};
    fields.forEach((f) => {
      if (f.type === 'stringlist') {
        init[f.name] = toArr(initialData[f.name]);
      } else {
        init[f.name] = initialData[f.name] ?? '';
      }
    });
    setForm(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const set = (name, val) => setForm((prev) => ({ ...prev, [name]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    {field.type === 'stringlist' ? (
                      <StringListEditor
                        label={field.label}
                        values={form[field.name] || []}
                        onChange={(val) => set(field.name, val)}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <>
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{field.label}</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                          value={form[field.name] || ''}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                        >
                          <option value="">Select...</option>
                          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </>
                    ) : field.type === 'textarea' ? (
                      <>
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{field.label}</label>
                        <textarea
                          rows="4"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all resize-none"
                          placeholder={field.placeholder}
                          value={form[field.name] || ''}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                        />
                      </>
                    ) : field.type === 'quill' ? (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{field.label}</label>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden min-h-[300px]">
                          <ReactQuill
                            theme="snow"
                            value={form[field.name] || ''}
                            onChange={(val) => set(field.name, val)}
                            modules={quillModules}
                            formats={quillFormats}
                            className="h-[250px]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{field.label}</label>
                        <input
                          type={field.inputType || 'text'}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium"
                          placeholder={field.placeholder}
                          value={form[field.name] || ''}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/50 shrink-0">
                <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-white rounded-xl transition-all border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                  {initialData?._id ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Layout Helpers ──────────────────────────────────────────────────────────
const ContentCard = ({ title, description, to, icon: Icon }) => (
  <Link to={to} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group">
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

const SectionEditor = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h4>
      <GripVertical size={16} className="text-slate-300" />
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

// ─── HomeAboutEditor ──────────────────────────────────────────────────────────
export const HomeAboutEditor = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    birthPlace: '', motherTongue: '', fatherRelation: '',
    govExperience: [], corpExperience: [], ethics: [], socialServices: [],
  });
  const [modal, setModal] = useState({ open: false, listKey: '', index: -1, item: {} });

  useEffect(() => { fetchAbout(); }, []);

  const fetchAbout = async () => {
    try {
      const res = await contentApi.getAbout();
      if (res.data) {
        const d = res.data;
        setData({
          ...d,
          govExperience:  toArr(d.govExperience),
          ethics:         toArr(d.ethics),
          corpExperience: toArr(d.corpExperience),
          socialServices: toArr(d.socialServices),
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try { await contentApi.updateAbout(data); alert('About section saved!'); }
    catch { alert('Save failed'); }
  };

  const openModal = (listKey, index = -1) => {
    setModal({ open: true, listKey, index, item: index >= 0 ? data[listKey][index] : {} });
  };

  const saveItem = (item) => {
    setData((prev) => {
      const list = [...(prev[modal.listKey] || [])];
      if (modal.index >= 0) list[modal.index] = item;
      else list.push(item);
      return { ...prev, [modal.listKey]: list };
    });
  };

  const deleteItem = (listKey, idx) => {
    setData((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== idx) }));
  };

  const objFields = [
    { name: 'title', label: 'Title', required: true, placeholder: 'Enter title...' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description...' },
  ];

  const ObjList = ({ listKey }) => (
    <div className="space-y-2">
      {(data[listKey] || []).map((item, i) => (
        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 group hover:border-rose-200 transition-all">
          <div className="flex-1">
            <p className="font-bold text-slate-800">{item.title}</p>
            <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
          </div>
          <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
            <button type="button" onClick={() => openModal(listKey, i)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={14} /></button>
            <button type="button" onClick={() => deleteItem(listKey, i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      {(data[listKey] || []).length === 0 && (
        <p className="text-sm text-slate-400 italic text-center py-2">No items yet</p>
      )}
    </div>
  );

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading About Data...</div>;

  return (
    <div className="max-w-4xl">
      <ItemModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.index >= 0 ? 'Edit Item' : 'Add Item'}
        fields={objFields}
        initialData={modal.item}
        onSave={saveItem}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">About Us Management</h3>
          <p className="text-slate-500 font-medium">Edit Profile, Experience, and Ethics</p>
        </div>
        <button onClick={handleSave} className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold">
          <Save size={18} /><span>Save Changes</span>
        </button>
      </div>

      <SectionEditor title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ key: 'birthPlace', label: 'Birth Place' }, { key: 'motherTongue', label: 'Mother Tongue' }].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">{f.label}</label>
              <input type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
                value={data[f.key]} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Father Relation</label>
            <input type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none font-medium"
              value={data.fatherRelation} onChange={(e) => setData({ ...data, fatherRelation: e.target.value })} />
          </div>
        </div>
      </SectionEditor>

      <SectionEditor title="Govt. Experience">
        <StringListEditor
          values={data.govExperience}
          onChange={(v) => setData({ ...data, govExperience: v })}
          placeholder="Add a govt. experience point..."
        />
      </SectionEditor>

      <SectionEditor title="Corporate Experience">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => openModal('corpExperience')}
            className="px-4 py-1.5 bg-rose-50 text-rose-600 text-xs font-black rounded-lg hover:bg-rose-100 flex items-center gap-1">
            <Plus size={13} /> Add Entry
          </button>
        </div>
        <ObjList listKey="corpExperience" />
      </SectionEditor>

      <SectionEditor title="Professional Ethics">
        <StringListEditor
          values={data.ethics}
          onChange={(v) => setData({ ...data, ethics: v })}
          placeholder="Add an ethics point..."
        />
      </SectionEditor>

      <SectionEditor title="Social Services">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => openModal('socialServices')}
            className="px-4 py-1.5 bg-rose-50 text-rose-600 text-xs font-black rounded-lg hover:bg-rose-100 flex items-center gap-1">
            <Plus size={13} /> Add Entry
          </button>
        </div>
        <ObjList listKey="socialServices" />
      </SectionEditor>
    </div>
  );
};

// ─── ContactLocationEditor ────────────────────────────────────────────────────
export const ContactLocationEditor = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ locations: [], emails: { appointment: [], services: [] } });

  useEffect(() => { fetchContact(); }, []);

  const fetchContact = async () => {
    try {
      const res = await contentApi.getContact();
      if (res.data) {
        const d = res.data;
        setData({
          ...d,
          emails: {
            appointment: toArr(d.emails?.appointment),
            services:    toArr(d.emails?.services),
          },
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try { await contentApi.updateContact(data); alert('Contact details updated!'); }
    catch { alert('Update failed'); }
  };

  const setLoc = (i, key, val) => {
    const nl = [...data.locations];
    nl[i] = { ...nl[i], [key]: val };
    setData({ ...data, locations: nl });
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Contact Data...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Contact & Location Settings</h3>
          <p className="text-slate-500 font-medium">Update office addresses and email contacts</p>
        </div>
        <button onClick={handleSave} className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold">
          <Save size={18} /><span>Save Changes</span>
        </button>
      </div>

      <SectionEditor title="Office Locations">
        <div className="space-y-4">
          {(data.locations || []).map((loc, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl group">
              <div className="flex justify-between items-center mb-2">
                <input type="text"
                  className="bg-transparent border-none font-bold text-slate-800 outline-none text-lg flex-1 focus:bg-white focus:border focus:border-slate-200 focus:rounded-lg focus:px-2 transition-all"
                  value={loc.city}
                  onChange={(e) => setLoc(i, 'city', e.target.value)}
                  placeholder="City Name"
                />
                <button onClick={() => setData({ ...data, locations: data.locations.filter((_, j) => j !== i) })}
                  className="text-slate-300 hover:text-rose-600 transition-colors ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-rose-100 resize-none font-medium"
                value={loc.address} rows={3}
                onChange={(e) => setLoc(i, 'address', e.target.value)}
                placeholder="Full address..."
              />
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, locations: [...(data.locations || []), { city: 'New City', address: '' }] })}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-rose-300 hover:text-rose-500 transition-all flex items-center justify-center space-x-2">
            <Plus size={20} /><span>Add New Location</span>
          </button>
        </div>
      </SectionEditor>

      <SectionEditor title="Contact Emails">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StringListEditor
            label="Appointment Emails"
            values={data.emails?.appointment}
            onChange={(v) => setData({ ...data, emails: { ...data.emails, appointment: v } })}
            placeholder="Add email address..."
          />
          <StringListEditor
            label="Project Services Emails"
            values={data.emails?.services}
            onChange={(v) => setData({ ...data, emails: { ...data.emails, services: v } })}
            placeholder="Add email address..."
          />
        </div>
      </SectionEditor>
    </div>
  );
};

// ─── ServicesChargesEditor ────────────────────────────────────────────────────
export const ServicesChargesEditor = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try { const res = await contentApi.getServices(); setServices(res.data || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await contentApi.addService({ 
        title: input.trim(),
        description: 'Professional Service'
      });
      setInput('');
      fetchServices();
    } catch { alert('Failed to add service'); }
  };

  const [modal, setModal] = useState({ open: false, data: {}, isEdit: false });

  const handleEdit = (svc) => {
    setModal({ 
      open: true, 
      data: {
        ...svc,
        points: toArr(svc.points)
      }, 
      isEdit: true 
    });
  };

  const handleSaveEdit = async (formData) => {
    const processed = {
      ...formData,
      points: toArr(formData.points)
    };
    try {
      await contentApi.updateService(modal.data._id, processed);
      alert('Service updated!');
      fetchServices();
    } catch { alert('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await contentApi.deleteService(id); fetchServices(); }
    catch { alert('Delete failed'); }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Services...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Professional Services</h3>
          <p className="text-slate-500 font-medium">Add multiple service titles quickly</p>
        </div>
      </div>

      <SectionEditor title="Service Titles">
        <div className="space-y-3">
          <ItemModal
            isOpen={modal.open}
            onClose={() => setModal({ open: false, data: {}, isEdit: false })}
            fields={[
              { name: 'title', label: 'Service Title', required: true },
              { name: 'description', label: 'Brief Description', type: 'textarea' },
              { name: 'points', label: 'Service Points (Details)', type: 'stringlist' }
            ]}
            initialData={modal.data}
            onSave={handleSaveEdit}
          />

          {services.map((svc, i) => (
            <div key={svc._id || i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-rose-200 transition-all">
              <span className="text-xs font-black text-slate-400 w-5 text-right shrink-0">{i + 1}.</span>
              <div className="flex-1 text-sm font-bold text-slate-800">
                {svc.title || svc.name}
              </div>
              <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(svc)} 
                  className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit Service"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(svc._id)} 
                  className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                  title="Delete Service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && <p className="text-center text-slate-400 py-4 italic text-sm">No services listed yet.</p>}

          <form onSubmit={handleAdd} className="flex gap-2 mt-6">
            <input
              className="flex-1 px-4 py-3 bg-white border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-rose-300 focus:bg-rose-50/30 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a service title and press Add..."
            />
            <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md shrink-0">
              <Plus size={16} /> Add New
            </button>
          </form>
        </div>
      </SectionEditor>
    </div>
  );
};

// ─── CorporateEditor ──────────────────────────────────────────────────────────
export const CorporateEditor = () => {
  const [modal, setModal] = useState({ open: false, type: null, data: {}, isEdit: false });
  const [items, setItems] = useState({ tenders: [], mous: [], notices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [t, m, n] = await Promise.all([
        corporateApi.getTenders(),
        corporateApi.getMOUs(),
        corporateApi.getNotices(),
      ]);
      setItems({ tenders: t.data || [], mous: m.data || [], notices: n.data || [] });
    } catch { console.error('Error fetching corporate data'); }
    finally { setLoading(false); }
  };

  const handleSave = async (formData) => {
    const { type, data: existing, isEdit } = modal;
    try {
      if (isEdit && existing._id) {
        if (type === 'Tender') await corporateApi.updateTender(existing._id, formData);
        else if (type === 'MOU') await corporateApi.updateMOU(existing._id, formData);
        else if (type === 'Notice') await corporateApi.updateNotice(existing._id, formData);
        alert(`${type} updated!`);
      } else {
        if (type === 'Tender') await corporateApi.addTender(formData);
        else if (type === 'MOU') await corporateApi.addMOU(formData);
        else if (type === 'Notice') await corporateApi.addNotice(formData);
        alert(`${type} published!`);
      }
      fetchAll();
    } catch { alert(`Failed to save ${type}`); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this?')) return;
    try {
      if (type === 'Tender') await corporateApi.deleteTender(id);
      else if (type === 'MOU') await corporateApi.deleteMOU(id);
      else if (type === 'Notice') await corporateApi.deleteNotice(id);
      fetchAll();
    } catch { alert('Delete failed'); }
  };

  const openModal = (type, data = {}, isEdit = false) => {
    // Normalize any array fields when opening modal
    const normalized = { ...data };
    ['points', 'projectLocations', 'targetSectors', 'ourRequirements'].forEach((k) => {
      if (normalized[k] !== undefined) normalized[k] = toArr(normalized[k]);
    });
    setModal({ open: true, type, data: normalized, isEdit });
  };

  const getFields = (type) => {
    if (type === 'Notice') return [
      { name: 'title',            label: 'Project Title',              placeholder: 'e.g. Infrastructure Development Plan', required: true },
      { name: 'description',      label: 'Brief Description',          type: 'textarea', placeholder: 'Summary of the notice...', required: true },
      { name: 'projectLocationsHeading', label: 'Location Heading Label', placeholder: 'e.g. Project Locations' },
      { name: 'projectLocations', label: 'Project Locations',          type: 'stringlist', placeholder: 'Add location (e.g. Surat)...' },
      { name: 'targetSectorsHeading',    label: 'Sector Heading Label',   placeholder: 'e.g. Target Sectors' },
      { name: 'targetSectors',    label: 'Target Sectors',             type: 'stringlist', placeholder: 'Add sector...' },
      { name: 'ourRequirementsHeading',  label: 'Requirements Heading Label', placeholder: 'e.g. Our Requirements' },
      { name: 'ourRequirements',  label: 'Our Requirements',           type: 'stringlist', placeholder: 'Add requirement...' },
    ];
    return [
      { name: 'title',       label: `${type} Title`,    placeholder: `e.g. Official ${type} 2026`, required: true },
      { name: 'description', label: 'Description',      type: 'textarea', placeholder: 'Summary of the document...', required: true },
      { name: 'points',      label: 'Key Points',       type: 'stringlist', placeholder: 'Add a key point...' },
    ];
  };

  const categoryMap = {
    notices: { label: 'Project Notices',   Icon: BellRing,    color: 'text-amber-600', bg: 'bg-amber-100', type: 'Notice' },
    tenders: { label: 'Corporate Tenders', Icon: FileCode,    color: 'text-blue-600',  bg: 'bg-blue-100',  type: 'Tender' },
    mous:    { label: 'Corporate MOU',     Icon: ShieldCheck, color: 'text-rose-600',  bg: 'bg-rose-100',  type: 'MOU' },
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Corporate Data...</div>;

  return (
    <div className="max-w-4xl">
      <ItemModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, type: null, data: {}, isEdit: false })}
        title={modal.isEdit ? `Edit ${modal.type}` : `Add New ${modal.type === 'Notice' ? 'Project Notice' : modal.type}`}
        fields={modal.type ? getFields(modal.type) : []}
        initialData={modal.data}
        onSave={handleSave}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Corporate Relations</h3>
          <p className="text-slate-500 font-medium">Manage Tenders, MOUs, and Project Notices</p>
        </div>
      </div>

      {/* Quick Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Object.values(categoryMap).map(({ label, Icon, color, bg, type }) => (
          <div key={type} onClick={() => openModal(type)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
            <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
              <Icon size={24} />
            </div>
            <h4 className="font-black text-slate-800 tracking-tight text-lg mb-1">{label}</h4>
            <p className="text-xs text-rose-600 font-black uppercase tracking-widest mt-2 flex items-center">
              Post New <Plus size={12} className="ml-1" />
            </p>
          </div>
        ))}
      </div>

      {/* Lists */}
      {Object.entries(categoryMap).map(([cat, meta]) => (
        <SectionEditor key={cat} title={meta.label}>
          <div className="space-y-2">
            {items[cat].map((item) => (
              <div key={item._id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-rose-100 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                  {toArr(item.points).length > 0 && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">{toArr(item.points).length} key points</p>
                  )}
                </div>
                <div className="flex gap-1 ml-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openModal(meta.type, item, true)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(meta.type, item._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {items[cat].length === 0 && (
              <p className="text-[11px] text-slate-300 italic text-center py-4">No {cat} published yet.</p>
            )}
          </div>
        </SectionEditor>
      ))}
    </div>
  );
};

// ─── HiringEditor ─────────────────────────────────────────────────────────────
export const HiringEditor = () => {
  const [loading, setLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);
  const [modal, setModal] = useState({ open: false, data: {}, isEdit: false });

  useEffect(() => { fetchVacancies(); }, []);

  const fetchVacancies = async () => {
    try { const v = await workforceApi.getVacancies(); setVacancies(v.data || []); }
    catch { console.error('Error fetching vacancies'); }
    finally { setLoading(false); }
  };

  const handleSave = async (formData) => {
    const processed = {
      ...formData,
      targetSectors:    toArr(formData.targetSectors),
      requiredPlatforms: toArr(formData.requiredPlatforms),
      emails:           toArr(formData.emails),
    };
    try {
      if (modal.isEdit && modal.data._id) {
        await workforceApi.updateVacancy(modal.data._id, processed);
        alert('Vacancy updated!');
      } else {
        await workforceApi.addVacancy(processed);
        alert('Vacancy posted!');
      }
      fetchVacancies();
    } catch { alert('Failed to save vacancy'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vacancy?')) return;
    try { await workforceApi.deleteVacancy(id); fetchVacancies(); }
    catch { alert('Delete failed'); }
  };

  const openModal = (data = {}, isEdit = false) => {
    setModal({
      open: true, isEdit, data: {
        ...data,
        targetSectors:    toArr(data.targetSectors),
        requiredPlatforms: toArr(data.requiredPlatforms),
        emails:           toArr(data.emails),
      }
    });
  };

  const vacancyFields = [
    {
      name: 'title', label: 'Job Title',
      placeholder: 'e.g. Social Media Influencer', required: true,
    },
    {
      name: 'campaignHeading', label: 'Campaign Label (Text on Badge)',
      placeholder: 'e.g. CAMPAIGN',
    },
    {
      name: 'campaign', label: 'Campaign Name',
      placeholder: 'e.g. Social Media campaign / Brand Promotion',
    },
    {
      name: 'type', label: 'Employment Type', type: 'select',
      options: ['On Contract', 'On Payroll'], required: true,
    },
    {
      name: 'description', label: 'Job Description', type: 'textarea', required: true,
      placeholder: 'e.g. Experienced Social Media Influencers irrespective of locations are required for our long-term Online Business Advertisements...',
    },
    {
      name: 'targetSectorsHeading', label: 'Target Sectors Label',
      placeholder: 'e.g. Target Sectors',
    },
    {
      name: 'targetSectors', label: 'Target Sectors', type: 'stringlist',
      placeholder: 'e.g. Textile & Garments',
    },
    {
      name: 'requiredPlatformsHeading', label: 'Required Platforms Label',
      placeholder: 'e.g. Required Platforms',
    },
    {
      name: 'requiredPlatforms', label: 'Required Platforms', type: 'stringlist',
      placeholder: 'e.g. LinkedIn, Instagram, YouTube...',
    },
    {
      name: 'applyNowTitle', label: 'Apply Now Heading',
      placeholder: 'e.g. Apply Now',
    },
    {
      name: 'quotationInstruction', label: 'Quotation Instruction', type: 'textarea',
      placeholder: 'e.g. Submit your Quotation in PDF format including payment terms.',
    },
    {
      name: 'emailHeading', label: 'Email Section Label',
      placeholder: 'e.g. Email Quotation To:',
    },
    {
      name: 'emails', label: 'Email Quotation To (Multiple)', type: 'stringlist',
      placeholder: 'Add email address...',
    },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Vacancies...</div>;

  return (
    <div className="max-w-4xl">
      <ItemModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, data: {}, isEdit: false })}
        title={modal.isEdit ? 'Edit Vacancy' : 'Post New Job Vacancy'}
        fields={vacancyFields}
        initialData={modal.data}
        onSave={handleSave}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Hiring & Careers</h3>
          <p className="text-slate-500 font-medium">Manage job opportunities and contract roles</p>
        </div>
        <button onClick={() => openModal()}
          className="flex items-center space-x-3 px-6 py-3 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all font-black">
          <Plus size={20} /><span>Post New Vacancy</span>
        </button>
      </div>

      <SectionEditor title="Active Hiring List">
        <div className="space-y-4">
          {vacancies.map((job) => (
            <div key={job._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-l-8 border-l-rose-500 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h4 className="text-xl font-black text-slate-800">{job.title}</h4>
                    {job.type && (
                      <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                        {job.type}
                      </span>
                    )}
                    {job.campaign && (
                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {(job.campaignHeading || 'CAMPAIGN')}: {job.campaign}
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{job.description}</p>
                </div>
                {/* Actions */}
                <div className="flex gap-1 ml-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(job, true)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(job._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Submission & Contact Info */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {toArr(job.emails).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quotation Emails</p>
                    <p className="text-xs text-rose-600 font-bold">{toArr(job.emails).join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Target Sectors */}
              {toArr(job.targetSectors).length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{job.targetSectorsHeading || 'Target Sectors'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {toArr(job.targetSectors).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                        {i + 1}. {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Platforms */}
              {toArr(job.requiredPlatforms).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{job.requiredPlatformsHeading || 'Required Platforms'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {toArr(job.requiredPlatforms).map((p, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {vacancies.length === 0 && (
            <p className="text-center py-8 text-slate-400 italic">No job openings at present.</p>
          )}
        </div>
      </SectionEditor>
    </div>
  );
};

// ─── PageContentManager ───────────────────────────────────────────────────────
export const PageContentManager = () => (
  <div className="space-y-10">
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600 blur-[120px] opacity-20 rounded-full -mr-32 -mt-32" />
      <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Website Content Hub</h2>
        <p className="text-lg text-slate-400 max-w-2xl font-medium">
          Select a section below to manage the live content of the HC Parekh website.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContentCard title="About & Profile"    description="Edit personal details, bio, and ethics."             to="/about"      icon={Info} />
      <ContentCard title="Contact & Offices"  description="Manage office locations and multiple emails."         to="/contact"    icon={MapPin} />
      <ContentCard title="Services & Rates"   description="Edit professional plans and key points."              to="/services"   icon={Briefcase} />
      <ContentCard title="Corporate Hub"      description="Notices, Tenders, and MOU filings."                  to="/corporate"  icon={Layers} />
      <ContentCard title="Hiring & Careers"   description="Social Media Experts and career opportunities."       to="/hiring"     icon={Plus} />
      <ContentCard title="Circulars"          description="Create and manage official circulars."                to="/circulars"  icon={FileText} />
      <ContentCard title="SEO & Global Meta"  description="Site title, favicon, and keywords."                  to="/settings"   icon={Settings} />
    </div>

    <div className="bg-white p-6 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 tracking-tight">System Integrity Check</h4>
          <p className="text-xs text-slate-500 font-medium italic">All editors are synchronized with Render Cloud Backend.</p>
        </div>
      </div>
      <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
        Verify Now
      </button>
    </div>
  </div>
);

// ─── CircularEditor ──────────────────────────────────────────────────────────
export const CircularEditor = () => {
  const [loading, setLoading] = useState(true);
  const [circulars, setCirculars] = useState([]);
  const [modal, setModal] = useState({ open: false, data: {}, isEdit: false });

  useEffect(() => { fetchCirculars(); }, []);

  const fetchCirculars = async () => {
    try { 
      const res = await corporateApi.getCirculars(); 
      setCirculars(res.data || []); 
    } catch { console.error('Error fetching circulars'); }
    finally { setLoading(false); }
  };

  const handleSave = async (formData) => {
    try {
      if (modal.isEdit && modal.data._id) {
        await corporateApi.updateCircular(modal.data._id, formData);
        alert('Circular updated!');
      } else {
        await corporateApi.addCircular(formData);
        alert('Circular published!');
      }
      fetchCirculars();
    } catch { alert('Failed to save circular'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this circular?')) return;
    try { await corporateApi.deleteCircular(id); fetchCirculars(); }
    catch { alert('Delete failed'); }
  };

  const openModal = (data = {}, isEdit = false) => {
    setModal({
      open: true, isEdit, data: {
        ...data,
        circularNo: data.circularNo || `HCPA / ${new Date().getFullYear()} / `,
        circularDate: data.circularDate || `/  / ${new Date().getFullYear()}`,
        subject: data.subject || '',
        kindAttention: data.kindAttention || '',
        content: data.content || '',
      }
    });
  };

  const circularFields = [
    { name: 'circularNo', label: 'Circular No.', required: true, placeholder: 'HCPA / 2026 / 01' },
    { name: 'circularDate', label: 'Circular Date', required: true, placeholder: '23 / 04 / 2026' },
    { name: 'subject', label: 'Subject', required: true, placeholder: 'Subject of the circular' },
    { name: 'kindAttention', label: 'Kind Attention', placeholder: 'e.g. All Departments' },
    { name: 'content', label: 'Circular Content', type: 'quill', required: true },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Circulars...</div>;

  return (
    <div className="max-w-4xl">
      <ItemModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, data: {}, isEdit: false })}
        title={modal.isEdit ? 'Edit Circular' : 'Add New Circular'}
        fields={circularFields}
        initialData={modal.data}
        onSave={handleSave}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Official Circulars</h3>
          <p className="text-slate-500 font-medium">Manage and publish official company circulars</p>
        </div>
        <button onClick={() => openModal()}
          className="flex items-center space-x-3 px-6 py-3 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all font-black">
          <Plus size={20} /><span>New Circular</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {circulars.map((c) => (
          <div key={c._id} className="bg-white p-5 rounded-2xl border border-slate-200 group hover:border-rose-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{c.subject}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{c.circularNo}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.circularDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(c, true)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
              <button onClick={() => handleDelete(c._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {circulars.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No circulars found. Click 'New Circular' to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── WebMarketEditor ────────────────────────────────────────────────────────
export const WebMarketEditor = () => {
  const [settings, setSettings] = useState({ endUsers: [], serviceProviders: [] });
  const [newOfficial, setNewOfficial] = useState({ authorizedOfficial: '', assessCode: '' });
  const [editingOfficial, setEditingOfficial] = useState(null);
  const [activeTab, setActiveTab] = useState('end-user-enquiry');
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editEnquiry, setEditEnquiry] = useState(null);

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await webMarketApi.getSettings();
      console.log('WebMarket Settings Received:', res.data);
      const data = res.data || {};
      setSettings({
        endUsers: data.endUsers || [],
        serviceProviders: data.serviceProviders || []
      });
    } catch (err) {
      console.error('CRITICAL: Settings fetch failed', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchEnquiries = async (type) => {
    setLoading(true);
    try {
      const res = type === 'end-user' 
        ? await webMarketApi.getEndUserEnquiries() 
        : await webMarketApi.getServiceProviderEnquiries();
      console.log(`WebMarket ${type} Enquiries Received:`, res.data);
      setEnquiries(res.data || []);
    } catch (err) {
      console.error(`CRITICAL: ${type} enquiry fetch failed`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchEnquiries(activeTab === 'end-user-enquiry' ? 'end-user' : 'service-provider');
  }, [activeTab]);

  const categoryKey = activeTab === 'end-user-enquiry' ? 'endUsers' : 'serviceProviders';

  const handleAddOfficial = async () => {
    if (!newOfficial.authorizedOfficial || !newOfficial.assessCode) {
      alert('Fill all fields first.');
      return;
    }
    try {
      const updatedList = [...(settings[categoryKey] || []), newOfficial];
      const updatedSettings = { ...settings, [categoryKey]: updatedList };
      console.log('Updating settings with:', updatedSettings);
      await webMarketApi.updateSettings(updatedSettings);
      setNewOfficial({ authorizedOfficial: '', assessCode: '' });
      await fetchSettings();
      alert('Official registered successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Check console.');
    }
  };

  const handleUpdateOfficial = async () => {
    if (!editingOfficial) return;
    try {
      const updatedList = [...settings[categoryKey]];
      updatedList[editingOfficial.index] = { 
        authorizedOfficial: editingOfficial.authorizedOfficial, 
        assessCode: editingOfficial.assessCode 
      };
      const updatedSettings = { ...settings, [categoryKey]: updatedList };
      await webMarketApi.updateSettings(updatedSettings);
      setEditingOfficial(null);
      await fetchSettings();
      alert('Official updated!');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDeleteOfficial = async (index) => {
    if (!window.confirm('Remove this official? This will prevent them from submitting new forms.')) return;
    try {
      const updatedList = settings[categoryKey].filter((_, i) => i !== index);
      const updatedSettings = { ...settings, [categoryKey]: updatedList };
      await webMarketApi.updateSettings(updatedSettings);
      await fetchSettings();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdateEnquiry = async () => {
    try {
      if (activeTab === 'end-user-enquiry') {
        await webMarketApi.updateEndUserEnquiry(editEnquiry._id, editEnquiry);
      } else {
        await webMarketApi.updateServiceProviderEnquiry(editEnquiry._id, editEnquiry);
      }
      alert('Record updated!');
      setEditEnquiry(null);
      fetchEnquiries(activeTab === 'end-user-enquiry' ? 'end-user' : 'service-provider');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Permanently delete this submission?')) return;
    try {
      if (activeTab === 'end-user-enquiry') await webMarketApi.deleteEndUserEnquiry(id);
      else await webMarketApi.deleteServiceProviderEnquiry(id);
      fetchEnquiries(activeTab === 'end-user-enquiry' ? 'end-user' : 'service-provider');
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">HCP Web Market</h2>
            <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Personnel Authorization & Enquiries</p>
          </div>
          <button onClick={() => setShowDiagnostics(!showDiagnostics)} className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
            <Settings size={16} />
          </button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => setActiveTab('end-user-enquiry')} 
            className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${activeTab === 'end-user-enquiry' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-500 hover:text-slate-700'}`}>End-Users</button>
          <button onClick={() => setActiveTab('provider-enquiry')} 
            className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${activeTab === 'provider-enquiry' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-700'}`}>Providers</button>
        </div>
      </div>

      {showDiagnostics && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-slate-900 rounded-2xl font-mono text-[10px] text-emerald-400 overflow-x-auto">
          <p className="mb-2 text-slate-500 font-bold uppercase tracking-widest">// RAW SETTINGS DATA</p>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
          <p className="my-2 text-slate-500 font-bold uppercase tracking-widest">// ACTIVE TAB: {activeTab}</p>
          <p className="text-slate-500 font-bold uppercase tracking-widest">// ENQUIRY COUNT: {enquiries.length}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          
          {/* ─── Manage Officials Section ─── */}
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${activeTab === 'end-user-enquiry' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight">Manage {activeTab === 'end-user-enquiry' ? 'End-User' : 'Provider'} Officials</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Add or update authorized personnel codes</p>
                </div>
              </div>
              {settingsLoading && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editingOfficial ? 'Update Personnel' : 'Add New Personnel'}</h5>
                <div className="space-y-3">
                  <input className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:border-blue-400 transition-all shadow-sm"
                    placeholder="Full Official Name"
                    value={editingOfficial ? editingOfficial.authorizedOfficial : newOfficial.authorizedOfficial} 
                    onChange={e => editingOfficial 
                      ? setEditingOfficial({...editingOfficial, authorizedOfficial: e.target.value}) 
                      : setNewOfficial({...newOfficial, authorizedOfficial: e.target.value})} />
                  <input className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-sm focus:border-blue-400 transition-all shadow-sm"
                    placeholder="Access / Assess Code"
                    value={editingOfficial ? editingOfficial.assessCode : newOfficial.assessCode} 
                    onChange={e => editingOfficial 
                      ? setEditingOfficial({...editingOfficial, assessCode: e.target.value}) 
                      : setNewOfficial({...newOfficial, assessCode: e.target.value})} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={editingOfficial ? handleUpdateOfficial : handleAddOfficial} 
                    className={`flex-1 py-4 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all ${activeTab === 'end-user-enquiry' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                    {editingOfficial ? 'Update Codes' : 'Save Personnel'}
                  </button>
                  {editingOfficial && (
                    <button onClick={() => setEditingOfficial(null)} className="px-4 py-4 bg-white text-slate-400 border border-slate-200 rounded-xl font-black uppercase text-[10px] hover:bg-slate-50 transition-all">Cancel</button>
                  )}
                </div>
              </div>

              {/* List Section */}
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
                {settingsLoading ? (
                  <div className="col-span-full p-10 flex items-center justify-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                    Loading personnel list...
                  </div>
                ) : (settings[categoryKey] || []).length > 0 ? (
                  (settings[categoryKey] || []).map((official, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm group hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs ${activeTab === 'end-user-enquiry' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                          {index + 1}
                        </div>
                        <div className="max-w-[180px]">
                          <h4 className="font-black text-slate-800 uppercase tracking-tight text-xs truncate">{official.authorizedOfficial}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Code:</span>
                            <span className="text-[10px] text-emerald-600 font-black font-mono">{official.assessCode}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingOfficial({ ...official, index })} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteOfficial(index)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No officials found in this category</p>
                    <p className="text-slate-400 text-[10px] mt-2 italic">Please add an authorized person to enable form submissions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Submissions List Section ─── */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{activeTab === 'end-user-enquiry' ? 'End-User Enquiries' : 'Provider Enquiries'}</h3>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Filter by Official Name..."
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-400 w-full md:w-64"
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setEnquiries(prev => prev.map(enq => ({
                      ...enq,
                      _hidden: !enq.authorizedOfficial?.toLowerCase().includes(term) && !enq.name?.toLowerCase().includes(term)
                    })));
                  }}
                />
                <button onClick={() => fetchEnquiries(activeTab === 'end-user-enquiry' ? 'end-user' : 'service-provider')} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase hover:underline shrink-0">
                  <Settings size={12} className="animate-spin-slow" /> Refresh Data
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="p-20 text-center space-y-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 font-bold italic text-sm">Synchronizing...</p>
              </div>
            ) : enquiries.filter(e => !e._hidden).length === 0 ? (
              <div className="p-16 text-center space-y-6 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <FileText size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 font-black uppercase text-sm tracking-tight">No Submissions Found</p>
                  <p className="text-slate-300 text-xs font-medium max-w-xs mx-auto">Try adjusting your filter or registering new officials above.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {enquiries.filter(e => !e._hidden).map(enq => (
                  <div key={enq._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-black text-slate-800 uppercase tracking-tight text-lg">{enq.name}</h4>
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">{new Date(enq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold tracking-tight">{enq.email} <span className="mx-2 text-slate-200">|</span> {enq.contactNo}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button title="Edit Submission" onClick={() => setEditEnquiry(enq)} className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm">
                          <Edit size={20} />
                        </button>
                        <button title="Delete Submission" onClick={() => handleDeleteEnquiry(enq._id)} className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm">
                          <Trash2 size={20} />
                        </button>
                        <button title="View Details" onClick={() => setSelectedEnquiry(selectedEnquiry === enq._id ? null : enq._id)} 
                          className={`p-3 rounded-xl transition-all ${selectedEnquiry === enq._id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100'}`}>
                          <Info size={20} />
                        </button>
                      </div>
                    </div>
                    
                    {selectedEnquiry === enq._id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-6 border-t border-slate-50 overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-[11px] font-bold">
                          <div className="space-y-1">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Category</span>
                            <span className="text-slate-800 uppercase">{enq.category || 'Professional'}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Membership</span>
                            <span className="text-slate-800 uppercase">{enq.membershipType}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Record ID</span>
                            <span className="text-slate-400 font-mono text-[9px]">{enq._id}</span>
                          </div>
                          <div className="col-span-full sm:col-span-2 space-y-1">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Registered Address</span>
                            <span className="text-slate-600 font-medium text-xs leading-relaxed block">{enq.address || enq.businessAddress}</span>
                          </div>
                          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization Used</span>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600 font-black text-[10px]">{enq.authorizedOfficial}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-500 font-mono text-[9px]">{enq.assessCode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 space-y-3">
                          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected Services / Expertise</span>
                          <div className="flex flex-wrap gap-2">
                            {(enq.itServicesRequired || enq.itServicesOffered || []).length > 0 ? (
                              (enq.itServicesRequired || enq.itServicesOffered || []).map((s, i) => (
                                <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tight border border-blue-100">{s}</span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic text-xs">No specific services selected</span>
                            )}
                          </div>
                        </div>

                        {enq.paymentTerms && (
                          <div className="mt-8 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</span>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{enq.paymentTerms}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Edit Submission Modal */}
      <AnimatePresence>
        {editEnquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditEnquiry(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                    <Edit size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Edit Record</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Modifying Submission Details</p>
                  </div>
                </div>
                <button onClick={() => setEditEnquiry(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Client Full Name</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all"
                      value={editEnquiry.name} onChange={e => setEditEnquiry({...editEnquiry, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all"
                      value={editEnquiry.contactNo} onChange={e => setEditEnquiry({...editEnquiry, contactNo: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all"
                      value={editEnquiry.email} onChange={e => setEditEnquiry({...editEnquiry, email: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registered Address</label>
                    <textarea rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all resize-none"
                      value={editEnquiry.address || editEnquiry.businessAddress} 
                      onChange={e => setEditEnquiry({...editEnquiry, [editEnquiry.address ? 'address' : 'businessAddress']: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Membership Status</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all"
                      value={editEnquiry.membershipType} onChange={e => setEditEnquiry({...editEnquiry, membershipType: e.target.value})}>
                      {['Eco', 'Silver Membership', 'Gold Membership', 'Platinum Membership'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Technical Staff</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-400 transition-all"
                      value={editEnquiry.technicalStaffCount || ''} onChange={e => setEditEnquiry({...editEnquiry, technicalStaffCount: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={handleUpdateEnquiry} className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Apply Changes</button>
                <button onClick={() => setEditEnquiry(null)} className="px-8 py-5 bg-white text-slate-400 border border-slate-200 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

