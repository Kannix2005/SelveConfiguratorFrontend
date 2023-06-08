import { boot } from "quasar/wrappers";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios);
if (window.location.href.indexOf("localhost") >= 0) {
  mock.onGet("gatewayData").reply(200, {
    port: 1,
    state: "Blabla",
    lastLogEvent: "Dingsbums2",
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
  });

  mock.onGet("gateway/events").reply(200, {
    log: true,
    device: false,
    sensor: true,
    sender: true,
    duty: false,
  });

  mock.onGet("gateway/led").reply(200, { ledState: true });
  mock.onGet("gateway/repeater").reply(200, { repeaterState: true });
}
export default boot(async ({ app }) => {
  app.config.globalProperties.$mockApi = mock;
});
