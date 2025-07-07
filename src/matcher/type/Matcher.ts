export class Matcher {
    private __type = '__matcher__';

    static is(value: any): value is Matcher {
        return value?.__type === '__matcher__';
    }

    public match(value: any): boolean {
        return false;
    }

    public toString(): string {
        return "";
    }
}
