import React, { useContext } from "react"

import { Route, Redirect } from "react-router-dom"
import { useAuth } from "./Auth"

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useAuth()

  if (currentUser && currentUser.emailVerified) {
    return (
      <Route {...rest} render={routeProps => <RouteComponent {...routeProps} /> } />
    )
  } else if (currentUser && !currentUser.emailVerified) {
    return (
      <Redirect to={"/verify"} />
    )
  } else {
    return (
      <Redirect to={"/login"} />
    )
  }


}

export default PrivateRoute
