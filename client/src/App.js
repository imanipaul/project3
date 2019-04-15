import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoggedIn from './components/LoggedIn'
import Profile from './components/Profile'
import Thread from './components/Thread'
import Category from './components/Category'
import CreateComment from './components/CreateComment'

import decode from 'jwt-decode'

const url = 'http://localhost:3001'

let userName = ''

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      categories: [],
      comments: [],
      isLoggedIn: false
    }

  }

  getThreads() {
    fetch(`${url}/thread`)
      .then(response => {
        return response.json();
      }).then(data => {
        console.log(data)
        this.setState({
          threads: data
        })
      })
  }

  // delete thread function

  async handleDeleteThreads(event) {
    event.preventDefault();
    await fetch(`${url}/thread/${event.target.id}`, {
      method: 'DELETE'
    }).then(response => {
      return response.json();
    })
    this.getThreads();
  }

  async getCategories() {
    const response = await fetch(`${url}/category`)
    const data = await response.json()
    console.log(data)
    this.setState({
      categories: data.allCategories

    })
  }

  //delete Category function

  async handleDeleteCategories(event) {
    event.preventDefault();
    await fetch(`${url}/category/${event.target.id}`, {
      method: 'DELETE'
    }).then(response => {
      return response.json();
    })
    this.getCategories();
  }

  getComments() {
    fetch(`${url}/comment`).then(response => {
      return response.json()
    }).then(data => {
      console.log('comments', data)
      this.setState({
        comments: data
      })
    })
  }


  // Delete Comment function

  async handleDeleteComments(event) {
    event.preventDefault();
    await fetch(`${url}/comment/${event.target.id}}`, {
      method: 'DELETE'
    }).then(response => {
      return response.json();
    })
    this.getComments();
  }

  handleLogOut = () => {
    localStorage.removeItem('token')
    this.setState({ isLoggedIn: false })
    alert('Logged out!')
  }

  handleLogIn = async event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {
      nameOrEmail: formData.get("nameOrEmail"),
      password: formData.get("password")
    }
    const resp = await fetch(url + '/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const pResp = await resp.json()
    console.log(pResp)
    if (pResp.token) localStorage.setItem('token', pResp.token)
    this.setState({ isLoggedIn: true })
    await alert(pResp.message)
  }

  handleSignUp = async event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    }
    const resp = await fetch(url + '/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const pResp = await resp.json()
    await console.log(pResp)
    if (pResp.token) localStorage.setItem('token', pResp.token)
    this.setState({ isLoggedIn: true })
    alert(pResp.message)
  }




  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.setState({ isLoggedIn: true })
    }
    this.getThreads()
    this.getCategories()
    this.getComments()
  }


  render() {
    if (localStorage.getItem('token')) {
      userName = decode(localStorage.getItem('token'))
    }
    return (
      <div className="App">
        <Switch>
          <Route
            exact path='/'
            render={() => <LandingPage threads={this.state.threads} categories={this.state.categories} handleLogIn={this.handleLogIn} handleLogOut={this.handleLogOut} handleSignUp={this.handleSignUp} isLoggedIn={this.state.isLoggedIn} />}
          />

          <Route
            path='/Home'
            render={() => <LoggedIn threads={this.state.threads} categories={this.state.categories} />} />

          <Route
            path='/Category/:id'
            render={(props) => <Category {...props} threads={this.state.threads} categories={this.state.categories} />} />

          <Route path='/Profile' render={() => <Profile />} />

          <Route
            path='/Thread/:id'
            render={(props) => <Thread {...props} threads={this.state.threads} comments={this.state.comments} handleDeleteThreads={this.handleDeleteThreads} />} />

          {/* <Route path='/CreateComment' render={() => <CreateComment />} /> */}
        </Switch>
      </div>
    );
  }
}

export default App;
