import {
  createBrowserRouter,
} from 'react-router-dom'
import Introduction from '../component/introduction'
import Home from '../pages/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        element: <Introduction />,
      },
    ],
  },
])
