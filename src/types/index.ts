export type CompetenceLevel ="all"| "BE" | "AE" | "ME" | "EE";

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
  key:string,
  id: string;
  name: string;
  strands: {
    letterIdentification: StudentStrandPerformance;
    letterNaming: StudentStrandPerformance;
    letterFormation: StudentStrandPerformance;
    phonemicAwareness: StudentStrandPerformance;
  };
}
