import { useAppSelector } from '@/hooks/reduxHooks'
import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const NonAuth: FC = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo)

  console.log('NonAuth - userInfo:', !!userInfo?.accessToken)

  // Redirect authenticated users to the home page
  return userInfo?.accessToken ? <Navigate to="/" replace /> : <Outlet />
}

export default NonAuth
