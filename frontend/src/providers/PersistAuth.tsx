import { errorToast } from '@/components/ui/toast'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useRefreshMutation } from '@/redux/apis/authApiSlice'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const PersistAuth = () => {
  const [refresh, { isLoading }] = useRefreshMutation()
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const userInfo = useAppSelector((state) => state.auth.userInfo)

  const persist = localStorage.getItem('persist_signin') === 'true'

  useEffect(() => {
    const verifyAuth = async () => {
      if (!userInfo?.accessToken && persist) {
        try {
          const res = await refresh({}).unwrap()
          if (!res.success) {
            errorToast(res.message)
          }
        } catch (err) {
          console.error('Error during token refresh:', err)
        }
      }
      setIsAuthInitialized(true)
    }

    verifyAuth()
  }, [])

  // loading or a blank screen until refresh is done
  if (!isAuthInitialized || isLoading) {
    return <></>
  }

  // Once authentication is initialized, render child routes
  return <Outlet />
}

export default PersistAuth
