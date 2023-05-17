import classNames from 'classnames'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Categories } from 'src/types/categories.type'
import { QueryConfig } from '../ProductList'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaPrice } from '../../../utils/rules'
import RatingStars from '../RatingStar'
import { omit } from 'lodash'

interface Props {
  categories: Categories[] | []
  queryConfig: QueryConfig
}

interface formData {
  price_min: string
  price_max: string
}

function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<formData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(schemaPrice)
  })
  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAllFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['price_min', 'price_max', 'rating_filter', 'category']
        )
      ).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link to={path.home} className={classNames('flex items-center font-bold', { ' text-orange': !category })}>
        <svg viewBox='0 0 12 10' className='mr-2 h-3 w-4 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth='1'>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4'>
        <ul>
          {categories.length > 0 &&
            categories.map((item) => {
              const isActive = category === item._id
              return (
                <li className='py-2 pl-2 text-sm' key={item._id}>
                  <Link
                    to={{
                      pathname: path.home,
                      search: createSearchParams({
                        ...queryConfig,
                        category: item._id
                      }).toString()
                    }}
                    className={classNames('relative px-2', {
                      'font-semibold text-orange': isActive
                    })}
                  >
                    {isActive && (
                      <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                        <polygon points='4 3.5 0 0 0 7' />
                      </svg>
                    )}
                    {item.name}
                  </Link>
                </li>
              )
            })}
        </ul>
      </div>
      <div className='py-4'>
        <div className='flex items-center font-bold'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x={0}
            y={0}
            className='mr-3 h-4 w-3 fill-current stroke-current'
          >
            <g>
              <polyline
                fill='none'
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </g>
          </svg>
          Bộ lọc tìm kiếm
        </div>
        <div className='my-4 h-[1px] bg-gray-300' />
        <div className=''>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start justify-around'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    placeholder='đ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  ></InputNumber>
                )
              }}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  placeholder='đ ĐẾN'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  classNameError='hidden'
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                  value={field.value}
                  ref={field.ref}
                ></InputNumber>
              )}
            />
          </div>
          <div className='mt-1 max-h-[1.25rem] min-h-[1rem] text-center text-xs text-red-600'>
            {errors.price_min?.message}
          </div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <div className='flex flex-col items-start'>
        <RatingStars queryConfig={queryConfig}></RatingStars>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAllFilter}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}

export default AsideFilter
