export function replaceInText(text, search, replace) {
    if (Array.isArray(search)) {
        search.forEach((element, index) => {
            let replaceEl = replace;
            if (Array.isArray(replace)) replaceEl = replace[index];
            text = text.replace(element, replaceEl)
        })
    } else {
        return text.replace(search, replace);
    }
    return text;
}

export function getNationFlag(nation) {
    const flag = require(`./assets/ships/nations/Wows_flag_${nation}.png`)
    if (flag) return flag;
    return false
}

export function getShipTypeIcon(type) {
    const icon = require(`./assets/ships/types/${type}.png`)
    if (icon) return icon;
    return false
}

export function normalizeRequest(request) {
    if (!request) return '';
    return request.toLowerCase().trim()
        .replace('ą', 'a')
        .replace('å', 'a')
        .replace('ä', 'a')
        .replace('à', 'a')
        .replace('â', 'a')
        .replace('ć', 'c')
        .replace('ç', 'c')
        .replace('ę', 'e')
        .replace('é', 'e')
        .replace('è', 'e')
        .replace('ê', 'e')
        .replace('ë', 'e')
        .replace('î', 'i')
        .replace('ì', 'i')
        .replace('ï', 'i')
        .replace('ł', 'l')
        .replace('ń', 'n')
        .replace('ó', 'o')
        .replace('ò', 'o')
        .replace('ö', 'o')
        .replace('ô', 'o')
        .replace('ø', 'o')
        .replace('ś', 's')
        .replace('ß', 'ss')
        .replace('ü', 'u')
        .replace('û', 'u')
        .replace('ù', 'u')
        .replace('ź', 'z')
        .replace('ż', 'z');
}
