import type { UserProfile } from "../types/cardTypes";

/**
 * - Must not be blank
 * - Length: 1-64 characters
 */
export function validateUserName(value: string | undefined): string | null {
    if (!value || value.trim().length === 0) {
        return "Username cannot be blank";
    }

    if (value.length < 1 || value.length > 64) {
        return "Username must be between 1 and 64 characters";
    }

    return null;
}

/**
 * - If provided, must be 50-500 characters
 */
export function validateBio(value: string | undefined): string | null {
    if (!value || value.trim().length === 0) {
        return "Biography is required";
    }

    if (value.length < 50) {
        return "Biography must be at least 50 characters";
    }

    if (value.length > 500) {
        return "Biography cannot exceed 500 characters";
    }

    return null;
}

/**
 * - Must not be empty
 * - Must have 5-10 items
 */
export function validateInterests(values: number[] | undefined): string | null {
    if (!values || values.length === 0) {
        return "Interests set cannot be empty";
    }

    if (values.length < 5) {
        return "You must select at least 5 interests";
    }

    if (values.length > 10) {
        return "You can select at most 10 interests";
    }

    return null;
}

/**
 * - Must not be empty
 * - Must have 1-10 items
 */
export function validateGenres(values: number[] | undefined): string | null {
    if (!values || values.length === 0) {
        return "Genres set cannot be empty";
    }

    if (values.length < 1) {
        return "You must select at least 1 genre";
    }

    if (values.length > 10) {
        return "You can select at most 10 genres";
    }

    return null;
}

/**
 * - Must not be empty
 * - Must have 1-10 items
 */
export function validateTargetGenres(values: number[] | undefined): string | null {
    if (!values || values.length === 0) {
        return "Target genres set cannot be empty";
    }

    if (values.length < 1) {
        return "You must select at least 1 genre";
    }

    if (values.length > 10) {
        return "You can select at most 10 genres";
    }

    return null;
}

/**
 * - Must not be null
 * - Range: -90 to 90
 */
export function validateLatitude(value: number | undefined): string | null {
    if (value === undefined || value === null) {
        return "Latitude is required";
    }

    if (value < -90 || value > 90) {
        return "Invalid latitude";
    }

    return null;
}

/**
 * - Must not be null
 * - Range: -180 to 180
 */
export function validateLongitude(value: number | undefined): string | null {
    if (value === undefined || value === null) {
        return "Longitude is required";
    }

    if (value < -180 || value > 180) {
        return "Invalid longitude";
    }

    return null;
}

/**
 * - Must not be null
 * - Range: 1 to 20000
 */
export function validateSearchRadius(value: number | undefined): string | null {
    if (value === undefined || value === null) {
        return "Search radius is required";
    }

    if (value < 1 || value > 20000) {
        return "Search radius must be within 1 to 20000 range";
    }

    return null;
}

/**
 * Validates a specific card based on its ID and the current user profile state.
 * This function orchestrates field-specific validation for a given card.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateCurrentCard(cardId: string, userProfile: UserProfile): string | null {
    switch (cardId) {
        case "userName":
            return validateUserName(userProfile.userName);

        case "bio":
            return validateBio(userProfile.bio);

        case "interests":
            return validateInterests(userProfile.interests);

        case "genres":
            return validateGenres(userProfile.genres);

        case "targetGenres":
            return validateTargetGenres(userProfile.targetGenres);

        case "location":
            // Validate both latitude and longitude for location card
            const latError = validateLatitude(userProfile.latitude);
            if (latError) return latError;

            const longError = validateLongitude(userProfile.longitude);
            if (longError) return longError;

            const radiusError = validateSearchRadius(userProfile.searchRadius);
            if (radiusError) return radiusError;

            return null;

        case "picture":
            // Picture is optional, so always valid
            return null;

        case "branchChoice":
            // Branch choice is validated in CardFlowPage logic
            return null;

        default:
            return null;
    }
}
