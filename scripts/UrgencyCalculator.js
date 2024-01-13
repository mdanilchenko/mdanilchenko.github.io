import TShirtSizeMapper from "./TShirtSizeMapper.js"

export default class UrgencyCalculator {
    static getFeatureUrgency(feature, config) {
        const daysToDeliver = !feature.daysToDeliver ? TShirtSizeMapper.getDaysToDeliverFromSize(feature.tShirtSize) : feature.daysToDeliver;
        const now = new Date();
        let actualTime = feature.deadline.getTime() - now.getTime();
        if (actualTime < 0) {
            actualTime = 0;
        }

        let actualDays = 
            Math.round(actualTime / (1000 * 3600 * 24));
        
        let urgency = (daysToDeliver/feature.allocatedCapacity) / (actualDays * config.workdaysPerWeek / 7);
        if (urgency > 1 ) {
            return 1.2;
        }

        return urgency > 0 ? urgency : 0;
    }
}
