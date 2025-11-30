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
    const errorMessage = await response.json().catch(() => null);
    const error = new Error();
    (error as any).status = response.status;
    (error as any).message = errorMessage;

    throw error;
  }
  return response.json() as Promise<T>;
};
