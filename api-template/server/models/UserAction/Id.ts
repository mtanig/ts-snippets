import { isUuid } from '../../../libs/TypeChecker';
import { v4 as uuidv4 } from "uuid";

export default class Id {
    private readonly id: string;

    constructor(id?: string) {
        if (!id) {
            id = uuidv4()
        }
        if (typeof id !== 'string') {
            throw new TypeError(`id is not string.`);
        }
        if (!isUuid(id)) {
            throw new TypeError(`id is not uuid.`);
        }

        this.id = id;
    }

    getAsString(): string {
        return this.id;
    }
}