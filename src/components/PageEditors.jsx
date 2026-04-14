import React, { useState, useEffect } from 'react';
import {
  MapPin, Briefcase, Settings, Info, Save, Plus, Trash2,
  ChevronRight, GripVertical, Layers, FileCode, ShieldCheck,
  BellRing, X, Edit,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contentApi, corporateApi, workforceApi } from '../api';

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
      // Send both title and name/description to prevent 400 errors from older remote backend
      await contentApi.addService({ 
        title: input.trim(),
        name: input.trim(),
        description: 'Added via rapid list'
      });
      setInput('');
      fetchServices();
    } catch { alert('Failed to add service'); }
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
          {services.map((svc, i) => (
            <div key={svc._id || i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-rose-200 transition-all">
              <span className="text-xs font-black text-slate-400 w-5 text-right shrink-0">{i + 1}.</span>
              <div className="flex-1 text-sm font-bold text-slate-800">
                {svc.title || svc.name}
              </div>
              <button 
                onClick={() => handleDelete(svc._id)} 
                className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                title="Delete Service"
              >
                <Trash2 size={16} />
              </button>
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
      { name: 'projectLocations', label: 'Project Locations',          type: 'stringlist', placeholder: 'Add location (e.g. Surat)...' },
      { name: 'targetSectors',    label: 'Target Sectors',             type: 'stringlist', placeholder: 'Add sector...' },
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
      submissionNotes:  toArr(formData.submissionNotes),
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
        submissionNotes:  toArr(data.submissionNotes),
      }
    });
  };

  const vacancyFields = [
    {
      name: 'title', label: 'Job Title',
      placeholder: 'e.g. Social Media Influencer', required: true,
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
      name: 'targetSectors', label: 'Target Sectors', type: 'stringlist',
      placeholder: 'e.g. Textile & Garments',
    },
    {
      name: 'requiredPlatforms', label: 'Required Platforms', type: 'stringlist',
      placeholder: 'e.g. LinkedIn, Instagram, YouTube...',
    },
    {
      name: 'submissionNotes', label: 'Submission Notes', type: 'stringlist',
      placeholder: 'e.g. Quotation in PDF format...',
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
                        {job.campaign}
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

              {/* Target Sectors */}
              {toArr(job.targetSectors).length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Sectors</p>
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Required Platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {toArr(job.requiredPlatforms).map((p, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Notes */}
              {toArr(job.submissionNotes).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Submission Notes</p>
                  <ul className="space-y-0.5">
                    {toArr(job.submissionNotes).map((n, i) => (
                      <li key={i} className="text-xs text-slate-500 font-medium">• {n}</li>
                    ))}
                  </ul>
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
          Select a section below to manage the live content of the HC website.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContentCard title="About & Profile"    description="Edit personal details, bio, and ethics."             to="/about"      icon={Info} />
      <ContentCard title="Contact & Offices"  description="Manage office locations and multiple emails."         to="/contact"    icon={MapPin} />
      <ContentCard title="Services & Rates"   description="Edit professional plans and key points."              to="/services"   icon={Briefcase} />
      <ContentCard title="Corporate Hub"      description="Notices, Tenders, and MOU filings."                  to="/corporate"  icon={Layers} />
      <ContentCard title="Hiring & Careers"   description="Social Media Experts and career opportunities."       to="/hiring"     icon={Plus} />
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
