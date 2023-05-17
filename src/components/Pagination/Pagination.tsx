import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

interface PropsPagination {
  totalPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  queryConfig: QueryConfig
}
const RANGE = 2
function Pagination({ totalPage, queryConfig, setCurrentPage }: PropsPagination) {
  const currentPage = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 px-4 py-2'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 px-4 py-2'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // Điều kiện để return về ...
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames(
              'mx-3 flex h-7 w-10 cursor-pointer items-center justify-center text-center text-lg text-gray-500 hover:fill-gray-800',
              { 'rounded-sm bg-orange text-white': currentPage === pageNumber }
            )}
            key={index}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap items-center justify-center'>
      {currentPage !== 1 ? (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className='cursor-pointe mr-2 px-4 py-4'
        >
          <svg
            enableBackground='new 0 0 11 11'
            viewBox='0 0 11 11'
            x='0'
            y='0'
            className='h-4 w-4 fill-gray-500 hover:fill-gray-800'
          >
            <g>
              <path d='m8.5 11c-.1 0-.2 0-.3-.1l-6-5c-.1-.1-.2-.3-.2-.4s.1-.3.2-.4l6-5c .2-.2.5-.1.7.1s.1.5-.1.7l-5.5 4.6 5.5 4.6c.2.2.2.5.1.7-.1.1-.3.2-.4.2z'></path>
            </g>
          </svg>
        </Link>
      ) : (
        <span className='cursor-pointe mr-2 cursor-not-allowed px-4 py-4'>
          <svg enableBackground='new 0 0 11 11' viewBox='0 0 11 11' x='0' y='0' className='h-4 w-4 fill-gray-300'>
            <g>
              <path d='m8.5 11c-.1 0-.2 0-.3-.1l-6-5c-.1-.1-.2-.3-.2-.4s.1-.3.2-.4l6-5c .2-.2.5-.1.7.1s.1.5-.1.7l-5.5 4.6 5.5 4.6c.2.2.2.5.1.7-.1.1-.3.2-.4.2z'></path>
            </g>
          </svg>
        </span>
      )}

      {renderPagination()}
      {currentPage !== totalPage ? (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className='ml-4  cursor-pointer px-4 py-2'
        >
          <svg
            enableBackground='new 0 0 11 11'
            viewBox='0 0 11 11'
            x='0'
            y='0'
            className='h-4 w-4 fill-gray-500 hover:fill-gray-800'
          >
            <path d='m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z'></path>
          </svg>
        </Link>
      ) : (
        <span className='ml-4  cursor-pointer px-4 py-2'>
          <svg
            enableBackground='new 0 0 11 11'
            viewBox='0 0 11 11'
            x='0'
            y='0'
            className='h-4 w-4 cursor-not-allowed fill-gray-300'
          >
            <path d='m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z'></path>
          </svg>
        </span>
      )}
    </div>
  )
}

export default Pagination
