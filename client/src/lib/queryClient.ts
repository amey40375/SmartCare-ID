import { QueryClient } from "@tanstack/react-query";

// Create a default fetcher function
const defaultFetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Create and export the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => defaultFetcher(queryKey[0] as string),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Export helper function for API requests
export const apiRequest = async (url: string, options?: RequestInit) => {
  return defaultFetcher(url, options);
};