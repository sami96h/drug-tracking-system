import {
  createBrowserRouter,
} from 'react-router-dom'
import AddDrugs from '../component/AddDrugs'
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
      {
        path: '/drugs/new',
        element: <AddDrugs />,
      },
    ],
  },
])
