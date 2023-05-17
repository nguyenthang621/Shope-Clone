import React from 'react'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface LayoutProps {
  children?: React.ReactNode
}
function RegisterLayout({ children }: LayoutProps) {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      {children}
      <Footer></Footer>
    </div>
  )
}

export default RegisterLayout
