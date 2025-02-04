import { SumA } from "./index";

describe("Testando jest", () => {
    it("teste qualqyer", () => {
        const a = new SumA();

        const Sum1 = 2;
        const Sum2 = 3;

        const result = Sum1 + 4;
        expect(a.a(Sum1, Sum2)).toEqual(result);
    });
});
