import {
    LOADED,
    TOKEN,
    ERROR,
    AUTO_SUBMIT,
    UPDATE,
    AMOUNT,
    MONTH,
    YEAR,
    CARD_TYPE,
    CVV_TYPE
} from "./constants";

/**
*
* @param {MessageEvent} e
*/
export function _onMessage(e) {
    var data = e.data;
    if (e.source !== this.$refs.iFrameRef.contentWindow) return;
    switch (data.action) {
        case LOADED:
            this.log("Message received: ifield loaded");
            this._onLoad();
            break;
        case TOKEN:
            this.log("Message received: " + TOKEN);
            this._onToken(data);
            break;
        case AUTO_SUBMIT:       //triggered when submit is fired within the iFrame
            this.log("Message received: " + AUTO_SUBMIT);
            this._onSubmit(data);
            break;
        case UPDATE:
            this.log("Message received: " + UPDATE);
            this._onUpdate(data);
            break;
        default:
            break;
    }
    if (this.threeDS.enable3DS && data.eci && data.eci.length && this.type === CARD_TYPE) {
        this.log("Message received: eci");
        this.postMessage(data);
    }
}
export function _onLoad() {
    this.iFrameLoaded = true;
    const newAccount = this.transformAccountData(val);
    this.setAccount(newAccount);
    if (this.type === CARD_TYPE && this.threeDS.enable3DS) {
        this.enable3DS(this.threeDS.waitForResponse, this.threeDS.waitForResponseTimeout);
        this.update3DS(AMOUNT, this.threeDS.amount);
        this.update3DS(MONTH, this.threeDS.month);
        this.update3DS(YEAR, this.threeDS.year);
    }
    this.init();
    if (this.type === CVV_TYPE && this.issuer)
        this.updateIssuer(this.issuer);
    if (this.options.placeholder)
        this.setPlaceholder(this.options.placeholder);
    if (this.options.enableLogging)
        this.enableLogging();
    if (this.type === CARD_TYPE && this.options.autoFormat)
        this.enableAutoFormat(this.options.autoFormatSeparator);
    if (this.options.autoSubmit)
        this.enableAutoSubmit(this.options.autoSubmitFormId);
    if (this.options.iFieldstyle)
        this.setStyle(this.options.iFieldstyle);
    this.$emit('load');
}
/**
 *
 * @param {{data: TokenData | ErrorData}} param0
 */
export function _onToken({ data }) {
    this.tokenLoading = false;
    if (data.result === ERROR) {
        this.latestErrorTime = new Date();
        this.log("Token Error: " + data.errorMessage);
        this.tokenValid = false;
        this.$emit('error', { data });
    } else {
        this.xTokenData = data;
        this.tokenValid = true;
        this.$emit('token', { data });
    }
}
/**
 *
 * @param {{data: UpdateData}} param0
 */
export function _onUpdate({ data }) {
    this.ifieldDataCache = {
        length: this.type === CARD_TYPE ? data.cardNumberLength : data.length,
        isEmpty: data.isEmpty,
        isValid: data.isValid
    };
    if (data.isValid && !this.tokenValid && !this.tokenLoading) {
        this.getToken();
    }
    if (!data.isValid) {
        this.tokenValid = false;
    }
    switch (data.event) {
        case 'input':
            this.$emit('input', { data });
            break;
        case 'click':
            this.$emit('click', { data });
            break;
        case 'focus':
            this.$emit('focus', { data });
            break;
        case 'dblclick':
            this.$emit('dblclick', { data });
            break;
        case 'change':
            this.$emit('change', { data });
            break;
        case 'blur':
            this.$emit('blur', { data });
            break;
        case 'keypress':
            this.$emit('keypress', { data });
            break;
        default:
            break;
    }
    this.$emit('update', { data });
}

/**
 *
 * @param {{data: SubmitData}} param0
 */
export function _onSubmit({ data }) {
    //call first before submit is triggered
    this.$emit('submit', { data });
    if (data && data.formId) {
        document.getElementById(data.formId).dispatchEvent(
            new Event("submit", {
                bubbles: true,
                cancelable: true
            })
        );
    }
}


/**
 * @typedef SubmitData
 * @property {string} formId
 */
/**
 *
 * @typedef TokenData
 * @property {string} xToken
 * @property {string} xTokenType
 * @property {string} xCardDataType
 * @property {string} xMaskedData
 * @property {string} xIssuer
 * @property {string} xTokenCreationTime
 * @property {string} xTokenVersion
 */
/**
 * @typedef ErrorData
 * @property {string} result
 * @property {string} errorMessage
 * @property {string} xTokenType
 */
/**
 * @typedef UpdateData
 * @property {string} event
 * @property {string} issuer
 * @property {boolean} ifieldValueChanged
 * @property {boolean} isEmpty
 * @property {boolean} isValid
 * @property {number} length
 * @property {number} cardNumberLength
 */