import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         footer,
                                         size = 'md',
                                         closeOnOutsideClick = true,
                                     }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    // Handle click outside modal
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                closeOnOutsideClick &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose, closeOnOutsideClick]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>

                <div
                    ref={modalRef}
                    className={`${sizeClasses[size]} w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
                >
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4">{children}</div>

                    {footer && (
                        <div className="border-t bg-gray-50 px-6 py-4">{footer}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;