import http from 'src/utils/http'
import { Categories } from '../types/categories.type'
import { SuccessResponseApi } from 'src/types/utils.type'

export const categoriesApi = {
  getCategories: function () {
    return http.get<SuccessResponseApi<Categories[]>>('/categories')
  }
}
