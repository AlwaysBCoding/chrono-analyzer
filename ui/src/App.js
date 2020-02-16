import React from 'react';
import axios from 'axios';
import './App.css';

const API_ENDPOINT = "http://3.227.8.3/"
const API_CLIENT = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000
})

class App extends React.Component {

  state = {
    predictions: {
      pricePrediction: undefined,
      brandPredictions: []
    },
    imgSrc: ""
  }

  _onDragOver(e) {
    e.preventDefault()
  }

  _onDragLeave(e) {
    e.preventDefault()
  }

  _onDrop(e) {
    e.preventDefault()
    var targetFile = e.dataTransfer.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(targetFile)
    reader.onloadend = (e) => { this.setState({ imgSrc: reader.result })}
    var data = new FormData()
    data.append('image', targetFile)
    API_CLIENT.post('/classify', data, {headers: {"Content-Type": targetFile.type}})
      .then((response) => { this.setState({predictions: response.data}) })
      .catch((error) => { console.log(error) })
  }

  render() {
    var ImagePreview
    if(this.state.imgSrc) {
      ImagePreview = (<img src={this.state.imgSrc} alt="img-of-a-watch" />)
    }

    var Predictions = []
    this.state.predictions.brandPredictions.forEach((item, index) => {
      Predictions.push(
        <p key={`item-${index}`}>{item[0]}: {item[1]}</p>
      )
    })

    return (
      <div className="App">
        <div
          className='file-dropzone'
          onDragOver={(e) => { this._onDragOver(e) }}
          onDragLeave={(e) => { this._onDragLeave(e) }}
          onDrop={(e) => { this._onDrop(e) }}>
          {ImagePreview}
        </div>

        <div className='predictions'>
          {Predictions}
        </div>
      </div>
    )
  }
}

export default App;






























// SOME COMMENT
