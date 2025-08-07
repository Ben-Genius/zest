export type CompetenceLevel = "all" | "BE" | "AE" | "ME" | "EE";

export interface StrandStudent {
  studentId: string;
  name: string;
  competence: CompetenceLevel;
}

export interface Strand {
  strandId: string;
  strand: string;
  workCovered: number; // percentage
  students: StrandStudent[];
}

export interface ClassProfile {
  strands: Strand[];
}

export interface StudentStrandPerformance {
  competence: CompetenceLevel;
  progress: number;
}

export interface StudentDetails {
  key: string;
  id: string;
  name: string;
  strands: {
    letterIdentification: StudentStrandPerformance;
    letterNaming: StudentStrandPerformance;
    letterFormation: StudentStrandPerformance;
    phonemicAwareness: StudentStrandPerformance;
  };
}

export interface StrandStudentl {
  studentId: string;
  name: string;
  competence: string;
  avatar?: string;
  lastActivity?: string;
  performance?: "excellent" | "good" | "needs-improvement" | "at-risk";
}

export interface StrandListProps {
  filteredStrands: Strand[];
  navigation: any;
  theme: any;
  baseColors: any;
  strings: any;
  onStrandPress?: (strand: Strand) => void;
  onStudentPress?: (student: StrandStudent) => void;
  onBulkAction?: (strandIds: string[], action: string) => void;
}
