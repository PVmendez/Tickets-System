import express from 'express';
import { upload, handleMulterError } from '../handlers/ticketHandler.js';
import { createTicket, getTickets, getCashback, updateTicketStatus, deleteTicket } from '../services/ticketService.js';

const router = express.Router();

router.post('/tickets', upload.single('image'), handleMulterError, createTicket);
router.get('/tickets', getTickets);
router.get('/tickets/:id/cashback', getCashback);
router.patch('/tickets/:id', updateTicketStatus);
router.delete('/tickets/:id', deleteTicket);

export default router;
