import { param, query } from 'express-validator';

/**
 * Validation rules for getting a specific season
 * - season: must be a 4-digit year
 */
export const validateGetSeason = [
  param('season')
    .isString()
    .matches(/^\d{4}$/).withMessage('Season must be a 4-digit year')
];

/**
 * Validation rules for getting all seasons
 * - limit: optional, must be a positive integer
 * - page: optional, must be a positive integer
 */
export const validateGetAllSeasons = [
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
]; 