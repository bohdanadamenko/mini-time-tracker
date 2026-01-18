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

export interface GetEntriesParams {
  project?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

import { API_URL } from './constants';

async function parseErrorResponse(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return fallbackMessage;
    const json = JSON.parse(text);
    return json.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export const api = {
  async getEntries(params: GetEntriesParams = {}): Promise<PaginatedResponse<TimeEntry>> {
    const searchParams = new URLSearchParams();
    if (params.project) searchParams.append('project', params.project);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_URL}/entries?${searchParams.toString()}`);
    if (!response.ok) {
      const message = await parseErrorResponse(response, 'Failed to fetch entries');
      throw new Error(message);
    }
    return response.json();
  },

  async getDailyTotal(date: string): Promise<{ total: number }> {
    const response = await fetch(`${API_URL}/entries/total-hours?date=${date}`);
    if (!response.ok) {
      const message = await parseErrorResponse(response, 'Failed to fetch daily total');
      throw new Error(message);
    }
    return response.json();
  },

  async getEntry(id: number): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries/${id}`);
    if (!response.ok) {
      const message = await parseErrorResponse(response, 'Failed to fetch entry');
      throw new Error(message);
    }
    return response.json();
  },

  async createEntry(entry: CreateEntryDto): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const message = await parseErrorResponse(response, 'Failed to create entry');
      throw new Error(message);
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
      const message = await parseErrorResponse(response, 'Failed to update entry');
      throw new Error(message);
    }
    return response.json();
  },

  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/entries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const message = await parseErrorResponse(response, 'Failed to delete entry');
      throw new Error(message);
    }
  },
};
