import Config from "./Config.js";
import Feature from "./Feature.js";
import ImportanceCalculator from "./ImportanceCalculator.js";
import StoreProvider from "./StoreProvider.js";
import TShirtSizeMapper from "./TShirtSizeMapper.js";
import UrgencyCalculator from "./UrgencyCalculator.js";

const FEATURES_STORE_KEY = 'storedFeatures';

const URGENCY_COLORS = {
    RED: 'rgba(255, 99, 132, 0.5)',
    YELLOW: 'rgba(255, 211, 0, 0.5)',
    GREEN: 'rgba(99, 255, 132, 0.5)'
}

export class FeatureManager {
    features = [];
    storage = new StoreProvider();
    configService = new Config();

    constructor() {
        this.loadFeatures();
    }

    loadFeatures() {
        const features = this.storage.getArray(FEATURES_STORE_KEY);
        if (features && features.length > 0) {
            for (const feature of features) {
                const featureObjec = Feature.fromJsonObject(feature);
                if (featureObjec) {
                    this.features.push(featureObjec);
                }
            }
        }
    }

    saveFeatures() {
        const featureJsonArray = [];
        for (const feature of this.features) {
            featureJsonArray.push(feature.toJson());
        }

        this.storage.save(FEATURES_STORE_KEY, JSON.stringify(featureJsonArray));
    }

    deleteFeature(name) {
        this.features = this.features.filter(feature => feature.name !== name);
        this.saveFeatures();
    }

    getFeatureByName(name) {
        for (const feature of this.features) {
            if (feature.name === name) {
                return feature;
            }
        }
        return null;
    }

    getFeaturesData() {
        const featuresDatasets = [];
        for (const feature of this.features) {
            const urgency = Math.round(UrgencyCalculator.getFeatureUrgency(feature, this.configService.getConfig()) * 100);
            const importance = Math.round(ImportanceCalculator.getFeatureImportance(feature) * 100);
            let color = URGENCY_COLORS.GREEN;
            if (urgency > 100) {
                color = URGENCY_COLORS.RED;
            } else if (urgency >= 80 ) {
                color = URGENCY_COLORS.YELLOW;
            }
            
            const dataset = {
                label: feature.name,
                data: [ {
                  x: urgency,
                  y: importance,
                  r: TShirtSizeMapper.getFeatureRadius(feature),
                }],
                backgroundColor: color,
            };

            featuresDatasets.push(dataset);
        }

        return featuresDatasets;
    }
}

export const featureManager = new FeatureManager();