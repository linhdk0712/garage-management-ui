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
        'bg-[#EDEDE9] rounded-lg border border-[#D6CCC2] overflow-hidden',
        className
    );

    const headerClass = classNames(
        'px-6 py-4 bg-[#E3D5CA]',
        {
            'border-b border-[#D6CCC2]': !subtitle,
            'pb-2': subtitle,
        },
        headerClassName
    );

    const subtitleClass = classNames(
        'px-6 py-2 border-b border-[#E3D5CA] text-sm text-[#6B5B47]'
    );

    const bodyClass = classNames(
        {
            'p-6': !noPadding,
        },
        bodyClassName
    );

    const footerClass = classNames(
        'px-6 py-4 bg-[#F5EBE0] border-t border-[#E3D5CA]',
        footerClassName
    );

    return (
        <div className={cardClass}>
            {title && (
                <div className={headerClass}>
                    <h3 className="text-lg font-semibold text-[#3D2C2E]">{title}</h3>
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