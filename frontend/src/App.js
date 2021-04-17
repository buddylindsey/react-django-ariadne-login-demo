import "./App.css"
import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import { authMiddleware, UserProvider, useAuth } from "./Auth"
import { LoginForm, PasswordChange, RegisterForm } from "./Forms"

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  concat,
  useQuery,
  gql,
} from "@apollo/client"

const httpLink = new HttpLink({ uri: "http://localhost:9000/graphql/" })

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
})

const DATA_QUERY = gql`
  query getSomeData {
    getSomeData {
      names
    }
  }
`

function SomeData() {
  const { loading, data } = useQuery(DATA_QUERY)

  if (loading) return "Loading..."
  console.log(data)
  return (
    <>
      {data.getSomeData.names.map((x) => (
        <div key={x}>{x}</div>
      ))}
    </>
  )
}

function User() {
  const userContext = useAuth()
  return <div>hello {userContext.user ? userContext?.user?.username : "failure"}</div>
}

function UserInfo() {
  const userContext = useAuth()
  return <div>{userContext.user.username}</div>
}

function Index() {
  const userContext = useAuth()
  return (
    <div className="App">
      <header className="App-header">
        <h2>Testing out Login/Logout/Registration 🚀</h2>
        {userContext.user ? "" : <LoginForm path="/" />}
        <User />
        {userContext.user ? <UserInfo /> : ""}
      </header>
    </div>
  )
}

function About() {
  return (
    <div className="App">
      <User />
    </div>
  )
}

function Profile() {
  const userContext = useAuth()

  return (
    <div className="App">
      <User />
      {userContext.user ? <SomeData /> : ""}
    </div>
  )
}

function Logout() {
  const userContext = useAuth()
  return <button onClick={userContext.logout}>Logout</button>
}

function Register() {
  return <RegisterForm />
}

function PasswordChangePage() {
  return <PasswordChange />
}

function Header() {
  const userContext = useAuth()

  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {userContext.user ? (
          <>
            <li>
              <Link to="/changepassword">Change Password</Link>
            </li>
            <li>
              <Logout></Logout>
            </li>
          </>
        ) : (
          <li>
            <Link to="/register">Register</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Header />
        <Switch>
          <Route exact path="/">
            <Index />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/changepassword">
            <PasswordChangePage />
          </Route>
        </Switch>
      </UserProvider>
    </ApolloProvider>
  )
}

export default App
