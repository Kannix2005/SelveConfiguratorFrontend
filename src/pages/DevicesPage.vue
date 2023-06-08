<template>
  <q-page class="flex-center">
    <div class="q-pa-xl">
      <q-table
        flat
        bordered
        title="Devices"
        :rows="deviceData"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
        :pagination="initialPagination"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top>
          <q-btn
            color="primary"
            :disable="loading"
            label="Add device"
            icon="add"
            @click="addPopup"
          />
          <q-btn
            class="q-ml-sm"
            color="primary"
            label="Update all"
            icon="refresh"
            @click="loadData"
          />
          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td width="20px">
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
              <q-badge
                v-if="col.value === 'device'"
                color="purple"
                :label="'Commeo'"
              />
              <q-badge
                v-else-if="col.value === 'iveo'"
                color="green"
                :label="'Iveo'"
              />
              <q-badge
                v-else-if="col.value === 'sensor'"
                color="yellow"
                :label="'Sensor'"
              />
              <q-badge
                v-else-if="col.value === 'sender'"
                color="blue"
                :label="'Sender'"
              />
              <q-badge
                v-else-if="col.value === 'senSim'"
                color="black"
                :label="'SenSim'"
              />
              <div v-else>{{ col.value }}</div>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td
              colspan="100%"
              class="q-pa-md example-row-stacked-to-horizontal"
            >
              <div class="row">
                <div class="col-12">
                  <q-list bordered class="rounded-borders">
                    <q-expansion-item
                      expand-separator
                      icon="perm_identity"
                      label="Name"
                      :caption="props.row.name"
                    >
                      <q-card>
                        <q-card-section>
                          <div>
                            <q-btn
                              style="background: #009f00; color: white"
                              label="Rename"
                              icon="update"
                              class="flex-break"
                              @click="renamePopup(props.row.id, props.row.name)"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>

                    <q-expansion-item
                      expand-separator
                      icon="perm_identity"
                      label="Value"
                      :caption="
                        props.row.info.value ? props.row.info.value : '0'
                      "
                    >
                      <q-slider
                        v-model="props.row.info.value"
                        @change="
                          (val) => {
                            this.setValue(props.row.id, val);
                          }
                        "
                        :min="0"
                        :max="100"
                        :step="1"
                        label
                        :label-value="'Current value: ' + props.row.info.value"
                        color="light-blue"
                        @vue-mounted="value = props.row.info.value"
                        class=""
                        style="width: 50%; margin-left: 25%"
                      />
                    </q-expansion-item>

                    <q-expansion-item
                      v-for="(item, key) in props.row.info"
                      v-bind:key="key"
                      :label="labelkey(key, item)['label']"
                      :icon="labelkey(key, item)['icon']"
                      :header-class="labelkey(key, item)['headerclass']"
                      :disable="labelkey(key, item)['disable']"
                      :caption="labelkey(key, item)['caption']"
                      :hidden="labelkey(key, item)['hidden']"
                    ></q-expansion-item>

                    <q-expansion-item icon="build" label="Actions">
                      <q-card>
                        <q-card-section>
                          <div>
                            <q-btn
                              style="background: #7575ff; color: white"
                              label="Set device function"
                              icon="delete"
                              class="flex-break"
                              @click="deviceFunction(props.row.i)"
                            />
                            <q-btn
                              style="background: #ff0000; color: white"
                              label="Delete Device"
                              icon="delete"
                              class="flex-break"
                              margin="10px"
                              @click="deletePopup(props.row.id, props.row.name)"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </div>
                <div class="col-1"></div>
                <div class="col-1"></div>
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
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { ref } from "vue";

let deviceData = {};
const columns = [
  {
    name: "id",
    required: true,
    label: "Device ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
    style: "width: 50px",
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
    align: "left",
    label: "Type",
    field: (row) => row.type,
    sortable: true,
  },
];

