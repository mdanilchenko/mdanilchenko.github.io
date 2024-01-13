export default class Feature {
    name = null;
    description = null;
    tShirtSize = null;
    deadline = null;
    daysToDeliver = null;
    allocatedCapacity = 1;
    params = null; // [{name, score}]

    constructor(name, description, tShirtSize, deadline, daysToDeliver, allocatedCapacity, params) {
        this.name = name;
        this.description = description;
        this.tShirtSize = tShirtSize;
        this.deadline = deadline;
        this.daysToDeliver = daysToDeliver;
        this.allocatedCapacity = allocatedCapacity;
        this.params = params;
    }

    getParamScore(name) {
        for (const param of this.params) {
            if (param.name == name) {
                return param.score;
            }
        }

        return null;
    }

    toJson() {
        const output = {};
        output.name = this.name;
        output.description = this.description;
        output.tShirtSize = this.tShirtSize;
        output.deadline = this.deadline;
        output.daysToDeliver = this.daysToDeliver;
        output.allocatedCapacity = this.allocatedCapacity;
        output.params = this.params;

        return output;
    }

    static fromJsonObject(input) {
        return new Feature(input.name, input.description, input.tShirtSize, new Date(input.deadline), input.daysToDeliver, input.allocatedCapacity, input.params);
    }
}