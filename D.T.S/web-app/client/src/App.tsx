import { FC, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import useAuth from './hooks/useAuth'
import './App.css'
import { checkToken } from './api/checkToken'
import Spinner from './component/Spinner/spinner'

const App: any = () => {
  const { auth, dispatch } = useAuth()
  useEffect(() => {
    (async () => {
      try {
        const { username, org } = await checkToken()
        dispatch?.({
          type: 'INITIALISE',
          payload: { user: { username, org }, loggedIn: true },
        })
      } catch (err) {
        dispatch?.({
          type: 'INITIALISE',
          payload: { user: undefined, loggedIn: false },
        })
      }
    })()
  }, [])
  return (

    auth?.checkedToken ? (
      <div className="App">

        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    ) : (<Spinner />)

  )
}

export default App
