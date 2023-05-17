import { Link } from 'react-router-dom'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'
import ProductRating from '../ProductRating'
interface propsProduct {
  product: ProductType
}

function Product({ product }: propsProduct) {
  return (
    <Link to={product._id}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt='product'
            className='absolute left-0 top-0  h-full w-full bg-white object-contain'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[1.75rem] text-xs text-gray-800 line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-sm text-gray-400 line-through'>
              {' '}
              <span className='text-xs'>₫</span>
              <span>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-2 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating}></ProductRating>
            <div className='ml-2 text-xs text-gray-800'>Đã bán {formatNumberToSocialStyle(Number(product.sold))}</div>
          </div>
          <div className='mt-3'>
            <p className='text-xs text-gray-500'>Hà Nội</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
