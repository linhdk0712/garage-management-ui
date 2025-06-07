import { AuthData } from '../types/auth.types';

// Storage keys
const AUTH_STORAGE_KEY = 'garage_auth';
const THEME_STORAGE_KEY = 'garage_theme';
const PREFERENCES_STORAGE_KEY = 'garage_preferences';

type ThemeType = 'light' | 'dark' | 'system';

/**
 * Get the stored authentication data
 * @returns Authentication data or null if not found
 */
export const getStoredAuth = (): AuthData | null => {
    try {
        const authData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!authData) return null;

        const parsedData = JSON.parse(authData) as AuthData;
        return parsedData;
    } catch (error: unknown) {
        console.error('Error retrieving auth data from localStorage:', error);
        return null;
    }
};

/**
 * Store authentication data
 * @param authData Authentication data to store
 */
export const setStoredAuth = (authData: AuthData): void => {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error: unknown) {
        console.error('Error storing auth data in localStorage:', error);
    }
};

/**
 * Remove stored authentication data
 */
export const removeStoredAuth = (): void => {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error: unknown) {
        console.error('Error removing auth data from localStorage:', error);
    }
};

/**
 * Get stored theme preference
 * @returns Theme preference or 'light' as default
 */
export const getStoredTheme = (): ThemeType => {
    try {
        const theme = localStorage.getItem(THEME_STORAGE_KEY);
        if (!theme) return 'system';

        return theme as ThemeType;
    } catch (error) {
        console.error('Error retrieving theme from localStorage:', error);
        return 'system';
    }
};

/**
 * Store theme preference
 * @param theme Theme preference to store
 */
export const setStoredTheme = (theme: ThemeType): void => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.error('Error storing theme in localStorage:', error);
    }
};

/**
 * Get user preferences
 * @returns User preferences or default values
 */
export const getStoredPreferences = (): Record<string, unknown> => {
    try {
        const preferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (!preferences) return {};

        return JSON.parse(preferences);
    } catch (error) {
        console.error('Error retrieving preferences from localStorage:', error);
        return {};
    }
};

/**
 * Store user preferences
 * @param preferences User preferences to store
 */
export const setStoredPreferences = (preferences: Record<string, unknown>): void => {
    try {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error storing preferences in localStorage:', error);
    }
};

/**
 * Update a specific user preference
 * @param key Preference key
 * @param value Preference value
 */
export const updateStoredPreference = (key: string, value: unknown): void => {
    try {
        const preferences = getStoredPreferences();
        preferences[key] = value;
        setStoredPreferences(preferences);
    } catch (error) {
        console.error('Error updating preference in localStorage:', error);
    }
};