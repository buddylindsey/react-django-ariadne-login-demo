import jwt from "jsonwebtoken"
import React, { useState, createContext, useContext, useEffect } from "react"

import { ApolloLink, useQuery, gql } from "@apollo/client"

const REFRESH_TOKEN = "refresh_token"
const ACCESS_TOKEN = "access_token"

async function fetchAuthAPI(url, body) {
  let authorization = await getBearerToken()

  const options = {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify(body),
  }

  const result = await fetch(`http://localhost:9000${url}`, options).then((response) =>
    response.json()
  )
  return result
}

async function getBearerToken() {
  const accessToken = await getAccessToken()
  let authorization = ""

  if (accessToken) {
    authorization = `Bearer ${accessToken}`
  }
  return authorization
}

async function getRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)
  let data = null
  try {
    data = await fetchAuthAPI("/auth/token/refresh/", {
      refresh: refreshToken,
    })
  } catch (e) {
    console.log(e)
  }
  if (data?.access) {
    localStorage.setItem(ACCESS_TOKEN, data.access)
    return data.access
  }
}

async function getAccessToken() {
  let accessToken = localStorage.getItem(ACCESS_TOKEN)
  let refreshToken = localStorage.getItem(REFRESH_TOKEN)

  // If we have an access token and it isn't set to undefined
  // Lets use it.
  if (accessToken && accessToken !== "undefined") {
    const decoded_data = jwt.decode(accessToken)

    // TODO: Rework date refresh stuff
    const currentTime = Math.floor(Date.now() / 1000)

    // If the accessToken has expired lets refresh it
    if (currentTime > decoded_data.exp) {
      console.log("Refreshing Token")
      accessToken = await getRefreshToken()
      return accessToken
    }

    // If the access token has not expired lets use it
    return accessToken
  } else if (refreshToken) {
    // if there is no accesstoken or it is undefined, but we have
    // a refresh token lets refresh and use that access token.
    accessToken = await getRefreshToken()
    return accessToken
  }

  // Should not actually hit here.
  return accessToken
}

const authMiddleware = new ApolloLink(async (operation, forward) => {
  let authorization = await getBearerToken()

  operation.setContext({
    headers: {
      authorization,
    },
  })

  return forward(operation)
})

const USER_QUERY = gql`
  query currentUser {
    getCurrentUser {
      id
      username
    }
  }
`

const UserContext = createContext(null)

const UserProvider = (props) => {
  const [user, setUser] = useState(null)

  const { data } = useQuery(USER_QUERY)

  useEffect(() => {
    if (data) {
      setUser(data.getCurrentUser)
    }
  }, [data])

  const login = (username, password) => {
    fetchAuthAPI("/auth/login/", { username, password }).then((data) => {
      localStorage.setItem(ACCESS_TOKEN, data.access_token)
      localStorage.setItem(REFRESH_TOKEN, data.refresh_token)
      setUser(data.user)
    })
  }

  const logout = () => {
    fetchAuthAPI("/auth/logout/", {
      token: localStorage.getItem(ACCESS_TOKEN),
    }).then((data) => {
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      setUser(null)
    })
  }

  const register = (email, password1, password2) => {
    fetchAuthAPI("/auth/registration/", { username: email, password1, password2 }).then((data) => {
      localStorage.setItem(ACCESS_TOKEN, data.access_token)
      localStorage.setItem(REFRESH_TOKEN, data.refresh_token)
      setUser(data.user)
    })
  }

  const passwordReset = (email) => {
    fetchAuthAPI("/auth/password/reset/", { email }).then((data) => {
      console.log(data)
    })
  }

  const passwordResetConfirm = (password1, password2, uid, token) => {
    fetchAuthAPI("/auth/password/reset/confirm/", { password1, password2, uid, token }).then(
      (data) => {
        console.log(data)
      }
    )
  }

  const passwordChange = (oldPassword, password1, password2) => {
    fetchAuthAPI("/auth/password/change/", {
      oldPassword,
      new_password1: password1,
      new_password2: password2,
    }).then((data) => {
      console.log(data)
    })
  }

  const userContextValue = {
    login,
    logout,
    user,
    register,
    passwordReset,
    passwordResetConfirm,
    passwordChange,
  }

  return <UserContext.Provider value={userContextValue}>{props.children}</UserContext.Provider>
}

const useAuth = () => useContext(UserContext)

export { authMiddleware, UserProvider, useAuth }
