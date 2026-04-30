'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './payoutAccounts.module.scss';
import Button from '@/components/button';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import MoreIcon from '@/icons/moreIcon';
import EditOutline from '@/icons/editOutline';
import RemoveIcon from '@/icons/removeIcon';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { getBankList, createBank, updateBank, deleteBank } from '@/services/bank';
import LogoutModal from '@/components/modal/logoutModal';

const HomeImage = '/assets/images/home.svg';
const AddIcon = '/assets/icons/add.svg';

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'Savings Account', label: 'Savings Account' },
  { value: 'Current Account', label: 'Current Account' },
  { value: 'Salary Account', label: 'Salary Account' },
];

const EMPTY_FORM = {
  account_holder_name: '',
  bank_name: '',
  account_number: '',
  account_type: '',
  IFSC_code: '',
  branch_name: '',
  is_default: false,
};

const onlyLetters = (v) => v.replace(/[^a-zA-Z\s]/g, '');
const onlyDigits = (v) => v.replace(/\D/g, '');
const ifscFormat = (v) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

function validate(form) {
  const e = {};
  if (!form.account_holder_name.trim()) e.account_holder_name = 'Account holder name is required';
  else if (form.account_holder_name.trim().length < 3) e.account_holder_name = 'Minimum 3 characters required';

  if (!form.bank_name.trim()) e.bank_name = 'Bank name is required';
  else if (form.bank_name.trim().length < 2) e.bank_name = 'Minimum 2 characters required';

  if (!form.account_number.trim()) e.account_number = 'Account number is required';
  else if (form.account_number.length < 9) e.account_number = 'Minimum 9 digits required';
  else if (form.account_number.length > 18) e.account_number = 'Maximum 18 digits allowed';

  if (!form.account_type) e.account_type = 'Account type is required';

  if (!form.IFSC_code.trim()) e.IFSC_code = 'IFSC code is required';
  else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.IFSC_code)) e.IFSC_code = 'Enter a valid IFSC code (e.g. HDFC0001234)';

  if (!form.branch_name.trim()) e.branch_name = 'Branch name is required';
  else if (form.branch_name.trim().length < 2) e.branch_name = 'Minimum 2 characters required';

  return e;
}

// API returns { success, message, data: [...] }
function normaliseList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.payload)) return res.payload;
  return [];
}

