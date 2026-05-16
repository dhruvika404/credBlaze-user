import React, { useMemo, useState } from 'react'
import styles from './benefitsSection.module.scss';
import Button from '@/components/button';
import CopyIcon from '@/icons/copyIcon';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TelegramShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    RedditIcon,
    EmailIcon,
    TelegramIcon,
    LinkedinIcon,
} from 'react-share';

export default function BenefitsSection() {
    const { user } = useAuth();
    const [isShareEnabled, setIsShareEnabled] = useState(false);

    const referralLink = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const code = user?.referralCode ?? '';
        if (!code) return `${origin}/signup`;
        return `${origin}/signup?referral_code=${code}`;
    }, [user]);

    const shareTitle = 'Join CradeBlaze and win assured money!';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied to clipboard!');
    };

    const handleShare = () => {
        setIsShareEnabled(true);
    };

    const handlePlatformClick = () => {
        setIsShareEnabled(false);
    };

    const sharePlatforms = [
        { Button: WhatsappShareButton, Icon: WhatsappIcon, label: 'WhatsApp', color: '#65D072' },
        { Button: FacebookShareButton, Icon: FacebookIcon, label: 'Facebook', color: '#425893' },
        { Button: TwitterShareButton, Icon: TwitterIcon, label: 'Twitter', color: '#4D9FEB' },
        { Button: EmailShareButton, Icon: EmailIcon, label: 'Email', color: '#888888' },
        { Button: RedditShareButton, Icon: RedditIcon, label: 'Reddit', color: '#FF4500' },
        { Button: TelegramShareButton, Icon: TelegramIcon, label: 'Telegram', color: '#0088cc' },
        { Button: LinkedinShareButton, Icon: LinkedinIcon, label: 'LinkedIn', color: '#0077b5' },
    ];

    return (
        <div className={styles.benefitsSection}>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <div className={styles.referEarn}>
                        <h3>
                            Refer & Earn
                        </h3>
                        <p>
                            Invite your friends win assured money
                        </p>
                    </div>
                    <div className={styles.referralLink}>
                        <span>Your Referral Link</span>
                        <div className={styles.inputButton}>
                            <div className={styles.inputRelative}>
                                <input
                                    type='text'
                                    readOnly
                                    value={referralLink}
                                    placeholder='Loading referral link...'
                                />
                                <div className={styles.iconAlign} onClick={handleCopyLink} style={{ cursor: 'pointer' }}>
                                    <CopyIcon />
                                </div>
                            </div>
                            <Button text="Share Link" onClick={handleShare} />
                        </div>
                    </div>
                    <div className={styles.shareViaText}>
                        <p>
                            Share via:
                        </p>
                        <div className={styles.iconAlignment}>
                            {
                                sharePlatforms.map((platform, index) => {
                                    const PlatformButton = platform.Button;
                                    const PlatformIcon = platform.Icon;
                                    return (
                                        <div className={`${styles.iconText} ${!isShareEnabled ? styles.disabled : ''}`} key={index}>
                                            <div className={styles.iconCenter}>
                                                <PlatformButton url={referralLink} title={shareTitle} onClick={handlePlatformClick}>
                                                    <PlatformIcon size={48} round iconFillColor="white" bgStyle={{ fill: platform.color }} />
                                                </PlatformButton>
                                            </div>
                                            <p>
                                                {platform.label}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.referEarn}>
                        <h3>
                            Invite & Earn Benefits
                        </h3>
                        <p>
                            Share your referral link and earn when friends join and participate.
                        </p>
                    </div>
                    <div className={styles.benefits}>
                        <h3>
                            🎁 Benefits
                        </h3>
                        <ul>
                            <li>Earn instant rewards through daily spins and simple activities.</li>
                            <li>Redeem your points for real value like recharges, vouchers, and offers.</li>
                            <li>Increase your earnings with referrals and consistent engagement.</li>
                            <li>Enjoy a fun, interactive experience while maximizing your rewards.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
