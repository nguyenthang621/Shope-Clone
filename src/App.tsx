import { ToastContainer } from 'react-toastify'
import useRoute from './hooks/useRoute'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElement = useRoute()

  return (
    <div>
      {routeElement}
      <ToastContainer />
    </div>
  )
}

export default App
