import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import io from 'socket.io-client';
import './App.css';
import ConversationList from './ConversationList';
import TextEditor from './TextEditor';
import {herokuUrl} from './helper';
const socket = io(herokuUrl);

const App = () => {
    return (
      <Router>
        <Switch>
          <Route path="/editor/create-new-doc" component={props => <TextEditor {...props} socket={socket}/>}/>
          <Route path="/editor/:docId" component={props => <TextEditor {...props} socket={socket}/>}/>
          <Route path="/" exact component={props => <ConversationList {...props}/>}/>
        </Switch>
      </Router>
    )
  }

export default App;