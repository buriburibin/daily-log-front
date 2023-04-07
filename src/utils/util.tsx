const ENDPOINT = 'http://192.168.0.58:8080';

export async function request<TResponse>(
    url: string,
    config?: RequestInit,
): Promise<Response> {
    const response = await fetch(ENDPOINT+url, config);
    return response;
}