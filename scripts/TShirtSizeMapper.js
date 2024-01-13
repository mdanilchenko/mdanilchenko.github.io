const T_SHIRT_MAPPER = {
    'S': 2*7,
    'M': 30,
    'L': 2*30,
    'XL': 6*30,
}
const HIGHEST_T_SHIRT = 'XXL';
const HIGHEST_T_SHIRT_DAYS = 365;

export default class TShirtSizeMapper {
    static getFeatureSize(feature) {
        if (feature.tShirtSize) {
            return feature.tShirtSize;
        }

        if (feature.daysToDeliver) {
            for (const [size, days] of Object.entries(T_SHIRT_MAPPER)) {
                if (feature.daysToDeliver <= days) {
                    return size;
                }
            }

            return HIGHEST_T_SHIRT;
        }

        throw new Error('No data to define T-Shirt size');
    }

    static getFeatureRadius(feature) {
        const featureSize = TShirtSizeMapper.getFeatureSize(feature);
        let i = 1;
        for (const [size, days] of Object.entries(T_SHIRT_MAPPER)) {
            if (featureSize === size) {
                break;
            }
            i++;
        }

        return i*15;   
    }
    static getDaysToDeliverFromSize(size) {
        return T_SHIRT_MAPPER[size] ? T_SHIRT_MAPPER[size] : HIGHEST_T_SHIRT_DAYS;
    }

}