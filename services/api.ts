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

        // Sanitize boolean fields because Google Sheets might return them as strings or booleans
        const sanitizeBoolean = (val: any) => {
            if (val === undefined || val === null || val === '') return true;
            if (typeof val === 'boolean') return val;
            return String(val).toLowerCase() === 'true';
        };

        const normalizeDate = (dateStr: any) => {
            if (!dateStr) return new Date().toISOString();
            const str = String(dateStr);
            // Handle DD/MM/YYYY
            const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/;
            const match = str.match(ddmmyyyy);
            if (match) {
                return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}T12:00:00Z`;
            }
            const date = new Date(str);
            return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
        };

        const sanitizedData: ApiResponse = {
            announcements: (data.announcements || []).map((item: any, idx: number) => ({
                ...item,
                id: item.id ? String(item.id) : `ann-${Date.now()}-${idx}`,
                title: String(item.title || ''),
                content: String(item.content || ''),
                author: String(item.author || 'Secretaria'),
                date: normalizeDate(item.date),
                tags: Array.isArray(item.tags) ? item.tags :
                    (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : ['Geral']),
                active: sanitizeBoolean(item.active),
                featured: sanitizeBoolean(item.featured)
            })),
            resources: (data.resources || []).map((item: any, idx: number) => ({
                ...item,
                id: item.id ? String(item.id) : `res-${Date.now()}-${idx}`,
                active: sanitizeBoolean(item.active)
            })),
            documents: (data.documents || []).map((item: any, idx: number) => ({
                ...item,
                id: item.id ? String(item.id) : `doc-${Date.now()}-${idx}`,
                active: sanitizeBoolean(item.active)
            }))
        };

        console.log('Sanitized Data:', sanitizedData);

        return sanitizedData;
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

export const updateAnnouncement = async (announcement: Announcement) => {
    return sendPostRequest('updateAnnouncement', announcement);
};

export const deleteAnnouncement = async (id: string) => {
    return sendPostRequest('deleteAnnouncement', { id });
};

export const createResource = async (resource: Resource) => {
    return sendPostRequest('createResource', resource);
};

export const updateResource = async (resource: Resource) => {
    return sendPostRequest('updateResource', resource);
};

export const deleteResource = async (id: string) => {
    return sendPostRequest('deleteResource', { id });
};

export const createDocument = async (document: DocumentItem) => {
    return sendPostRequest('createDocument', document);
};

export const updateDocument = async (document: DocumentItem) => {
    return sendPostRequest('updateDocument', document);
};

export const deleteDocument = async (id: string) => {
    return sendPostRequest('deleteDocument', { id });
};
