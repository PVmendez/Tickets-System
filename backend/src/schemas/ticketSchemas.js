import Joi from 'joi';

export const ticketCreateSchema = Joi.object({
  userId: Joi.string().required(),
});

export const ticketStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required()
});
