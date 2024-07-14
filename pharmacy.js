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
        this.drugs = this.drugs.map((currentDrug) => {
            const drugConfig =
                DRUGS_CONFIG[currentDrug.name] ?? DRUGS_CONFIG["default"];

            // apply benefit change before expiration
            if (currentDrug.expiresIn > 0) {
                // 1. check for special change depending on days left
                const specificChange = drugConfig.benefitChangeByDaysLeft?.find(
                    ({ daysLeft }) => currentDrug.expiresIn <= daysLeft
                ); // as the array of specificChangesByDayLeft is sorted by minimum value on daysLeft we are sure to apply to correct value

                if (specificChange) {
                    currentDrug.benefit += specificChange.benefitChange;
                }

                // 2. Apply default drug benefit change
                else {
                    currentDrug.benefit += drugConfig.benefitChange;
                }
            }
            // else apply benefit change after expiration
            else {
                currentDrug.benefit += drugConfig.benefitChangeAfterExpiration;
            }

            // subtract 1 day to drug if drug expires
            if (drugConfig.doExpire) {
                currentDrug.expiresIn -= 1;
            }

            // apply common drug rules
            currentDrug.benefit = Math.min(
                Math.max(currentDrug.benefit, MIN_BENEFIT),
                MAX_BENEFIT
            );

            return currentDrug;
        });

        return this.drugs;
    }
}
