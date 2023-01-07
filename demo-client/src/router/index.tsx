import {
  createBrowserRouter,
} from 'react-router-dom'
import AddDrugs from '../component/AddDrugs'
import Introduction from '../component/introduction'
import QrCodes from '../component/QrCodes'
import QrScanner from '../component/QrScanner'
import TransactionsList from '../component/TransactionsList'
import UpdateDrugs from '../component/UpdateDrugs'
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
        path: 'qr-codes',
        element: <QrCodes />,
      },

    ],
  },
])
