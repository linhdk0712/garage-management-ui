import React from 'react';
import classNames from 'classnames';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    bodyClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
                                       title,
                                       subtitle,
                                       children,
                                       footer,
                                       className,
                                       bodyClassName,
                                       headerClassName,
                                       footerClassName,
                                       noPadding = false,
                                   }) => {
    const cardClass = classNames(
        'bg-white rounded-xl shadow-md overflow-hidden',
        className
    );

    const headerClass = classNames(
        'px-6 py-4',
        {
            'border-b': !subtitle,
            'pb-2': subtitle,
        },
        headerClassName
    );

    const subtitleClass = classNames(
        'px-6 py-2 border-b text-sm text-gray-500'
    );

    const bodyClass = classNames(
        {
            'p-6': !noPadding,
        },
        bodyClassName
    );

    const footerClass = classNames(
        'px-6 py-4 bg-gray-50 border-t',
        footerClassName
    );

    return (
        <div className={cardClass}>
            {title && (
                <div className={headerClass}>
                    <h3 className="text-lg font-medium">{title}</h3>
                </div>
            )}

            {subtitle && (
                <div className={subtitleClass}>
                    {subtitle}
                </div>
            )}

            <div className={bodyClass}>{children}</div>

            {footer && <div className={footerClass}>{footer}</div>}
        </div>
    );
};

export default Card;