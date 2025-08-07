const strings = {
  appName: "Zest",

  auth: {
    signInTitle: "Sign In",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    signInButton: "Sign In",
    noAccount: "  Don't have an account?"
  },

  home: {
    title: "Class Performance",
    searchPlaceholder: "Search student...",
    strandPerformance: "Performance by Strand",
    masteryKeyTitle: "Mastery Key",
    loading: "Loading...",
    error : "Error",
    noStudent: " No students found",
    student: "students",
    strands: {
      letterIdentification: "Letter Identification",
      letterNaming: "Letter Naming",
      letterFormation: "Letter Formation",
      phonemicAwareness: "Phonemic Awareness"
    },

    progressCovered: (percent: number) => `${percent}% of work covered`
  },

  studentDetail: {
    title: "Student Details",
    downloadButton: "Download Report",
    progress: (percent: number) => `Work progress - ${percent}%`,
    studentPerformance: "Student Performance Overview"
  },

  masteryLevels: {
    BE: "Below Expectation",
    AE: "Approaching Expectation",
    ME: "Meeting Expectation",
    EE: "Exceeding Expectation"
  }
};

export default strings;
