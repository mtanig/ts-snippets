import { isUuid } from '../../../libs/TypeChecker';
import { v4 as uuidv4 } from "uuid";

export default class UserId {
    private readonly userId: string;

    constructor(userId?: string) {
        if (!userId) {
            userId = uuidv4()
        }
        if (typeof userId !== 'string') {
            throw new TypeError(`userId is not string.`);
        }
        if (!isUuid(userId)) {
            throw new TypeError(`userId is not uuid.`);
        }

        this.userId = userId;
    }

    getAsString(): string {
        return this.userId;
    }
}