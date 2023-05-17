import Footer from 'src/components/Footer'
import MainHeader from 'src/components/MainHeader'

interface layoutProps {
  children: React.ReactNode
}
function MainLayout({ children }: layoutProps) {
  return (
    <>
      <MainHeader></MainHeader>
      {children}
      <Footer></Footer>
    </>
  )
}

export default MainLayout
