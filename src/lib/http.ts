export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const http = async <T>(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      typeof errorBody === 'string'
        ? errorBody
        : (errorBody && (errorBody.message as string)) || 'Request failed';

    const error = new Error(message) as Error & {
      status?: number;
      data?: unknown;
    };
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  return response.json() as Promise<T>;
};
