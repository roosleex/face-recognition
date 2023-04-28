import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  onInputChange = (event) => {
    console.log('onInputChange', 'input=' + event.target.value);
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    console.log('onButtonSubmit', 'imageUrl=' + this.state.input);
    this.setState({imageUrl: this.state.input});
    const requestOptions = this.getRequestOptions(this.state.input);  
    
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          this.displayFaceBox(this.calculateFaceLocation(result));
        })
        .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, route, box, imageUrl} = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home'
          ? <div> 
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl = {imageUrl} />
           </div>
          : (
            route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
          ) 
        }
      </div>
    );
  }

  getRequestOptions = (imageUrl) => {
    const USER_ID = 'ruslan-7';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '7185e35ba7f141bc8b1d219212f188af';
    const APP_ID = 'test';
    // Change this to whatever image input you want to add
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    console.log('requestOptions', requestOptions);
    console.log('requestOptions imageUrl', IMAGE_URL);
    return requestOptions
  }

  calculateFaceLocation = (data) => {
    let result = {
      leftCol: '',
      topRow: '',
      rightCol: '',
      bottomRow: '',
    };
    const obj = JSON.parse(data);
    if (!obj.outputs[0].data.hasOwnProperty('regions')) {
      console.log('faceBox', 'is empty');
      return result;
    }

    let faceBox = obj.outputs[0].data.regions[0].region_info.bounding_box;
    console.log('faceBox', faceBox);
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
  
    result.leftCol = faceBox.left_col * width;
    result.topRow = faceBox.top_row * height;
    result.rightCol = width - (faceBox.right_col * width);
    result.bottomRow = height - (faceBox.bottom_row * height);
    return result;
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
}

export default App;
