import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Block(props) {
  return (
    <div className="Block">
      <h3>Server: {props.name}</h3>
      <button
        onClick={() => props.onClick()}
        className={props.value === "UP"
            ? "up"
            : (props.value === "DOWN"
              ? "down"
              : "other")}
      >{props.value === null ? "Checking" : props.value}</button>
      {props.previous === null ? (
          <p>No previous response</p>
        ) : (
          <p>Last response was {props.previous}</p>
        )}
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        // to store the state of each block
        blocks: Array(5).fill(null),
      }],
      prev: Array(5).fill(null),
      urls: [
        "https://test.cognition-app.com/api/status",
        "https://ord.dev.stackworx.io/graphql",
        "https://api.durf.dev.stackworx.io/graphql",
        "https://prima.run/health",
        "https://stackworx.io/"
      ],
    };
    setInterval(function(){
      // alert("Check");
      this.requestCall("http://httpstat.us/418", 0);
    }.bind(this), 3000/*00*/);
  }

// Helper function for rendering blocks
  renderBlock(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const prev = this.state.prev;
    const urls = this.state.urls;

    return <Block value={current.blocks[i]} previous={prev[i]} name={urls[i]} onClick={() => this.handleClick()} />
  }

  handleClick() {
    const history = this.state.history;
    const prev = history[history.length - 2].blocks.slice();
    this.setState({
      prev: prev,
    });
  }

// Helper function for requests
  requestCall(url, i) {
    const request = require('request');
    const history = this.state.history;
    const current = history[history.length - 1];
    const blocks = current.blocks.slice();

    request({
      uri: url,
      method: 'GET'
    }, function(error, response, body) {
      if(error) {
        blocks[i] = "OTHER";
      } else if (response.statusCode === 200) {
        blocks[i] = "UP";
      } else {
        blocks[i] = "DOWN";
      }
      this.setState({
        history: history.concat([{
          blocks: blocks,
        }]),
      });
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="Block-container">
          {this.renderBlock(0)}
        </div>
      </div>
    );
  }
}

export default App;
