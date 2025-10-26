// create a empty class for exampapers service

import ExamPaperModel from "../../entity/user_exam_paper.entity";
import { IUserExamPaper } from '../../entity/user_exam_paper.entity';
import { IUserExamPaperEvaluation } from "../../type/exampaper.type";
import { uploadToS3 } from '../../utils/s3.utils';
import ModelEvaluatedExamPaperModel, { IModelEvaluatedExamPaper } from '../../entity/model_evaluated_exam_paper.entity';
import VerifiedExamPaperModel, { IVerifiedExamPaper } from '../../entity/verified_exam_paper.entity';

class ExamPapersService {
    private static instance: ExamPapersService;

    private constructor() {}

    public static getInstance(): ExamPapersService {
        if (!ExamPapersService.instance) {
        ExamPapersService.instance = new ExamPapersService();
        }
        return ExamPapersService.instance;
    }

    public async processEvaluation(examPaperId: string, evaluationData: IUserExamPaperEvaluation): Promise<any> {
        const updatedExamPaper = await ExamPaperModel.findByIdAndUpdate(
        examPaperId,
        { $set: { evaluation_report: evaluationData, processing_status: 'completed', processed_at: new Date() } },
        { new: true }
        );

        if (!updatedExamPaper) {
        throw new Error(`Exam paper with ID ${examPaperId} not found.`);
        }

        return updatedExamPaper.toObject();
    }

    public async processUpload(
        year: string,
        files: { [fieldname: string]: Express.Multer.File[] },
        user: any
    ): Promise<IUserExamPaper[]> {
        const createdRecords: IUserExamPaper[] = [];

        for (const fieldname in files) {
        const file = files[fieldname][0];
        const filePath = `${user.id}/${new Date().getTime()}-${file.originalname}`;

        try {
            // 1. Upload the file to AWS S3
            await uploadToS3(file.buffer, filePath, file.mimetype);
        } catch (error: any) {
            throw new Error(`Failed to upload ${file.originalname} to S3: ${error.message}`);
        }

        // 2. Create a record in the database
        const newExamPaper = new ExamPaperModel({
            owner_id: user.id,
            storage_path: filePath,
            board_type: 'CBSE',
            exam_metadata: [{ year, type: fieldname }],
            processing_status: 'pending',
            original_filename: file.originalname,
            file_size: file.size,
            content_type: file.mimetype,
        });

        try {
            const savedRecord = await newExamPaper.save();
            createdRecords.push(savedRecord.toObject());
        } catch (error: any) {
            // If the DB save fails, we should ideally delete the file that was just uploaded to S3.
            throw new Error(`Failed to save exam paper record for ${file.originalname} to database: ${error.message}`);
        }
        }

        return createdRecords;
    }

    public async getModelEvaluatedPapersByOwner(ownerId: string): Promise<IModelEvaluatedExamPaper> {
        const papers = await ModelEvaluatedExamPaperModel.findOne({ owner_id: ownerId, is_deleted: false }).sort({_id:-1});
        if(!papers)
            throw new Error(`Exam paper with ID ${ownerId} not found.`);
        return papers;
    }

    public async getVerifiedPapersByOwner(ownerId: string): Promise<IVerifiedExamPaper> {
        const papers = await VerifiedExamPaperModel.findOne({ owner_id: ownerId, is_deleted: false }).sort({_id:-1});
        if(!papers)
            throw new Error(`Exam paper with ID ${ownerId} not found.`);
        return papers;
    }

    public async updateVerifiedExamPaper(paperId: string, evaluationData: IUserExamPaperEvaluation): Promise<IVerifiedExamPaper> {
        const updatedPaper = await VerifiedExamPaperModel.findByIdAndUpdate(
            paperId,
            { $set: { evaluation_report: evaluationData, processing_status: 'completed', processed_at: new Date() } },
            { new: true }
        ).sort({_id:-1}).exec();

        if (!updatedPaper) {
            throw new Error(`Verified exam paper with ID ${paperId} not found.`);
        }
        return updatedPaper;
    }
}

export default ExamPapersService.getInstance();