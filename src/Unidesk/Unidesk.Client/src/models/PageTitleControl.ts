const defaultTitle = "Témata FM TUL";
export const setTitle = (title: string) => {
    document.title = title;
}

export const setTitleDetails = (details: string, title: string|null = null) => {
    const pageTitle = title ?? defaultTitle;
    // concat title with details with middot
    document.title = `${details} \u00B7 ${pageTitle}`;
}