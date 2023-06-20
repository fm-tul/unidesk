export const en = {
  id: "eng",
  locale: "en-UK",
  flag: "🇺🇸",
  language: "English",

  // common
  "common.upload": "Upload",
  "common.download": "Download",
  "common.clear": "Clear",
  "common.approve": "Approve",
  "common.reject": "Reject",
  "common.turn-down": "Reject",
  "common.invitation-sent": "Invitation sent",
  "common.save-first-before-contiuining": "Save first before continuing",
  "common.upload.drop-files-here": "Drop files here to upload",
  "common.remove-file": "Remove file",
  "common.file-removed-from-server": "File removed from server",
  "common.error.failed-to-send-invitation": "Failed to send invitation",
  "common.error.failed-to-remove-file-from-server": "Failed to remove file from server",
  "common.upload.error.file-too-large-x": (x: string) => `File too large. Maximum file size is ${x}.`,
  "common.upload.error.file-not-supported-x": (x: string) => `File type not supported. Supported file types are ${x}.`,


  // users
  "user-function": "User Function",
  "linked-with-stag": "Linked with STAG",
  "delete-user": "Delete User",
  deleted: "Deleted",
  delete: "Delete",
  "user-aliases": "User Aliases",
  days: "days",

  // report
  "report.section.general": "General",
  "report.section.evaluation": "Evaluation",
  "report.section.overall-evaluation": "Overall Evaluation",

  // report internships
  "report.section.internship.company-info": "Company Info",
  "report.section.internship.student-info": "Info about Student",
  "report.section.internship.internship-info": "Internship Details",
  "report.section.internship.date-and-place": "Date and Place",

  edit: "Edit",
  view: "View",

  // navbar
  import: "Import",
  styles: "Styles",
  login: "Login",
  logout: "Logout",
  "login.local-account": "Login with local account",
  "login.liane": "Login with LIANE",
  "login.title": "Login",
  "login.loading": "Logging in...",
  "login.username": "Your email",
  "login.password": "Password",
  "login.password-new": "New password",
  "login.password-new-repeat": "Repeat new password",
  "login.reset-token": "Reset token",
  "login.username.placeholder": "name@company.com",
  "login.password.placeholder": "********",
  "login.login": "Login",
  "login.change-password": "Change password",
  "login.register": "Register",
  "login.reset-password": "Reset password",
  "login.do-you-really-wish-to-reset-password": "Do you really wish to reset your password?",
  "login.reset-password-sent": "Email with the reset token has been sent to your email address.",


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
  "evalution.submitted": "Evaluation submitted",
  "evalution.submitted-error": "Error while submitting evaluation",
  "evalution.submitted-success": "Evaluation submitted successfully",
  "evalution.submitted-success-message": "Evaluation submitted successfully. You can now close this window.",
  "evaluation.invited": "Email with evaluation invitation has been sent to the user.",

  ok: "Ok",
  cancel: "Cancel",
  close: "Close",
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
  and: "and",
  "and-x-more": (x: number) => `and ${x} more`,

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
  "keywords.add-new": "Add new keyword",
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
  "form.required": "This field is required",
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
  "evaluation.evaluation-of-x": (x: string) => `Evaluation of ${x}`,
  "evaluation.invited-by-x": (x: string) => `Invited by ${x}`,
  "evaluation.you-have-been-invited-to-perform-evaluation-on-x-under-role-y": (x: string, y: string) => `You've been invited to perform evaluation on **${x}** under role **${y}**`,
  "evaluation.enter-passphrase-to-unlock": "Enter passphrase to unlock",

  "evaluation.accept-and-unlock": "Accept & unlock",
  "evaluation.reopen-and-unlock": "Reopen & unlock",
  "evaluation.continue-with-evaluation": "Continue with evaluation",
  "evaluation.provide-reason-for-rejection": "Please provide reason for rejection",
  "evaluation.attach-existing-pdf": "Attach existing PDF",

  "evaluation.appears-to-be-complete": "Evaluation appears to be complete. When you are ready, you can submit this evaluation.",
  "evaluation.cannot-be-edited-after-submission": "Please note that you will **not** be able to edit this evaluation after submission.",
  "evaluation.double-check-your-answers": "Double check your answers before submitting.",
  "evaluation.ready-to-submit": "I'm ready to submit this evaluation.",

  "evaluation.status.rejected": "You've rejected this evaluation, reason: ",
  "evaluation.status.submitted": "You've submitted this evaluation, thank you!",
  "evaluation.status.approved": "This evaluation has been approved, thank you!",
  "evaluation.status.published": "This evaluation has been published and is available for public. Thank you!",

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
  "link.internships": "Internships",
  "link.internship": "Internship",
  "link.emails": "Emails",

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
  "settings.departments": "Departments",
  "settings.faculties": "Faculties",
  "settings.school-years": "School Years",
  "settings.thesis-outcomes": "Thesis Outcomes",
  "settings.thesis-types": "Thesis Types",
  "settings.study-programmes": "Study Programmes",
  "settings.change-tracker": "Change Trackers",
  "settings.in-memory-options": "In-Memory Options",

  // select component
  "select-component.type-to-search": "Type to search...",
  "select-component.no-results-found": "No results found",

  // form
  "section.personal-information": "Personal Information",
  "section.functions-and-aliases": "Functions & Aliases",
  "section.roles-and-grants": "Roles & Grants",
  "section.teams-and-groups": "Teams & Groups",
  "section.teams": "Teams",
  "section.preferences": "Preferences",

  "section.team-information": "Team Information",
  "section.team-composition": "Team Composition",

  // help
  "help.user-function":
    "User Functions serves as a guide for users of the system. Please select all the functions which are applicable to this user.",
  "help.user-aliases":
    "User Aliases are used to connect your main account with other originating from STAG. Please select all the aliases which are applicable to this user.",
  "help.user-roles":
    "User Roles are used to grant you access to certain parts of the system. Please select all the roles which are applicable to this user.",
  "help.teams": "Teams are used to group users together. Please select all the teams which are applicable to this user.",

  // user function
  "user-function.none": "None",
  "user-function.guest": "Guest",
  "user-function.author": "Author",
  "user-function.teacher": "Teacher",
  "user-function.supervisor": "Supervisor",
  "user-function.opponent": "Opponent",
  "user-function.external": "External",

  // operators
  "operator.and-or": "And/Or",

  // confirm-dialog
  "confirm-dialog.title": "Are you sure?",
  "confirm-dialog.message": "This action cannot be undone.",
  "confirm-dialog.ok": "Confirm",
  "confirm-dialog.cancel": "Cancel",

  "confirm-dialog.are-you-sure-you-want-to-delete-this-team": "Are you sure you want to delete this team?",

  "home.welcome-to-temata": (username: string) => `Welcome to Témata FM TUL, ${username}!`,
  "home.i-am-looking-for-thesis": (
    <>
      I am{" "}
      <span className="group-hover:font-bold group-hover:underline group-hover:decoration-white/70 group-hover:decoration-2">looking</span>{" "}
      for thesis
    </>
  ),
  "home.i-want-to-create-thesis": (
    <>
      I want to{" "}
      <span className="group-hover:font-bold group-hover:underline group-hover:decoration-white/70 group-hover:decoration-2">create</span>{" "}
      thesis
    </>
  ),
  "home.i-want-to-register-internship": (
    <>
      I want to{" "}
      <span className="group-hover:font-bold group-hover:underline group-hover:decoration-white/70 group-hover:decoration-2">register</span>{" "}
      a new internship
    </>
  ),

  // thesis
  "thesis.no-thesis": "No thesis found",

  // user
  "user.create-new-user": "Create new user",
  "user.function.are": "are",
  "user.function.is": "is",
  "user.function.no-functions": "has no functions",
  "empty_string": "",
  

  // internships
  "internship.student": "Student",
  "internship.student.locked-description": "You cannot edit selected student, missing grants.",
  "internship.title": "Proffesional Internship",
  "internship.company-name": "Company Name",
  "internship.department": "Department",
  "internship.location": "Location",
  "internship.start-date": "Start Date",
  "internship.end-date": "End Date",
  "internship.period": "Internship Period",
  "internship.create-new": "Create new internship",
  "internship.edit": "Edit internship",

  "internship.add-note": "Add note",
  "internship.note-from-supervisor": "Note from supervisor",
  "internship.no-internships": "No internships found",
  "internship.submit-for-approval": "Submit for approval",
  "internship.approve-internship": "Approve internship",
  "internship.approve-internship-with-notes": "Approve internship with Note",
  "internship.reopen-internship": "Reopen internship",
  "internship.reject-internship": "Reject internship",
  "internship.mark-as-finished": "Mark as finished",
  "internship.mark-as-defended": "Mark as defended",
  "internship.download-evaluation-author": "Download final report of internship",
  "internship.download-evaluation-supervisor": "Download evaluation from supervisor",

  "internship.section.general": "General Details",
  "internship.section.dates": "Dates",
  "internship.section.contact": "Contact's Information",
  "internship.section.job-description": "Job Description",
  "internship.section.next-steps": "What needs to be done next?",
  "internship.section.files-to-download": "Files to download",

  "internship.next-steps.wait-until-internship-ends": "Wait until internship ends",
  "internship.next-steps.upload-final-report": "Upload final report of internship in PDF format",
  "internship.next-steps.invite-supervisor-to-evaluate": "Invite supervisor to evaluate internship",
  "internship.next-steps.wait-for-supervisor-to-evaluate": "Wait for supervisor to evaluate internship",
  "internship.next-steps.wait-for-manager-to-approve": "Wait for manager to approve evaluation of internship",
  "internship.next-steps.supervisor-contact-info-not-filled": "Supervisor contact information is not filled. Please fill it in the form below.",
  "internship.next-steps.supervisor-invited": "Supervisor was invited to evaluate internship. You will be notified when it is done.",

  "internship.supervisor-name": "Supervisor Name",
  "internship.supervisor-phone": "Supervisor Phone",
  "internship.supervisor-email": "Supervisor Email",
  "internship.requirements": "Requirements",
  "internship.abstract": "Abstract",
  "internship.keywords": "Keywords",
  "internship.comments": "Comments",
  "internship.warning.duration-6-weeks": "The internship duration is less than 6 weeks. Please check the dates.",
  "internship.warning.internalship-not-ended": "This internship has not ended yet.",
  "internship.error.start-date-must-be-before-end-date": "Start date must be before end date",

  "internship.status.submitted": "Internship application was submitted and is waiting for approval. You will be notified when it is approved.",
  "internship.status.approved": "Internship application was approved!",
  "internship.status.rejected": "Internship application was rejected.",
  "internship.status.reopened": "Internship application was not approved and was reopened for changes. Fix the issues and submit it again.",
  "internship.status.cancelled": "Internship application was cancelled.",
  "internship.status.finished": "Internship application was finished.",
  "internship.status.defended": "Internship application was finished and defended.",


  // emails

};

export default en;
