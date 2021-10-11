const Alexa = require('ask-sdk-core');
const loadDB = require('./database/index');
const helper = require('./helper/resolveSlots')
const covidApi = require('./helper/covidCount')

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.type);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = speechOutput.response.LaunchIntent.reprompt
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput.response.LaunchIntent.speak)
            .reprompt(speechOutput.response.LaunchIntent.reprompt)
            .getResponse();
    },
};

const CancelStopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);

        return responseBuilder
            .speak(speechOutput.response.StopIntent.speak)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = speechOutput.response.HelpIntent.speak
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput.response.HelpIntent.speak)
            .reprompt(speechOutput.response.HelpIntent.reprompt)
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};

const FallBackHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = speechOutput.response.FallbackIntent.speak
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput.response.FallbackIntent.speak)
            .reprompt(speechOutput.response.FallbackIntent.reprompt)
            .getResponse();
    },
};

const NavigateHomeHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = speechOutput.response.NavigateHomeIntent.speak
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput.response.NavigateHomeIntent.speak)
            .reprompt(speechOutput.response.NavigateHomeIntent.reprompt)
            .getResponse();
    },
};

const RepeatHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speechOutput = sessionAttributes.repeat;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const CovidStats = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Covid_Status';
    },
    async handle(handlerInput) {
        let resolvedSpeech
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);

        let slotValues = helper.getSlotValues(handlerInput.requestEnvelope.request.intent.slots);

        let cases = await covidApi.getCovidCount(slotValues.Country.heardAs)


        if (slotValues.Country.heardAs && slotValues.CountType.heardAs) {
            if (slotValues.CountType.heardAs.toLowerCase() == 'total') {
                resolvedSpeech = (speechOutput.response.Covid_StatusIntent.speak).replace('#count_type', slotValues.CountType.heardAs).replace('#country', slotValues.Country.heardAs).replace('#cases_count', cases.total_cases)
            } else {
                resolvedSpeech = (speechOutput.response.Covid_StatusIntent.speak).replace('#count_type', slotValues.CountType.heardAs).replace('#country', slotValues.Country.heardAs).replace('#cases_count', cases.active_cases)
            }

        } else {
            resolvedSpeech = (speechOutput.response.Covid_StatusIntent.speak).replace('#count_type', 'total').replace('#country', slotValues.Country.heardAs).replace('#cases_count', cases.total_cases)
        }

        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = resolvedSpeech;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return responseBuilder
            .speak(resolvedSpeech)
            .reprompt(speechOutput.response.Covid_StatusIntent.reprompt)
            .getResponse();
    },
}

const NoIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);

        return responseBuilder
            .speak(speechOutput.response.NoIntent.speak)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    async handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = await loadDB(handlerInput.requestEnvelope.request.intent.name);
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.repeat = speechOutput.response.YesIntent.speak
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return responseBuilder
            .speak(speechOutput.response.YesIntent.speak)
            .reprompt(speechOutput.response.YesIntent.reprompt)
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
        console.log(`Error handled: ${error}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can not understand that, Please say once again.')
            .reprompt('Please reply.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        CancelStopHandler,
        HelpHandler,
        SessionEndedHandler,
        FallBackHandler,
        NavigateHomeHandler,
        RepeatHandler,
        CovidStats,
        YesIntentHandler,
        NoIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();