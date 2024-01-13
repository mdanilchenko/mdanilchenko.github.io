import Config from "./Config.js";
import Feature from "./Feature.js";
import { FeatureManager } from "./FeatureManager.js";

Chart.defaults.backgroundColor = '#343432';
Chart.defaults.borderColor = '#999999';
Chart.defaults.color = '#CCCCCC';

let mainChart = null;

const featureManager = new FeatureManager();

const renderChart = () => {

    const ctx = document.getElementById('priorityChart');
    if (mainChart) {
        mainChart.destroy();
    }
    const data = {
        datasets: featureManager.getFeaturesData()
      };

    const config = {
        type: 'bubble',
        data: data,
        options: {
            plugins: {
                title: {
                    text: "Urgent/Important diagram",
                    display: true,
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Importance'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Urgency'
                    }
                }
            }
        }
      };
    

    mainChart = new Chart(ctx, config);
};

const renderFeatureList = () => {
    let featuresHTML = [];
    for (const feature of featureManager.features) {
        featuresHTML.push(
            `<div class="feature-item" > 
                <button class="del-btn" onclick="deleteFeature('${feature.name}')">Delete</button>
                <button class="del-btn" onclick="editFeature('${feature.name}')">Edit</button>
                <div class="title">${feature.name}</div>
                <div class="desc">${feature.description}</div>
                <div class="info">
                    <div> <b>T-shirt size:</b> ${feature.tShirtSize} </div> 
                    <div> <b>Deadline date:</b> ${feature.deadline} </div> 
                    <div> <b>Man-days to deliver:</b> ${feature.daysToDeliver} </div> 
                    <div> <b>Allocated capacity:</b> ${feature.allocatedCapacity} </div> 
                </div>
            </div>`
        );
    }
    $('#feature-list').html(featuresHTML.join(''));
}

$(document).ready(() => {
    console.log('ready');
    $('#addFeature').on('click',createNewFeatureForm)
    renderChart();
    renderFeatureList();
});

function getFeatureParamsForm(feature) {
    let text = '';

    const configProvider = new Config();
    const config = configProvider.getConfig();

    let i = 0;
    for (const param of config.params) {
        const score = feature ? feature.getParamScore(param.name) : null;
        text = text + `<label for="param${i}">${param.name}:</label> <select name="param${i}" data-name="${param.name}">`;
        for (const option of param.values) {
            text = text + `<option value="${option.value}" ${score && option.value == score ? 'selected' : ''}>${option.key}</option>`;
        }
            
        text = text + `</select><div class="description">${param.description}</div>`;
        i++;
    }

    return text;
}

function getFeatureForm(event = null) {
    return `
    <h4>Add/Edit an Effort</h4>
    <input type="hidden" name="feature" value="${!event ? '' : event.name}" />
    <input type="text" name="name" placeholder="Name" value="${!event ? '' : event.name}"></input>
    <input type="text" name="description" placeholder="Description" value="${!event ? '' : event.description}"></input>
    <select name="tShirtSize" placeholder="T-shirt size">
        <option value="S" ${event && event.tShirtSize === 'S'  ? 'selected' : ''} >S</option>
        <option value="M" ${event && event.tShirtSize === 'M'  ? 'selected' : ''} >M</option>
        <option value="L" ${event && event.tShirtSize === 'L'  ? 'selected' : ''} >L</option>
        <option value="XL" ${event && event.tShirtSize === 'XL'  ? 'selected' : ''} >XL</option>
        <option value="XXL" ${event && event.tShirtSize === 'XXL'  ? 'selected' : ''} >XXL</option>
    </select>
    <input type="text" name="deadline" placeholder="Deadline (YYYY-MM-DD)" value="${!event ? '' : event.deadline.toISOString().split('T')[0]}"></input>
    <input type="text" name="daysToDeliver" placeholder="Days to deliver"  value="${!event ? '' : event.daysToDeliver}"></input>
    <input type="text" name="allocatedCapacity" placeholder="Allocated people"  value="${!event ? '' : event.allocatedCapacity}"></input>
    
    <h5>Parameters</h5>
    <div id = "paramsHolder">
        ${getFeatureParamsForm(event)}
    </div>
    <button id="submit">Save Effort</button>
    `;
}

function createNewFeatureForm() {
    $('#feature-form').html(getFeatureForm());
    $('#feature-form #submit').on('click', addNewFeature);
    $('.create-edit-popup').css('display','block');
}

function addNewFeature() {
    const prevName = $('#feature-form input[name|=feature]').val();
    const name = $('#feature-form input[name|=name]').val();
    const description = $('#feature-form input[name|=description]').val();
    const tShirtSize = $('#feature-form select[name|=tShirtSize]').val();
    const deadline = $('#feature-form input[name|=deadline]').val();
    const daysToDeliver = $('#feature-form input[name|=daysToDeliver]').val();
    const allocatedCapacity = $('#feature-form input[name|=allocatedCapacity]').val();
    
    const params = [];
    for (let i = 0; i < 100; i++) {
        const selector = `#feature-form select[name|=param${i}]`;
        if ($(selector).length > 0) {
            const score = $(selector).val();
            const name = $(selector).data('name');
            params.push({name, score});
        }
    }
    
    if (prevName != '') {
        const feature = featureManager.getFeatureByName(prevName);
        feature.name = name;
        feature.description = description;
        feature.tShirtSize = tShirtSize;
        feature.deadline = new Date(deadline);
        feature.daysToDeliver = daysToDeliver;
        feature.allocatedCapacity = allocatedCapacity;
        feature.params = params;
    } else {
        featureManager.features.push(
            new Feature(name, description, tShirtSize, new Date(deadline), daysToDeliver, allocatedCapacity, params)
        );
    }
    $('#feature-form').html('');
    $('.create-edit-popup').css('display','none');
    
    renderChart();
    renderFeatureList();
    featureManager.saveFeatures();
}

window.deleteFeature = function(name) {
    featureManager.deleteFeature(name);
    renderChart();
    renderFeatureList();
}

window.editFeature = function(name) {
    const feature = featureManager.getFeatureByName(name);
    $('#feature-form').html(getFeatureForm(feature));
    $('#feature-form #submit').on('click', addNewFeature);
    $('.create-edit-popup').css('display','block');
    
}

window.closePopup = function(obj) {
    $(obj).parent().css('display','none');
    $('#feature-form').html('');
}
