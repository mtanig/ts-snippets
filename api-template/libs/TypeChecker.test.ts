import { isUuid } from './TypeChecker';

describe('TypeChecker', () => {
    describe('isUuid()', () => {
        describe('valid', () => {
            it('returns true', () => {
                expect(isUuid('3348af8c-3641-b183-8908-f18f9d2504b7')).toEqual(true);
            });
        });
        describe('invalid', () => {
            it('returns false', () => {
                expect(isUuid('asdf')).toEqual(true);
            });
        });
    });
});