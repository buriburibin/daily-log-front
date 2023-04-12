import Cookies from "js-cookie";

const ENDPOINT = 'http://192.168.0.58:8080';

export async function request<TResponse>(
    url: string,
    config?: RequestInit,
    noCheckAuth?: boolean
): Promise<Response> {
    const response = await fetch(ENDPOINT+url, config);
    const isAuthenticated = !!Cookies.get('isLogin');
    if((isAuthenticated === null || !isAuthenticated) && !noCheckAuth){
        window.location.href = '/login'
    }
    return response;
}