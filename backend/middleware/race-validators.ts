import { param, query } from 'express-validator';

/**
 * Validation rules for getting races for a specific season
 * - season: must be a 4-digit year between 2005 and current year
 */
export const validateGetRacesForSeason = [
  param('season')
    .isString()
    .matches(/^\d{4}$/).withMessage('Season must be a 4-digit year')
    .custom((value) => {
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 2005 || year > currentYear) {
        throw new Error(`Season must be between 2005 and ${currentYear}`);
      }
      return true;
    }),
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('round')
    .optional()
    .isInt({ min: 1 }).withMessage('Round must be a positive integer')
]; 