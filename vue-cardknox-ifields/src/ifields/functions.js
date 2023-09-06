import { IFIELD_ORIGIN, PING, PLUGIN_NAME } from './constants';

/**
 *
 * @param {{action: string, data: *}} data
 */
export function postMessage(data) {
    if (!this.iFrameLoaded && data.action !== PING) {
        this.log("Iframe not loaded");
        this.ping();
        return;
    }
    try {
        const target = isAccessible(this.iFrameRef.contentWindow) ? location.origin : IFIELD_ORIGIN;
        this.iFrameRef.contentWindow.postMessage(data, target);
    } catch (error) {
        this.log(error);
    }
}

function isAccessible(otherWindow) {
    try {
        if (!otherWindow.document)
            return false;
        return true;
    } catch (e) {
        return false;
    }
}
export function validateProps() {
    validateIsDefined(this.account, "account");
    validateIsDefined(this.account.xKey, "xKey");
    validateIsDefined(this.account.xSoftwareName, "xSoftwareName");
    validateIsDefined(this.account.xSoftwareVersion, "xSoftwareVersion");
    validateIsDefined(this.type, "type");
}

function validateIsDefined(value, name) {
    if (!value)
        throw new Error("Missing " + name);
}

/**
 *
 * @param {string} message
 */
export function log(message) {
    if (this.options.enableLogging) {
        console.log(`IField ${this.type}: ${message}`);
    }
}
/**
 *
 * @param {string} action
 */
export function logAction(action) {
    this.log(`Sending message ${action}`);
}

/**
 * 
 * @param {AccountData} account
 * @returns {AccountData}
 */
export function transformAccountData(account) {
    const xSoftwareName = account.xSoftwareName;
    return Object.assign({}, account, { xSoftwareName: `(${PLUGIN_NAME}) ${xSoftwareName}` });
}
