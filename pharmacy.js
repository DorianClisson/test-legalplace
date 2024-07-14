export class Drug {
    constructor(name, expiresIn, benefit) {
        this.name = name;
        this.expiresIn = expiresIn;
        this.benefit = benefit;
    }
}

// all drugs config
const MIN_BENEFIT = 0;
const MAX_BENEFIT = 50;

// drugs specifig config
// (benefitChangeByDaysLeft & benefitChangeAfterExpiration could be optional and code arranged that way but as we are not in Typescript I rather prefer specify them)
const DRUGS_CONFIG = {
    default: {
        benefitChange: -1,
        benefitChangeByDaysLeft: null,
        benefitChangeAfterExpiration: -2,
        doExpire: true,
    },
    "Herbal Tea": {
        benefitChange: 1,
        benefitChangeByDaysLeft: null,
        benefitChangeAfterExpiration: 2,
        doExpire: true,
    },
    "Magic Pill": {
        benefitChange: 0,
        benefitChangeByDaysLeft: null,
        benefitChangeAfterExpiration: 0,
        doExpire: false,
    },
    Fervex: {
        benefitChange: 1,
        benefitChangeByDaysLeft: [
            { daysLeft: 10, benefitChange: 2 },
            { daysLeft: 5, benefitChange: 3 },
        ],
        benefitChangeAfterExpiration: -999, // just set a high enough value to force benefit drop to 0
        doExpire: true,
    },
};
// sort each drug benefitChangeByDaysLeft in DRUGS_CONFIG to ensure the minimum daysLeft config is sorted first
// so that .find() takes the lowest first because e.g. daysLeft 4 matches both <=5 & <=10
Object.values(DRUGS_CONFIG).forEach((drugConfig) => {
    if (drugConfig.benefitChangeByDaysLeft) {
        drugConfig.benefitChangeByDaysLeft =
            drugConfig.benefitChangeByDaysLeft.sort(
                (a, b) => a.daysLeft - b.daysLeft
            );
    }
});

export class Pharmacy {
    constructor(drugs = []) {
        this.drugs = drugs;
    }
    updateBenefitValue() {
        for (var i = 0; i < this.drugs.length; i++) {
            if (
                this.drugs[i].name != "Herbal Tea" &&
                this.drugs[i].name != "Fervex"
            ) {
                if (this.drugs[i].benefit > 0) {
                    if (this.drugs[i].name != "Magic Pill") {
                        this.drugs[i].benefit = this.drugs[i].benefit - 1;
                    }
                }
            } else {
                if (this.drugs[i].benefit < 50) {
                    this.drugs[i].benefit = this.drugs[i].benefit + 1;
                    if (this.drugs[i].name == "Fervex") {
                        if (this.drugs[i].expiresIn < 11) {
                            if (this.drugs[i].benefit < 50) {
                                this.drugs[i].benefit =
                                    this.drugs[i].benefit + 1;
                            }
                        }
                        if (this.drugs[i].expiresIn < 6) {
                            if (this.drugs[i].benefit < 50) {
                                this.drugs[i].benefit =
                                    this.drugs[i].benefit + 1;
                            }
                        }
                    }
                }
            }
            if (this.drugs[i].name != "Magic Pill") {
                this.drugs[i].expiresIn = this.drugs[i].expiresIn - 1;
            }
            if (this.drugs[i].expiresIn < 0) {
                if (this.drugs[i].name != "Herbal Tea") {
                    if (this.drugs[i].name != "Fervex") {
                        if (this.drugs[i].benefit > 0) {
                            if (this.drugs[i].name != "Magic Pill") {
                                this.drugs[i].benefit =
                                    this.drugs[i].benefit - 1;
                            }
                        }
                    } else {
                        this.drugs[i].benefit =
                            this.drugs[i].benefit - this.drugs[i].benefit;
                    }
                } else {
                    if (this.drugs[i].benefit < 50) {
                        this.drugs[i].benefit = this.drugs[i].benefit + 1;
                    }
                }
            }
        }

        return this.drugs;
    }
}
