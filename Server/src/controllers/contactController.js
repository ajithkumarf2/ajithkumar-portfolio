import { z } from 'zod';
import { LeadModel } from '../models/leadModel.js';
import { ResponseView } from '../views/responseView.js';
import { EmailService } from '../services/emailService.js';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(2, 'Message must be at least 2 characters').max(2000),
  source: z.string().optional().default('contact_form')
});

export class ContactController {
  static async submitContact(req, res, next) {
    try {
      const parsed = contactSchema.parse(req.body);
      const lead = await LeadModel.createLead(parsed);

      // Await email delivery so serverless runtimes (Vercel) don't freeze before SMTP completes
      try {
        await EmailService.sendLeadNotification(lead);
      } catch (err) {
        console.error('[EmailService] Failed to send Gmail notification:', err.message);
      }

      return ResponseView.success(res, lead, 201, 'Inquiry successfully submitted');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstMsg = err.errors?.[0]?.message || 'Validation failed';
        return ResponseView.error(res, firstMsg, 400, err.errors);
      }
      next(err);
    }
  }

  static async listContacts(req, res, next) {
    try {
      const leads = await LeadModel.getAllLeads();
      return ResponseView.success(res, leads);
    } catch (err) {
      next(err);
    }
  }
}
