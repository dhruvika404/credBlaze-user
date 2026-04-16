'use client'
import React from 'react'
import styles from './dropdown.module.scss';
import classNames from 'classnames';
import Select, { components } from 'react-select'

const defaultOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
]

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#625F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </components.DropdownIndicator>
    );
};

export default function Dropdown({ labelChange, label, options = defaultOptions, placeholder, defaultValue, onChange, value, name, heightChange, error, searchable, required }) {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: heightChange ? '47px' : '40px',
            minHeight: heightChange ? '47px' : '40px',
            borderRadius: '8px',
            border: error ? '1px solid #E53935' : '1px solid #E6E8EA',
            boxShadow: 'none',
            '&:hover': {
                border: error ? '1px solid #E53935' : '1px solid #E6E8EA',
            },
            background: '#FFF',
            fontSize: '14px',
            fontWeight: '400',
            color: '#0E121B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#625F6E',
            fontSize: '14px',
            margin: 0,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#0E121B',
            fontSize: '14px',
            margin: 0,
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: '0 12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '8px',
            border: '1px solid #E6E8EA',
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '4px',
            zIndex: 99,
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            borderRadius: '4px',
            backgroundColor: state.isSelected ? '#F3F4F6' : state.isFocused ? '#F9FAFB' : '#FFF',
            color: '#0E121B',
            cursor: 'pointer',
            padding: '8px 12px',
            '&:active': {
                backgroundColor: '#F3F4F6',
            },
        }),
        input: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
        })
    };

    return (
        <div className={classNames(styles.dropdown, labelChange ? styles.labelChange : '')}>
            {label && (
                <label>
                    {label}
                    {required && <span className={styles.requiredStar} aria-hidden="true"> *</span>}
                </label>
            )}
            <Select
                options={options}
                styles={customStyles}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                value={value}
                name={name}
                isSearchable={!!searchable}
                components={{ DropdownIndicator }}
            />
            {error && (
                <p className={styles.errorMsg} role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}



