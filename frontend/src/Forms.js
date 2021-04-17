import React, { useState } from "react"

import { useAuth } from "./Auth"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const userContext = useAuth()

  const submitForm = (event) => {
    event.preventDefault()

    userContext.login(username, password)
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>
          Email: <input type="text" onChange={(event) => setUsername(event.target.value)} />
        </p>
        <p>
          Password: <input type="password" onChange={(event) => setPassword(event.target.value)} />
        </p>
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
    </div>
  )
}

const RegisterForm = () => {
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const userContext = useAuth()

  const submitForm = (event) => {
    event.preventDefault()

    return userContext.register(email, password1, password2)
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>
          Email: <input type="email" onChange={(event) => setEmail(event.target.value)} />
        </p>
        <p>
          Password: <input type="password" onChange={(event) => setPassword1(event.target.value)} />
        </p>
        <p>
          Confirm Password:
          <input type="password" onChange={(event) => setPassword2(event.target.value)} />
        </p>
        <p>
          <button type="submit">Register</button>
        </p>
      </form>
    </div>
  )
}

const PasswordReset = () => {
  const [email, setEmail] = useState("")
  const userContext = useAuth()

  const submitForm = (event) => {
    event.preventDefault()

    userContext.passwordReset(email)
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>
          Email: <input type="email" onChange={(event) => setEmail(event.target.value)} />
        </p>
        <p>
          <button type="submit">Reset</button>
        </p>
      </form>
    </div>
  )
}

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const userContext = useAuth()

  const submitForm = (event) => {
    event.preventDefault()

    userContext.passwordChange(oldPassword, password1, password2)
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>
          Old Password:
          <input type="password" onChange={(event) => setOldPassword(event.target.value)} />
        </p>
        <p>
          New Password:
          <input type="password" onChange={(event) => setPassword1(event.target.value)} />
        </p>
        <p>
          Confirm New Password:
          <input type="password" onChange={(event) => setPassword2(event.target.value)} />
        </p>
        <p>
          <button type="submit">Change Password</button>
        </p>
      </form>
    </div>
  )
}

export { LoginForm, RegisterForm, PasswordReset, PasswordChange }
