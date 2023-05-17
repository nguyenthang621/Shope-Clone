import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { productApi } from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from 'src/utils/utils'
import QuantityController from 'src/components/QuantityController'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'

function ProductDetail() {
  const [currentIndexImage, setCurrentIndexImage] = useState<number[]>([0, 5])
  const [activeImage, setActiveImage] = useState<string>('')
  const { nameId } = useParams()
  const { data: productData } = useQuery({
    queryKey: ['product', nameId],
    queryFn: () => productApi.getProduct(nameId as string)
  })
  const product = productData?.data.data
  const imageRef = useRef<HTMLImageElement>(null)
  const currentImagesShow = useMemo(
    () => (product ? product.images.slice(...currentIndexImage) : []),
    [product, currentIndexImage]
  )

  useEffect(() => {
    if (product && product?.images.length > 0 && currentImagesShow) {
      setActiveImage(currentImagesShow[0])
    }
  }, [product, currentImagesShow])

  const handleSetImageShow = (control: string) => {
    if (control === 'next' && currentIndexImage[1] < (product?.images as string[]).length)
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    else if (control === 'prev' && currentIndexImage[0] > 0) setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const parentElement = event.currentTarget.getBoundingClientRect()
    // console.log(parentElement.x, parentElement.y)
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image // Kich thuoc anh
    const { offsetX, offsetY } = event.nativeEvent // Toa do mouse
    const top = offsetX * (1 - naturalWidth / parentElement.width)
    const left = offsetY * (1 - naturalHeight / parentElement.height)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleUnZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9 '>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={(event) => handleZoom(event)}
                onMouseLeave={(event) => handleUnZoom(event)}
              >
                <img
                  src={activeImage}
                  alt='product'
                  ref={imageRef}
                  className='pointer-events-none absolute left-0  top-0 h-full w-full bg-white object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={() => handleSetImageShow('prev')}
                >
                  <svg
                    enableBackground='new 0 0 13 20'
                    viewBox='0 0 13 20'
                    x='0'
                    y='0'
                    className='h-5 w-5 fill-slate-200'
                  >
                    <polygon points='4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9'></polygon>
                  </svg>
                </button>
                {currentImagesShow.map((img, index) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img}>
                      <img
                        src={img}
                        alt={product.name}
                        onMouseEnter={() => chooseActive(img)}
                        className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={() => handleSetImageShow('next')}
                >
                  <svg
                    enableBackground='new 0 0 13 21'
                    viewBox='0 0 13 21'
                    x='0'
                    y='0'
                    className='h-5 w-5 fill-slate-200'
                  >
                    <polygon points='11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11'></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-orange text-orange h-4 w-4'
                    nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                {/* <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                /> */}
                {/* <div className='ml-6 text-sm text-gray-500'>
                  {product.quantity} {t('product:available')}
                </div> */}
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  //   onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  //   onClick={buyNow}
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mb-4 mt-12 text-sm leading-9 text-gray-600'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
