<template>
  <iframe :src="IFIELD_ORIGIN + '/ifields/' + IFIELDS_VERSION + '/ifield.htm'" ref="iFrameRef" :title="type" />
</template>

<script>
import {
  CARD_TYPE,
  CVV_TYPE,
  AUTO_FORMAT_DEFAULT_SEPARATOR,
  IFIELDS_VERSION,
  IFIELD_ORIGIN
} from "./constants";
import * as eventHandlers from "./eventHandlers";
import * as actions from "./actions";
import * as functions from "./functions";

export default {
  data: function () {
    return {
      iFrameLoaded: false,
      ifieldDataCache: {},
      latestErrorTime: null,
      xTokenData: {},
      _tokenValid: false,
      tokenLoading: false,
      IFIELDS_VERSION: Object.freeze(IFIELDS_VERSION),
      IFIELD_ORIGIN: Object.freeze(IFIELD_ORIGIN)
    };
  },
  props: {
    type: String,
    account: {
      type: Object,
      default: function () {
        return {};
      }
    },
    options: {
      type: Object,
      default: function () {
        return {
          autoFormatSeparator: AUTO_FORMAT_DEFAULT_SEPARATOR,
          autoSubmit: true
        };
      }
    },
    threeDS: {
      type: Object,
      default: function () {
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
    disable3DS: actions.disable3DS,
    verify3DS: actions.verify3DS,
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
    transformAccountData: functions.transformAccountData
  },
  mounted: function () {
    this.validateProps();
    window.addEventListener("message", this.onMessage);
    this.ping();
  },
  destroyed: function () {
    window.removeEventListener("message", this.onMessage);
  },
  watch: {
    account: function (val) {
      const newAccount = this.transformAccountData(val);
      this.setAccount(newAccount);
    },
    threeDS: function (val, oldVal) {
      if (this.type !== CARD_TYPE) return;
      if (val.enable3DS) {
        if (!val.environment)
          return;
        if (this.iFrameLoaded && (!oldVal.enable3DS || val.environment !== oldVal.environment || val.handle3DSResults !== oldVal.handle3DSResults))
          this.enable3DS(val.environment, val.handle3DSResults);
      }
      else if (oldVal.enable3DS) {
        this.disable3DS();
      }
    },
    issuer: function (val) {
      if (this.type === CVV_TYPE) this.updateIssuer(val);
    },
    options: function (val, oldVal) {
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
      cache: false,
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