/**
 * Centralized API configuration for the portfolio frontend.
 * The NEXT_PUBLIC_BACKEND_URL variable can be provided at build time (e.g. into the Docker image)
 * or read from environment in some SSR scenarios.
 * For production, ensure this is set in your Cloud Run or Build settings.
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
