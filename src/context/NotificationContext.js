'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [unseenCount, setUnseenCount] = useState(0);
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL;
    const ws = useRef(null);

    useEffect(() => {
        // Only connect if user is logged in and has an ID
        if (user?.user_id) {
            const userId = user.user_id;
            // Remove trailing slash if present to avoid double slashes
            const baseWsUrl = socketUrl.endsWith('/') ? socketUrl.slice(0, -1) : socketUrl;
            let wsUrl = `${baseWsUrl}/ws/${userId}`;
            
            if (wsUrl.startsWith('http://')) {
                wsUrl = wsUrl.replace('http://', 'ws://');
            } else if (wsUrl.startsWith('https://')) {
                wsUrl = wsUrl.replace('https://', 'wss://');
            }
            // Force wss:// if the current page is loaded over https:// (to prevent Mixed Content errors)
            if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
                wsUrl = wsUrl.replace('ws://', 'wss://');
            }

            console.log(`Connecting to WebSocket: ${wsUrl}`);
            ws.current = new WebSocket(wsUrl);

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Flexible parsing to catch the count from various common structures
                    // Listening for 'get_unseen_count' as the primary event name
                    const isCorrectEvent = data?.type === 'get_unseen_count' ||
                        data?.event === 'get_unseen_count' ||
                        data?.type === 'unseen_count';

                    if (isCorrectEvent) {
                        const count = data?.count ?? data?.unseen_count ?? data?.data?.count;
                        if (count !== undefined) {
                            setUnseenCount(Number(count));
                        }
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.current.onopen = () => {
                // Request initial unseen count
                if (ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'get_unseen_count' }));
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.current.onclose = () => {
                console.log('WebSocket connection closed');
            };

            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }
    }, [user?.user_id, socketUrl]);

    const fetchUnseenCount = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'get_unseen_count' }));
        }
    };

    return (
        <NotificationContext.Provider value={{ unseenCount, setUnseenCount, fetchUnseenCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
