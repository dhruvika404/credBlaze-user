'use client';
import React, { useState, useMemo } from 'react'
import styles from './kycAddress.module.scss';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import UploadBox from '@/components/uploadBox';
import CloseDanger from '@/icons/closeDanger';
import Button from '@/components/button';
import { Country, State, City } from 'country-state-city';

export default function KycAddress({ onContinue, onCancel }) {
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    });
    const [uploadedFile, setUploadedFile] = useState(null);

    const countryOptions = useMemo(
        () => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
        []
    );

    const stateOptions = useMemo(() => {
        if (!formData.country) return [];
        return State.getStatesOfCountry(formData.country).map((s) => ({ value: s.isoCode, label: s.name }));
    }, [formData.country]);

    const cityOptions = useMemo(() => {
        if (!formData.country || !formData.state) return [];
        return City.getCitiesOfState(formData.country, formData.state).map((c) => ({ value: c.name, label: c.name }));
    }, [formData.country, formData.state]);

    const selectedCountry = countryOptions.find((c) => c.value === formData.country) || null;
    const selectedState = stateOptions.find((s) => s.value === formData.state) || null;
    const selectedCity = cityOptions.find((c) => c.value === formData.city) || null;

    const handleCountryChange = (opt) => {
        setFormData({ ...formData, country: opt?.value || '', state: '', city: '' });
    };

    const handleStateChange = (opt) => {
        setFormData({ ...formData, state: opt?.value || '', city: '' });
    };

    const handleCityChange = (opt) => {
        setFormData({ ...formData, city: opt?.value || '' });
    };

    const handleFileUpload = (file) => {
        if (file && !uploadedFile) {
            setUploadedFile({
                file: file,
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            });
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    const isFormValid = () => {
        return formData.address &&
            formData.city &&
            formData.state &&
            formData.country &&
            formData.zipCode &&
            uploadedFile;
    };

    const handleContinue = () => {
        if (isFormValid()) {
            const addressData = {
                address_proof: uploadedFile.file,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.zipCode,
                country: formData.country
            };
            onContinue(addressData);
        }
    };

    return (
        <div className={styles.kycAddress}>
            <div className={styles.kycAddressHeader}>
                <div className={styles.counter}>3</div>
                <div>
                    <h2>
                        Address
                    </h2>
                    <p>
                        Submit your address with address proof
                    </p>
                </div>
            </div>
            <div className={styles.kycAddressBody}>
                <Input
                    label='Address'
                    labelChange
                    placeholder='Enter address'
                    value={formData.address}
                    onChange={(value) => setFormData({ ...formData, address: value })}
                />
                <div className={styles.twocol}>
                    <Dropdown
                        label='Country'
                        labelChange
                        required
                        options={countryOptions}
                        searchable
                        placeholder='Select the country'
                        value={selectedCountry}
                        onChange={handleCountryChange}
                    />
                    <Dropdown
                        label='State'
                        labelChange
                        required
                        options={stateOptions}
                        searchable
                        placeholder={formData.country ? 'Select the state' : 'Select country first'}
                        value={selectedState}
                        onChange={handleStateChange}
                    />
                    <Dropdown
                        label='City'
                        labelChange
                        required
                        options={cityOptions}
                        searchable
                        placeholder={formData.state ? 'Select the city' : 'Select state first'}
                        value={selectedCity}
                        onChange={handleCityChange}
                    />
                    <Input
                        label='Zip Code'
                        labelChange
                        placeholder='Enter Zip Code'
                        value={formData.zipCode}
                        onChange={(value) => setFormData({ ...formData, zipCode: value })}
                    />
                </div>
                <div className={styles.content}>
                    <UploadBox 
                        onFileSelect={handleFileUpload}
                        disabled={uploadedFile !== null}
                        showPreview={false}
                    />
                    {uploadedFile && (
                        <div className={styles.uploadList}>
                            <div className={styles.proof}>
                                <div className={styles.image}>
                                    <img 
                                        src={URL.createObjectURL(uploadedFile.file)} 
                                        alt="Uploaded document"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                                <div className={styles.content}>
                                    <div>
                                        <h3>{uploadedFile.name}</h3>
                                        <p>{uploadedFile.size}</p>
                                    </div>
                                    <div className={styles.close} onClick={handleRemoveFile}>
                                        <CloseDanger />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={styles.buttonGrid}>
                        <Button text="Cancel" lightbutton onClick={onCancel} />
                        <Button
                            text="Finish KYC"
                            onClick={handleContinue}
                            disabled={!isFormValid()}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
