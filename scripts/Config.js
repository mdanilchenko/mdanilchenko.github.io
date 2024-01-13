import StoreProvider from "./StoreProvider.js"

const DEFAULT_CONFIG = {
    workdaysPerWeek: 5,
    paramsMaxScore: 5,
    params:[
        {
            name: 'Customer Impact',
            description: 'Number of customers impacted by the activity',
            weight: 3,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: 'Minor',
                    value: 2,
                },
                {
                    key: 'Fraction',
                    value: 3,
                },
                {
                    key: 'Majority',
                    value: 4,
                },
                {
                    key: 'All or significant customers',
                    value: 5,
                }
            ]
        },
        {
            name: 'Partners Impact',
            description: 'Number of partners impacted by the activity',
            weight: 1,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: 'Minor',
                    value: 2,
                },
                {
                    key: 'Fraction',
                    value: 3,
                },
                {
                    key: 'Majority',
                    value: 4,
                },
                {
                    key: 'All or significant partners',
                    value: 5,
                }
            ]
        },
        {
            name: 'Financial Impact',
            description: 'What revenue impact expected',
            weight: 2,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: '<10%',
                    value: 2,
                },
                {
                    key: '<50%',
                    value: 3,
                },
                {
                    key: '<100%',
                    value: 4,
                },
                {
                    key: '>=2x (multiplication)',
                    value: 5,
                }
            ]
        },
        {
            name: 'Goal or KPI Impact',
            description: 'Expected impact on project goal or KPI',
            weight: 1,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: '<10%',
                    value: 2,
                },
                {
                    key: '<50%',
                    value: 3,
                },
                {
                    key: '<100%',
                    value: 4,
                },
                {
                    key: '>=2x (multiplication)',
                    value: 5,
                }
            ]
        },
        {
            name: 'Cost',
            description: 'Implementation cost (time, money, team capacity). Mapped to a feture size (T-shirt size)',
            weight: 1,
            values: [
                {
                    key: 'S<',
                    value: 1,
                },
                {
                    key: 'M',
                    value: 2,
                },
                {
                    key: 'L',
                    value: 3,
                },
                {
                    key: 'XL',
                    value: 4,
                },
                {
                    key: 'XXL+',
                    value: 5,
                }
            ]
        },
        {
            name: 'Risk',
            description: 'Risk factors of the effort mapped to possible cost increase.',
            weight: 2,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: 'Mitigatable with no cost impact',
                    value: 2,
                },
                {
                    key: '<10% cost increase',
                    value: 3,
                },
                {
                    key: '<100% cost increase',
                    value: 4,
                },
                {
                    key: '>100% cost increase',
                    value: 5,
                }
            ]
        },
        {
            name: 'Dependencies on others',
            description: 'Can the project be delivered by the unit itself, or certain level of collaboration required',
            weight: 3,
            values: [
                {
                    key: 'No',
                    value: 1,
                },
                {
                    key: 'Consultations',
                    value: 2,
                },
                {
                    key: 'Priority alignment',
                    value: 3,
                },
                {
                    key: 'Delivery blockers',
                    value: 4,
                },
                {
                    key: 'Multiple parallel delivery blockers',
                    value: 5,
                }
            ]
        },
        {
            name: 'Leadership/Management initiative',
            description: 'Is this effort iitiared or monitored by high leadership of the company? Maps to an effort level',
            weight: 3,
            values: [
                {
                    key: 'Team-level',
                    value: 1,
                },
                {
                    key: 'Project-level',
                    value: 2,
                },
                {
                    key: 'Organization/Unit level',
                    value: 3,
                },
                {
                    key: 'Department/Branch level',
                    value: 4,
                },
                {
                    key: 'Company level',
                    value: 5,
                }
            ]
        },
        {
            name: 'Visibility',
            description: 'Effort visibility for customers',
            weight: 2,
            values: [
                {
                    key: 'Internal',
                    value: 1,
                },
                {
                    key: 'Indirect',
                    value: 2,
                },
                {
                    key: 'Minor',
                    value: 3,
                },
                {
                    key: 'Moderate',
                    value: 4,
                },
                {
                    key: 'Major/Global',
                    value: 5,
                }
            ]
        },
        {
            name: 'Team bandwidth',
            description: 'What amount of team resources needed',
            weight: 1,
            values: [
                {
                    key: 'Single owner',
                    value: 1,
                },
                {
                    key: 'Multiple experts',
                    value: 2,
                },
                {
                    key: '<50% of capacity',
                    value: 3,
                },
                {
                    key: '<100% or minor lack of resources',
                    value: 4,
                },
                {
                    key: 'Significant lack of resources',
                    value: 5,
                }
            ]
        },
        {
            name: 'Team skills',
            description: 'Does the team has enough expertees to deliver the effort?',
            weight: 1,
            values: [
                {
                    key: '100% enough.',
                    value: 1,
                },
                {
                    key: 'Minor learning or consultation required.',
                    value: 2,
                },
                {
                    key: 'Major learning or coaching.',
                    value: 3,
                },
                {
                    key: 'Require external expert(s).',
                    value: 4,
                },
                {
                    key: 'No knowledge at all.',
                    value: 5,
                }
            ]
        }
    ]
}

const CONFIG_STORAGE_KEY = 'prioritizationConfig';

export default class Config {
    storage = new StoreProvider();

    getConfig() {
        const config = this.storage.getObject(CONFIG_STORAGE_KEY);

        if (config !== undefined || !config) {
            return DEFAULT_CONFIG;
        }

        return config;
    }

    resetToDefault() {
        this.saveConfig(DEFAULT_CONFIG);
    }
    saveConfig(config) {
        storage.save(CONFIG_STORAGE_KEY, config);
    }
}