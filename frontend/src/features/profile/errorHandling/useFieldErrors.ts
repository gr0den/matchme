import { useState } from "react";
import { validateCurrentCard } from "./validators";
import type { UserProfile } from "../types/cardTypes";

/**
 * Custom hook for managing field-level error state in profile forms.
 * Provides field error tracking and validation methods.
 */
export function useFieldErrors() {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

    /**
     * Validates a specific card against the current user profile.
     * Updates the field error state and returns the error message (if any).
     *
     * @param cardId - The ID of the card to validate
     * @param userProfile - The current user profile data
     * @returns Error message string if validation fails, null if valid
     */
    function validateCard(cardId: string, userProfile: UserProfile): string | null {
        const error = validateCurrentCard(cardId, userProfile);

        setFieldErrors(prev => ({
            ...prev,
            [cardId]: error,
        }));

        return error;
    }

    /**
     * Clears the error for a specific field.
     *
     * @param fieldId - The ID of the field to clear error for
     */
    function clearFieldError(fieldId: string): void {
        setFieldErrors(prev => ({
            ...prev,
            [fieldId]: null,
        }));
    }

    /**
     * Clears all field errors.
     */
    function clearAllErrors(): void {
        setFieldErrors({});
    }

    return {
        fieldErrors,
        validateCard,
        clearFieldError,
        clearAllErrors,
    };
}
