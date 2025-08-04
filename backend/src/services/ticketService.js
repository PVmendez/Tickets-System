import { TicketModel } from '../models/ticketModel.js';
import { ocrMock } from '../mocks/ocrMock.js';
import { validateStatus } from '../utils/validateStatus.js';
import { ticketCreateSchema, ticketStatusSchema } from '../schemas/ticketSchemas.js';

export async function createTicket(req, res, next) {
  try {
    const { error } = ticketCreateSchema.validate({ userId: req.body.userId });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: error.details[0].message 
      });
    }

    const userId = req.body.userId;
    const imagePath = req.file ? req.file.path : req.body.imageUrl;
    
    if (!imagePath) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Image is required' 
      });
    }

    const ocrData = await ocrMock(imagePath);
    const ticket = await TicketModel.create({ userId, imagePath, ocrData });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function getTickets(req, res, next) {
  try {
    const tickets = await TicketModel.getAll();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
}

export async function getCashback(req, res, next) {
  try {
    const ticket = await TicketModel.getById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Ticket not found' 
      });
    }
    
    if (ticket.status !== 'approved') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Ticket must be approved to calculate cashback' 
      });
    }

    const ocrData = typeof ticket.ocr_data === 'string' 
      ? JSON.parse(ticket.ocr_data) 
      : ticket.ocr_data;
    
    if (!ocrData.items || !Array.isArray(ocrData.items)) {
      return res.status(422).json({ 
        error: 'Unprocessable entity',
        message: 'Invalid ticket data: items not found' 
      });
    }

    const cashback = ocrData.items.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0);

    res.json({ cashback });
  } catch (err) {
    next(err);
  }
}

export async function updateTicketStatus(req, res, next) {
  try {
    const { error } = ticketStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: error.details[0].message 
      });
    }

    const { status } = req.body;
    if (!validateStatus(status)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Invalid status' 
      });
    }

    const ticket = await TicketModel.updateStatus(req.params.id, status);
    if (!ticket) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Ticket not found' 
      });
    }

    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function deleteTicket(req, res, next) {
  try {
    const ticket = await TicketModel.delete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Ticket not found' 
      });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
}
