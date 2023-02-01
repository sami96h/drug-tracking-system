import {
  createBrowserRouter, Navigate,
} from 'react-router-dom'
// import Introduction from '../component/introduction'
import QrCodes, { loader as qrLoader } from '../component/QrCodes'
import QrScanner from '../component/QrScanner'
import TransactionsList, { loader as transactionsLoader } from '../component/TransactionsList'
import BatchesList, { loader as AssetsLoader } from '../component/BatchesList'
import BatchesDetails, { loader as assetLoader } from '../component/BatchDetails'
import UpdateDrugs from '../component/UpdateBatch'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import BoxDetails, { loader as boxLoader } from '../component/BoxDetails'
import BatchHistory from '../component/BatchHistory/BatchHistory'
import AddBatch from '../component/AddBatch'
import AddDrug from '../component/AddDrug'
import { Introduction } from '../component/Home'
import { ProtectedRoutes } from '../ProtectedRoutes'
import Home from '../pages/Home'

export const router = createBrowserRouter([

  {
    path: '/',
    element: <Home />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      {

        element: <ProtectedRoutes />,
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
            path: '/register',
            element: <Register />,
          },
          {
            path: 'qr-codes/:id',
            element: <QrCodes />,
            loader: qrLoader,
          },

        ],
      },
      {
        children: [
          {
            path: '/home',
            element: <Introduction />,
          },

          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/qr-scanner',
            element: <QrScanner />,
          },
          {
            path: 'boxes/:id',
            element: <BoxDetails />,
            loader: boxLoader,
          },

        ],
      },
    ],
  },

])
