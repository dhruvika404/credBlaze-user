'use client';
import React, { useState, useEffect } from 'react';
import styles from './deliveryAddresses.module.scss';
import Button from '@/components/button';
import MapIcon from '@/icons/mapIcon';
import EditOutline from '@/icons/editOutline';
import RemoveIcon from '@/icons/removeIcon';
import Input from '@/components/input';
import toast from 'react-hot-toast';
import { getAddressList, createAddress, updateAddress, deleteAddress } from '@/services/address';

const AddIcon = '/assets/icons/add.svg';

const EMPTY_FORM = {
  first_name: '', last_name: '', phone: '', countryCode: '',
  address: '', city: '', state: '', country: '', zip_code: '', is_default: false,
};

function validate(form) {
  const e = {};
  if (!form.first_name.trim()) e.first_name = 'Required';
  if (!form.last_name.trim()) e.last_name = 'Required';
  if (!form.phone.trim()) e.phone = 'Required';
  if (!form.address.trim()) e.address = 'Required';
  if (!form.city.trim()) e.city = 'Required';
  if (!form.state.trim()) e.state = 'Required';
  if (!form.country.trim()) e.country = 'Required';
  if (!form.zip_code.trim()) e.zip_code = 'Required';
  return e;
}

function normaliseList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.payload)) return res.payload;
  return [];
}

export default function DeliveryAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAddresses = () => {
    setLoading(true);
    getAddressList()
      .then((res) => setAddresses(normaliseList(res)))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const set = (field) => (v) => {
    const val = typeof v === 'object' && v?.target ? v.target.value : v;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setForm({
      first_name: addr.first_name || '',
      last_name: addr.last_name || '',
      phone: addr.phone || '',
      countryCode: addr.countryCode || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      country: addr.country || '',
      zip_code: addr.zip_code || '',
      is_default: addr.is_default || false,
    });
    setErrors({});
    setEditingId(addr.id || addr._id || addr.address_id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success('Address updated');
      } else {
        await createAddress(form);
        toast.success('Address added');
      }
      fetchAddresses();
      handleCancel();
    } catch {
      // toast handled in service
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success('Address removed');
      setAddresses((prev) => prev.filter((a) => (a.id || a._id || a.address_id) !== id));
    } catch {
      // toast handled in service
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.deliveryAddresses}>
      <div className={styles.spacingGrid}>
        <div className={styles.content}>
          <div>
            <h2>Saved Addresses</h2>
            <p>Add new Address and view address</p>
          </div>
          {!showForm && (
            <Button text="Add a new address" iconwithText icon={AddIcon} onClick={openAdd} />
          )}
        </div>

        {loading && <p className={styles.loadingText}>Loading addresses...</p>}

        {!loading && !showForm && addresses.map((addr) => {
          const id = addr.id || addr._id || addr.address_id;
          return (
            <div key={id} className={styles.locationBox}>
              <div className={styles.left}>
                <p>
                  {addr.first_name} {addr.last_name}
                  {addr.is_default && <span> Default</span>}
                </p>
                <div className={styles.location}>
                  <MapIcon />
                  <h6>{addr.address}, {addr.city}, {addr.state} {addr.zip_code}</h6>
                </div>
              </div>
              <div className={styles.right}>
                <span onClick={() => openEdit(addr)}><EditOutline /></span>
                <span
                  onClick={() => deletingId !== id && handleDelete(id)}
                  style={{ opacity: deletingId === id ? 0.5 : 1, cursor: deletingId === id ? 'not-allowed' : 'pointer' }}
                >
                  <RemoveIcon />
                </span>
              </div>
            </div>
          );
        })}

        {!loading && !showForm && addresses.length === 0 && (
          <p className={styles.emptyText}>No saved addresses yet.</p>
        )}

        {showForm && (
          <div className={styles.formBox}>
            <h4>{editingId ? 'Edit Address' : 'Add New Address'}</h4>
            <div className={styles.formGrid}>
              <Input labelChange label="First Name" placeholder="John" value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
              <Input labelChange label="Last Name" placeholder="Doe" value={form.last_name} onChange={set('last_name')} error={errors.last_name} />
              <Input labelChange label="Phone" placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} error={errors.phone} />
              <Input labelChange label="Country Code" placeholder="+1" value={form.countryCode} onChange={set('countryCode')} />
              <Input labelChange label="Address" placeholder="123 Main St" value={form.address} onChange={set('address')} error={errors.address} />
              <Input labelChange label="City" placeholder="New York" value={form.city} onChange={set('city')} error={errors.city} />
              <Input labelChange label="State" placeholder="NY" value={form.state} onChange={set('state')} error={errors.state} />
              <Input labelChange label="Country" placeholder="United States" value={form.country} onChange={set('country')} error={errors.country} />
              <Input labelChange label="Zip Code" placeholder="10001" value={form.zip_code} onChange={set('zip_code')} error={errors.zip_code} />
            </div>
            <label className={styles.defaultCheck}>
              <input type="checkbox" checked={form.is_default} onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))} />
              Set as default address
            </label>
          </div>
        )}
      </div>

      {showForm && (
        <div className={styles.boxFooter}>
          <Button text="Cancel" lightbutton onClick={handleCancel} />
          <Button text={saving ? 'Saving...' : editingId ? 'Update' : 'Save'} onClick={handleSave} disabled={saving} />
        </div>
      )}
    </div>
  );
}
