export interface TimeEntry {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryDto {
  date: string;
  project: string;
  hours: number;
  description: string;
}

export interface UpdateEntryDto {
  date?: string;
  project?: string;
  hours?: number;
  description?: string;
}

import { API_URL } from './constants';

export const api = {
  async getEntries(): Promise<TimeEntry[]> {
    const url = `${API_URL}/entries`;
    console.log('🌐 API_URL:', API_URL);
    console.log('📡 Fetching from:', url);
    const response = await fetch(url);
    console.log('📥 Response status:', response.status, response.statusText);
    if (!response.ok) throw new Error('Failed to fetch entries');
    return response.json();
  },

  async getEntry(id: number): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries/${id}`);
    if (!response.ok) throw new Error('Failed to fetch entry');
    return response.json();
  },

  async createEntry(entry: CreateEntryDto): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create entry');
    }
    return response.json();
  },

  async updateEntry(id: number, entry: UpdateEntryDto): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update entry');
    }
    return response.json();
  },

  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/entries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete entry');
    }
  },
};
