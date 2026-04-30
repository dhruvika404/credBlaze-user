'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './deliveryAddresses.module.scss';
import Button from '@/components/button';
import MapIcon from '@/icons/mapIcon';
import EditOutline from '@/icons/editOutline';
import RemoveIcon from '@/icons/removeIcon';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import PhoneInput, { parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';
import { getAddressList, createAddress, updateAddress, deleteAddress } from '@/services/address';
import { Country, State, City } from 'country-state-city';
import LogoutModal from '@/components/modal/logoutModal';

const AddIcon = '/assets/icons/add.svg';

const EMPTY_FORM = {
  first_name: '', last_name: '', phone: '', countryCode: '',
  address: '', city: '', state: '', country: '', zip_code: '', is_default: false,
};

function validate(form) {
  const e = {};
  if (!form.first_name.trim()) e.first_name = 'First name is required';
  if (!form.last_name.trim()) e.last_name = 'Last name is required';
  if (!form.phone) e.phone = 'Phone number is required';
  else if (!isValidPhoneNumber(form.phone)) e.phone = 'Enter a valid phone number';
  if (!form.address.trim()) e.address = 'Address is required';
  if (!form.country) e.country = 'Country is required';
  if (!form.state) e.state = 'State is required';
  if (!form.city) e.city = 'City is required';
  if (!form.zip_code.trim()) e.zip_code = 'Zip code is required';
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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const countryOptions = useMemo(
    () => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
    []
  );

  const stateOptions = useMemo(() => {
    if (!form.country) return [];
    return State.getStatesOfCountry(form.country).map((s) => ({ value: s.isoCode, label: s.name }));
  }, [form.country]);

  const cityOptions = useMemo(() => {
    if (!form.country || !form.state) return [];
    return City.getCitiesOfState(form.country, form.state).map((c) => ({ value: c.name, label: c.name }));
  }, [form.country, form.state]);

  const fetchAddresses = () => {
    setLoading(true);
    getAddressList()
      .then((res) => setAddresses(normaliseList(res)))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const set = (field) => (v) => {
    const val = typeof v === 'object' && v?.target ? v.target.value : v;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const handleCountryChange = (opt) => {
    setForm((f) => ({ ...f, country: opt?.value || '', state: '', city: '' }));
    setErrors((e) => { const n = { ...e }; delete n.country; delete n.state; delete n.city; return n; });
  };

  const handleStateChange = (opt) => {
    setForm((f) => ({ ...f, state: opt?.value || '', city: '' }));
    setErrors((e) => { const n = { ...e }; delete n.state; delete n.city; return n; });
  };

  const handleCityChange = (opt) => {
    setForm((f) => ({ ...f, city: opt?.value || '' }));
    setErrors((e) => { if (!e.city) return e; const n = { ...e }; delete n.city; return n; });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    const rawPhone = addr.phone || '';
    const rawCode = addr.countryCode || '';
    const phoneVal = rawCode && rawPhone
      ? (rawCode.startsWith('+') ? rawCode : `+${rawCode}`) + rawPhone
      : rawPhone;

    setForm({
      first_name: addr.first_name || '',
      last_name: addr.last_name || '',
      phone: phoneVal,
      countryCode: rawCode,
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
      let phone = form.phone;
      let countryCode = form.countryCode;
      if (form.phone && isValidPhoneNumber(form.phone)) {
        const parsed = parsePhoneNumber(form.phone);
        countryCode = `+${parsed.countryCallingCode}`;
        phone = parsed.nationalNumber;
      }

      const payload = { ...form, phone, countryCode };

      if (editingId) {
        await updateAddress(editingId, payload);
        toast.success('Address updated');
      } else {
        await createAddress(payload);
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
    if (addresses.length > 1) {
      const target = addresses.find((a) => (a.id || a._id || a.address_id) === id);
      if (target?.is_default) {
        toast.error('Cannot delete the default address. Set another address as default first');
        return;
      }
    }
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success('Address removed');
      setAddresses((prev) => prev.filter((a) => (a.id || a._id || a.address_id) !== id));
      setDeleteModal({ isOpen: false, id: null });
    } catch {
      // toast handled in service
    } finally {
      setDeletingId(null);
    }
  };

  const selectedCountry = countryOptions.find((c) => c.value === form.country) || null;
  const selectedState = stateOptions.find((s) => s.value === form.state) || (form.state ? { value: form.state, label: form.state } : null);
  const selectedCity = cityOptions.find((c) => c.value === form.city) || (form.city ? { value: form.city, label: form.city } : null);

  return (
    <div className={styles.deliveryAddresses}>
      <div className={styles.spacingGrid}>
        <div className={styles.content}>
          <div>
            <h2>{showForm ? (editingId ? 'Edit address' : 'Add a new address') : 'Saved Addresses'}</h2>
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
                  {addr.first_name ? addr.first_name.charAt(0).toUpperCase() + addr.first_name.slice(1) : ''}{' '}
                  {addr.last_name ? addr.last_name.charAt(0).toUpperCase() + addr.last_name.slice(1) : ''}
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
                  onClick={() => setDeleteModal({ isOpen: true, id })}
                  style={{ cursor: 'pointer' }}
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
            <div className={styles.formGrid}>
              {/* Row 1: First Name + Last Name */}
              <Input labelChange required label="First Name" placeholder="Enter first name"
                value={form.first_name} onChange={set('first_name')} error={errors.first_name} maxLength={50} />
              <Input labelChange required label="Last Name" placeholder="Enter last name"
                value={form.last_name} onChange={set('last_name')} error={errors.last_name} maxLength={50} />

              {/* Row 2: Phone number */}
              <div>
                <label className={styles.phoneLabel}>Phone number <span className={styles.requiredStar} aria-hidden="true">*</span></label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  placeholder="Enter your number"
                  value={form.phone || ''}
                  onChange={(val) => {
                    setForm((f) => ({ ...f, phone: val || '' }));
                    setErrors((e) => { if (!e.phone) return e; const n = { ...e }; delete n.phone; return n; });
                  }}
                  className={errors.phone ? styles.phoneInputError : styles.phoneInput}
                />
                {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
              </div>

              <div />

              {/* Row 3: Address (full width) */}
              <div className={styles.fullWidth}>
                <Input labelChange required label="Address" placeholder="Enter address"
                  value={form.address} onChange={set('address')} error={errors.address} maxLength={100} />
              </div>

              {/* Row 4: Country + State */}
              <Dropdown
                labelChange required
                label="Country"
                options={countryOptions}
                searchable
                placeholder="Select country"
                value={selectedCountry}
                onChange={handleCountryChange}
                error={errors.country}
              />
              <Dropdown
                labelChange required
                label="State"
                options={stateOptions}
                searchable
                placeholder={form.country ? 'Select state' : 'Select country first'}
                value={selectedState}
                onChange={handleStateChange}
                error={errors.state}
              />

              {/* Row 5: City + Zip Code */}
              <Dropdown
                labelChange required
                label="City"
                options={cityOptions}
                searchable
                placeholder={form.state ? 'Select city' : 'Select state first'}
                value={selectedCity}
                onChange={handleCityChange}
                error={errors.city}
              />
              <Input labelChange required label="Zip Code" placeholder="Enter Zip Code"
                value={form.zip_code} onChange={set('zip_code')} error={errors.zip_code} maxLength={10} />
            </div>

            <label className={styles.defaultCheck}>
              <input type="checkbox" checked={form.is_default}
                onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))} />
              Make this my default address
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

      <LogoutModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Address"
        description="Are you sure you want to delete this address?"
        confirmText="Yes, Delete"
        loading={deletingId === deleteModal.id}
        isDanger={true}
      />
    </div>
  );
}
