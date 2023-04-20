import { ILocale } from "../all";

export const cs: ILocale = {
  id: "cze",
  flag: "🇨🇿",
  language: "Čeština",

  // users
  "user-function": "Funkce uživatele",
  "linked-with-stag": "Propojeno se STAG",
  "delete-user": "Smazat uživatele",
  deleted: "Smazáno",
  delete: "Smazat",
  "user-aliases": "Uživatelské aliasy",
  days: "dní",

  // report
  "report.section.general": "Obecné",
  "report.section.evaluation": "Hodnocení",
  "report.section.overall-evaluation": "Celkové hodnocení",

  edit: "Upravit",
  view: "Zobrazit",

  // navbar
  import: "Importovat",
  styles: "Styly",
  login: "Přihlásit se",
  logout: "Odhlásit se",
  "login.local-account": "Přihlášení pomocí lokálního účtu",
  "login.liane": "Přihlášení pomocí LIANE",
  "login.title": "Přihlášení",
  "login.loading": "Přihlašuji...",
  "login.username": "Váš e-mail",
  "login.password": "Heslo",
  "login.password-new": "Nové heslo",
  "login.password-new-repeat": "Nové heslo znovu",
  "login.reset-token": "Token pro obnovení hesla",
  "login.change-password": "Změnit heslo",
  "login.username.placeholder": "jmeno@spolecnost.cz",
  "login.password.placeholder": "********",
  "login.login": "Přihlásit se",
  "login.register": "Registrovat se",
  "login.reset-password": "Zapomenuté heslo",
  "login.do-you-really-wish-to-reset-password": "Opravdu chcete obnovit heslo?",
  "login.reset-password-sent": "Na váš e-mail byl odeslán token pro obnovení hesla.",

  "sort-by": "Seřadit podle",
  "no-thesis-found": "Nenalezena žádná práce",

  // stag import
  "stag-sync": "Stag synchronizace",
  "imported-thesis": "Importovaná práce",
  "imported-thesis-none": "Nebyla nalezena žádná práce k importu",
  "imported-thesis-new": "nová",

  // account-settings
  "account-settings": "Nastavení účtu",
  "my-profile": "Můj profil",
  firstName: "Jméno",
  lastName: "Příjmení",
  middleName: "Prostřední jméno",
  titleBefore: "Titul před",
  titleAfter: "Titul za",
  submit: "Odeslat",
  "update-draft": "Uložit koncept",
  "pdf-preview": "Náhled PDF",
  "evalution.submitted": "Hodnocení odesláno",
  "evalution.submitted-error": "Chyba při odesílání hodnocení",
  "evalution.submitted-success": "Hodnocení úspěšně odesláno",
  "evalution.submitted-success-message": "Hodnocení úspěšně odesláno. Nyní můžete zavřít toto okno.",

  ok: "Ok",
  cancel: "Zrušit",
  close: "Zavřít",
  error: "chyba",
  "error-occurred": "Došlo k chybě",
  topics: "Témata",
  status: "Stav",
  all: "Vše",
  yes: "Ano",
  no: "Ne",
  "has-keywords": "Má klíčová slova",
  "restore-work": "Obnovit práci",
  "restore-work-from": "Obnovit práci z",
  "clear-history": "Vymazat historii",
  saved: "Uloženo",
  saving: "Ukládám...",
  "error-saving": "Chyba při ukládání",
  filled: "Vyplněno",
  loading: "Načítání",
  "import-successful": "Import úspěšný",
  "type-to-search": "Začněte psát pro vyhledávání...",
  search: "Hledat",
  create: "Vytvořit",
  update: "Aktualizovat",
  clear: "Vymazat",
  "click-to-edit": "Klikněte pro úpravu",
  "add-new": "Přidat nový",
  expand: "Rozbalit",
  collapse: "Sbalit",

  teams: "Týmy",
  "user-roles": "Role uživatele",
  "team-name": "Název týmu",
  "team-role": "Role v týmu",
  "no-teams": "Žádné týmy",
  accept: "Přijmout",
  decline: "Odmítnout",
  leave: "Odejít",
  remove: "Odstranit",
  "team.members": "Členové týmu",
  "team.invite-new-user": "Pozvat nového uživatele",
  "team.contact-email": "Kontaktní e-mail",

  // history
  created: "Vytvořeno",
  modified: "Upraveno",
  "created-by": "Vytvořil",
  "modified-by": "Upravil",
  "created-by-user-at-time": ((user: string, time: string) => `Vytvořil ${user} (${time})`) as any,
  "modified-by-user-at-time": ((user: string, time: string) => `Upravil ${user} (${time})`) as any,
  at: "v",
  actions: "Akce",

  // thesis
  "thesis-type": "Typ práce",
  name: "Název",
  description: "Popis",
  authors: "Autoři",
  supervisor: "Vedoucí",
  supervisors: "Vedoucí",
  opponent: "Oponent",
  opponents: "Oponenti",
  keywords: "Klíčová slova",
  "keywords.add-new": "Přidat nové",
  "name-lang": ((lang: string) => `Název (${lang})`) as any,
  "multiple-types": "Více typů",
  abstract: "Abstrakt",
  "abstract-lang": ((lang: string) => `Abstrakt (${lang})`) as any,
  "abstract-missing": "Chybí abstrakt",
  "school-year": "Školní rok",
  department: "Katedra",
  outcomes: "Předpokládané výsledky",
  "study-programme": "Studijní program",
  "thesis-from-stag-id": "Práce je propojena se STAG pomocí ID:",
  "suggested-keywords": "Navrhovaná klíčová slova",
  "no-keywords-found": "Nebyla nalezena žádná klíčová slova",
  "create-new-keyword-for-x": ((x: string) => `Vytvořit nové klíčové slovo pro ${x}`) as any,

  nameCze: "Název (česky)",
  nameEng: "Název (anglicky)",
  abstractCze: "Abstrakt (česky)",
  abstractEng: "Abstrakt (anglicky)",
  schoolYearId: "Školní rok",
  departmentId: "Katedra",
  studyProgrammeId: "Studijní program",
  thesisTypeCandidateIds: "Typ",
  facultyId: "Fakulta",
  outcomeIds: "Předpokládané výsledky",

  // errors
  required: "Vyžadováno",
  from: "Od",
  "min-3": "Vyberte alespoň 3 hodnoty",
  "basic-information": "Základní informace",

  //admin
  "administration-menu": "Administrace",
  "administration-actions": "Administrativní akce",
  "admin-manage-x": ((x: string) => `Spravovat ${x}`) as any,
  proceed: "Pokračovat",

  // paging
  "page-of": "z",

  // keywords
  "keyword-used-count": "Počet použití",

  // evaluations
  "evaluation.manage": "Spravovat hodnocení",
  "evaluation.unlocked": "Odemčeno",
  "evaluation.add-new-evalution": "Přidat nové hodnocení",
  "evaluation.edit-evalution": "Upravit hodnocení",
  "link.evaluation-detail": "Detail hodnocení",
  "evaluation.error-already-sent": "Hodnocení nelze upravit, pozvánka již byla odeslána",

  "evaluation.find-existing-user": "Najít existujícího uživatele",
  "evaluation.evaluator-email": "E-mail hodnotitele",
  "evaluation.evaluator-name": "Jméno hodnotitele",
  "evaluation.evaluator-relation": "Vztah k hodnotiteli",
  "evaluation.language": "Jazyk hodnocení",

  // links
  "link.import": "Import ze STAGu",
  "link.styles": "Styly",
  "link.go-home": "Domů",

  "link.thesis": "Práce",
  "link.theses": "Práce",
  "link.my-theses": "Moje práce",
  "link.edit-thesis": "Upravit práci",
  "link.create-thesis": "Vytvořit novou práci",
  "link.evaluation-edit": "Upravit hodnocení",
  "link.internships": "Praxe",
  "link.internship": "Praxe",

  "link.keywords": "Klíčová slova",
  "link.keyword": "Klíčové slovo",

  "link.user": "Uživatel",
  "link.my-profile": "Můj profil",
  "link.user-profile": "Profil uživatele",
  "link.users": "Uživatelé",

  "link.team": "Tým",
  "link.teams": "Týmy",
  "link.edit-team": "Upravit tým",

  "link.admin": "Admin",

  "no-grants": "Žádná oprávnění",

  //settings
  "link.settings": "Nastavení",
  "settings.roles-and-grants": "Role & Oprávnění",
  "select-component.no-results-found": "Nebyly nalezeny žádné výsledky",

  // form
  "section.personal-information": "Osobní informace",
  "section.functions-and-aliases": "Funkce & Aliasy",
  "section.roles-and-grants": "Role & Oprávnění",
  "section.teams-and-groups": "Týmy & Skupiny",
  "section.teams": "Týmy",

  "section.team-information": "Informace o týmu",
  "section.team-composition": "Složení týmu",

  // help
  "help.user-function":
    "Funkce uživatele slouží jako průvodce pro uživatele systému. Vyberte všechny funkce, které se na tohoto uživatele vztahují.",
  "help.user-aliases":
    "Aliasy uživatele se používají pro propojení vašeho hlavního účtu s dalšími účty ze STAGu. Vyberte všechny aliasy, které se na tohoto uživatele vztahují.",
  "help.user-roles":
    "Role uživatele slouží k získání přístupu k určitým částem systému. Vyberte všechny role, které se na tohoto uživatele vztahují.",
  "help.teams": "Týmy slouží k seskupení uživatelů. Vyberte všechny týmy, které se na tohoto uživatele vztahují.",

  // user function
  "user-function.none": "Žádná",
  "user-function.guest": "Host",
  "user-function.author": "Autor",
  "user-function.teacher": "Učitel",
  "user-function.supervisor": "Vedoucí",
  "user-function.opponent": "Oponent",
  "user-function.external": "Externí",
  "internship.period": "Období praxe",

  // operators
  "operator.and-or": "A/Nebo",

  // confirm-dialog
  "confirm-dialog.title": "Jste si jistý?",
  "confirm-dialog.message": "Tato akce nemůže být vrácena.",
  "confirm-dialog.ok": "Potvrdit",
  "confirm-dialog.cancel": "Zrušit",

  "confirm-dialog.are-you-sure-you-want-to-delete-this-team": "Opravdu chcete smazat tento tým?",
};
