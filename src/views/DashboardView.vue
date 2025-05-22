<template>
  <div class="q-pa-md">
    <div class="text-h6 text-bold q-mb-md row items-center">
      <IconLayoutDashboard class="text-primary q-mr-sm" :size="40" stroke-width="2" />
      <span class="text-h4 text-bold text-primary">DASHBOARD</span>
    </div>
  </div>
  <div class="q-pa-md">
    <div class="col-xs-12 col-sm-6">
      <div class="q-col-gutter-md row items-start">
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card class="primarymodes" flat>
            <div class="row">
              <div class="col-2 q-pa-md">
                <div class="row justify-center items-center" style="height: 70px">
                  <q-icon name="school" size="xl"></q-icon>
                </div>
              </div>
              <div class="col-10 accentmodes">
                <div class="row items-center" style="height: 95px">
                  <div class="q-ml-md">
                    <div class="text-h4 text-bold">
                      <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="ongoingscholars + gradscholars + termscholars"
                        :duration="3"
                        class="text-bold"
                      />
                    </div>
                    <div class="text-subtitle2">
                      Total Number of Ongoing, Graduated & Terminated Scholars:
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card class="primarymodes" flat>
            <div class="row">
              <div class="col-2 q-pa-md">
                <div class="row justify-center items-center" style="height: 70px">
                  <q-icon name="diversity_3" size="xl"></q-icon>
                </div>
              </div>
              <div class="col-10 accentmodes">
                <div class="row items-center" style="height: 95px">
                  <div class="q-ml-md">
                    <div class="text-h4 text-bold" id="number_up">
                      <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="ongoingscholars"
                        :duration="3"
                        class="text-bold"
                      />
                    </div>
                    <div id="number_up"></div>
                    <div class="text-subtitle2">Ongoing Scholars:</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card class="primarymodes" flat>
            <div class="row">
              <div class="col-2 q-pa-md">
                <div class="row justify-center items-center" style="height: 70px">
                  <q-icon name="groups_3" size="xl"></q-icon>
                </div>
              </div>
              <div class="col-10 accentmodes">
                <div class="row items-center" style="height: 95px">
                  <div class="q-ml-md">
                    <div class="text-h4 text-bold">
                      <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="gradscholars"
                        :duration="3"
                        class="text-bold"
                      />
                    </div>
                    <div class="text-subtitle2">Graduated Scholars:</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card class="primarymodes" flat>
            <div class="row">
              <div class="col-2 q-pa-md">
                <div class="row justify-center items-center" style="height: 70px">
                  <q-icon name="person_off" size="xl"></q-icon>
                </div>
              </div>
              <div class="col-10 accentmodes">
                <div class="row items-center" style="height: 95px">
                  <div class="q-ml-md">
                    <div class="text-h4 text-bold">
                      <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="termscholars"
                        :duration="3"
                        class="text-bold"
                      />
                    </div>
                    <div class="text-subtitle2">Terminated Scholars:</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>

  <div class="q-pa-md">
    <div class="col-xs-12 col-sm-6">
      <div class="q-col-gutter-md row items-start">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <q-card class="rounded-borders-20 q-pa-md cards" flat>
            <div class="row items-center no-wrap q-mb-lg">
              <div class="col">
                <div class="text-h6 text-bold q-mb-md row items-center">
                  <IconChartBar class="text-primary q-mr-sm" :size="40" stroke-width="2" />
                  <span class="text-h6 text-bold text-primary">Scholar Charts</span>
                </div>
              </div>
            </div>
            <q-card-section>
              <div class="row">
                <div class="col-12">
                  <div class="row justify-center">
                    <Line :data="linedata" :options="lineoptions" style="height: 530px" />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 q-gutter-y-lg col-sm-12 col-md-4">
          <q-card class="text-primary rounded-borders-20 cards" flat>
            <q-card-section>
              <div class="text-h6 text-bold">Male & Female Scholars</div>
            </q-card-section>

            <q-card-section class="q-pa-md">
              <div class="q-pa-md">
                <q-card flat class="my-card white text-primary rounded-borders-20">
                  <Doughnut :data="data" :options="options" :height="195" :width="195" />
                </q-card>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="text-primary rounded-borders-20 cards" flat>
            <q-card-section>
              <div class="text-h6 text-bold">Scholars Status Charts</div>
            </q-card-section>

            <q-card-section class="q-pa-md">
              <div class="q-pa-md">
                <q-card flat class="my-card white text-primary rounded-borders-20">
                  <Doughnut :data="datas" :options="doptions" :height="200" :width="200" />
                </q-card>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>

  <q-page-sticky position="top-right" :offset="[22, 22]">
    <q-tooltip class="primary">Year Adjustment</q-tooltip>
    <form id="" @submit.prevent.stop="populateyears">
      <q-fab
        label="Actions"
        external-label
        color="light-green-5"
        icon="calendar_month"
        direction="left"
      >
        <q-fab-action class="accentmodes" icon="event">
          <div class="q-px-sm">
            <UpdateSelect
              title="Year To"
              v-model="yearselect"
              :options="yrsoptions"
              :onFilter="filteryrs"
              @update:modelValue="populateyears"
            /></div
        ></q-fab-action>
        <q-fab-action class="accentmodes" icon="today">
          <div class="q-px-sm">
            <UpdateSelect
              title="Year From"
              v-model="frstYearSelect"
              :options="yrsoptions"
              :onFilter="filteryrs"
              @update:modelValue="populateyears"
            />
          </div>
        </q-fab-action>
      </q-fab>
    </form>
  </q-page-sticky>
