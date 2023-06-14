import { useState, useEffect } from 'react'
import axios from 'axios'


// AXIOS STUFF

const baseUrl = 'http://localhost:3001'

const create = newObject => {
  const request = axios.post(baseUrl + '/texts', newObject)
  return request.then(response => response.data)
}

const get = () => {
  const request = axios.get(baseUrl + '/texts')
  return request.then(response => response.data)
}

const sendRequest = (reqType) => {
  const request = axios.post(baseUrl + reqType)
  return request.then(response => response.data)
}

const Text = ({content}) => {
  if (content === '') {
    return (
      <div>
        <h3> Text </h3>
        <p>Input your text</p>
    </div>
    )
  }
  else {
    return (
    <div> 
      <h3> Text </h3>
      <p> {content} </p> 
    </div>
    )
  }
}

const Result = ({content}) => {
  if (content === '') {
    return (
      <div>
        <h3> Result </h3>
        <p>Input your text and select an option</p>
      </div>
      
    )
  } else {
    const bullets = content.split("\n")
    console.log(bullets)
    const list = (bullets.length === 1) ? 
                  <p> {content} </p> : 
                  <ul> {bullets.map(bullet => <li> {bullet} </li>)} </ul>
    return (
    <div>
      <h3> Result </h3>
      {list}
    </div>)
  }
}

const App = () => {
  const [texts, setTexts] = useState('')
  const [newText, setNewText] = useState('')
  const [result, setResult] = useState('')

  useEffect(() => {
    get().then(initialText => {
      setTexts(initialText)
    })
  })

  const addText = (event) => {
    event.preventDefault()
    const textObject = {
      content: newText
    }
    create(textObject).then(returnedText => setTexts(returnedText))
    setNewText('')
    console.log(texts)
  }

  const handleTextChange = (event) => {
    setNewText(event.target.value)
  }

  const Simplify = (event) => {
    event.preventDefault()
    sendRequest('/simplify').then(data => {
      console.log(data)
      setResult(data)})
  }

  const Bullet = (event) => {
    event.preventDefault()
    sendRequest('/bullet').then(data => {
      console.log(data)
      setResult(data)
    })
  }

  const Summarize = (event) => {
    event.preventDefault()
    sendRequest('/summarize').then(data => {
      console.log(data)
      setResult(data)
    })
  }

  return (
    <div>
      <form onSubmit={addText}> 
        <input placeholder="Paste input text here" value={newText} onChange={handleTextChange} />
        <button type="submit"> Add Text</button>
      </form>
      <Text content={texts}/>
      <div>
          <button onClick={Simplify}>
            Simplify
          </button>
          <button onClick={Bullet}>
            Bullet Points
          </button>
          <button onClick={Summarize}>
            Summarize
          </button>
      </div>
      <Result content={result}/>
    </div>
  )
}

export default App