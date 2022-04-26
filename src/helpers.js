export function replaceInText(text, search, replace) {
    if (Array.isArray(search)) {
        search.forEach((element, index) => {
            let replaceEl = replace;
            if (Array.isArray(replace)) replaceEl = replace[index];
            text = text.replace(element, replaceEl);
        });
    } else {
        return text.replace(search, replace);
    }
    return text;
}

export function getNationFlag(nation) {
    const flag = require(`./assets/ships/nations/Wows_flag_${ nation }.png`);
    if (flag) return flag;
    return false;
}

export function getShipTypeIcon(type) {
    const icon = require(`./assets/ships/types/${ type }.png`);
    if (icon) return icon;
    return false;
}

export function normalizeRequest(request) {
    if (!request) return '';
    return request.toLowerCase().trim()
        .normalize("NFD")
        .replace(/[\u00df-\u00ff][\u0300-\u036f][\u1e02-\u1ef3]/g, '');
}
