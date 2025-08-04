export class ApiService {
  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL) {
    this.baseUrl = baseUrl;
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;

      throw new Error(errorMessage);
    }
    return response.json();
  }

  async fetchTickets() {
    const response = await fetch(`${this.baseUrl}/tickets`);
    return this.handleResponse(response);
  }

  async createTicket(userId, imageFile) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', imageFile);
    
    const response = await fetch(`${this.baseUrl}/tickets`, {
      method: 'POST',
      body: formData
    });
    return this.handleResponse(response);
  }

  async updateTicketStatus(ticketId, status) {
    const response = await fetch(`${this.baseUrl}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }

  async deleteTicket(ticketId) {
    const response = await fetch(`${this.baseUrl}/tickets/${ticketId}`, {
      method: 'DELETE'
    });
    return this.handleResponse(response);
  }

  async getCashback(ticketId) {
    const response = await fetch(`${this.baseUrl}/tickets/${ticketId}/cashback`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();

export function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG, GIF y WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es muy grande. El tamaño máximo permitido es 5MB.');
  }

  return true;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

export function getStatusColor(status) {
  switch (status) {
    case 'approved': return '#4CAF50';
    case 'rejected': return '#f44336';
    case 'pending': return '#FF9800';
    default: return '#757575';
  }
}

export function getStatusText(status) {
  switch (status) {
    case 'approved': return 'Aprobado';
    case 'rejected': return 'Rechazado';
    case 'pending': return 'Pendiente';
    default: return 'Desconocido';
  }
}
