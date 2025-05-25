import { useState, useEffect, useCallback } from 'react';
import { fetchUserInfo } from '../api/apiClient';

interface UserInfo {
    CreatedAt: string;
    Email: string;
    Username: string;
}

interface CachedUserInfo {
    data: UserInfo;
    timestamp: number;
    userID: string;
}

const USER_INFO_CACHE_KEY = 'userInfo_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get user ID from localStorage
    const getUserID = useCallback(() => {
        return localStorage.getItem('userID')?.toUpperCase() || '';
    }, []);

    // Check if cached data is still valid
    const isCacheValid = useCallback((cachedData: CachedUserInfo, currentUserID: string): boolean => {
        const now = Date.now();
        const isNotExpired = (now - cachedData.timestamp) < CACHE_DURATION;
        const isSameUser = cachedData.userID === currentUserID;
        return isNotExpired && isSameUser;
    }, []);

    // Get cached user info from localStorage
    const getCachedUserInfo = useCallback((userID: string): UserInfo | null => {
        try {
            const cached = localStorage.getItem(USER_INFO_CACHE_KEY);
            if (cached) {
                const cachedData: CachedUserInfo = JSON.parse(cached);
                if (isCacheValid(cachedData, userID)) {
                    return cachedData.data;
                }
            }
        } catch (error) {
            console.error('Error reading cached user info:', error);
        }
        return null;
    }, [isCacheValid]);

    // Save user info to localStorage cache
    const setCachedUserInfo = useCallback((data: UserInfo, userID: string) => {
        try {
            const cacheData: CachedUserInfo = {
                data,
                timestamp: Date.now(),
                userID
            };
            localStorage.setItem(USER_INFO_CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error caching user info:', error);
        }
    }, []);

    // Clear cached user info
    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(USER_INFO_CACHE_KEY);
        } catch (error) {
            console.error('Error clearing user info cache:', error);
        }
    }, []);

    // Fetch user info from API
    const fetchAndCacheUserInfo = useCallback(async (userID: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchUserInfo(userID);
            console.log('Fetched user info:', data);
            setUserInfo(data);
            setCachedUserInfo(data, userID);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user info';
            setError(errorMessage);
            console.error('Error fetching user info:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setCachedUserInfo]);

    // Refresh user info (force fetch from API)
    const refreshUserInfo = useCallback(async () => {
        const userID = getUserID();
        if (userID) {
            clearCache();
            return await fetchAndCacheUserInfo(userID);
        }
        return null;
    }, [getUserID, clearCache, fetchAndCacheUserInfo]);

    // Main function to get user info (from cache or API)
    const loadUserInfo = useCallback(async () => {
        const userID = getUserID();
        
        if (!userID) {
            setLoading(false);
            setError('No user ID found');
            return;
        }

        // Try to get from cache first
        const cachedInfo = getCachedUserInfo(userID);
        if (cachedInfo) {
            setUserInfo(cachedInfo);
            setLoading(false);
            setError(null);
            return cachedInfo;
        }

        // If not in cache or expired, fetch from API
        return await fetchAndCacheUserInfo(userID);
    }, [getUserID, getCachedUserInfo, fetchAndCacheUserInfo]);

    // Load user info on mount
    useEffect(() => {
        loadUserInfo();
    }, [loadUserInfo]);

    return {
        userInfo,
        loading,
        error,
        refreshUserInfo,
        clearCache,
        userID: getUserID()
    };
}; 