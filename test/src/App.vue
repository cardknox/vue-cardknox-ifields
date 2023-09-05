<script setup>
import { ref, computed } from 'vue';
import ifields, { CARD_TYPE, CVV_TYPE, THREEDS_ENVIRONMENT } from "vue-cardknox-ifields";
import '@oruga-ui/oruga-next/dist/oruga.css';
import format from "date-fns/lightFormat";

const ifieldsKey = ref("");
const cardIfield = ref(null);
const cvvIfield = ref(null);
const account = ref({
  xKey: ifieldsKey.value,
  xSoftwareName: "vue-cardknox-ifields",
  xSoftwareVersion: "1.0.0"
});
const amount = ref(2.36);
const threeDS = ref({
  enable3DS: true,
  environment: THREEDS_ENVIRONMENT.Staging,
  handle3DSResults: handle3DSResults
});
const cardData = ref({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  cardToken: "",
  cvvToken: "",
  firstName: "John",
  lastName: "Doe",
  address: "123 Somewhere",
  city: "Anywhere",
  state: "NY",
  zip: "98765",
  mobile: "1234567890",
  email: "test@test.com"
});
const ifieldCardOptions = ref({
  enableLogging: true,
  autoFormat: true,
  autoFormatSeparator: " ",
  threeDS: threeDS.value,
  placeholder: "Card Number",
  autoSubmit: false,
  iFieldstyle: {
    width: "365px",
    "max-width": "100%",
    "box-shadow": "inset 0 1px 2px rgba(10, 10, 10, 0.1)",
    "background-color": "white",
    border: "1px solid transparent",
    "border-color": "#dbdbdb",
    "border-radius": "4px",
    color: "#363636",
    height: "2.25em",
    "line-height": "1.5",
    "padding-bottom": "calc(0.375em - 1px)",
    "padding-left": "calc(0.625em - 1px)",
    "padding-right": "calc(0.625em - 1px)",
    "padding-top": "calc(0.375em - 1px)"
  }
});
const ifieldCvvOptions = ref({
  enableLogging: false,
  autoFormat: true,
  autoFormatSeparator: " ",
  placeholder: "CVV",
  iFieldstyle: {
    width: "50%",
    "max-width": "100%",
    "box-shadow": "inset 0 1px 2px rgba(10, 10, 10, 0.1)",
    "background-color": "white",
    border: "1px solid transparent",
    "border-color": "#dbdbdb",
    "border-radius": "4px",
    color: "#363636",
    height: "2.25em",
    "line-height": "1.5",
    "padding-bottom": "calc(0.375em - 1px)",
    "padding-left": "calc(0.625em - 1px)",
    "padding-right": "calc(0.625em - 1px)",
    "padding-top": "calc(0.375em - 1px)"
  }
});
const issuer = ref("");
const gatewayResponse = ref("");
const gateway3dsResponse = ref("");

const readyToSubmitToGateway = computed(() => {
  return cardData.value.cardToken.length > 0 && cardData.value.cvvToken.length > 0 && amount.value > 0;
});

async function handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification, error) {
  try {
    console.log('handle3DSResults')
    const postData = {
      xSoftwareName: "Test-Vue-iFields",
      xSoftwareVersion: "1.0",
      xVersion: "5.0.0",
      x3dsError: error,
      xRefNum: xRefNum,
      xCavv: xCavv,
      xEci: xEciFlag,
      x3dsAuthenticationStatus: xAuthenticateStatus,
      x3dsSignatureVerificationStatus: xSignatureVerification,
      x3dsActionCode: actionCode,
    };
    console.log(postData);
    const response = await fetch('/api/verifyjson', { method: 'POST', body: JSON.stringify(postData), headers: { 'Content-Type': 'application/json' } });
    gateway3dsResponse.value = await response.json();
  } catch (error) {
    console.error(error);
    gateway3dsResponse.value = error;
  }
}

function onLoad() {
  console.log("Iframe loaded");
}
function onUpdate({ data }) {
  if (data.issuer)
    issuer.value = data.issuer;
}
function onSubmit() {
  console.log("IFrame submitted");
  submitToGateway();
}
function onCardToken({ data }) {
  console.log("IFrame card token received", data);
  cardData.value = Object.assign({}, cardData.value, {
    cardToken: data.xToken
  });
}
function onCvvToken({ data }) {
  console.log("IFrame cvv token received", data);
  cardData.value = Object.assign({}, cardData.value, {
    cvvToken: data.xToken
  });
}
function onError({ data }) {
  console.error("IFrame errored", data);
}
function focus(type) {
  const ref = getRefFromType(type);
  ref.value.focusIfield();
}
function clear(type) {
  const ref = getRefFromType(type);
  ref.value.clearIfield();
  cardData.value[type + "Token"] = "";
}
function submit(type) {
  const ref = getRefFromType(type);
  ref.value.getToken();
}
function getRefFromType(type) {
  switch (type) {
    case CARD_TYPE:
      return cardIfield;
    case CVV_TYPE:
      return cvvIfield;
    default:
      throw Error('unknown type');
  }
}
async function submitToGateway() {
  let request = {
    xSoftwareName: "Test-Vue-iFields",
    xSoftwareVersion: "1.0",
    xVersion: "5.0.0",
    xCommand: "cc:sale",
    xAmount: amount.value,
    xCardnum: cardData.value.cardToken,
    xBillFirstName: cardData.value.firstName,
    xBillLastName: cardData.value.lastName,
    xBillStreet: cardData.value.address,
    xBillCity: cardData.value.city,
    xBillZip: cardData.value.zip,
    xBillState: cardData.value.state,
    xBillMobile: cardData.value.mobile,
    xEmail: cardData.value.email,
    xExp: format(
      new Date(cardData.value.year, cardData.value.month - 1),
      "MMyy"
    ),
    xCvv: cardData.value.cvvToken
  };
  try {
    const response = await fetch("/api/gatewayjson", {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' }
    });
    const responseBody = await response.json();
    gatewayResponse.value = responseBody;
    if (responseBody.xResult === 'V')
      verify3DS(responseBody);
  } catch (error) {
    console.error(error);
  }
}
function verify3DS(verifyData) {
  window.ck3DS.verifyTrans(verifyData);
}
</script>

