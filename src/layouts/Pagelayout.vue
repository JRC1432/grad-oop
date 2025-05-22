<template>
  <q-layout view="hHh Lpr lff" class="pagebackground">
    <q-header flat height-hint="58">
      <!-- Apply surface-container-lowest if needed -->
      <q-toolbar class="secondarymodes">
        <q-btn flat round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />
        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs" to="/stats">
          <q-avatar size="28px" rounded>
            <img src="../assets/seilogopng.png" />
          </q-avatar>
          <q-toolbar-title shrink class="text-weight-bold">
            Graduate Scholarship Monitoring System
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <div class="q-gutter-xs row items-center no-wrap">
          <DarkMode />
          <Notify />
          <UploadPic />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :width="200"
      :breakpoint="500"
      class="backgroundmodes"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list padding>
          <q-item
            clickable
            v-ripple
            tag="a"
            to="/dashboard"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section> Dashboard </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            tag="a"
            to="/users"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>

            <q-item-section> Users </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            tag="a"
            to="/newscholar"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="group_add" />
            </q-item-section>

            <q-item-section> New Scholar </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            tag="a"
            to="/scholars"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section> Scholars </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            tag="a"
            to="/school"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="home_work" />
            </q-item-section>

            <q-item-section> Schools </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            tag="a"
            to="/forms"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>

            <q-item-section> Forms </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            tag="a"
            to="/brochure"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>

            <q-item-section> Brochures </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            tag="a"
            to="/log"
            class="rounded-borders q-my-xs"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" />
            </q-item-section>

            <q-item-section> Logs </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import DarkMode from '../components/DarkMode.vue'
// import Notify from '../components/Notify.vue'
import UploadPic from '../components/UploadPic.vue'
import { ref, inject, reactive, onMounted } from 'vue'

import {
  IconChartPie,
  IconUsersGroup,
  IconUserPlus,
  IconSchool,
  IconBuildingCommunity,
  IconFileInfo,
  IconAlertOctagon,
} from '@tabler/icons-vue'
import router from '../router'

const axios = inject('$axios')
const user = inject('$user')

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const drawer = ref(false)
const miniState = ref(true)
</script>

<style lang="sass" scoped>

.my-menu-link
  color: white
  background: #71cf3a
  .my-card
  width: 100%
  max-width: 350px
  .rounded-borders-40
  border-radius: 40px !important // Adjust the radius as needed
  .overflow-hidden
  overflow: hidden

  .example-item
  height: 5px
</style>
