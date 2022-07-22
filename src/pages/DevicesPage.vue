<template>
  <q-page class="flex-center">
    <div class="q-pa-xl">
      <q-table
        title="Devices"
        :rows="gatewayData"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
      >
        <template v-slot:top>
          <q-btn
            color="primary"
            :disable="loading"
            label="Add device"
            @click="addPopup"
          />
          <q-btn
            class="q-ml-sm"
            color="primary"
            label="Update all"
            @click="loadData"
          />
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="xs"
                color="blue"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="row">
                <div class="col">
                  Additional info about: {{ props.row.name }}.
                </div>
                <q-space></q-space>

                <div class="col-3">
                  <div>
                    <q-btn
                      style="background: #009f00; color: white"
                      label="Rename"
                      icon="update"
                      class="flex-break"
                      @click="renamePopup(props.row.id, props.row.name)"
                    />
                  </div>
                  <div>
                    <q-btn
                      style="background: #ff0000; color: white"
                      label="Delete"
                      icon="delete"
                      class="flex-break"
                      @click="deletePopup(props.row.id, props.row.name)"
                    />
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { ref } from "vue";

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
    name: "type",
    align: "center",
    label: "Type",
    field: (row) => row.type,
    sortable: true,
  },
];

export default {
  setup() {
    const loading = ref(false);
    const filter = ref("");
    const rowCount = ref(10);
    const $q = useQuasar();
    gatewayData = [];

    return {
      loading,
      filter,
      rowCount,
      columns,
      gatewayData,
      loadData() {
        loading.value = true;

        if (window.location.href.indexOf("localhost") >= 0) {
          this.gatewayData = [
            { id: 1, type: "commeo", name: "Dingsbums1" },
            { id: 2, type: "commeo", name: "Wohnzimmer" },
            { id: 3, type: "commeo", name: "Fenster" },
            { id: 4, type: "commeo", name: "Schlosswächter Haus" },
          ];

          loading.value = false;
        } else {
          axios
            .get("devices")
            .then((val) => {
              console.log(val);
              this.gatewayData = val;
            })
            .catch((err) => console.log(err))
            .finally(() => {
              setTimeout(() => {
                loading.value = false;
              }, 300);
            });
        }
      },

      update(id) {
        loading.value = true;
        axios
          .get("devices/" + id)
          .then((val) => {
            console.log(val);
            this.gatewayData = val;
          })
          .catch((err) => console.log(err))
          .finally(() => {
            setTimeout(() => {
              loading.value = false;
            }, 300);
          });
      },
      deleteDevice(id) {
        loading.value = true;
        axios
          .get("devices/delete/" + id)
          .then((val) => {
            console.log(val);
            this.gatewayData = val;
          })
          .catch((err) => console.log(err))
          .finally(() => {
            setTimeout(() => {
              loading.value = false;
            }, 300);
          });
      },
      renameDevice(id, name) {},

      deletePopup(id, name) {
        $q.dialog({
          title: "Confirm",
          message: "Do you really want to delete the device " + name + "?",
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            console.log(id);
          })
          .onOk(() => {
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      },
      renamePopup(id, name) {
        $q.dialog({
          title: "Confirm",
          message: "To what do you want to rename the device " + name + "?",
          cancel: true,
          persistent: true,
          prompt: {
            model: "",
            type: "text",
          },
        })
          .onOk((data) => {
            console.log(data);
          })
          .onOk(() => {
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      },
      addPopup(id, name) {
        $q.dialog({
          title: "Add Device",
          message: "Press OK to search for new devices.",
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            console.log("check");
          })
          .onOk(() => {
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      },
    };
  },
  data() {
    return {};
  },
  mounted() {
    this.loadData();
  },
};
</script>
