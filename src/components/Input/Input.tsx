import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}

function Input({ type, name, register, errorMessage, rules, ...rest }: InputProps) {
  return (
    <div className='mt-2'>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        {...register(name, rules)}
        {...rest}
      />
      <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default Input
