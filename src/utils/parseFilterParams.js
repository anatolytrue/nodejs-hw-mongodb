const parseType = (contactType) => {
    const isString = typeof contactType === 'string';
    if (!isString) return;
    const isType = (contactType) => ['work', 'home', 'personal'].includes(contactType);
    if (isType(contactType)) return contactType;
};

const parseFavorite = (isFavorite) => {
    if (typeof isFavorite === 'boolean') {
        return isFavorite;
    } return null;
};


export const parseFilterParams = (query) => {
    const { contactType, isFavorite } = query;

    const parsedContactType = parseType(contactType);
    const parsedIsFavorite = parseFavorite(isFavorite);

    return {
        contactType: parsedContactType,
        isFavorite: parsedIsFavorite
    };
};
