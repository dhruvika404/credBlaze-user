import React from 'react'
import styles from './contactInformation.module.scss';
import CallIcon from '@/icons/callIcon';
import EmailIcon from '@/icons/emailIcon';
import AddressIcon from '@/icons/addressIcon';

export default function ContactInformation() {
    return (
        <div className={styles.contactInformation}>
            <div className={styles.cardtitle}>
                <h2>
                    Contact Information
                </h2>
            </div>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <CallIcon />
                    <div>
                        <a>+91 123567890</a>
                        <span>
                            Work
                        </span>
                    </div>
                </div>
                <div className={styles.items}>
                    <CallIcon />
                    <div>
                        <a>+91 123567890</a>
                        <span>
                            Personal
                        </span>
                    </div>
                </div>
                <div className={styles.items}>
                    <CallIcon />
                    <div>
                        <a>+91 123567890</a>
                        <span>
                            Office
                        </span>
                    </div>
                </div>
                <div className={styles.items}>
                    <EmailIcon />
                    <div>
                        <a>ana.oliveira@tetrarsalesate.com</a>
                    </div>
                </div>
                <div className={styles.items}>
                    <EmailIcon />
                    <div>
                        <a>www.terrarealesate.com</a>
                    </div>
                </div>
                <div className={styles.items}>
                    <AddressIcon />
                    <div>
                        <a>PO Box: 87211, Office 712, Building 11, Bay Square, Dubai, United Arab Emirates</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
