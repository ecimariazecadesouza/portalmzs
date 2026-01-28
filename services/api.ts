import { Announcement, Resource, DocumentItem } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbwieCouf0GWRqw0WS-_Be8SW0AMJ1--boqpTacF66r--71W85pEMfkAH2gP926Twyzp/exec';

export interface ApiResponse {
    announcements: Announcement[];
    resources: Resource[];
    documents: DocumentItem[];
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
