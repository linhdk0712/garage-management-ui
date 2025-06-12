import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

export interface BeautifulTab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

interface BeautifulTabsProps {
    tabs: BeautifulTab[];
    defaultTabId?: string;
    variant?: 'glass' | 'gradient' | 'minimal' | 'elegant' | 'underline';
    align?: 'left' | 'center' | 'right' | 'full';
    className?: string;
    tabsClassName?: string;
    contentClassName?: string;
    onChange?: (tabId: string) => void;
}

const BeautifulTabs: React.FC<BeautifulTabsProps> = ({
    tabs,
    defaultTabId,
    variant = 'glass',
    align = 'left',
    className = '',
    tabsClassName = '',
    contentClassName = '',
    onChange,
}) => {
    // Find the first enabled tab or use the defaultTabId if provided
    const findInitialTab = (): string => {
        if (defaultTabId) {
            const tab = tabs.find(tab => tab.id === defaultTabId);
            if (tab && !tab.disabled) {
                return defaultTabId;
            }
        }

        const firstEnabledTab = tabs.find(tab => !tab.disabled);
        return firstEnabledTab ? firstEnabledTab.id : '';
    };

    const [activeTabId, setActiveTabId] = useState<string>(findInitialTab);

    // Update active tab when tabs or defaultTabId changes
    useEffect(() => {
        setActiveTabId(findInitialTab());
    }, [tabs, defaultTabId]);

    const handleTabClick = (tabId: string) => {
        setActiveTabId(tabId);
        if (onChange) {
            onChange(tabId);
        }
    };

    const containerClasses = classNames('w-full', className);

    const getTabsContainerClasses = () => {
        const alignClasses = {
            left: 'justify-start',
            center: 'justify-center',
            right: 'justify-end',
            full: 'justify-between',
        };

        const variantContainerClasses = {
            glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20 dark:border-slate-700/30',
            gradient: 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-2 shadow-lg',
            minimal: 'border-b-2 border-slate-200 dark:border-slate-700',
            elegant: 'bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1.5 shadow-sm border border-slate-200/60 dark:border-slate-700/60',
            underline: '',
        };

        return classNames(
            'flex flex-wrap gap-1',
            alignClasses[align],
            variantContainerClasses[variant],
            tabsClassName
        );
    };

    const getTabClasses = (tab: BeautifulTab) => {
        const isActive = activeTabId === tab.id;
        const isDisabled = tab.disabled;

        const baseClasses = 'inline-flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 relative overflow-hidden group cursor-pointer';

        const variantClasses = {
            glass: classNames(
                'rounded-xl',
                isActive
                    ? 'bg-white/90 text-slate-900 shadow-lg shadow-slate-200/50 border border-white/40 dark:bg-slate-700/90 dark:text-slate-100 dark:shadow-slate-900/50 dark:border-slate-600/40'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/60 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/60',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            gradient: classNames(
                'rounded-xl',
                isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/80',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            minimal: classNames(
                'border-b-2 -mb-px',
                isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50/30 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            elegant: classNames(
                'rounded-lg',
                isActive
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 border border-slate-200/80 dark:bg-slate-700 dark:text-slate-100 dark:shadow-slate-900/50 dark:border-slate-600/80'
                    : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/80',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            underline: classNames(
                '',
                isActive
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-slate-600 hover:text-slate-800 hover:border-b-2 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
        };

        return classNames(baseClasses, variantClasses[variant]);
    };

    const getContentClasses = () => {
        return classNames(
            'mt-6 animate-in fade-in-0 slide-in-from-top-2 duration-300',
            contentClassName
        );
    };

    // Find the active tab
    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className={containerClasses}>
            <div className={getTabsContainerClasses()}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={getTabClasses(tab)}
                        onClick={() => !tab.disabled && handleTabClick(tab.id)}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon && (
                                <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                                    {tab.icon}
                                </span>
                            )}
                            {tab.label}
                        </span>
                        {variant === 'glass' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        )}
                        {variant === 'gradient' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        )}
                    </div>
                ))}
            </div>

            {activeTab && (
                <div className={getContentClasses()}>
                    {activeTab.content}
                </div>
            )}
        </div>
    );
};

export default BeautifulTabs; 