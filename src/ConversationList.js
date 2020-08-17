import React, { Component } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import favoriteIcon from './assets/favorite.png';
import unFavoriteIcon from './assets/unFavorite.png';
import { callToDeleteDocument, getConversationsData } from './helper';

export default class ConversationList extends Component {
    state = {
        conversations: [],
        favorites: [],
        idToDelete: null,
    }

    async componentDidMount() {
        this.handleGetConversationsData();
    }   

    handleGetConversationsData = async () => {
        const respObj = await getConversationsData();
        if (respObj.ok) this.setState(respObj.state);
    }
    handleOnDelete = async (docId) => {
        const respObj = await callToDeleteDocument(docId);
        if (respObj.ok) this.setState(respObj.state);
    }

    onGetList = (e) => {
        e.preventDefault();
        this.handleGetConversationsData();
    }

    onDelete = (e) => {
        e.preventDefault();
        if (!this.state.idToDelete) return null;
        this.handleOnDelete(this.state.idToDelete);
    }
    
    docIdInputOnChange = (e) => {
        this.setState({
            idToDelete: e.target.value,
        })
    }

    onFavoriteClick = (favoriteId) => {
        if (!this.state.favorites.includes(favoriteId)) {
            this.setState(prevState =>  ({
                favorites: [...prevState.favorites, favoriteId],
            }))
        } else {
            this.setState(prevState =>  ({
                favorites: prevState.favorites.filter(favorite => favorite !== favoriteId),
            }))
        }
    }
    
    render() {
        const {conversations, favorites} = this.state;
        return (
            <>
                <h1>Docs Saved</h1>
                <ul>
                    <li>
                        <Link to="/editor/create-new-doc">
                        Text Editor       
                        </Link>
                    </li>
                </ul>
                <button onClick={this.onGetList}>Get List</button>
                <ConversationListComponent conversations={conversations} favorites={favorites} onClick={this.onFavoriteClick}/>
                <form>
                    <input onChange={this.docIdInputOnChange}/>
                    <input type="submit" value="Delete by DocId" onClick={this.onDelete}/>
                </form>
            </>
            
        )
    }
}

const ConversationListComponent = ({conversations, favorites, onClick}) => {
    return conversations.map((conversation, id) => {
        const isFavorite = favorites.includes(conversation.docId);
        const Container = isFavorite ? FavoriteComponent : MainContainer;
        return (
                    <Container key={`key_${id}`}>
                        <MyLink to={`/editor/${conversation.docId}`}>
                            <BoldText>{'Name: '}</BoldText>
                            "{conversation.name}"
                            <BoldText>{'ID:'}</BoldText>
                            {conversation.docId}
                        </MyLink>
                        <FavoriteIcon isFavorite={isFavorite} onClick={() => onClick(conversation.docId)}/>
                    </Container>
                
        )
    })
}

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px;
`;

const MyLink = styled(Link)`
    display: flex;
    flex-direction: row;
`;

const FavoriteComponent = styled(MainContainer)`
    border-style: solid;
    background-color: green;
`;

const BoldText = styled.div`
    font-weight: bold;
`;
const FavoriteIcon = styled.img.attrs(props => ({
    src: props.isFavorite ? favoriteIcon : unFavoriteIcon,
}))`
    width: 15px;
    height: 15px;
    margin-left: 20px;
`;