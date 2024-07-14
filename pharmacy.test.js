import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
    describe("Default drug e.g. Doliprane", () => {
        it("should decrease the benefit and expiresIn with", () => {
            expect(
                new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()
            ).toEqual([new Drug("test", 1, 2)]);
        });

        it("should double decrease the benefit after expiration", () => {
            expect(
                new Pharmacy([new Drug("test", 0, 3)]).updateBenefitValue()
            ).toEqual([new Drug("test", -1, 1)]);
        });

        it("should no go negative benefit", () => {
            expect(
                new Pharmacy([new Drug("test", 0, 1)]).updateBenefitValue()
            ).toEqual([new Drug("test", -1, 0)]);
        });
    });

    describe("Herbal Tea", () => {
        it("should increase the benefit", () => {
            expect(
                new Pharmacy([
                    new Drug("Herbal Tea", 2, 3),
                ]).updateBenefitValue()
            ).toEqual([new Drug("Herbal Tea", 1, 4)]);
        });

        it("should double increase the benefit after expiration", () => {
            expect(
                new Pharmacy([
                    new Drug("Herbal Tea", 0, 3),
                ]).updateBenefitValue()
            ).toEqual([new Drug("Herbal Tea", -1, 5)]);
        });

        it("should not overcap 50 benefit", () => {
            expect(
                new Pharmacy([
                    new Drug("Herbal Tea", 0, 49),
                ]).updateBenefitValue()
            ).toEqual([new Drug("Herbal Tea", -1, 50)]);
        });
    });

    describe("Magic Pill", () => {
        it("should never expires or decreases in benefit", () => {
            expect(
                new Pharmacy([
                    new Drug("Magic Pill", 2, 2),
                ]).updateBenefitValue()
            ).toEqual([new Drug("Magic Pill", 2, 2)]);
        });
    });

    describe("Fervex", () => {
        it("should increase by 1 by default", () => {
            expect(
                new Pharmacy([new Drug("Fervex", 20, 20)]).updateBenefitValue()
            ).toEqual([new Drug("Fervex", 19, 21)]);
        });

        it("should increase by 2 when expires in <= 10", () => {
            expect(
                new Pharmacy([new Drug("Fervex", 10, 20)]).updateBenefitValue()
            ).toEqual([new Drug("Fervex", 9, 22)]);
        });

        it("should increase by 3 when expires in <= 5", () => {
            expect(
                new Pharmacy([new Drug("Fervex", 5, 20)]).updateBenefitValue()
            ).toEqual([new Drug("Fervex", 4, 23)]);
        });

        it("should drop benefit to 0 after expiration", () => {
            expect(
                new Pharmacy([new Drug("Fervex", 0, 20)]).updateBenefitValue()
            ).toEqual([new Drug("Fervex", -1, 0)]);
        });
    });

    describe("Dafalgan", () => {
        it("should decrease the benefit and expiresIn with", () => {
            expect(
                new Pharmacy([new Drug("Dafalgan", 2, 4)]).updateBenefitValue()
            ).toEqual([new Drug("Dafalgan", 1, 2)]);
        });

        it("should double decrease the benefit after expiration", () => {
            expect(
                new Pharmacy([new Drug("Dafalgan", 0, 4)]).updateBenefitValue()
            ).toEqual([new Drug("Dafalgan", -1, 0)]);
        });

        it("should no go negative benefit", () => {
            expect(
                new Pharmacy([new Drug("Dafalgan", 0, 1)]).updateBenefitValue()
            ).toEqual([new Drug("Dafalgan", -1, 0)]);
        });
    });
});
