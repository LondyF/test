export interface Answer {
  lovId: number;
  id: number;
  answer: string;
  sortOrder: number;
}

export interface Question {
  id: number;
  question: string;
  answerId: number;
  sortOrder: number;
  mc: Answer[];
}

export interface HealthCheckUpQuestions {
  id: number;
  lastMeting: string;
  naam: string;
  info: string;
  sortOrder: number;
  questions300: Question[];
}

export interface GetHealthCheckUpQuestionsResponse {
  questions: HealthCheckUpQuestions;
}
