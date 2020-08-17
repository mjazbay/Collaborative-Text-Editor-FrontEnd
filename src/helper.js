const localUrl = 'http://localhost:9000';
export const herokuUrl = 'https://editorbackend.herokuapp.com';

export const apiSaveCall = async (state) => {
    return new Promise (async resolve => {
        const {createdBy, content, editedBy, editing, docId, name} = state;
        const newEditedBy = editedBy.includes(editing) ? editedBy : [...editedBy, editing];
        const docData = {
            name,
            docId,
            createdBy: createdBy || editing,
            editedBy: newEditedBy,
            content,
        };
        const resp = await fetch(`${herokuUrl}/api/docs/save/${docId}`, {
            method: 'POST',
            mode: 'cors', 
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(docData),
        });
        resp.json().then(respJson => {
        if (respJson.success){
            console.log('successfully saved ', respJson.doc);
            resolve(callApi(docId));
        } else {
            console.log('error saving ', respJson.error);
        }
        }).catch(err => {
        console.log('debug err saving ', err);
        })
    })
}

export const callApi = async (docId) => {
    if (!docId) return null;
    return new Promise(async resolve => {
        const resp = await fetch(`${herokuUrl}/api/docs/get/${docId}`,);
        resp.json().then(respJson => {
        console.log('debug respJson ', respJson);
        if (respJson.success) {
            const {name, content, createdBy, editedBy} = respJson.doc;
            resolve({
                state: {
                    content,
                    name,
                    createdBy,
                    docId: respJson.doc.docId,
                    editedBy,
                },
                ok: true,
            }) 
        } else {
            console.log('debug error fetching the document ',respJson.error)
        }
        }).catch(err => console.log(err));
    })
  }

  export const callToDeleteDocument = async (docId) => {
      return new Promise (async resolve => {
        fetch(`${herokuUrl}/api/docs/conversations/${docId}`,{
            method: 'DELETE',
            }).then(resp => {
            if (resp.status === 204) {
                resolve(getConversationsData());
            } else console.log('error deleting ', resp.status);
            }).catch(err => console.log('couldnt delete ', err));
      })
  }

  export const getConversationsData = async () => {
      return new Promise(async resolve => {
        fetch(`${herokuUrl}/api/docs/conversations/`).then(resp => resp.json()).then(respJson =>  {
            if (respJson.ok) {
                    console.log('successfully fetching conversations data ', respJson.conversations) ;
                    resolve({
                        state: {
                            conversations: respJson.conversations,
                        },
                        ok: true,
                    })
                }
            else console.log('error fetching conversations ', respJson.msg);
            }).catch(err => console.log('error fetching ', err));
      })
  }