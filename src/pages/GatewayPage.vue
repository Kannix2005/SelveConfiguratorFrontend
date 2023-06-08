<template>
  <q-page class="justify-evenly">
    <div class="row">
      <div class="col-6">
        <q-list bordered class="rounded-borders" padding>
          <q-item-label header>Gateway state</q-item-label>
          <div v-for="(item, key) in gatewayData" v-bind:key="key" class="">
            <q-expansion-item
              :label="labelkeyGateway(key, item)['label']"
              :icon="labelkeyGateway(key, item)['icon']"
              :header-class="labelkeyGateway(key, item)['headerclass']"
              :disable="labelkeyGateway(key, item)['disable']"
              :caption="labelkeyGateway(key, item)['caption']"
              :hidden="labelkeyGateway(key, item)['hidden']"
            ></q-expansion-item>
          </div>
        </q-list>
      </div>

      <div class="col-6">
        <q-list bordered padding>
          <q-item-label header>Gateway functions</q-item-label>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Enable gateway LEDs</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="blue"
                v-model="valueLED"
                val="battery"
                @update:model-value="this.setGatewayLED(valueLED)"
              />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Reset gateway</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="amber"
                label="Reset"
                @click="this.resetGateway()"
              ></q-btn>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Set repeater forwarding</q-item-label>
              <div class="text-h10">
                <q-badge
                  color="blue"
                  :label="gatewayData.repeaterState"
                  outline
                  align="middle"
                >
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="primary"
                label="Set Repeater"
                @click="this.setRepeater()"
              ></q-btn>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Set gateway events</q-item-label>

              <q-checkbox
                v-model="events.log"
                label="Log"
                @update:model-value="this.setEvents('log', events.log)"
              />
              <q-checkbox
                v-model="events.device"
                label="Device"
                @update:model-value="this.setEvents('device', events.device)"
              />
              <q-checkbox
                v-model="events.sensor"
                label="Sensor"
                @update:model-value="this.setEvents('sensor', events.sensor)"
              />
              <q-checkbox
                v-model="events.sender"
                label="Sender"
                @update:model-value="this.setEvents('sender', events.sender)"
              />
              <q-checkbox
                v-model="events.duty"
                label="Duty Cycle"
                @update:model-value="this.setEvents('duty', events.duty)"
              />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Factory reset Iveo channel</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="red"
                label="Factory reset channel"
                @click="this.iveoFactory()"
              ></q-btn>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Factory reset gateway</q-item-label>

              <div class="text-h10">
                <q-badge
                  color="red"
                  label="Deletes all devices --- DANGER!!!"
                  align="middle"
                >
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="red"
                label="FACTORY RESET"
                @click="this.factoryResetGateway()"
              ></q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { ref } from "vue";

export default defineComponent({
  name: "GatewayPage",
  setup() {
    let $q = useQuasar();
    return {};
  },
  data() {
    return {
      gatewayData: [],
      loading: ref(false),
      valueLED: ref(true),
      valueA: ref(true),
      events: {
        log: true,
        device: true,
        sensor: false,
        sender: false,
        duty: true,
      },
    };
  },
  methods: {
    loadGatewayData() {
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
        this.gatewayData = {
          port: 1,
          state: "device",
          lastLogEvent: "Dingsbums1",
          version: "12314.154545.22",
          serial: "ffaasdfsdaffas1413414",
          spec: "sdafdfdsafdsafds",
          duty: {
            utilization: 1,
            sendingBlocked: false,
          },
          worker: {
            state: "Running",
          },
          queue: {
            txq: {
              items: 0,
            },
            rxq: {
              items: 0,
            },
          },
          repeaterState: "No repeater installed",
        };

        this.loading = false;
      } else {
        axios
          .get("gatewayData")
          .then((val) => {
            console.log(val);
            this.gatewayData = val;
          })
          .catch((err) => {
            console.log(err);
            showNotifError(err);
          })
          .finally(() => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
        this.getEvents();
        this.getGatewayLED();
      }
    },

    labelkeyGateway(key, value) {
      switch (key) {
        case "state":
          return {
            label: "State",
            icon: "signal_wifi_4_bar",
            headerclass: "",
            disable: true,
            caption: value.toString(),
          };
        case "lastLogEvent":
          return {
            label: "Last Log Event",
            icon: "timeline",
            headerclass: "",
            disable: true,
            caption: value.toString(),
          };
        case "version":
          return {
            label: "Version",
            icon: "tag",
            headerclass: "",
            disable: true,
            caption: value.toString(),
          };
        case "serial":
          return {
            caption: value.toString(),
            icon: "tag",
            headerclass: "",
            disable: true,
            label: "Serial",
          };
        case "spec":
          return {
            caption: value.toString(),
            icon: "tag",
            headerclass: "",
            disable: true,
            label: "Spec",
          };
        case "duty":
          return {
            caption:
              "Utilization: " +
              value.utilization +
              " Sending blocked: " +
              value.sendingBlocked,
            icon: value.sendingBlocked ? "report_problem" : "check",
            headerclass: value.sendingBlocked ? "text-red" : "text-green",
            disable: true,
            label: "Duty",
          };
        case "worker":
          return {
            caption: value.state.toString(),
            icon: "check",
            headerclass: value.state === "Running" ? "text-green" : "text-red",
            disable: true,
            label: "Worker state",
          };
        case "port":
          return {
            caption: value.toString(),
            icon: "power",
            headerclass: "",
            disable: true,
            label: "Port",
          };
        case "queue":
          return {
            caption:
              "Transmitting " +
              value.txq.items +
              " items, Recieved " +
              value.rxq.items +
              " items",
            icon: "pan_tool",
            headerclass: "",
            disable: true,
            label: "Queue state",
          };

        default:
          return {
            caption: value.toString(),
            icon: "question_mark",
            headerclass: "",
            disable: true,
            label: key,
          };
      }
    },

    resetGateway() {
      this.loading = true;
      axios
        .get("gateway/reset")
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
    factoryResetGateway() {
      this.loading = true;
      axios
        .get("gateway/factoryReset")
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
    iveoFactory() {
      this.loading = true;
      //show popup with security check and selection
    },
    setGatewayLED(val) {
      this.loading = true;
      axios
        .post("gateway/led", { value: val })
        .then((val) => {
          this.getGatewayLED();
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
    getGatewayLED() {
      this.loading = true;
      axios
        .get("gateway/led")
        .then((val) => {
          this.valueLED = val;
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
    setEvents(type, val) {
      this.loading = true;
      axios
        .post("gateway/events", { type: type, value: val })
        .then((val) => {
          this.getGatewayLED();
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
    getEvents() {
      this.loading = true;
      axios
        .get("gateway/events")
        .then((val) => {
          this.events = val;
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
    setRepeater(type, val) {
      this.loading = true;
      //show popup
    },
    getRepeater() {
      this.loading = true;
      axios
        .get("gateway/repeater")
        .then((val) => {
          this.repeaterState = val;
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
  },
  mounted() {
    this.loadGatewayData();
  },
});
</script>
