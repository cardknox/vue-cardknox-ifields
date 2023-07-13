import {
  PING,
  STYLE,
  GET_TOKEN,
  INIT,
  FORMAT,
  SET_PLACEHOLDER,
  FOCUS,
  CLEAR_DATA,
  SET_ACCOUNT_DATA,
  ENABLE_LOGGING,
  ENABLE_AUTO_SUBMIT,
  ENABLE3DS,
  DISABLE3DS,
  UPDATE3DS,
  UPDATE_ISSUER
} from "./constants";

export function ping() {
  var message = {
    action: PING
  };
  this.logAction(PING);
  this.postMessage(message);
}
/**
 *
 * @param {AccountData} data
 */
export function setAccount(data) {
  var message = {
    action: SET_ACCOUNT_DATA,
    data
  };
  this.logAction(SET_ACCOUNT_DATA);
  this.postMessage(message);
}
export function init() {
  var message = {
    action: INIT,
    tokenType: this.type,
    referrer: window.location.toString()
  };
  this.logAction(INIT);
  this.postMessage(message);
}
export function getToken() {
  var message = {
    action: GET_TOKEN
  };
  this.logAction(GET_TOKEN);
  this.tokenLoading = true;
  this.postMessage(message);
}
/**
 *
 * @param {string} environment
 */
export function enable3DS(environment, handle3DSResults) {
  if (!!handle3DSResults) {
    if (typeof window.ck3DS !== 'undefined') {
      ck3DS.configuration.onVerifyComplete = handle3DSResultsWrapper(handle3DSResults);
      ck3DS.configuration.enableConsoleLogging = this.options.enableLogging;
      if (!ck3DS.initialized)
        ck3DS.initialize3DS(environment);
    }
  }
  var message = {
    action: ENABLE3DS,
    data: {
      environment,
      verificationEnabled: !!handle3DSResults
    }
  };
  this.logAction(ENABLE3DS);
  this.postMessage(message);
}

function handle3DSResultsWrapper(handle3DSResults) {
  return function (actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification) {
    handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification, ck3DS.error);
  }
}
/**
 *
 */
export function disable3DS() {
  var message = {
    action: DISABLE3DS,
    data: {}
  };
  this.logAction(ENABLE3DS);
  this.postMessage(message);
}
/**
 *
 */
export function verify3DS(verifyData) {
  if (typeof window.ck3DS !== 'undefined')
    ck3DS.verifyTrans(verifyData);
  else
    this.log('verify3DS called without using enable3DS first to attach a handler!')
}
/**
 *
 * @param {string} fieldName - The field to update
 * @param {string} value
 */
export function update3DS(fieldName, value) {
  var message = {
    action: UPDATE3DS,
    data: {
      fieldName,
      value
    }
  };
  this.logAction(UPDATE3DS);
  this.postMessage(message);
}
/**
 *
 * @param {string} issuer
 */
export function updateIssuer(issuer) {
  var message = {
    action: UPDATE_ISSUER,
    issuer
  };
  this.logAction(UPDATE_ISSUER);
  this.postMessage(message);
}
/**
 *
 * @param {string} data
 */
export function setPlaceholder(data) {
  var message = {
    action: SET_PLACEHOLDER,
    data
  };
  this.logAction(SET_PLACEHOLDER);
  this.postMessage(message);
}
/**
 *
 * @param {string} formatChar
 */
export function enableAutoFormat(formatChar) {
  var message = {
    action: FORMAT,
    data: {
      formatChar
    }
  };
  this.logAction(FORMAT);
  this.postMessage(message);
}
export function enableLogging() {
  var message = {
    action: ENABLE_LOGGING
  };
  this.logAction(ENABLE_LOGGING);
  this.postMessage(message);
}
/**
 *
 * @param {string} formId - The ID attribute of the form to trigger submit on
 */
export function enableAutoSubmit(formId) {
  var message = {
    action: ENABLE_AUTO_SUBMIT,
    data: {
      formId
    }
  };
  this.logAction(ENABLE_AUTO_SUBMIT);
  this.postMessage(message);
}
export function setStyle(data) {
  var message = {
    action: STYLE,
    data
  };
  this.logAction(STYLE);
  this.postMessage(message);
}
//----------------------Public Actions
export function focusIfield() {
  var message = {
    action: FOCUS
  };
  this.logAction(FOCUS);
  this.postMessage(message);
}
export function clearIfield() {
  var message = {
    action: CLEAR_DATA
  };
  this.logAction(CLEAR_DATA);
  this.postMessage(message);
}
/**
 * @typedef AccountData
 * @property {string} xKey
 * @property {string} xSoftwareName
 * @property {string} xSoftwareVersion
 */