export default defineComponent({
  name: "DevicePage",
  setup() {
    let $q = useQuasar();
    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        $q,
        // rowsNumber: xx if getting data from a server
      },
    };
  },
  data() {
    return {
      loading: ref(false),
      filter: ref(""),
      rowCount: ref(10),
      columns,
      deviceData: [],
      standard: ref(50),
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;

      if (window.location.href.indexOf("localhost") >= 0) {
        let value = Math.random();
        let mms = "";
        if (value <= 0.3) {
          mms = "UP_ON";
        } else if (value <= 0.6) {
          mms = "STOPPED_OFF";
        } else if (value <= 1) {
          mms = "DOWN_ON";
        }
        this.deviceData = [
          {
            id: 1,
            type: "device",
            name: "Dingsbums1",
            info: {
              movementState: mms,
              value: Math.floor(Math.random() * 100),
              targetValue: 40,
              unreachable: Math.random() <= 0.5 ? true : false,
              overload: Math.random() <= 0.5 ? true : false,
              obstructed: Math.random() <= 0.5 ? true : false,
              alarm: Math.random() <= 0.5 ? true : false,
              lostSensor: Math.random() <= 0.5 ? true : false,
              automaticMode: Math.random() <= 0.5 ? true : false,
              gatewayNotLearned: Math.random() <= 0.5 ? true : false,
              windAlarm: Math.random() <= 0.5 ? true : false,
              rainAlarm: Math.random() <= 0.5 ? true : false,
              freezingAlarm: Math.random() <= 0.5 ? true : false,
              dayMode: "3",
            },
          },
          { id: 2, type: "sensor", name: "Wohnzimmer", info: [] },
          { id: 3, type: "iveo", name: "Fenster", info: [] },
          {
            id: 4,
            type: "device",
            name: "Schlosswächter Haus",
            info: {
              movementState: mms,
              value: Math.floor(Math.random() * 100),
              targetValue: 60,
              unreachable: false,
              overload: true,
              obstructed: true,
              alarm: true,
              lostSensor: true,
              automaticMode: true,
              gatewayNotLearned: true,
              windAlarm: true,
              rainAlarm: true,
              freezingAlarm: true,
              dayMode: "Day",
            },
          },
          { id: 5, type: "sender", name: "Fenster", info: [] },
          { id: 6, type: "senSim", name: "Handsteuerung", info: [] },
        ];

        this.loading = false;
      } else {
        axios
          .get("devices")
          .then((val) => {
            console.log(val);
            this.deviceData = val;
          })
          .catch((err) => {
            console.log(err);
            this.$notifyError(err.toString());
          })
          .finally(() => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
      }
    },

    updateDevice(id) {
      this.loading = true;
      axios
        .get("devices/" + id)
        .then((val) => {
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          this.$notifyError(err.toString());
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    deleteDevice(id) {
      this.loading = true;
      axios
        .delete("devices/delete/" + id)
        .then((val) => {
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          this.$notifyError(err.toString());
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    renameDevice(id, name) {
      this.loading = true;
      axios
        .put("devices/rename/" + id, { name: name })
        .then((val) => {
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          this.$notifyError(err.toString());
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    setValue(id, val) {
      this.loading = true;
      axios
        .post("devices/setValue/" + id, { value: val })
        .then((val) => {
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          this.$notifyError(err.toString());
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },

    deletePopup(id, name) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Do you really want to delete the device " + name + "?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.deleteDevice(id);
          this.loadData();
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
      this.$q
        .dialog({
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
          this.renameDevice(id, data);
          this.loadData();
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
    addPopup() {
      this.$q
        .dialog({
          title: "Add Device",
          message: "Press OK to search for new devices.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$q
            .dialog({
              title: "Type of device to learn",
              message: "Choose an option:",
              options: {
                type: "radio",
                model: "opt1",
                // inline: true
                items: [
                  { label: "Commeo", value: "commeo" },
                  { label: "Iveo", value: "iveo" },
                  { label: "Sensor", value: "sensor" },
                  { label: "Sender", value: "sender" },
                ],
              },
              cancel: true,
              persistent: true,
            })
            .onOk((data) => {
              console.log(">>>> OK, received", data);
              this.loading = true;
              axios
                .post("gateway/learn/" + data)
                .then((val) => {
                  let foundDevices = {};
                  let foundDevicesNo = 0;
                  let dialog = $q
                    .dialog({
                      message: "Time left: 240s",
                      progress: true, // we enable default settings
                      persistent: true, // we want the user to not be able to close it
                      cancel: true, // we want the user to be able to cancel it
                    })
                    .onCancel(() => {
                      this.loading = true;
                      axios
                        .get("gateway/stopLearn/")
                        .then((val) => {})
                        .catch((err) => {
                          console.log(err);
                          this.$notifyError(err.toString());
                        })
                        .finally(() => {
                          setTimeout(() => {
                            clearInterval(interval);
                            this.loading = false;
                            dialog.hide();
                            this.loadData();
                          }, 300);
                        });

                      if (foundDevicesNo > 0) {
                        this.$q
                          .dialog({
                            title: "Select found device save into the gateway",
                            message: "Choose a device:",
                            options: {
                              type: "radio",
                              model: "optFoundDevices",
                              // inline: true
                              items: foundDevices.items(),
                            },
                            cancel: true,
                            persistent: true,
                          })
                          .onOk((data) => {
                            axios
                              .post("gateway/save/" + data)
                              .then((val) => {})
                              .catch((err) => {
                                console.log(err);
                                this.$notifyError(err.toString());
                              })
                              .finally(() => {
                                setTimeout(() => {
                                  this.loading = false;
                                }, 300);
                              });
                          });
                      }

                      dialog.hide();
                      this.loadData();
                    });
                  const interval = setInterval(() => {
                    this.loading = true;
                    axios
                      .get("gateway/learn/" + data)
                      .then((val) => {
                        dialog.update({
                          message: `Time left: ${val.timeLeft}s <br> Found devices: ${val.foundDevicesNo}`,
                        });
                        if (val.foundDevicesNo > 0) {
                          foundDevices = val.foundDevices;
                          foundDevicesNo = val.foundDevicesNo;
                        }
                        if (val.timeLeft >= 240) {
                          clearInterval(interval);
                          setTimeout(() => {
                            if (foundDevicesNo > 0) {
                              this.$q
                                .dialog({
                                  title:
                                    "Select found device save into the gateway",
                                  message: "Choose a device:",
                                  options: {
                                    type: "radio",
                                    model: "optFoundDevices",
                                    // inline: true
                                    items: foundDevices.items(),
                                  },
                                  cancel: true,
                                  persistent: true,
                                })
                                .onOk((data) => {
                                  axios
                                    .post("gateway/save/" + data)
                                    .then((val) => {})
                                    .catch((err) => {
                                      console.log(err);
                                      this.$notifyError(err.toString());
                                    })
                                    .finally(() => {
                                      setTimeout(() => {
                                        this.loading = false;
                                      }, 300);
                                    });
                                });
                            }
                            dialog.hide();
                            this.loadData();
                          }, 350);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        this.$notifyError(err.toString());
                      })
                      .finally(() => {
                        setTimeout(() => {
                          this.loading = false;
                        }, 300);
                      });
                  }, 1000);
                })
                .catch((err) => {
                  console.log(err);
                  this.$notifyError(err.toString());
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loading = false;
                  }, 300);
                });
            })
            .onCancel(() => {
              // console.log('>>>> Cancel')
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
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
    deviceFunction(id) {
      this.$q
        .dialog({
          title: "Type of command to set the device to",
          message: "Choose an option:",
          options: {
            type: "radio",
            model: "optDeviceFunction",
            // inline: true
            items: [
              { label: "Select", value: 0 },
              { label: "Install", value: 1 },
              { label: "Sensor", value: 2 },
              { label: "ManProg", value: 3 },
              { label: "AutoProg", value: 4 },
              { label: "StorePosition", value: 5 },
              { label: "DriveUp", value: 6 },
              { label: "DriveDown", value: 7 },
              { label: "KeyRelease", value: 8 },
              { label: "DriveStop", value: 9 },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          console.log(">>>> OK, received", data);
          this.loading = true;
          axios
            .post("device/" + id + "/setFunction/", data)
            .then((val) => {
              let dialog = $q
                .dialog({
                  message: "Set another function?",
                  persistent: true, // we want the user to not be able to close it
                  cancel: true, // we want the user to be able to cancel it
                })
                .onOk(() => {
                  this.deviceFunction(id);
                  dialog.hide();
                })
                .onCancel(() => {
                  dialog.hide();
                  this.loadData();
                });
            })
            .catch((err) => {
              console.log(err);
              this.$notifyError(err.toString());
            })
            .finally(() => {
              setTimeout(() => {
                this.loading = false;
              }, 300);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    deviceType(id) {
      this.$q
        .dialog({
          title: "Type to set the device to",
          message: "Choose an option:",
          options: {
            type: "radio",
            model: "optDeviceType",
            // inline: true
            items: [
              { label: "Shutter", value: 1 },
              { label: "Blind", value: 2 },
              { label: "Awning", value: 3 },
              { label: "Switch", value: 4 },
              { label: "Dimmer", value: 5 },
              { label: "Night Light", value: 6 },
              { label: "Dawn Light", value: 7 },
              { label: "Heating", value: 8 },
              { label: "Cooling", value: 9 },
              { label: "Switch (daytime)", value: 10 },
              { label: "gateway", value: 11 },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          console.log(">>>> OK, received", data);
          this.loading = true;
          axios
            .post("device/" + id + "/setType/", data)
            .then((val) => {
              dialog.hide();
            })
            .catch((err) => {
              console.log(err);
              this.$notifyError(err.toString());
            })
            .finally(() => {
              setTimeout(() => {
                this.loading = false;
              }, 300);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    labelkey(key, value) {
      switch (key) {
        case "unreachable":
          return {
            label: "Reachable",
            icon: value ? "signal_wifi_off" : "signal_wifi_4_bar",
            headerclass: value ? "text-yellow" : "text-green",
            disable: true,
            caption: value ? "unreachable" : "reachable",
          };
        case "movementState":
          return {
            label: "Movement State",
            icon: "timeline",
            headerclass: "",
            disable: true,
            caption: value,
          };
        case "targetValue":
          return {
            label: "Target value",
            icon: "percent",
            headerclass: "",
            disable: true,
            caption: "" + value,
          };
        case "overload":
          return {
            caption: value ? "overloaded" : "clear",
            icon: value ? "sync_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Overload",
          };
        case "obstructed":
          return {
            caption: value ? "obstructed" : "clear",
            icon: value ? "warning" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Obstructed",
          };
        case "alarm":
          return {
            caption: value ? "alarmed" : "clear",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Alarm",
          };
        case "lostSensor":
          return {
            caption: value ? "lost" : "clear",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Lost sensor",
          };
        case "automaticMode":
          return {
            caption: value ? "automatic mode" : "manual mode",
            icon: value ? "roller_shades" : "pan_tool",
            headerclass: value ? "text-blue" : "text-green",
            disable: true,
            label: "Driving mode",
          };
        case "gatewayNotLearned":
          return {
            caption: value ? "not learned" : "learned",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Gateway not learned",
          };
        case "windAlarm":
          return {
            caption: value ? "alarm" : "clear",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Wind alarm",
          };
        case "rainAlarm":
          return {
            caption: value ? "alarm" : "clear",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Rain alarm",
          };
        case "freezingAlarm":
          return {
            caption: value ? "alarm" : "clear",
            icon: value ? "report_problem" : "check",
            headerclass: value ? "text-red" : "text-green",
            disable: true,
            label: "Freezing alarm",
          };
        case "dayMode":
          return {
            caption: value == "3" ? "day mode" : "no day mode",
            icon: value == "3" ? "insert_invitation" : "free_cancellation",
            headerclass: value == "3" ? "text-green" : "text-blue",
            disable: true,
            label: "Day Mode",
          };
        case "value":
          return { hidden: true };

        default:
          return {
            caption: value,
            icon: "question_mark",
            headerclass: "",
            disable: true,
            label: key,
          };
      }
    },
  },
});
</script>
