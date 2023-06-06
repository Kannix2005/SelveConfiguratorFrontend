<template>
  <q-layout view="lHh lpR lfr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Selve Configurator </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="200">
      <q-tabs vertical>
        <q-item-label header> Menu </q-item-label>
        <q-route-tab name="Devices" label="Devices" icon="code" to="/" exact />
        <q-route-tab
          name="Gateway"
          label="Gateway"
          icon="school"
          to="/gateway"
          exact
        />
        <q-route-tab
          name="Settings"
          label="Settings"
          icon="chat"
          to="/settings"
          exact
        />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="accent" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
