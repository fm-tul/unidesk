export const en = {
  id: "eng",
  flag: "🇺🇸",
  language: "English",

  // users
  "user-function": "User Function",
  "linked-with-stag": "Linked with STAG",
  "delete-user": "Delete User",
  deleted: "Deleted",
  delete: "Delete",
  "user-aliases": "User Aliases",

  // report 
  "report.section.general": "General",
  "report.section.evaluation": "Evaluation",
  "report.section.overall-evaluation": "Overall Evaluation",

  // navbar
  import: "Import",
  styles: "Styles",
  login: "Login",
  logout: "Logout",
  "sort-by": "Sort by",
  "no-thesis-found": "No thesis found",

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
  submit: "Submit",
  "update-draft": "Save draft",
  "pdf-preview": "PDF Preview",
  "evalution-submitted": "Evaluation submitted",
  "evalution-submitted-error": "Error while submitting evaluation",

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
  "restore-work-from": "Restore work from",
  "clear-history": "Clear history",
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
  expand: "Expand",
  collapse: "Collapse",

  teams: "Teams",
  "user-roles": "User Roles",
  "team-name": "Team Name",
  "team-role": "Team Role",
  "no-teams": "No teams",
  accept: "Accept",
  decline: "Decline",
  leave: "Leave",
  remove: "Remove",
  "team.members": "Team Members",
  "team.invite-new-user": "Invite new user",
  "team.contact-email": "Contact email",

  // history
  created: "Created",
  modified: "Modified",
  "created-by": "Created by",
  "modified-by": "Modified by",
  "created-by-user-at-time": (user: string, time: string) => `Created by ${user} (${time})`,
  "modified-by-user-at-time": (user: string, time: string) => `Modified by ${user} (${time})`,
  at: "at",
  actions: "Actions",

  // thesis
  "thesis-type": "Thesis type",
  name: "Name",
  description: "Description",
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
  from: "From",
  "min-3": "Select at least 3 values",
  "basic-information": "Basic information",

  //admin
  "administration-menu": "Administration",
  "administration-actions": "Administration Actions",
  "admin-manage-x": (x: string) => `Manage ${x}`,
  proceed: "Proceed",

  // paging
  "page-of": "of",
  
  // keywords
  "keyword-used-count": "Used count",

  // evaluations
  "evaluation.manage": "Manage Evaluations",
  "evaluation.unlocked": "Unlocked",
  "evaluation.add-new-evalution": "Add new evaluation",
  "evaluation.edit-evalution": "Edit evaluation",
  "link.evaluation-detail": "Evaluation Detail",
  "evaluation.error-already-sent": "Cannot edit evaluation, the invitation has already been sent",

  "evaluation.find-existing-user": "Find existing user",
  "evaluation.evaluator-email": "Email of evaluator",
  "evaluation.evaluator-name": "Name of evaluator",
  "evaluation.evaluator-relation": "Relation to evaluator",
  "evaluation.language": "Language of evaluation",

  // links
  "link.import": "Stag Import",
  "link.styles": "Styles",
  "link.go-home": "Go home",

  "link.thesis": "Thesis",
  "link.theses": "Theses",
  "link.my-theses": "My Theses",
  "link.edit-thesis": "Edit Thesis",
  "link.create-thesis": "Create new Thesis",
  "link.evaluation-edit": "Edit Evaluation",

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
  

  // form
  "section.personal-information": "Personal Information",
  "section.functions-and-aliases": "Functions & Aliases",
  "section.roles-and-grants": "Roles & Grants",
  "section.teams-and-groups": "Teams & Groups",
  "section.teams": "Teams",

  "section.team-information": "Team Information",
  "section.team-composition": "Team Composition",

  // help
  "help.user-function": "User Functions serves as a guide for users of the system. Please select all the functions which are applicable to this user.",
  "help.user-aliases": "User Aliases are used to connect your main account with other originating from STAG. Please select all the aliases which are applicable to this user.",
  "help.user-roles": "User Roles are used to grant you access to certain parts of the system. Please select all the roles which are applicable to this user.",
  "help.teams": "Teams are used to group users together. Please select all the teams which are applicable to this user.",
};

export default en;
