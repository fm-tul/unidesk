export const en = {
  id: "eng",
  flag: "🇺🇸",
  language: "English",

  // users
  "user-function": "User Function",

  // navbar
  import: "Import",
  styles: "Styles",
  login: "Login",
  logout: "Logout",

  // stag import
  "stag-sync": "Stag Sync",
  "imported-thesis": "Imported thesis",
  "imported-thesis-none": "No Thesis found to be imported",
  "imported-thesis-new": "new",

  // account-settings
  "account-settings": "Account Settings",
  "my-profile": "My Profile",
  firstName: "Firstname",
  lastName: "Lastname",
  middleName: "Middlename",
  titleBefore: "Title Before",
  titleAfter: "Title After",

  // general
  ok: "Ok",
  cancel: "Cancel",
  error: "error",
  "error-occurred": "Error occurred",
  topics: "Topics",
  status: "Status",
  all: "All",
  yes: "Yes",
  no: "No",
  "has-keywords": "Has keywords",
  "restore-work": "Restore work",
  saved: "Saved",
  saving: "Saving...",
  "error-saving": "Error while saving",
  filled: "Filled",
  loading: "Loading",
  "import-successful": "Import successful",
  "type-to-search": "Type to search...",
  search: "Search",
  create: "Create",
  update: "Update",
  clear: "Clear",
  "click-to-edit": "Click to edit",
  "add-new": "Add New",

  teams: "Teams",
  "user-roles": "User Roles",
  accept: "Accept",
  decline: "Decline",

  // history
  created: "Created",
  modified: "Modified",
  "created-by": "Created by",
  "modified-by": "Modified by",
  "created-by-user-at-time": (user: string, time: string) => `Created by ${user} (${time})`,
  "modified-by-user-at-time": (user: string, time: string) => `Modified by ${user} (${time})`,
  at: "at",

  // thesis
  "thesis-type": "Thesis type",
  name: "Name",
  authors: "Authors",
  supervisor: "Supervisor",
  supervisors: "Supervisors",
  opponent: "Opponent",
  opponents: "Opponents",
  keywords: "Keywords",
  "name-lang": (lang: string) => `Name (${lang})`,
  "multiple-types": "Multiple types",
  abstract: "Abstract",
  "abstract-lang": (lang: string) => `Abstract (${lang})`,
  "abstract-missing": "Abstract is missing",
  "school-year": "School year",
  department: "Department",
  outcomes: "Expected Outcomes",
  "study-programme": "Study programme",
  "thesis-from-stag-id": "Thesis is linked with STAG using ID:",
  "suggested-keywords": "Suggested keywords",
  "no-keywords-found": "No keywords found",
  "create-new-keyword-for-x": (x: string) => `Create new keyword for ${x}`,

  nameCze: "Name (Czech)",
  nameEng: "Name (English)",
  abstractCze: "Abstract (Czech)",
  abstractEng: "Abstract (English)",
  schoolYearId: "School year",
  departmentId: "Department",
  studyProgrammeId: "Study programme",
  thesisTypeCandidateIds: "Type",
  facultyId: "Faculty",
  outcomeIds: "Expected Outcomes",

  // errors
  required: "Required",
  "min-3": "Select at least 3 values",
  "basic-information": "Basic information",

  //admin
  "administration-menu": "Administration",
  "administration-actions": "Administration Actions",
  "admin-manage-x": (x: string) => `Manage ${x}`,

  // paging
  "page-of": "of",

  // keywords
  "keyword-used-count": "Used count",

  // links
  "link.import": "Stag Import",
  "link.styles": "Styles",
  "link.go-home": "Go home",

  "link.thesis": "Thesis",
  "link.theses": "Theses",
  "link.my-theses": "My Theses",
  "link.edit-thesis": "Edit Thesis",
  "link.create-thesis": "Create new Thesis",

  "link.keywords": "Keywords",
  "link.keyword": "Keyword",

  "link.user": "User",
  "link.my-profile": "My Profile",
  "link.user-profile": "User Profile",
  "link.users": "Users",

  "link.team": "Team",
  "link.teams": "Teams",
  "link.edit-team": "Edit Team",

  "link.admin": "Admin",

  "no-grants": "No grants",

  //settings
  "link.settings": "Settings",
  "settings.roles-and-grants": "Roles & Grants",

  // select component
  "select-component.type-to-search": "Type to search...",
  "select-component.no-results-found": "No results found",
};

export default en;