</template>
<script setup>
import UpdateSelect from '../components/UpdateSelect.vue'

import { ref, onMounted, inject, computed } from 'vue'
import { IconChartBar, IconLayoutDashboard } from '@tabler/icons-vue'
import { Line, Doughnut } from 'vue-chartjs'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { defineComponent } from 'vue'

import Vue3autocounter from 'vue3-autocounter'

const axios = inject('$axios')

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
)

// Declared Variable
const ongoingscholars = ref()
const gradscholars = ref()
const termscholars = ref()
const malecounts = ref([])
const femalecounts = ref([])
const allScholar = ref([])
const allYear = ref([])
var yrsoptions2 = []
const yrsoptions = ref(yrsoptions2)

const yearselect = ref(2026)
const frstYearSelect = ref(2023)

// const populateyrs = () => {

// }

const populateyears = () => {
  // Bar Graph Append
  var formData = new FormData()

  formData.append('frstYearSelect', frstYearSelect.value)
  formData.append('yearselect', yearselect.value)

  // Ongoing Scholars
  axios.post('/dashboard_function.php?OnScholars', formData).then(function (response) {
    ongoingscholars.value = response.data.ongoingscholar
  })

  // Graduated Scholars

  axios.post('/dashboard_function.php?GradScholars', formData).then(function (response) {
    gradscholars.value = response.data.gradscholar
  })

  // Terminated Scholars

  axios.post('/dashboard_function.php?TermScholars', formData).then(function (response) {
    termscholars.value = response.data.termscholar
  })

  // Male Counts

  axios.post('/dashboard_function.php?countmale', formData).then(function (response) {
    malecounts.value = response.data.malecount
  })

  // Female Counts

  axios.post('/dashboard_function.php?countfemale', formData).then(function (response) {
    femalecounts.value = response.data.femalecount
  })

  // Dashboard Datas

  axios.post('/dashboard_function.php?LineDataScholar', formData).then(function (response) {
    allYear.value = response.data.year
    allScholar.value = response.data.scholar

    console.log(response.data.year)
  })

  // Auto populate Years

  axios.get('/dashboard_function.php?years').then((response) => {
    yrsoptions2 = response.data
  })
}

const filteryrs = (val, update) => {
  if (val === '') {
    update(() => {
      yrsoptions.value = yrsoptions2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    yrsoptions.value = yrsoptions2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const linedata = computed(() => {
  return {
    labels: allYear.value,
    datasets: [
      {
        label: 'No. Of Scholars',
        backgroundColor: '#71cf3a',
        data: allScholar.value,
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  }
})

const lineoptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltip: {
    enabled: true,
  },
}

// Pie Data for Gender Scholars

const data = computed(() => {
  return {
    labels: ['Male', 'Female'],
    datasets: [
      {
        backgroundColor: ['#71cf3a', '#90e4b0'],
        data: [malecounts.value, femalecounts.value],
        borderWidth: 0,
      },
    ],
  }
})

const options = {
  responsive: true,
  cutout: 50,
  maintainAspectRatio: false,
}

// Pie Data for All Scholars

const datas = computed(() => {
  return {
    labels: ['Ongoing', 'Graduated', 'Terminated'],
    datasets: [
      {
        backgroundColor: ['#90e4b0', '#71cf3a', '#E3856B'],
        data: [ongoingscholars.value, gradscholars.value, termscholars.value],
        borderWidth: 0,
      },
    ],
  }
})

const doptions = {
  responsive: true,
  cutout: 50,
  maintainAspectRatio: false,
}

defineComponent({
  name: 'Demo',
  components: {
    'vue3-autocounter': Vue3autocounter,
  },
})

onMounted(() => {
  populateyears()
})
</script>

<style>
.rounded-borders-20 {
  border-radius: 20px !important; /* Adjust the radius as needed */
}
</style>
