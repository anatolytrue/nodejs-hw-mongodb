const parseType = (contactType) => {
    const isString = typeof contactType === 'string';
    if (!isString) return;
    const isType = (contactType) => ['work', 'home', 'personal'].includes(contactType);
    if (isType(contactType)) return contactType;
};

const parseFavourite = (isFavourite) => {
    if (typeof isFavourite === 'boolean') {
        return isFavourite;
    } return null;
};


export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;

    const parsedContactType = parseType(contactType);
    const parsedIsFavourite = parseFavourite(isFavourite);

    return {
        contactType: parsedContactType,
        isFavourite: parsedIsFavourite
    };
};
