/* eslint-disable max-len */
import PublicLayout from '../../layouts/PublicLayout'
import PrivateLayout from '../../layouts/PrivateLayout'
import useAuth from '../../hooks/useAuth'

const Home:any = () => {
  const { auth } = useAuth()
  return (

    auth?.loggedIn ? <PrivateLayout /> : <PublicLayout />
  )
}

export default Home
