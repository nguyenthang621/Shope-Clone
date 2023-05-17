import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { schemaRegister } from 'src/utils/rules'
import Input from 'src/components/Input/Input'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/apis/auth.api'
import _ from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = yup.InferType<typeof schemaRegister>

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaRegister)
  })
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'password_confirm'>) => registerAccount(body)
  })

  const onsubmit = handleSubmit((data) => {
    const body = _.omit(data, ['password_confirm'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'password_confirm'>>>(error)) {
          const errorForm = error.response?.data.data
          if (errorForm) {
            Object.keys(errorForm).forEach((key: string) => {
              setError(key as keyof Omit<FormData, 'password_confirm'>, {
                message: errorForm[key as keyof Omit<FormData, 'password_confirm'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onsubmit}>
              <div className='text-2xl'>Đăng kí</div>
              <Input
                name='email'
                placeholder='Email'
                register={register}
                type='email'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                placeholder='Mật khẩu'
                register={register}
                type='password'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Input
                name='password_confirm'
                placeholder='Xác nhận Mật khẩu'
                register={register}
                type='password'
                errorMessage={errors.password_confirm?.message}
                autoComplete='on'
              />

              <Button
                className='mt-4 flex w-full items-center justify-center bg-red-400 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-500'
                isLoading={registerAccountMutation.isLoading}
                disabled={registerAccountMutation.isLoading}
              >
                Đăng kí
              </Button>
              <div className='mt-2 flex items-center justify-center text-center'>
                <div className='text-slate-400'>Bạn đã có tài khoản?</div>
                <Link to={path.home} className='ml-1 text-red-600'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
