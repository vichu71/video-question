<template>
  <v-snackbar
    v-if="currentAlert"
    v-model="currentAlert"
    :timeout="3000"
    :color="currentAlert.type"
  >{{ currentAlert.message }}</v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  default as alertService,
  AlertContainer,
  AlertType,
  Alert
} from '../services/alert'
import { AxiosInstance } from 'axios'

@Component
export default class AlertStack extends Vue implements AlertContainer {
  currentAlert?: Alert | null = null
  alerts: Alert[] = []

  showNextAlert () {
    if (this.alerts.length > 0) {
        this.currentAlert = this.alerts.pop()
        setTimeout(this.showNextAlert.bind(this), 300)
    }
  }

  alert (type: AlertType, message: string) {
    this.alerts.push({ type, message })
    if (!this.currentAlert && this.alerts.length === 1) {
      this.showNextAlert()
    }
  }
}
</script>

