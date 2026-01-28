import { Announcement, Resource, DocumentItem } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbwieCouf0GWRqw0WS-_Be8SW0AMJ1--boqpTacF66r--71W85pEMfkAH2gP926Twyzp/exec';

export interface ApiResponse {
    announcements: Announcement[];
    resources: Resource[];
    documents: DocumentItem[];
}

interface PostResponse {
    result: 'success' | 'error';
    data?: any;
    error?: any;
}

export const fetchData = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const sendPostRequest = async (action: string, data: any): Promise<PostResponse> => {
    // Use no-cors mode is tricky for read/write. 
    // Standard Apps Script web apps need 'Content-Type': 'text/plain;charset=utf-8' to avoid CORS preflight issues sometimes,
    // or just standard POST. Let's try standard POST with text/plain to avoid OPTIONS request if possible.
    // actually, for correct JSON handling on the server, we usually send standard JSON.
    // But Apps Script CORS is often permissive if we follow redirects.

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            // Google Apps Script requires text/plain to avoid CORS preflight (OPTIONS) in some cases,
            // but if we want to send JSON, we often default to text/plain and parse it manually in the script.
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ action, data }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error performing ${action}:`, error);
        throw error;
    }
};

export const createAnnouncement = async (announcement: Announcement) => {
    return sendPostRequest('createAnnouncement', announcement);
};

export const createResource = async (resource: Resource) => {
    return sendPostRequest('createResource', resource);
};

export const createDocument = async (document: DocumentItem) => {
    return sendPostRequest('createDocument', document);
};
