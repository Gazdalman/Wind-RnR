import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const RedirectComponent = () => {
  const history = useHistory()

  useEffect(() => {
    history.replace("/not-found")
  }, [])

  return null
}

export default RedirectComponent;
