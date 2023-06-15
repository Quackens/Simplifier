import { useState, useEffect } from 'react'
import axios from 'axios'

// AXIOS STUFF

const baseUrl = 'http://localhost:3001'

const create = newObject => {
  const request = axios.post(baseUrl + '/addText', newObject)
  return request.then(response => response.data)
}

const get = (type) => {
  const request = axios.get(baseUrl + '/' + type)
  return request.then(response => response.data)
}

const sendRequest = (reqType) => {
  const request = axios.post(baseUrl + reqType)
  return request.then(response => response.data)
}

const deleteText = (id) => {
  return axios.delete(baseUrl + '/texts/delete/' + id)
}


const deleteButton = (id, conns, set) => {
  deleteText(id).then(response => console.log(response))
  set(conns.filter(c => c !== id))
  console.log(id)
}

const Text = ({content, setResult, conns, setConnections}) => {
  if (content === '') {
    return (
      <div>
        <p>Input your text</p>
    </div>
    )
  }
  else {
    const list = content.map(chunk => 
      <div key={chunk.id}>
        <p>({chunk.id}) {chunk.content}</p>
        <button onClick={(e) => Simplify(e, setResult, chunk.id)}>
          Simplify
        </button>
        <button onClick={(e) => {Bullet(e, setResult, chunk.id)}}>
          Bullet Points
        </button>
        <button onClick={(e) => {Summarize(e, setResult, chunk.id)}}>
          Summarize
        </button>
        <button onClick={(e) => addConnect(e, conns, setConnections, chunk.id)}> Add to Linked Texts</button>
        <button onClick={() => deleteButton(chunk.id, conns, setConnections)}> Delete </button>
      </div>
      )
    return (
    <div> 
      {list}
    </div>
    )
  }
}

const Simplify = (event, set, id) => {
  event.preventDefault()
  sendRequest('/simplify/' + id).then(data => {
    console.log(data)
    set(data)})
}

const Bullet = (event, set, id) => {
  event.preventDefault()
  sendRequest('/bullet/' + id).then(data => {
    console.log(data)
    set(data)
  })
}

const Summarize = (event, set, id) => {
  event.preventDefault()
  sendRequest('/summarize/' + id).then(data => {
    console.log(data)
    set(data)
  })
}

const addConnect = (event, conn, set, id) => {
  if (!conn.includes(id)) {
    set(conn.concat(id))
  }
}

const deleteConnect = (event, id, conn, set) => {
  set(conn.filter(c => c !== id))
}
const Result = ({content}) => {
  if (content === '') {
    return (
      <div>
        <h2> Result </h2>
        <p>Input your text and select an option to generate a response!</p>
      </div>
      
    )
  } else {
    const bullets = content.split("\n")
    const list = (bullets.length === 1) ? 
                  <p> {content} </p> : 
                  <ul> {bullets.map((bullet, i) => <li key={i}> {bullet} </li>)}
                  </ul>
    return (
    <div>
      <h2> Result </h2>
      {list}
    </div>)
  }
}

const generateConnections = (conn, set) => {
  console.log('Generating Similarity Report: ', conn)
  const newObject = {connections: conn}
  const request = axios.post(baseUrl + '/connections', newObject)

  return request.then(response => {console.log(response.data); set([])})
}

const addAll = (texts, conn, set) => {
  let copy = conn
  console.log(texts)
  console.log(conn)
  
  for (let i=0; i<texts.length; i++) {
    let t = texts[i]
    console.log(t)
    if (conn.includes(Number(t.id))) {
      console.log("skipping")
      continue
    } else {
      copy = copy.concat(Number(t.id))
      
    }
  }
  set(copy)
}

const Connections = ({texts, connections, setConnections}) => {
  return (
    <div>
      <h3> Linking Texts: </h3>
      <ul>
        {connections.map((c, i) => 
        <li key={i}>
          {c}
          <button onClick={(e) => deleteConnect(e, c, connections, setConnections)}> Remove </button>
        </li>)}
      </ul>
      <button onClick={() => generateConnections(connections, setConnections)}> 
        Generate Similarity Report 
      </button>
      <button onClick={() => addAll(texts, connections, setConnections)}>Add All</button>
    </div>
  
  )
}



const doSearch = (event, text, setText, conn, setConn) => {
  event.preventDefault()
  setText('')

  const newObject = {search: text, connections: conn}
  const request = axios.post(baseUrl + '/search', newObject)
  return request.then(response => {console.log(response.data); setConn([])})
}

const SearchQuery = ({text, setText, conn, setConn}) => {
  return (
    <div>
      <h3>Search queries on linked texts </h3>
      <form onSubmit={(e) => doSearch(e, text, setText, conn, setConn)}>
        <input placeholder="Enter search query" value={text} onChange={(e) => handleTextChange(e, setText)} />
        <button type="submit"> Search </button>
      </form>
    </div>
  )
}

const handleTextChange = (event, set) => {
  set(event.target.value)
}

const App = () => {
  const [texts, setTexts] = useState([])
  const [newText, setNewText] = useState('')
  const [result, setResult] = useState('')
  const [connections, setConnections] = useState([])
  const [queryText, setQueryText] = useState('')

  useEffect(() => {get('texts').then(text => {setTexts(text)})})
  useEffect(() => {get('result').then(result => {setResult(result)})})
  const addText = (event) => {
    event.preventDefault()
    const textObject = {
      content: newText
    }
    create(textObject).then(returnedText => setTexts(texts.concat(returnedText)))
    setNewText('')
    console.log(texts)
  }

  

  

  return (
    <div>
      <h2> Texts </h2>
      <form onSubmit={addText}> 
        <input placeholder="Paste input text here" value={newText} onChange={(e) => handleTextChange(e, setNewText)} />
        <button type="submit"> Add Text</button>
      </form>
      <Text content={texts} setResult={setResult} conns={connections} setConnections={setConnections}/>
      <Connections texts={texts} connections={connections} setConnections={setConnections} />
      <SearchQuery text={queryText} setText={setQueryText} conn={connections} setConn={setConnections}/> 
      <Result content={result}/>
      
    </div>
  )
}

export default App