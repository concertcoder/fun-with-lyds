import React, { useState, useEffect } from 'react'
import { firestoreCollections } from './utils/firebase'
import randomColor from 'randomcolor'

function App () {
  const [threadName, setThreadName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [name, setName] = useState('')
  const [hasName, setHasName] = useState(false)

  useEffect(() => {
    async function fetchData () {
      firestoreCollections.messagesRef
        .where('threadName', '==', threadName)
        .orderBy('createdAt', 'asc')
        .onSnapshot(async userTasksQuery => {
          setIsReady(true)
          setIsLoading(false)
          setMessages(userTasksQuery.docs.map(doc => doc.data()))
        })
    }

    if (isLoading) {
      fetchData()
    }
  }, [isLoading, threadName])

  const submitMessage = () => {
    firestoreCollections.messagesRef.add({
      threadName,
      text: currentMessage,
      createdAt: Date.now(),
      chatName: name
    })
    setCurrentMessage('')
  }

  const nameToColor = {}

  messages.forEach(((message) => {
    nameToColor[message.chatName] = randomColor()
  }))


  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      {!hasName && (
        <div>
          <div>Please enter your chat name</div>
          <div>
            <input
              autoFocus
              type='text'
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  setHasName(true)
                }
              }}
              onChange={e => setName(e.target.value)}
            />
            <button
              disabled={!name}
              onClick={() => {
                setHasName(true)
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
      {hasName && !isReady && !isLoading && (
        <div>
          <div>Please enter in your secret room name</div>
          <div>
            <input
              autoFocus
              type='text'
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  setIsLoading(true)
                }
              }}
              onChange={e => setThreadName(e.target.value)}
            />
            <button
              disabled={!threadName}
              onClick={() => {
                setIsLoading(true)
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
      {isLoading && <div>Is Loading...</div>}

      {isReady && (
        <div>
          <div style={{ marginBottom: '10px' }}>Messages:</div>
          {messages.map(message => (
            <div
              style={{ borderBottom: '1px solid #CCC', color: nameToColor[message.chatName] }}
              key={message.createdAt}
            >
              {message.chatName}: {message.text}
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <input
              autoFocus
              type='text'
              value={currentMessage}
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  submitMessage()
                }
              }}
              onChange={e => {
                setCurrentMessage(e.target.value)
              }}
              placeholder='Enter message...'
            />{' '}
            <button onClick={submitMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
