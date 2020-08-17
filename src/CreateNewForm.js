import React, { Component } from 'react';
import styled from 'styled-components';

export default class CreateNewForm extends Component {
    onDocNameChange = (e) => {
        this.props.onChangeUpdateState({name: e.target.value})
    }
    onDocIdChange = (e) => {
        this.props.onChangeUpdateState({docId: e.target.value})
    }
    onCreatedByChange = (e) => {
        this.props.onChangeUpdateState({createdBy: e.target.value, editedBy: [e.target.value], editing: e.target.value})
    }

    render() {
        const {name, docId, createdBy} = this.props.editorState;
        return (
            <MainContainer>
                <FormInput inputName="Doc Name: " onChange={this.onDocNameChange} value={name}/>
                <FormInput inputName="Doc ID: " onChange={this.onDocIdChange} value={docId}/>
                <FormInput inputName="Created By: " onChange={this.onCreatedByChange} value={createdBy}/>
            </MainContainer>
        )
    }
}

const FormInput = ({inputName, onChange, value}) => {
    return (
        <div>
            {inputName} 
            <input onChange={onChange} value={value || ''}/>
        </div>
    )
}

const MainContainer = styled.h2`
display: flex;
flex-direction: column;
margin: 10px;
margin-left: 30px;
`;