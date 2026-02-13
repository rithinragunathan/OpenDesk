import { Router } from 'express';
import { createIssue, listIssues } from '../controllers/issueController.js';
import { requireAuth } from '../middleware/auth.js';

export const issueRouter = Router();

issueRouter.get('/', listIssues);
issueRouter.post('/', requireAuth, createIssue);
