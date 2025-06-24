<script setup>
import { ref, inject, onMounted } from 'vue'
import { IconAlertOctagon } from '@tabler/icons-vue'

const axios = inject('$axios')
const user = inject('$user')

const dialogMessage = ref(false)

// Read Logs

const actlog = ref()

onMounted(() => {
  readLog()
})

const readLog = () => {
  axios.get('/logs_function.php?readLogs').then(function (response) {
    actlog.value = response.data
  })
}

// Read Notification

const notifCount = ref()

onMounted(() => {
  readNotif()
})

const readNotif = () => {
  axios.get('/logs_function.php?readNotifCount').then(function (response) {
    notifCount.value = response.data.count
  })
}

// Read/Unread Functions
const logids = ref()
const logmsg = ref()

const readStatus = (props) => {
  dialogMessage.value = true
  logids.value = props

  var formData = new FormData()
  formData.append('logids', logids.value)

  axios.post('/logs_function.php?readStats', formData).then(function (response) {
    logmsg.value = response.data
  })

  axios.post('/logs_function.php?logReadStats', formData).then(function (response) {
    if (response.data == true) {
      readNotif()
    } else {
      alert('2nd Failed')
    }
  })
}
</script>

<template>
  <div class="q-pa-xs">
    <q-btn flat round icon="notifications_active" class="q-ml-md">
      <q-menu class="rounded-borders-20">
        <div class="q-pa-sm notifexpansion">
          <q-list v-for="actlogs in actlog" :key="actlogs.actlog">
            <q-item
              clickable
              v-ripple
              @click="readStatus(actlogs.id)"
              v-if="actlogs.read_stats == 'unread'"
              class="secondarymodes"
            >
              <q-item-section>
                <q-item-label>SYSTEM NOTIFICATION: {{ actlogs.added_by }}</q-item-label>
                <q-item-label caption lines="2">{{ actlogs.action_title }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ actlogs.prevtime }} ago</q-item-label>
                <q-icon
                  v-if="actlogs.read_stats == 'read'"
                  name="radio_button_checked"
                  color="green"
                />
                <q-icon v-else name="radio_button_checked" color="orange" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="readStatus(actlogs.id)" v-else class="surface-notif">
              <q-item-section>
                <q-item-label>SYSTEM NOTIFICATION: {{ actlogs.added_by }}</q-item-label>
                <q-item-label caption lines="2">{{ actlogs.action_title }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ actlogs.prevtime }} ago</q-item-label>
                <q-icon
                  v-if="actlogs.read_stats == 'read'"
                  name="radio_button_checked"
                  color="green"
                />
                <q-icon v-else name="radio_button_checked" color="orange" />
              </q-item-section>
            </q-item>

            <q-separator dark />
          </q-list>
        </div>
      </q-menu>

      <q-badge color="orange" floating>{{ notifCount }}</q-badge>
    </q-btn>
  </div>

  <q-dialog v-model="dialogMessage" persistent>
    <q-card style="width: 700px; max-width: 80vw" class="rounded-borders-20 on-surface-text">
      <q-toolbar class="secondarymodes">
        <IconAlertOctagon :size="30" stroke-width="2" />

        <q-toolbar-title
          ><span class="text-weight-bold">SYSTEM NOTIFICATION</span> !!</q-toolbar-title
        >
      </q-toolbar>
      <q-card-section v-for="logmsgs in logmsg" :key="logmsgs.logmsg">
        <div class="q-pa-xs text-h6">Action by: {{ logmsgs.added_by }}</div>
        <div class="q-pa-xs text-h7">Action Log: {{ logmsgs.action_title }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" v-close-popup @click="readLog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.notifexpansion {
  max-width: 350px;
  max-height: 500px;
}
</style>
