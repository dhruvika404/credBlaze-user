import React from 'react'
import styles from './uploadBox.module.scss';
import DragFileIcon from '@/icons/dragFileIcon';
export default function UploadBox() {
    return (
        <div className={styles.uploadBox}>
            <div>
                <div className={styles.iconCenter}>
                    <DragFileIcon />
                </div>
                <p>
                    Click to upload or drag and drop
                </p>
                <span>
                    Aadhaar, PAN, Passport, or Driver's License
                </span>
            </div>
        </div>
    )
}
