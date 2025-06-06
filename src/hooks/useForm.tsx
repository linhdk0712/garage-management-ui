import { useState, ChangeEvent, FormEvent } from 'react';

interface FormOptions<T> {
    initialValues: T;
    onSubmit: (values: T) => void | Promise<void>;
    validate?: (values: T) => Record<keyof T, string> | Record<string, never>;
}

/**
 * Custom hook for managing form state
 * @param options Form configuration options
 * @returns Form state and handlers
 */
function useForm<T extends Record<string, any>>({
                                                    initialValues,
                                                    onSubmit,
                                                    validate,
                                                }: FormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitCount, setSubmitCount] = useState<number>(0);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkboxes
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setValues((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error when value changes
        if (errors[name as keyof T]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        // Validate field on blur if validate function exists
        if (validate) {
            const validationErrors = validate(values);
            if (validationErrors[name as keyof T]) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: validationErrors[name as keyof T],
                }));
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitCount((prev) => prev + 1);

        // Validate all fields before submission
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors as Record<keyof T, string>);

            // Mark all fields as touched
            const allTouched = Object.keys(values).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {} as Record<keyof T, boolean>
            );
            setTouched(allTouched);

            // If there are errors, don't submit
            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        // Submit form
        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
            // You can handle submission errors here
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({} as Record<keyof T, string>);
        setTouched({} as Record<keyof T, boolean>);
        setIsSubmitting(false);
    };

    const setFieldValue = (name: keyof T, value: any) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
    };
}

export default useForm;