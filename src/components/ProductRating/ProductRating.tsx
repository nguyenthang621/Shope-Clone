function ProductRating({
  rating,
  activeClassName = 'h-3 w-3 fill-yellow-300 text-yellow-300',
  nonActiveClassName = 'h-3 w-3 fill-current text-gray-300'
}: {
  rating: number
  activeClassName?: string
  nonActiveClassName?: string
}) {
  const arrayRating = Array(5)
    .fill(0)
    .map((_, index) => {
      if (index + 1 < rating) return '100%'
      else if (index + 1 - rating < 1) return Math.floor((rating - index) * 100) + '%'
      else return '0%'
    })

  return (
    <div className='flex items-center'>
      {arrayRating.map((fill, index) => {
        return (
          <div className='relative' key={index}>
            <div className={`absolute left-0 top-0 h-full  overflow-hidden`} style={{ width: fill }}>
              <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={activeClassName}>
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit='10'
                ></polygon>
              </svg>
            </div>
            <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={nonActiveClassName}>
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit='10'
              ></polygon>
            </svg>
          </div>
        )
      })}
    </div>
  )
}

export default ProductRating
