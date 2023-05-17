import axios, { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

import { HttpStatusCode } from 'src/constants/httpStatus'
import { AuthResponse } from 'src/types/auth.type'
import { LocalStorage } from './localStorage'
import path from 'src/constants/path'
import { User } from 'src/types/user.type'

class Http {
  instance: AxiosInstance
  private accessToken: string | null
  private refreshToken: string | null
  private profile: User | null
  constructor() {
    this.accessToken = LocalStorage.getItemStorage('access_token')
    this.refreshToken = LocalStorage.getItemStorage('refresh_token')
    this.profile = JSON.parse(LocalStorage.getItemStorage('profile') as string)
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Add a request interceptor
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.authorization = this.accessToken
        return config
      }
      return config
    })

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          this.profile = data.data.user

          LocalStorage.setItemStorage('access_token', this.accessToken)
          LocalStorage.setItemStorage('profile', JSON.stringify(this.profile))
        } else if (url === path.logout) {
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = null
          LocalStorage.clear()
        }
        return response
      },
      function (error) {
        if (error?.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
