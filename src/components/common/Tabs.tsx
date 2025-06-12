import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

export interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    defaultTabId?: string;
    variant?: 'underline' | 'pills' | 'boxed' | 'modern';
    align?: 'left' | 'center' | 'right' | 'full';
    className?: string;
    tabsClassName?: string;
    contentClassName?: string;
    onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
                                       tabs,
                                       defaultTabId,
                                       variant = 'modern',
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
            underline: 'border-b border-slate-200 dark:border-slate-700',
            pills: 'gap-2',
            boxed: 'border-b border-slate-200 dark:border-slate-700',
            modern: 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-1.5 shadow-sm border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm',
        };

        return classNames(
            'flex flex-wrap',
            alignClasses[align],
            variantContainerClasses[variant],
            tabsClassName
        );
    };

    const getTabClasses = (tab: Tab) => {
        const isActive = activeTabId === tab.id;
        const isDisabled = tab.disabled;

        const baseClasses = 'inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden group';

        const variantClasses = {
            underline: classNames(
                'border-b-2',
                isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            pills: classNames(
                'rounded-lg',
                isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            boxed: classNames(
                'border-b-2 -mb-px',
                isActive
                    ? 'border-blue-500 bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            modern: classNames(
                'rounded-lg',
                isActive
                    ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 border border-slate-200/80 dark:bg-slate-700 dark:text-slate-100 dark:shadow-slate-900/50 dark:border-slate-600/80'
                    : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/80',
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
            <div className={getTabsContainerClasses()} role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={getTabClasses(tab)}
                        onClick={() => !tab.disabled && handleTabClick(tab.id)}
                        disabled={tab.disabled}
                        aria-selected={activeTabId === tab.id}
                        role="tab"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                            {tab.label}
                        </span>
                        {variant === 'modern' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        )}
                    </button>
                ))}
            </div>

            {activeTab && (
                <div className={getContentClasses()} role="tabpanel" aria-labelledby={`tab-${activeTab.id}`}>
                    {activeTab.content}
                </div>
            )}
        </div>
    );
};

export default Tabs;