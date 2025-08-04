import { pool } from '../db/db.js';

export class TicketRepository {
  constructor(dbPool) {
    this.db = dbPool;
  }

  async create({ userId, imagePath, ocrData }) {
    try {
      const result = await this.db.query(
        `INSERT INTO tickets (user_id, image_path, ocr_data, status, created_at) 
         VALUES ($1, $2, $3, 'pending', NOW()) RETURNING *`,
        [userId, imagePath, JSON.stringify(ocrData)]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[TicketRepository] Error creating ticket:', error);
      throw error;
    }
  }

  async getAll() {
    try {
      const result = await this.db.query('SELECT * FROM tickets ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('[TicketRepository] Error getting all tickets:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await this.db.query('SELECT * FROM tickets WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('[TicketRepository] Error getting ticket by id:', error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const result = await this.db.query(
        'SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('[TicketRepository] Error getting tickets by user id:', error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const result = await this.db.query(
        'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[TicketRepository] Error updating ticket status:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM tickets WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('[TicketRepository] Error deleting ticket:', error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const result = await this.db.query(
        'SELECT * FROM tickets WHERE status = $1 ORDER BY created_at DESC',
        [status]
      );
      return result.rows;
    } catch (error) {
      console.error('[TicketRepository] Error getting tickets by status:', error);
      throw error;
    }
  }
}

const defaultTicketRepository = new TicketRepository(pool);

export const TicketModel = {
  async create(data) {
    return defaultTicketRepository.create(data);
  },
  async getAll() {
    return defaultTicketRepository.getAll();
  },
  async getById(id) {
    return defaultTicketRepository.getById(id);
  },
  async updateStatus(id, status) {
    return defaultTicketRepository.updateStatus(id, status);
  },
  async delete(id) {
    return defaultTicketRepository.delete(id);
  }
};

export default defaultTicketRepository;
