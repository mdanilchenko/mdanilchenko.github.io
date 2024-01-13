import Config from "./Config.js";

export default class ImportanceCalculator {
    static getFeatureImportance(feature) {
        const configObj = new Config();
        const configuration = configObj.getConfig();
        const activeParams = configuration.params;

        const reducedParams = {};
        for (const param of activeParams) {
            reducedParams[param.name] = param.weight;
        }

        let totalWeights = 0;
        let featureWeight = 0;

        for (const param of feature.params) {
            if (reducedParams[param.name]) {
                totalWeights += reducedParams[param.name];
                featureWeight += reducedParams[param.name] * param.score;
            }
        }

        return featureWeight/(totalWeights * configuration.paramsMaxScore);
    }
}