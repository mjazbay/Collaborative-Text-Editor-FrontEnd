import React, { Component } from 'react';
import CreateNewForm from './CreateNewForm';
import { apiSaveCall, callApi } from './helper';

export default class TextEditor extends Component {
    state = {
        name: '',
        content: "Waiting for API Response",
        createdBy: '',
        editedBy: [],
        docId: 0,
        editing: '',
        isNewForm: true,
        lastSaved: null,
      }    
      async componentDidMount() {
        this.props.socket.on('update', ({data, docId}) => {
          if (docId === this.state.docId) {
            // console.log('on update --> ',data, docId);
            this.setState({
              content: data,
            });
          }
        })
        this.setState({
            docId: this.props.match.params.docId,
            isNewForm: !this.props.match.params.docId
        })
        this.handleApiCall(this.props.match.params.docId);
      }

      handleApiCall = async (docId) => {
          if (!docId) return;
            const respObj = await callApi(docId);
            if (respObj.ok) this.setState(respObj.state);  
      }

      onEditingName = (event) => {
        const data = event.target.value;
        this.setState({editing: data});
      }
    
      onChangeDocumentId = (event) => {
        const data = event.target.value;
        this.setState({docId: data*1});
      }
      onSearch = async (e) => {
        e.preventDefault();
        this.handleApiCall(this.state.docId)
      }
    
    
      onTextChange = (event) => {
        const data = event.target.value;
        this.setState({content: data});
        this.props.socket.emit('update', {data, docId: this.state.docId});
      }
      onSave = async (e) => {
        e.preventDefault();
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        this.setState({lastSaved: dateTime});
        const respObj = await apiSaveCall(this.state);
        if (respObj.ok) this.setState(respObj.state);  
      }

      onCreateNewDoc = (e) => {
        e.preventDefault();
          this.setState(prevState => ({
              isNewForm: true,
              name: '',
              content: "",
              createdBy: '',
              editedBy: [],
              docId: 0,
              editing: '',
          }))
      }

      onNewDocInputChange = (state) => {
        this.setState(state);
      }
      
      render() {
        const {name, docId, createdBy, editedBy, lastSaved} = this.state;
        const editedByStr = editedBy.length ? editedBy.reduce((n1,n2) => `${n1}, ${n2}`) : '';
        const InputForms = this.state.isNewForm ? 
            <CreateNewForm editorState={this.state} onChangeUpdateState={this.onNewDocInputChange}/> 
            : 
            <SearchUpdatePage name={name} docId={docId} editedBy={editedByStr} 
                createdBy={createdBy} editing={this.state.editing} onEditingName={this.onEditingName}/>;

        return (
            <div className="App">
                <h1>Collaborative Editor</h1>
                {InputForms}
                <form>
                <input onChange={this.onChangeDocumentId} value={this.state.docId || ''}/>
                <input type="submit" value="Search by docId" onClick={this.onSearch}/>
                or
                <input type="submit" value="Create New Doc" onClick={this.onCreateNewDoc}/>
                </form>
                
                <textarea style={{width: '70vw', height: '50vh'}} onChange={this.onTextChange} value={this.state.content || ''}/>
                <input type="submit" value="Save" onClick={this.onSave}/>
                {lastSaved && <div>Last saved @ {lastSaved}</div>}
            </div>
        )
    }
}

const SearchUpdatePage = ({name, docId, editedBy, createdBy, editing, onEditingName}) => {
    return (
        <h2>
            <div>Document Name: {name}</div>
            <div>Document ID: {docId}</div>
            <div>Edited By: {editedBy}</div>
            <div>Created By: {createdBy}</div>
            <div>
                Editing: 
                <input value={editing || ''} onChange={onEditingName}/>
            </div>
        </h2>
    )
}

