import * as yup from 'yup'
import { RegisterOptions, UseFormGetValues } from 'react-hook-form'

type Rules = { [key in 'email' | 'password' | 'password_confirm']?: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Email không hợp lệ'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6-130 ký tự'
    },
    maxLength: {
      value: 130,
      message: 'Độ dài từ 6-130 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6-130 ký tự'
    },
    maxLength: {
      value: 130,
      message: 'Độ dài từ 6-130 ký tự'
    }
  },
  password_confirm: {
    required: {
      value: true,
      message: 'Mật khẩu xác nhận là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6-130 ký tự'
    },
    maxLength: {
      value: 130,
      message: 'Độ dài từ 6-130 ký tự'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Mật khẩu không khớp' : undefined
  }
})

export const schemaRegister = yup
  .object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự'),

    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự'),

    password_confirm: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự')
      .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không khớp')
  })
  .required()

export const schemaLogin = schemaRegister.omit(['password_confirm'])

export const schemaPrice = yup.object({
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Vui lòng nhập khoảng giá phù hợp',
    test: function (value) {
      const price_min = value
      const { price_max } = this.parent
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) > Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Vui lòng nhập khoảng giá phù hợp',
    test: function (value) {
      const price_max = value
      const { price_min } = this.parent
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) > Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  })
})
