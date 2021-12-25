export const UUID_REGEX_STR = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const UUID_REGEX = new RegExp(UUID_REGEX_STR);

export function isUuid(uuid: any): boolean {
    return UUID_REGEX.test(uuid);
}
export function isDate(date: any): boolean {
    return Object.prototype.toString.call(date) == '[object Date]';
}
