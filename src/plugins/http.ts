import axios from 'axios'

const http = axios.create({
    //baseURL: process.env.VUE_APP_BACKEND_URL,
    baseURL:'https://test.apigw.question.systems/',
  timeout: 10000,
  timeoutErrorMessage: 'Timeout'
})

export default http