<template>
  <div id="checkout">
    <div>
      <section class="hero is-success">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Checkout</h1>
            <h4 class="subtitle">Please enter your credit card information</h4>
          </div>
        </div>
      </section>
      <div class="main">
        <p id="total">
          Your Total:
          <span id="total-amount">${{ amount }}</span>
        </p>
        <div class="columns">
          <div class="column">
            <section class="box card-box">
              <o-field label="Amount" expanded>
                <o-input type="num" placeholder="Amount" v-model="amount"></o-input>
              </o-field>
              <o-field grouped>
                <o-field label="First Name" expanded>
                  <o-input placeholder="First Name" v-model="cardData.firstName" ref="inputRef"></o-input>
                </o-field>
                <o-field label="Last Name" expanded>
                  <o-input placeholder="Last Name" v-model="cardData.lastName"></o-input>
                </o-field>
              </o-field>
              <o-field label="Address">
                <o-input placeholder="Address" v-model="cardData.address"></o-input>
              </o-field>
              <o-field grouped>
                <o-field label="City" expanded>
                  <o-input placeholder="City" v-model="cardData.city"></o-input>
                </o-field>
                <o-field label="State" class="smallWidth">
                  <o-input placeholder="State" v-model="cardData.state"></o-input>
                </o-field>
                <o-field label="Zip" class="smallWidth">
                  <o-input placeholder="Zip" v-model="cardData.zip"></o-input>
                </o-field>
              </o-field>
              <o-field label="Mobile">
                <o-input placeholder="Mobile" v-model="cardData.mobile" type="tel"></o-input>
              </o-field>
              <o-field label="Email">
                <o-input placeholder="Email" v-model="cardData.email" type="email"></o-input>
              </o-field>
              <o-field label="Card Number">
                <ifields :account="account" :type="CARD_TYPE" :options="ifieldCardOptions" :threeDS="threeDS"
                  ref="cardIfield" @load="onLoad" @submit="onSubmit" @token="onCardToken" @error="onError"
                  @keypress="onUpdate" @click="onUpdate" @input="onUpdate" @focus="onUpdate" @dblclick="onUpdate"
                  @change="onUpdate" @blur="onUpdate" class="ifields" />
              </o-field>
              <button @click="focus(CARD_TYPE)">Focus</button>
              <button @click="clear(CARD_TYPE)">Clear</button>
              <button @click="submit(CARD_TYPE)">Submit</button>
              <o-field label="Expiration">
                <div>
                  <o-select :placeholder="cardData.month">
                    <option :value="i" v-for="i in 12" :key="i" aria-role="listitem">{{ i
                    }}</option>
                  </o-select>
                  <o-select :placeholder="cardData.year">
                    <option :value="i + cardData.year - 1" v-for="i in  15 " :key="i" aria-role="listitem">{{ i +
                      cardData.year - 1 }}
                    </option>
                  </o-select>
                </div>
              </o-field>
              <o-field label="CVV">
                <ifields :account="account" :type="CVV_TYPE" :issuer="issuer" :options="ifieldCvvOptions" ref="cvvIfield"
                  @load="onLoad" @submit="onSubmit" @token="onCvvToken" @error="onError" @keypress="onUpdate"
                  @click="onUpdate" @input="onUpdate" @focus="onUpdate" @dblclick="onUpdate" @change="onUpdate"
                  @blur="onUpdate" class="ifields" />
              </o-field>
              <button @click="focus(CVV_TYPE)">Focus</button>
              <button @click="clear(CVV_TYPE)">Clear</button>
              <button @click="submit(CVV_TYPE)">Submit</button>
              <div class="button-spaced">
                <o-button rounded :disabled="!readyToSubmitToGateway" @click="submitToGateway">Submit To Gateway</o-button>
              </div>
            </section>
          </div>
          <div class="column">
            <section class="box result-box">
              <o-field label="Card Token">
                <p class="token-field" id="card-token">{{ cardData.cardToken }}</p>
              </o-field>
              <o-field label="CVV Token">
                <p class="token-field" id="cvv-token">{{ cardData.cvvToken }}</p>
              </o-field>
              <o-field label="Gateway Response">
                <p class="token-field">{{ gatewayResponse }}</p>
              </o-field>
              <o-field label="Gateway 3DS Response">
                <p class="token-field">{{ gateway3dsResponse }}</p>
              </o-field>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  background-color: papayawhip;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  width: 65%;
  margin: 5% 10%;
}

.ifields {
  height: 40px;
  width: 100%;
  max-width: 100%;
}

.card-box {
  max-width: 450px;
  min-width: 406px;
  width: 425px;
  float: left;
}

.result-box {
  max-width: 450px;
  min-width: 406px;
  width: 425px;
  float: right;
}

#total {
  color: #00103a;
  font-size: 32px;
  font-weight: bold;
}

.token-field {
  word-wrap: break-word;
}

.smallWidth {
  max-width: 23%;
}
.button-spaced{
  padding: 10px 0;
}
</style>
