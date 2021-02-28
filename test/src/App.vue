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
                    <span id="total-amount">${{amount}}</span>
                </p>
                <section class="box card-box">
                    <b-field label="Name">
                        <b-input placeholder="Name" v-model="cardData.name" ref="inputRef"></b-input>
                    </b-field>
                    <b-field label="Card Number">
                        <ifields
                            :account="account"
                            :type="CARD_TYPE"
                            :options="ifieldCardOptions"
                            :threeDS="threeDS"
                            @load="onLoad"
                            @submit="onSubmit"
                            @token="onCardToken"
                            @error="onError"
                            @keypress="onUpdate"
                            @click="onUpdate"
                            @input="onUpdate"
                            @focus="onUpdate"
                            @dblclick="onUpdate"
                            @change="onUpdate"
                            @blur="onUpdate"
                        />
                    </b-field>
                    <b-field label="Expiration">
                        <div>
                            <b-dropdown v-model="cardData.month" hoverable aria-role="list">
                                <button class="button is-success" slot="trigger">
                                    <span>{{cardData.month}}</span>
                                    <b-icon icon="menu-down"></b-icon>
                                </button>

                                <b-dropdown-item
                                    :value="i"
                                    v-for="i in 12"
                                    :key="i"
                                    aria-role="listitem"
                                >{{i}}</b-dropdown-item>
                            </b-dropdown>
                            <b-dropdown v-model="cardData.year" hoverable aria-role="list">
                                <button class="button is-success" slot="trigger">
                                    <span>{{cardData.year}}</span>
                                    <b-icon icon="menu-down"></b-icon>
                                </button>

                                <b-dropdown-item
                                    :value="i + cardData.year - 1"
                                    v-for="i in 15"
                                    :key="i"
                                    aria-role="listitem"
                                >{{i + cardData.year - 1}}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </b-field>
                    <b-field label="CVV">
                        <ifields
                            :account="account"
                            :type="CVV_TYPE"
                            :issuer="issuer"
                            :options="ifieldCvvOptions"
                            @load="onLoad"
                            @submit="onSubmit"
                            @token="onCvvToken"
                            @error="onError"
                            @keypress="onUpdate"
                            @click="onUpdate"
                            @input="onUpdate"
                            @focus="onUpdate"
                            @dblclick="onUpdate"
                            @change="onUpdate"
                            @blur="onUpdate"
                        />
                    </b-field>
                    <submit :amount="amount" :doSubmit="doSubmit" :cardData="cardData" :valid="ready" />
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import ifields, { CARD_TYPE, CVV_TYPE } from "vue-cardknox-ifields";
import submit from "./components/submit";
import "buefy/dist/buefy.css";

export default {
    name: "App",
    components: {
        ifields,
        submit
    },
    data: function() {
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
            amount: 2.36,
            cardData: {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                cardToken: "",
                cvvToken: "",
                name
            },
            doSubmit: false
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
                enable3DS: false,
                waitForResponse: false,
                waitForResponseTimeout: undefined,
                amount: this.amount,
                month: this.cardData.month,
                year: this.cardData.year
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
            // console.log(`Iframe ${data.event} received`);
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
    width: 35%;
    margin: 5% 10%;
}
iframe {
    height: 40px;
    width: 100%;
    max-width: 100%;
}
.card-box {
    max-width: 450px;
    min-width: 406px;
    width: 425px;
}
#total {
    color: #00103a;
    font-size: 32px;
    font-weight: bold;
}
</style>
