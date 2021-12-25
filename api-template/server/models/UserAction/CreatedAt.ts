import { isDate } from '../../../libs/TypeChecker';

export default class CreatedAt {
    private readonly createdAt: Date;

    constructor(createdAt: Date | undefined) {
        if (createdAt && !isDate(createdAt)) {
            throw new TypeError(`createdAt is not Date.`);
        }

        this.createdAt = createdAt || new Date();
    }

    getAsDate() {
        return this.createdAt;
    }

    getAsString() {
        return this.createdAt.toJSON();
    }
}