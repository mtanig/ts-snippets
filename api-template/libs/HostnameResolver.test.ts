import HostnameResolver from "./HostnameResolver";

describe('HostnameResolver', () => {
    describe('resolve', () => {
        it('returns hosts by array', () => {
            const hostnames = HostnameResolver.resolve('xxx[08-10,18-20].{aaa,bbb}.example.co.jp');
            expect(JSON.stringify(hostnames)).toEqual(
                JSON.stringify([
                    'xxx08.aaa.example.co.jp',
                    'xxx08.bbb.example.co.jp',
                    'xxx09.aaa.example.co.jp',
                    'xxx09.bbb.example.co.jp',
                    'xxx10.aaa.example.co.jp',
                    'xxx10.bbb.example.co.jp',
                    'xxx18.aaa.example.co.jp',
                    'xxx18.bbb.example.co.jp',
                    'xxx19.aaa.example.co.jp',
                    'xxx19.bbb.example.co.jp',
                    'xxx20.aaa.example.co.jp',
                    'xxx20.bbb.example.co.jp'
                ]));
        });

        describe('hostname is none', () => {
            it('throws an error', () => {
                expect(() => HostnameResolver.resolve(<any>undefined)).toThrowError("Cannot read property 'length' of undefined");
            });
        });
    });
});