import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input/Input'
import { schemaLogin } from 'src/utils/rules'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = yup.InferType<typeof schemaLogin>

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schemaLogin) })

  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const loginActionMutation = useMutation({
    mutationFn: (body: FormData) => loginAccount(body)
  })
  const onSubmit = handleSubmit((body) => {
    loginActionMutation.mutate(body, {
      onSuccess(data) {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(path.home)
      },
      onError(error) {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
          const errorForm = error.response?.data.data
          console.log(errorForm)
          if (errorForm) {
            Object.keys(errorForm).forEach((key: string) => {
              setError(key as keyof FormData, {
                message: errorForm[key as keyof FormData],
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
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='email'
                placeholder='Xác nhận Mật khẩu'
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
              <Button
                className='mt-4 flex w-full items-center justify-center bg-red-400 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-500'
                isLoading={loginActionMutation.isLoading}
                disabled={loginActionMutation.isLoading}
              >
                Đăng nhập
              </Button>
              <div className='mt-2 flex items-center justify-center text-center'>
                <div className='text-slate-400'>Bạn chưa có tài khoản?</div>
                <Link to={path.register} className='ml-1 text-red-600'>
                  Đăng kí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
