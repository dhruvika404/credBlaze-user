import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './userStories.module.scss';
import StoryPreview from '../storyPreview';
import { getStoryAds } from '@/services/ads';

export default function UserStories() {
    const viewportRef = useRef(null);
    const [stories, setStories] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString.replace(' ', 'T'));
        const diffInSeconds = Math.floor((now - past) / 1000);

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return 'Just now';

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    };

    useEffect(() => {
        const fetchStoryAds = async () => {
            try {
                const response = await getStoryAds();
                if (response.success && response.data) {
                    const clientStories = response.data.map((client, index) => {
                        return {
                            id: client.client_id || `client-${index}`,
                            username: client.client_name,
                            avatar: client.client_profile,
                            seen: client.all_seen,
                            items: (client.ads || []).map((ad) => {
                                return {
                                    id: ad.id,
                                    image: ad.ad_file,
                                    type: 'image',
                                    time: formatRelativeTime(ad.created_at),
                                    link: ad.destination_link,
                                    isAd: true,
                                    seen: ad.seen
                                };
                            })
                        };
                    });
                    setStories(clientStories);
                }
            } catch (error) {
                console.error('Error fetching story ads:', error);
            }
        };
        fetchStoryAds();
    }, []);

    const handleStoryClick = (index) => {
        setSelectedStoryIndex(index);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
    };

    return (
        <>
            <div className={styles.userStories}>
                <div className={styles.storiesViewport} ref={viewportRef}>
                    <motion.div
                        className={styles.storiesTrack}
                        drag="x"
                        dragConstraints={viewportRef}
                        dragElastic={0.08}
                        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                        whileTap={{ cursor: 'grabbing' }}
                        style={{ cursor: 'grab' }}
                    >
                        {stories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                className={styles.storyItem}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                onClick={() => handleStoryClick(index)}
                            >
                                <div
                                    className={`${styles.avatarRing} ${story.seen ? styles.seen : ''}`}
                                >
                                    <div className={styles.avatarInner}>
                                        <img
                                            src={story.avatar}
                                            alt={story.username}
                                            className={styles.avatarImage}
                                            draggable={false}
                                        />
                                    </div>
                                </div>
                                <span className={styles.username}>{story.username}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {isPreviewOpen && (
                    <StoryPreview
                        stories={stories}
                        onClose={handleClosePreview}
                        initialIndex={selectedStoryIndex}
                        onStorySeen={(adId) => {
                            setStories(prev => prev.map(story => ({
                                ...story,
                                items: story.items.map(item =>
                                    item.id === adId ? { ...item, seen: true } : item
                                )
                            })));
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
