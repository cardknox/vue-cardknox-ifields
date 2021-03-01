<template>
  <iframe
    :src="'https://cdn.cardknox.com/ifields/' + version + '/ifield.htm'"
    ref="iFrameRef"
    :title="type"
  />
</template>

<script>
import {
  AMOUNT,
  MONTH,
  YEAR,
  CARD_TYPE,
  CVV_TYPE,
  // WAIT_FOR_3DS_RESPONSE_TIMEOUT_DEFAULT,
  AUTO_FORMAT_DEFAULT_SEPARATOR
} from "./constants";
import * as eventHandlers from "./eventHandlers";
import * as actions from "./actions";
import * as functions from "./functions";

export default {
  data: function() {
    return {
      iFrameLoaded: false,
      ifieldDataCache: {},
      latestErrorTime: null,
      xTokenData: {},
      _tokenValid: false,
      tokenLoading: false
    };
  },
  props: {
    version: String,
    type: String,
    account: {
      type: Object,
      default: function() {
        return {};
      }
    },
    options: {
      type: Object,
      default: function() {
        return {
          autoFormatSeparator: AUTO_FORMAT_DEFAULT_SEPARATOR,
          autoSubmit: true
        };
      }
    },
    threeDS: {
      type: Object,
      default: function() {
        return {};
      }
    },
    issuer: String
  },
  methods: {
    //----------------------Events
    onMessage: eventHandlers._onMessage,
    _onLoad: eventHandlers._onLoad,
    _onToken: eventHandlers._onToken,
    _onUpdate: eventHandlers._onUpdate,
    _onSubmit: eventHandlers._onSubmit,

    //----------------------Actions
    ping: actions.ping,
    setAccount: actions.setAccount,
    init: actions.init,
    getToken: actions.getToken,
    enable3DS: actions.enable3DS,
    update3DS: actions.update3DS,
    updateIssuer: actions.updateIssuer,
    setPlaceholder: actions.setPlaceholder,
    enableAutoFormat: actions.enableAutoFormat,
    enableLogging: actions.enableLogging,
    enableAutoSubmit: actions.enableAutoSubmit,
    setStyle: actions.setStyle,
    //----------------------Public Actions
    focusIfield: actions.focusIfield,
    clearIfield: actions.clearIfield,

    //----------------------Helper Functions
    postMessage: functions.postMessage,
    validateProps: functions.validateProps,
    log: functions.log,
    logAction: functions.logAction,
    error: functions.error,
    transformAccountData: functions.transformAccountData
  },
  mounted: function() {
    window.addEventListener("message", this.onMessage);
    this.ping();
  },
  destroyed: function() {
    window.removeEventListener("message", this.onMessage);
  },
  watch: {
    account: function (val) {
      const newAccount = this.transformAccountData(val);
      this.setAccount(newAccount);
    },
    threeDS: function(val, oldVal) {
      if (this.type !== CARD_TYPE) return;
      if (val.enable3DS) {
        if (!oldVal.enable3DS)
          this.enable3DS(val.waitForResponse, val.waitForResponseTimeout);
        if (val.amount !== oldVal.amount || !oldVal.enable3DS)
          this.update3DS(AMOUNT, val.amount);
        if (val.month !== oldVal.month || !oldVal.enable3DS)
          this.update3DS(MONTH, val.month);
        if (val.year !== oldVal.year || !oldVal.enable3DS)
          this.update3DS(YEAR, val.year);
      }
    },
    issuer: function(val) {
      if (this.type === CVV_TYPE) this.updateIssuer(val);
    },
    options: function(val, oldVal) {
      if (this.type === CARD_TYPE && val.autoFormat) {
        if (
          val.autoFormat !== oldVal.autoFormat ||
          val.autoFormatSeparator !== oldVal.autoFormatSeparator
        )
          this.enableAutoFormat(val.autoFormatSeparator);
      }
      if (val.autoSubmit) {
        if (
          val.autoSubmit !== oldVal.autoSubmit ||
          val.autoSubmitFormId !== oldVal.autoSubmitFormId
        )
          this.enableAutoSubmit(val.autoSubmitFormId);
      }
      if (val.enableLogging && !oldVal.enableLogging) this.enableLogging();
      if (val.placeholder !== oldVal.placeholder)
        this.setPlaceholder(val.placeholder);
      if (val.iFieldstyle !== oldVal.iFieldstyle)
        this.setStyle(val.iFieldstyle);
    }
  },
  computed: {
    tokenValid: {
      get() {
        return this._tokenValid && this.xTokenData && this.xTokenData.xToken;
      },
      set(value) {
        this._tokenValid = value;
      }
    }
  }
};

export { CARD_TYPE, ACH_TYPE, CVV_TYPE } from "./constants";
</script>