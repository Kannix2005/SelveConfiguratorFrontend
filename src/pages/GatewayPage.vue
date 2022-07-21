<template>
  <q-page class="flex flex-center"> Gateway </q-page>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

function loadData() {
  axios
    .get("gatewayData")
    .then((val) => {
      console.log(val);
      this.gatewayData = val;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setTimeout(() => {}, 300);
    });
}

export default defineComponent({
  name: "GatewayPage",
  setup() {},
  mounted() {
    loadData();
  },
});
</script>
