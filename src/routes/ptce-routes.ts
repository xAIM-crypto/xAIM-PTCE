import { Router, Request, Response } from 'express';
import { PTCEController } from '../controllers/ptce-controller';

const router = Router();
const ptceController = new PTCEController();

/**
 * PTCE (Predictive Triadic Consensus Engine) Routes
 */

/**
 * @route  POST /api/ptce/determine-winner
 * @desc   Determine the winner between two models using PTCE
 * @access Private
 */
router.post('/determine-winner', (req: Request, res: Response) => 
  ptceController.determineWinner(req, res)
);

/**
 * @route  POST /api/ptce/determine-winner-detailed
 * @desc   Determine the winner between two models with detailed LLM interactions
 * @access Private
 */
router.post('/determine-winner-detailed', (req: Request, res: Response) => 
  ptceController.determineWinnerWithDetails(req, res)
);

/**
 * @route  POST /api/ptce/determine-winner-by-ids
 * @desc   Determine the winner between two models using their IDs
 * @access Private
 */
router.post('/determine-winner-by-ids', (req: Request, res: Response) => 
  ptceController.determineWinnerByIds(req, res)
);

/**
 * @route  POST /api/ptce/determine-winner-by-ids-detailed
 * @desc   Determine the winner between two models using their IDs with detailed LLM interactions
 * @access Private
 */
router.post('/determine-winner-by-ids-detailed', (req: Request, res: Response) => 
  ptceController.determineWinnerByIdsWithDetails(req, res)
);

/**
 * @route  GET /api/ptce/health
 * @desc   Check if the PTCE service is running
 * @access Public
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'PTCE service is running'
  });
});

export default router; 