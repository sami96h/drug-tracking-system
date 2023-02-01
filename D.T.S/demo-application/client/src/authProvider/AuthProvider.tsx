/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useReducer, useMemo } from 'react'
import { obj, action } from '../interfaces/authprovider'

const INIT_STATE = {
  auth: {
    loggedIn: false,
    user: null,
    checkedToken: false,
  },
}
const AuthContext = createContext<obj>(INIT_STATE)

const reducer = (state: any, action: action) :any => {
  switch (action.type) {
    case 'INITIALISE': {
      return {
        ...state,
        auth: {
          loggedIn: action.payload?.loggedIn,
          user: action.payload?.user,
          checkedToken: true,
        },
      }
    }

    case 'LOGIN': {
      return {
        ...state,
        auth: {
          loggedIn: true,
          user: action.payload?.user,
          checkedToken: true,
        },

      }
    }

    case 'LOGOUT': {
      return {
        ...state,
        auth: {
          loggedIn: false,
          user: null,
          checkedToken: true,
        },
      }
    }
    default: {
      return { ...state }
    }
  }
}

const AuthProvider = ({ children }: any): any => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE)

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default AuthProvider
