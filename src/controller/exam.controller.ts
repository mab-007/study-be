import { Router, Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import { tenantMiddleware } from '../middleware/tenant.middleware';

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = [
  { name: 'question_paper', maxCount: 1 },
  { name: 'answer_sheet', maxCount: 1 },
  { name: 'marking_scheme', maxCount: 1 },
];



class ExamController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/cbse-exam-papers/upload',
      authMiddleware,
      tenantMiddleware,
      upload.fields(uploadFields),
      this.uploadExamPapers.bind(this)
    );

    this.router.put(
      '/cbse-exam-papers/:examPaperId/evaluation',
      authMiddleware,
      tenantMiddleware,
      this.evaluateExamPaper.bind(this)
    );

    this.router.get(
      '/cbse-exam-papers/model-evaluated',
      authMiddleware,
      tenantMiddleware,
      this.getModelEvaluatedPapers.bind(this)
    );

    this.router.get(
      '/cbse-exam-papers/verified',
      authMiddleware,
      tenantMiddleware,
      this.getVerifiedPapers.bind(this)
    );

    this.router.put(
      '/cbse-exam-papers/verified/:paperId',
      authMiddleware,
      tenantMiddleware,
      this.updateVerifiedExamPaper.bind(this)
    );
  }

  private async uploadExamPapers(req: Request, res: Response): Promise<void> {
    const { year } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || Object.keys(files).length === 0) {
      res.status(400).json({ message: 'At least one file (question_paper, answer_sheet, or marking_scheme) must be uploaded.' });
      return;
    }

    logger.info(`Received exam paper upload for year: ${year} for tenant`);

    try {
      // The service will handle the logic for each uploaded file
      const result = await req.service.processUpload(year, files, req.user!);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error(`Error processing exam paper upload for year: ${year}`, { error });
      res.status(500).json({ message: 'Error processing upload', error: error.message });
    }
  }
  private async evaluateExamPaper(req: Request, res: Response): Promise<void> {
    const { examPaperId } = req.params;
    const evaluationData = req.body;

    logger.info(`Received evaluation for exam paper ID: ${examPaperId}`);

    try {
      const result = await req.service.processEvaluation(examPaperId, evaluationData);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error processing evaluation for exam paper ID: ${examPaperId}`, { error });
      res.status(500).json({ message: 'Error processing evaluation', error: error.message });
    }
  }

  private async getModelEvaluatedPapers(req: Request, res: Response): Promise<void> {
    const ownerId = req.user!.id;
    logger.info(`Fetching model-evaluated papers for owner ID: ${ownerId}`);

    try {
      const result = await req.service.getModelEvaluatedPapersByOwner(ownerId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error fetching model-evaluated papers for owner ID: ${ownerId}`, { error });
      res.status(500).json({ message: 'Error fetching model-evaluated papers', error: error.message });
    }
  }

  private async getVerifiedPapers(req: Request, res: Response): Promise<void> {
    const ownerId = req.user!.id;
    logger.info(`Fetching verified papers for owner ID: ${ownerId}`);

    try {
      const result = await req.service.getVerifiedPapersByOwner(ownerId);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error fetching verified papers for owner ID: ${ownerId}`, { error });
      res.status(500).json({ message: 'Error fetching verified papers', error: error.message });
    }
  }

  private async updateVerifiedExamPaper(req: Request, res: Response): Promise<void> {
    const { paperId } = req.params;
    const evaluationData = req.body;

    logger.info(`Updating verified exam paper ID: ${paperId}`);

    try {
      const result = await req.service.updateVerifiedExamPaper(paperId, evaluationData);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Error updating verified exam paper ID: ${paperId}`, { error });
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error updating verified exam paper', error: error.message });
      }
    }
  }
}

export default new ExamController().router;