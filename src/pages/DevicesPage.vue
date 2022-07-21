<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table
        title="Devices"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :separator="horizontal"
      />
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

let gatewayData = {};
const columns = [
  {
    name: "id",
    required: true,
    label: "Device ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Device name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
  { name: "carbs", label: "Carbs (g)", field: "carbs" },
  { name: "protein", label: "Protein (g)", field: "protein" },
  { name: "sodium", label: "Sodium (mg)", field: "sodium" },
  {
    name: "calcium",
    label: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "iron",
    label: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];

function loadData() {
  axios
    .get("deviceData")
    .then((val) => {
      console.log(val);
      this.gatewayData = val;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setTimeout(() => {}, 300);
    });
}

export default {
  data() {
    return {
      columns,
      gatewayData: "",
    };
  },
  mounted() {
    loadData();
  },
};
</script>
