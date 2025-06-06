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
    variant?: 'underline' | 'pills' | 'boxed';
    align?: 'left' | 'center' | 'right' | 'full';
    className?: string;
    tabsClassName?: string;
    contentClassName?: string;
    onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
                                       tabs,
                                       defaultTabId,
                                       variant = 'underline',
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

        return classNames(
            'flex flex-wrap',
            alignClasses[align],
            variant === 'boxed' ? 'border-b border-gray-200' : '',
            tabsClassName
        );
    };

    const getTabClasses = (tab: Tab) => {
        const isActive = activeTabId === tab.id;
        const isDisabled = tab.disabled;

        const baseClasses = 'inline-flex items-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

        const variantClasses = {
            underline: classNames(
                'border-b-2',
                isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            pills: classNames(
                'rounded-md',
                isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
            boxed: classNames(
                'border-b-2 -mb-px',
                isActive
                    ? 'border-blue-500 bg-white text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            ),
        };

        return classNames(baseClasses, variantClasses[variant]);
    };

    const getContentClasses = () => {
        return classNames('mt-4', contentClassName);
    };

    // Find the active tab
    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className={containerClasses}>
            <div className={getTabsContainerClasses()}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={getTabClasses(tab)}
                        onClick={() => !tab.disabled && handleTabClick(tab.id)}
                        disabled={tab.disabled}
                        aria-selected={activeTabId === tab.id}
                        role="tab"
                    >
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        {tab.label}
                    </button>
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

export default Tabs;