export interface GradeLevel {
  id: string;
  grade: number;
  levelName: string;
  averageAge: number;
  numberOfQuestions: number;
  instructions: string;
  storyWordCount: number;
}

export interface GradeLevelsResponse {
  gradeLevels: GradeLevel[];
}
