<template>
    <div id="app">
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
                <section class="box card-box">
                    <b-field label="Amount" expanded>
                        <b-input type="num" placeholder="Amount" v-model="amount"></b-input>
                    </b-field>
                    <b-field grouped>
                        <b-field label="First Name" expanded>
                            <b-input placeholder="First Name" v-model="cardData.firstName" ref="inputRef"></b-input>
                        </b-field>
                        <b-field label="Last Name" expanded>
                            <b-input placeholder="Last Name" v-model="cardData.lastName"></b-input>
                        </b-field>
                    </b-field>
                    <b-field label="Address">
                        <b-input placeholder="Address" v-model="cardData.address"></b-input>
                    </b-field>
                    <b-field grouped>
                        <b-field label="City" expanded>
                            <b-input placeholder="City" v-model="cardData.city"></b-input>
                        </b-field>
                        <b-field label="State" class="smallWidth">
                            <b-input placeholder="State" v-model="cardData.state"></b-input>
                        </b-field>
                        <b-field label="Zip" class="smallWidth">
                            <b-input placeholder="Zip" v-model="cardData.zip"></b-input>
                        </b-field>
                    </b-field>
                    <b-field label="Mobile">
                        <b-input placeholder="Mobile" v-model="cardData.mobile" type="tel"></b-input>
                    </b-field>
                    <b-field label="Email">
                        <b-input placeholder="Email" v-model="cardData.email" type="email"></b-input>
                    </b-field>
                    <b-field label="Card Number">
                        <ifields :account="account" :type="CARD_TYPE" :options="ifieldCardOptions" :threeDS="threeDS"
                            ref="cardIfield" @load="onLoad" @submit="onSubmit" @token="onCardToken" @error="onError"
                            @keypress="onUpdate" @click="onUpdate" @input="onUpdate" @focus="onUpdate" @dblclick="onUpdate"
                            @change="onUpdate" @blur="onUpdate" class="ifields" />
                    </b-field>
                    <button @click="focus(CARD_TYPE)">Focus</button>
                    <button @click="clear(CARD_TYPE)">Clear</button>
                    <button @click="submit(CARD_TYPE)">Submit</button>
                    <b-field label="Expiration">
                        <div>
                            <b-dropdown v-model="cardData.month" hoverable aria-role="list">
                                <button class="button is-success" slot="trigger">
                                    <span>{{ cardData.month }}</span>
                                    <b-icon icon="menu-down"></b-icon>
                                </button>

                                <b-dropdown-item :value="i" v-for="i in 12" :key="i" aria-role="listitem">{{ i
                                }}</b-dropdown-item>
                            </b-dropdown>
                            <b-dropdown v-model="cardData.year" hoverable aria-role="list">
                                <button class="button is-success" slot="trigger">
                                    <span>{{ cardData.year }}</span>
                                    <b-icon icon="menu-down"></b-icon>
                                </button>

                                <b-dropdown-item :value="i + cardData.year - 1" v-for="i in 15" :key="i"
                                    aria-role="listitem">{{ i + cardData.year - 1 }}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </b-field>
                    <b-field label="CVV">
                        <ifields :account="account" :type="CVV_TYPE" :issuer="issuer" :options="ifieldCvvOptions"
                            ref="cvvIfield" @load="onLoad" @submit="onSubmit" @token="onCvvToken" @error="onError"
                            @keypress="onUpdate" @click="onUpdate" @input="onUpdate" @focus="onUpdate" @dblclick="onUpdate"
                            @change="onUpdate" @blur="onUpdate" class="ifields" />
                    </b-field>
                    <button @click="focus(CVV_TYPE)">Focus</button>
                    <button @click="clear(CVV_TYPE)">Clear</button>
                    <button @click="submit(CVV_TYPE)">Submit</button>
                    <submit :amount="amount" :doSubmit="doSubmit" :cardData="cardData" :valid="ready"
                        :verify3DS="verify3DS" />
                </section>
                <section class="box result-box">
                    <b-field label="Card Token">
                        <p class="token-field" id="card-token">{{ this.cardData.cardToken }}</p>
                    </b-field>
                    <b-field label="CVV Token">
                        <p class="token-field" id="cvv-token">{{ this.cardData.cvvToken }}</p>
                    </b-field>
                    <b-field label="Gateway 3DS Response">
                        <p class="token-field" >{{ this.gateway3dsResponse }}</p>
                    </b-field>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import ifields, { CARD_TYPE, CVV_TYPE, THREEDS_ENVIRONMENT } from "vue-cardknox-ifields";
import submit from "./components/submit";
import "buefy/dist/buefy.css";

export default {
    name: "App",
    components: {
        ifields,
        submit
    },
    data: function () {
        return {
            account: {
                xKey: "",
                xSoftwareName: "vue-cardknox-ifields",
                xSoftwareVersion: "1.0.0"
            },
            ifieldCardOptions: {
                enableLogging: false,
                autoFormat: true,
                autoFormatSeparator: " ",
                threeDS: this.threeDS,
                placeholder: "Card Number",
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
            },
            ifieldCvvOptions: {
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
            },
            issuer: "",
            amount: "2.36",
            cardData: {
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
            },
            doSubmit: false,
            gateway3dsResponse: ""
        };
    },
    created() {
        this.CVV_TYPE = CVV_TYPE;
        this.CARD_TYPE = CARD_TYPE;
    },
    computed: {
        getInputStyle() {
            return this.$refs.inputRef.style;
        },
        threeDS() {
            return {
                enable3DS: true,
                environment: THREEDS_ENVIRONMENT.Staging,
                handle3DSResults: this.handle3DSResults
            };
        },
        ready() {
            return true;
        }
    },
    methods: {
        onLoad() {
            console.log("Iframe loaded");
        },
        onUpdate({ data }) {
            if (data.issuer) this.issuer = data.issuer;
        },
        onSubmit() {
            console.log("IFrame submitted");
            this.doSubmit = true;
        },
        onCardToken({ data }) {
            console.log("IFrame card token received", data);
            this.cardData = Object.assign({}, this.cardData, {
                cardToken: data.xToken
            });
        },
        onCvvToken({ data }) {
            console.log("IFrame cvv token received");
            this.cardData = Object.assign({}, this.cardData, {
                cvvToken: data.xToken
            });
        },
        onError({ data }) {
            console.error("IFrame errored", data);
        },
        focus(type) {
            const ref = this.getRefFromType(type);
            ref.focusIfield();
        },
        clear(type) {
            const ref = this.getRefFromType(type);
            ref.clearIfield();
            this.cardData[type + "Token"] = "";
        },
        submit(type) {
            const ref = this.getRefFromType(type);
            ref.getToken();
        },
        getRefFromType(type) {
            switch (type) {
                case CARD_TYPE:
                    return this.$refs.cardIfield;
                case CVV_TYPE:
                    return this.$refs.cvvIfield;
                default:
                    throw Error('unknown type');
            }
        },
        verify3DS(verifyData) {
            window.ck3DS.verifyTrans(verifyData);
        },
        async handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification, error) {
            try {
                console.log('handle3DSResults')
                const postData = {
                    xKey: "",
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
                const response = await fetch('https://x1.cardknox.com/verifyjson', { method: 'POST', body: JSON.stringify(postData) });
                this.gateway3dsResponse = await response.json();
            } catch (error) {
                console.error(error);
                this.gateway3dsResponse = error;
            }
        }
    }
};
</script>

<style>
html {
    background-color: papayawhip;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.main {
    width: 65%;
    margin: 5% 10%;
}

/* fix iframe styling set by buefy */
iframe {
    height: inherit;
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
</style>
