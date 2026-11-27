import { AnalyticsModel } from '../models/analyticsModel.js';
import { ResponseView } from '../views/responseView.js';

export class AnalyticsController {
  static async logEvent(req, res, next) {
    try {
      const { eventType = 'custom', eventData = {} } = req.body;
      await AnalyticsModel.recordEvent({ eventType, eventData });
      return ResponseView.success(res, { recorded: true }, 200, 'Analytics event tracked');
    } catch (err) {
      next(err);
    }
  }

  static async getAnalyticsSummary(req, res, next) {
    try {
      const summary = await AnalyticsModel.getSummary();
      return ResponseView.success(res, summary);
    } catch (err) {
      next(err);
    }
  }
}
