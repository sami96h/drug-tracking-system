import {
  createBrowserRouter,
} from 'react-router-dom'
import Introduction from '../component/introduction'
import QrCodes, { loader as qrLoader } from '../component/QrCodes'
import QrScanner from '../component/QrScanner'
import TransactionsList, { loader as transactionsLoader } from '../component/TransactionsList'
import BatchesList, { loader as AssetsLoader } from '../component/BatchesList'
import BatchesDetails, { loader as assetLoader } from '../component/BatcheDetails'
import UpdateDrugs from '../component/UpdateBatch'
import Home from '../pages/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import { ProtectedRoutes } from '../ProtectedRoutes'
import BoxDetails, { loader as boxLoader } from '../component/BoxDetails'
import BatchHistory from '../component/BatchHistory/BatchHistory'
import AddBatch from '../component/AddBatch'
import AddDrug from '../component/AddDrug'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Introduction />,
  },

  {
    path: '/',
    element: <ProtectedRoutes><Home /></ProtectedRoutes>,
    children: [
      {
        path: '/drugs/new',
        element: <AddDrug />,
      },

      {
        path: '/batches/new',
        element: <AddBatch />,

      },
      {
        path: 'batches/:id/update',
        element: <UpdateDrugs />,
      },
      {
        path: 'batches/:id/history',
        element: <BatchHistory />,
      },
      {
        path: 'boxes/:id',
        element: <BoxDetails />,
        loader: boxLoader,
      },
      {
        path: '/qr-scanner',
        element: <QrScanner />,
      },
      {
        path: '/transactions',
        element: <TransactionsList />,
        loader: transactionsLoader,
      },
      {
        path: '/batches',
        element: <BatchesList />,
        loader: AssetsLoader,
      },
      {
        path: '/batches/:id',
        element: <BatchesDetails />,
        loader: assetLoader,
      },
      {
        path: 'qr-codes/:id',
        element: <QrCodes />,
        loader: qrLoader,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
])