export default function PayoutAccounts() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, bank: null });
  const menuRef = useRef(null);

  const fetchBanks = () => {
    setLoading(true);
    getBankList()
      .then((res) => setBanks(normaliseList(res)))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const set = (field, sanitise) => (v) => {
    let val = typeof v === 'object' && v?.target ? v.target.value : v;
    if (sanitise) val = sanitise(val);
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (bank) => {
    setForm({
      account_holder_name: bank.account_holder_name || '',
      bank_name: bank.bank_name || '',
      account_number: bank.account_number || '',
      account_type: bank.account_type || '',
      IFSC_code: bank.IFSC_code || '',
      branch_name: bank.branch_name || '',
      is_default: bank.is_default || false,
    });
    setErrors({});
    setEditingId(bank.id);
    setShowForm(true);
    setOpenMenuId(null);
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
        await updateBank(editingId, form);
        toast.success('Bank account updated');
      } else {
        await createBank(form);
        toast.success('Bank account added');
      }
      fetchBanks();
      handleCancel();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (bank) => {
    if (bank.is_default) return;
    try {
      await updateBank(bank.id, { is_default: true });
      setBanks((prev) => prev.map((b) => ({ ...b, is_default: b.id === bank.id })));
    } catch {
    }
  };

  const handleDelete = async (id) => {
    if (banks.length > 1) {
      const target = banks.find((b) => b.id === id);
      if (target?.is_default) {
        toast.error('Cannot delete the default account. Set another account as default first');
        return;
      }
    }
    setDeletingId(id);
    setOpenMenuId(null);
    try {
      await deleteBank(id);
      toast.success('Bank account removed');
      setBanks((prev) => prev.filter((b) => b.id !== id));
      setDeleteModal({ isOpen: false, id: null });
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const selectedAccountType = ACCOUNT_TYPE_OPTIONS.find((o) => o.value === form.account_type) || null;

  if (!loading && banks.length === 0 && !showForm) {
    return (
      <div className={styles.payoutAccounts}>
        <div className={styles.iconCenter}>
          <img src={HomeImage} alt="No payment method" />
        </div>
        <h3>No payment method</h3>
        <p>No payment method selected / No available payment methods</p>
        <div className={styles.buttonCenter}>
          <Button text="Add New Payout Method" iconwithText icon={AddIcon} onClick={openAdd} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.payoutAccountsWrapper}>
      <div className={styles.outlinebox}>

        <div className={styles.header}>
          <div>
            <h2>{showForm ? (editingId ? 'Edit bank account' : 'Add new bank account') : 'Payout Methods'}</h2>
            {!showForm && <p>Add Bank Accounts for withdrawals.</p>}
          </div>
          {!showForm && (
            <Button text="Add New Payout Method" iconwithText icon={AddIcon} onClick={openAdd} />
          )}
        </div>

        {loading && <p className={styles.loadingText}>Loading...</p>}

        {!loading && !showForm && (
          <div className={styles.bankList}>
            {banks.map((bank) => {
              const num = String(bank.account_number);
              const masked = '*'.repeat(Math.max(0, num.length - 4)) + num.slice(-4);
              return (
                <div key={bank.id} className={styles.bankCard}>
                  <div className={styles.left}>
                    <div
                      className={classNames(styles.checkbox, bank.is_default ? styles.checked : '')}
                      onClick={() => handleSetDefault(bank)}
                    >
                      {bank.is_default && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.info}>
                      <h3>{bank.bank_name}</h3>
                      <p>{masked}</p>
                    </div>
                  </div>
                  <div
                    className={styles.right}
                    ref={openMenuId === bank.id ? menuRef : null}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === bank.id ? null : bank.id);
                    }}
                  >
                    <MoreIcon />
                    {openMenuId === bank.id && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.menuItem} onClick={() => {
                          setViewModal({ isOpen: true, bank });
                          setOpenMenuId(null);
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>View Details</span>
                        </div>
                        <div className={styles.menuItem} onClick={() => openEdit(bank)}>
                          <EditOutline />
                          <span>Edit Account</span>
                        </div>
                        <div
                          className={classNames(styles.menuItem, styles.delete)}
                          onClick={() => setDeleteModal({ isOpen: true, id: bank.id })}
                          style={{ cursor: 'pointer' }}
                        >
                          <RemoveIcon />
                          <span>Delete Account</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className={styles.formGrid}>
            <Input labelChange required label="Account Holder Name" placeholder="e.g. Naitik Kumar"
              value={form.account_holder_name} onChange={set('account_holder_name', onlyLetters)}
              error={errors.account_holder_name} maxLength={50} />
            <Input labelChange required label="Bank Name" placeholder="e.g. HDFC Bank"
              value={form.bank_name} onChange={set('bank_name', onlyLetters)}
              error={errors.bank_name} maxLength={50} />
            <Input labelChange required label="Account Number" placeholder="e.g. 245445555"
              value={form.account_number} onChange={set('account_number', onlyDigits)}
              error={errors.account_number} maxLength={18} inputMode="numeric" />
            <Dropdown labelChange required label="Account Type" options={ACCOUNT_TYPE_OPTIONS}
              placeholder="Select account type" value={selectedAccountType}
              onChange={(opt) => { setForm((f) => ({ ...f, account_type: opt?.value || '' })); setErrors((e) => { const n = { ...e }; delete n.account_type; return n; }); }}
              error={errors.account_type} />
            <Input labelChange required label="IFSC Code" placeholder="e.g. HDFC0001234"
              value={form.IFSC_code} onChange={set('IFSC_code', ifscFormat)}
              error={errors.IFSC_code} maxLength={11} />
            <Input labelChange required label="Branch Name" placeholder="e.g. Connaught Place"
              value={form.branch_name} onChange={set('branch_name', onlyLetters)}
              error={errors.branch_name} maxLength={60} />
          </div>
        )}
      </div>

      {showForm && (
        <div className={styles.boxFooter}>
          <Button text="Cancel" lightbutton onClick={handleCancel} />
          <Button text={saving ? 'Saving...' : editingId ? 'Update' : 'Submit'} onClick={handleSave} disabled={saving} />
        </div>
      )}

      <LogoutModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Bank Account"
        description="Are you sure you want to delete this bank account?"
        confirmText="Yes, Delete"
        loading={deletingId === deleteModal.id}
        isDanger={true}
      />

      {viewModal.isOpen && viewModal.bank && (
        <div className={styles.viewModalWrapper} onClick={() => setViewModal({ isOpen: false, bank: null })}>
          <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.viewModalHeader}>
              <h2>Bank Account Details</h2>
              <button onClick={() => setViewModal({ isOpen: false, bank: null })} className={styles.closeBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.viewModalContent}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Account Holder Name</span>
                <span className={styles.value}>{viewModal.bank.account_holder_name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Bank Name</span>
                <span className={styles.value}>{viewModal.bank.bank_name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Account Number</span>
                <span className={styles.value}>{viewModal.bank.account_number}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Account Type</span>
                <span className={styles.value}>{viewModal.bank.account_type}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>IFSC Code</span>
                <span className={styles.value}>{viewModal.bank.IFSC_code}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Branch Name</span>
                <span className={styles.value}>{viewModal.bank.branch_name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Default Account</span>
                <span className={styles.value}>{viewModal.bank.is_default ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
