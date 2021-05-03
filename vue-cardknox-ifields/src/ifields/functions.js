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
    const target = isAccessible(this.$refs.iFrameRef.contentWindow) ? location.origin : IFIELD_ORIGIN;
    this.$refs.iFrameRef.contentWindow.postMessage(data, target);
}

function isAccessible(otherWindow) {
    try {
        if (!otherWindow.document)
            return false;
        return true;
    } catch(e) {
        return false;
    }
}
export function validateProps() {
    // var props = this.props;
    var accountProps = this.account
        ? this.account.xKey
            ? this.account.xSoftwareName
                ? this.account.xSoftwareVersion
                    ? false
                    : "xSoftwareVersion"
                : "xSoftwareName"
            : "xKey"
        : "account";
    if (accountProps) {
        this.error("Missing " + accountProps);
    }
    if (!this.type) this.error("Missing props (type)");
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
 * @param {string} message
 */
export function error(message) {
    console.error(`IField ${this.type}: ${message}`);
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
