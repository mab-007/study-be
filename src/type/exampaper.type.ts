export interface IScoringBreakdown {
  x_coordinate: number;
  y_coordinate: number;
  reasoning: string;
  mark_awarded: boolean;
  partial_mark_awarded: number;
  page_number: number;
}

export interface IMistakeMade {
  mistake_type: string; 
  x_coordinate: number;
  y_coordinate: number;
  mistake_description: string;
  lacking_competencies: string[]; 
  marks_lost: number;
  page_number: number;
}

export interface IQuestionEvaluation {
  question_id: number;
  component_id: string;
  question_summary: string;
  typology: string; 
  question_type: string; 
  page_number: number;
  x_coordinate: number;
  y_coordinate: number;
  marks_available: number;
  mark_scheme: string;
  chatper_name: string; 
  concepts_required: string[];
  student_answer: string;
  scoring_breakdown: IScoringBreakdown[];
  score_awarded: number;
  ideal_approach: string;
  student_approach: string;
  feedback: string;
  mistakes_made: IMistakeMade[];
  evaluation_score: string; 
}

export interface IUserExamPaperEvaluation {
  overall_score: number;
  total_possible_score: number;
  overall_feedback: string;
  predicted_grade: string; 
  questions: IQuestionEvaluation[];
  typology_performance: Record<string, any>; 
  concept_performance: Record<string, any>; 
  question_type_performance: Record<string, any>; 
  mistake_type_performance: Record<string, any>; 
  chapter_performance: Record<string, any>; 
  chapter_mistake_mapping: Record<string, any>; 
  question_summaries: any[]; 
  improvement_analysis: string;
  historical_comparison: any | null; 
}