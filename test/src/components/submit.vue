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
        amount: String,
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
                xVersion: "5.0.0",
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
                const gatewayResponse = await fetch("/api/gatewayjson", {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: { 'Content-Type': 'application/json' }
                });
                const responseBody = await gatewayResponse.json();
                console.log("Gateway Response", responseBody);
                if (responseBody.xResult === 'V')
                    this.verify3DS(responseBody);
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