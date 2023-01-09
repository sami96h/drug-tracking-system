import {
  createBrowserRouter,
} from 'react-router-dom'
import AddDrugs from '../component/AddDrugs'
import Introduction from '../component/introduction'
import QrCodes from '../component/QrCodes'
import QrScanner from '../component/QrScanner'
import TransactionsList from '../component/TransactionsList'
import BatchesList from '../component/BatchesList'
import BatchesDetails from '../component/BatchesDetails'
import UpdateDrugs from '../component/UpdateDrugs'
import Home from '../pages/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
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
      {
        path: '/drugs/update',
        element: <UpdateDrugs />,
      },
      {
        path: '/qr-scanner',
        element: <QrScanner />,
      },
      {
        path: '/transactions',
        element: <TransactionsList />,
      },
      {
        path: '/batches',
        element: <BatchesList />,
      },
      {
        path: '/batches/:id',
        element: <BatchesDetails />,
      },
      {
        path: 'qr-codes',
        element: <QrCodes />,
      },
    ],
  },
])
