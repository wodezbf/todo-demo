export class ApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  static async getTodos(search?: string) {
    const url = new URL(`${this.baseUrl}/todos`, window.location.origin);
    if (search) {
      url.searchParams.append('search', search);
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async createTodo(data: { 
    title: string; 
    description: string; 
    priority: 'low' | 'medium' | 'high';
  }) {
    const response = await fetch(`${this.baseUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return this.getTodos();
  }

  static async updateTodo(id: number, data: { 
    title?: string; 
    description?: string; 
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high'; 
  }) {
    const response = await fetch(`${this.baseUrl}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async deleteTodo(id: number) {
    const response = await fetch(`${this.baseUrl}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
} 