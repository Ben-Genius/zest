const strings = {
  appName: "Zest",

  auth: {
    signInTitle: "Sign In",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    signInButton: "Sign In",
    noAccount: "  Don't have an account?",
  },

 home: {
  title: "Class Performance",
  searchPlaceholder: "Search students or strands...",
  strandPerformance: "Performance by Strand",
  masteryKeyTitle: "Mastery Key",
  loading: "Loading...",
  error: "Error",
  retryButton: "Retry",
  noStudent: "No students found",
  student: "students",
  total: "Total",
  completed: "Completed",
  inProgress: "In Progress",
  notStarted: "Not Started",
  selectAll: "Select All",
  compact: "Compact",
  detailed: "Detailed",
  workCovered: "Work Covered",
  studentsLabel: "Students",
  archiveTitle: "Archive Strands",
  archiveMessage: (count: number) => `Archive ${count} selected strands?`,
  archive: "Archive",
   export: "Export",
  strands: {
      letterIdentification: "Letter Identification",
      letterNaming: "Letter Naming",
      letterFormation: "Letter Formation",
      phonemicAwareness: "Phonemic Awareness"
    },
},

  studentDetail: {
    title: "Student Details",
    downloadButton: "Download Report",
    progress: (percent: number) => `Work progress - ${percent}%`,
    studentPerformance: "Student Performance Overview",
  loading: "Loading student data...",
  completed: (val: number) => `${val}% completed`,
  target: "Target: 100%",
  lastUpdated: "Last updated: Today",
  weeklyImprovement: (val: number) => `Weekly improvement: +${val}%`,
  nextMilestone: (val: number) => `Next milestone: ${val}%`,
  viewDetails: "View Details",
    practice: "Practice",
    avgProgress: {
    label: "Average Progress",
    subtext: "Across all strands"
  },
  completedStrands: {
    label: "Completed Strands",
    subtext: "100% progress"
  },
  competenceLevels: {
    label: "Competence Levels",
    subtext: "ME or EE ratings"
  },
  highestCompetence: {
    label: "Highest Competence",
    subtext: "Best performance"
  },
  },

  masteryLevels: {
    BE: {
      label: "Below Expectation",
      description: "Needs support",
    },
    AE: {
      label: "Approaching Expectation",
      description: "Developing",
    },
    ME: {
      label: "Meeting Expectation",
      description: "On track",
    },
    EE: {
      label: "Exceeding Expectation",
      description: "Advanced",
    },
  },

   navigation: {
    tabs: {
      class: "Class",
      students: "Students",
      settings: "Settings",
    },
  },
   
   settings: {
  headerTitle: "Settings",
  headerSubtitle: "Manage your account and app preferences",
  profileName: "Azay Genius", // or make this dynamic
  profileEmail: "geniusben24@gmail.com", // or make this dynamic
  profileStatus: "Active",
  account: "Account",
  profileInfo: {
    title: "Profile Information",
    subtitle: "Update your personal details",
  },
  privacy: {
    title: "Privacy Settings",
    subtitle: "Manage your data and privacy",
  },
  preferences: "Preferences",
  darkMode: {
    title: "Dark Mode",
    subtitle: "Switch between light and dark themes",
  },
  autoDownload: {
    title: "Auto Download Reports",
    subtitle: "Automatically save performance reports",
  },
  appInfo: {
    version: "Zest Student Performance Tracker v1.0.0",
    tagline: "Built with ❤️ for educators",
  },
  logout: {
    button: "Log Out",
    confirmTitle: "Confirm Logout",
    confirmMessage: "Are you sure you want to log out?",
  },
}

};

export default strings;
