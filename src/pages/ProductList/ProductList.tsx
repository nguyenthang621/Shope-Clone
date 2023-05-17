import Product from 'src/components/Product'
import AsideFilter from './AsideFilter'
import SortBar from './SortBar'
import useQueryParams from 'src/hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import { productApi } from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import { useState } from 'react'
import { ProductListConfig } from 'src/types/product.type'
import { omitBy, isUndefined } from 'lodash'
import { categoriesApi } from 'src/apis/categories'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 10,
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      category: queryParams.category,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories()
  })

  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className='bg-gray-100 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-2'>
            <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig}></AsideFilter>
          </div>
          <div className='col-span-10'>
            <SortBar queryConfig={queryConfig} totalPage={productsData?.data.data.pagination.page_size || 1}></SortBar>
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productsData &&
                productsData.data.data.products.map((product) => (
                  <div className='span-col-1' key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
            </div>
            <Pagination
              queryConfig={queryConfig}
              totalPage={productsData?.data.data.pagination.page_size || 1}
              setCurrentPage={setCurrentPage}
            ></Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
