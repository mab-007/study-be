import mongoose, { Document, Schema } from 'mongoose';
import { IUserExamPaperEvaluation } from '../type/exampaper.type';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type BoardType = 'IGCSE' | 'CBSE';

export interface IUserExamPaper extends Document {
  owner_id: string; // Corresponds to Supabase user UUID
  storage_path: string;
  board_type?: BoardType;
  exam_metadata?: Record<string, any>[];
  evaluation_report?: IUserExamPaperEvaluation;
  answer_mapping?: Record<string, any>;
  syllabus_ids?: string[];
  processing_status: ProcessingStatus;
  processing_model?: string;
  processing_time_seconds?: string;
  processing_error?: string;
  original_filename?: string;
  student_name?: string;
  ib_template_id?: string;
  file_size?: number;
  content_type?: string;
  is_deleted: boolean;
  processed_at?: Date;
}

const UserExamPaperSchema: Schema = new Schema({
  owner_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  storage_path: {
    type: String,
    required: true,
  },
  board_type: {
    type: String,
    enum: ['IGCSE', 'CBSE'],
    index: true,
  },
  exam_metadata: {
    type: [Schema.Types.Mixed],
  },
  evaluation_report: {
    type: Schema.Types.Mixed,
  },
  answer_mapping: {
    type: Schema.Types.Mixed,
  },
  syllabus_ids: {
    type: [String],
  },
  processing_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true,
  },
  processing_model: {
    type: String,
  },
  processing_time_seconds: {
    type: String,
  },
  processing_error: {
    type: String,
  },
  original_filename: {
    type: String,
  },
  student_name: {
    type: String,
  },
  ib_template_id: {
    type: String, // Assuming UUID string
  },
  file_size: {
    type: Number,
  },
  content_type: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  processed_at: {
    type: Date,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const UserExamPaperModel = mongoose.model<IUserExamPaper>('UserUserExamPaper', UserExamPaperSchema);

export default UserExamPaperModel;

