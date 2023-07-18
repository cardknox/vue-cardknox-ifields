<template>
    <div class="center">
        <b-button @click="submit" :disabled="!valid" type="is-success" rounded>Submit</b-button>
    </div>
</template>

<script>
import format from "date-fns/lightFormat";

export default {
    name: "submit",
    props: {
        amount: Number,
        cardData: Object,
        valid: Boolean,
        doSubmit: Boolean,
        verify3DS: Function
    },
    methods: {
        async submit() {
            let request = {
                xKey: "",
                xSoftwareName: "Test-Vue-iFields",
                xSoftwareVersion: "1.0",
                xVersion: "4.5.8",
                xCommand: "cc:sale",
                xAmount: this.amount,
                xCardnum: this.cardData.cardToken,
                xBillFirstName: this.cardData.firstName,
                xBillLastName: this.cardData.lastName,
                xBillStreet: this.cardData.address,
                xBillCity: this.cardData.city,
                xBillZip: this.cardData.zip,
                xBillState: this.cardData.state,
                xBillMobile: this.cardData.mobile,
                xEmail: this.cardData.email,
                xExp: format(
                    new Date(this.cardData.year, this.cardData.month - 1),
                    "MMyy"
                ),
                xCvv: this.cardData.cvvToken
            };
            try {
                const gatewayResponse = await fetch(
                    "https://x1.cardknox.com/gateway?" +
                    Object.entries(request)
                        .map(e => e.map(e1 => encodeURIComponent(e1)).join("="))
                        .join("&")
                );
                const responseBody = await gatewayResponse.text();
                console.log("Gateway Response", responseBody);
                const params = new URLSearchParams(responseBody);
                if (params.get('xResult') === 'V') {
                    this.verify3DS(JSON.parse('{"' + decodeURI(responseBody).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'));
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    watch: {
        doSubmit(val) {
            if (val)
                this.submit();
        }
    }
};
</script>