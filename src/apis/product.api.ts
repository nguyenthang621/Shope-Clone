import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

export const productApi = {
  getProducts: function (params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>('/products', { params })
  },
  getProduct: function (id: string) {
    return http.get<SuccessResponseApi<Product>>(`/products/${id}`)
  }
}
