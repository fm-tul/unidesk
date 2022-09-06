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
  filled: "Filled",
  loading: "Loading",
  "import-successful": "Import successful",
  "type-to-search": "Type to search...",
  "search": "Search",
  create: "Create",
  update: "Update",

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
  keywords: "Keywords",
  "name-lang": (lang: string) => `Name (${lang})`,
  "multiple-types": "Multiple types",
  abstract: "Abstract",
  "abstract-lang": (lang: string) => `Abstract (${lang})`,
  "school-year": "School year",
  department: "Department",
  outcomes: "Expected Outcomes",
  "study-programme": "Study programme",
  "thesis-from-stag-id": "Thesis is linked with STAG using ID:",
  "suggested-keywords": "Suggested keywords",
  "no-keywords-found": "No keywords found",
  "create-new-keyword-for-x": (x: string) => `Create new keyword for ${x}`,

  // errors
  required: "Required",
  "min-3": "Select at least 3 values",
  "basic-information": "Basic information",

  //admin
  "administration-menu": "Administration",
  "admin-manage-x": (x: string) => `Manage ${x}`,

  // paging
  "page-of": "of",

  // keywords
  "keyword-used-count": "Used count",
};

export default en;
