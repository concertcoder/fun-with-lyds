import React, { useState, useEffect } from 'react'
import { firestoreCollections } from './utils/firebase'

function App () {
  const [threadName, setThreadName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    async function fetchData () {
      firestoreCollections.messagesRef
        .where('threadName', '==', threadName)
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

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      {!isReady && !isLoading && (
        <div>
          <div>Please enter in your secret room name</div>
          <div>
            <input type='text' onChange={e => setThreadName(e.target.value)} />
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
          {messages.map((message, idx) => (
            <div style={{ borderBottom: '1px solid #CCC' }} key={idx}>{message.text}</div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <input
              type='text'
              onChange={e => {
                setCurrentMessage(e.target.value)
              }}
              placeholder='Enter message...'
            />{' '}
            <button
              onClick={() => {
                firestoreCollections.messagesRef.add({
                  threadName,
                  text: currentMessage,
                  createdAt: Date.now()
                })
                setCurrentMessage('')
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
