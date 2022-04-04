import './App.css';
import React from 'react';
import FaceRecognition from './components/facerecognition/FaceRecognition.js';
import Logo from './components/logo/Logo';
import Register from './components/register/Register';
import Rank from './components/rank/Rank';
import SignIn from './components/signin/SignIn';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Navigation from './components/navigation/Navigation';
import Particles from "react-tsparticles";

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''  
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined 
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://floating-brushlands-09428.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://floating-brushlands-09428.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(err => console.log(err))
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }
    
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
  render(){
    const { isSignedIn, imageUrl, route, box }= this.state;
    return (
    <div className="App">
      <Particles className='particle' options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 3,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
            color: {
            value: "#ffffff",
          },
            move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 4,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        }
      }}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      { route === 'home'
      ? <div>
          <Logo />
          <Rank 
            name={this.state.user.name} 
            entries={this.state.user.entries}
          />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
          route === 'signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : (
            route === 'register'
            ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
         )
      }
    </div>
  );}
}

export default App;
