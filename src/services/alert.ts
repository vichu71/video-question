import { Vue } from 'vue-property-decorator'
import { AxiosInstance } from 'axios'

export enum AlertType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success'
}

export interface Alert {
  type: AlertType,
  message: string
}

export interface AlertContainer {
  alert: (type: AlertType, message: string) => void
}

const alertService = new class AlertService {
  app?: AlertContainer

  setAppContainer (app: AlertContainer) {
    this.app = app
  }

  alert (type: AlertType, message: string) {
    if (this.app) {
      this.app.alert(type, message)
    }
  }

  info (message: string) {
    this.alert(AlertType.INFO, message)
  }
  error (message: string) {
    this.alert(AlertType.ERROR, message)
  }
  success (message: string) {
    this.alert(AlertType.SUCCESS, message)
  }
  warning (message: string) {
    this.alert(AlertType.WARNING, message)
  }

  setupInterceptors (ax: AxiosInstance) {
    ax.interceptors.response.use(res => res, err => {
      if (err && err.config && err.response) {
        if(err.config.url === '/clients' && err.config.method === 'get' && err.response.status === 401) {
          return
        }
        if(err.config.url === 'authenticate' && err.config.method === 'post' && err.response.status === 401) {
          this.error("La combinación de usuario y contraseña ingresada es incorrecta")
          return
        }
      }
      if(err && err.response && err.response.status === 401) {
        this.error("Se venció la sesión, por favor vuelva a ingresar su usuario y contraseña")
        return
      }
      if(err && err.message === "Network Error") {
        this.error("Hubo un error en la conexión con el servidor")
        return
      }
      this.error((err && err.response && err.response.data && err.response.data.detail) || err)
      throw err
    })
  }
}

export default alertService
