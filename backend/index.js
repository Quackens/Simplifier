const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
const initial = require('./initial.js')

const OPENAI_KEY = "[REDACTED]"
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey: OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

let texts = initial.INITIAL_TEXT
let reply = ''

app.get('/texts', (request, response) => {
  response.send(texts)
})

app.get('/result', (request, response) => {
  response.send(reply)
})

app.delete('/texts/delete/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('Deleting note ' + id)
  texts = texts.filter(text => text.id !== id )
  console.log(texts)
  response.status(204).end()
})

app.post('/simplify/:id', async (request, response) => {
  const id = Number(request.params.id)
  console.log('Request to simplify text for ' + id)
  const text = texts.find(t => t.id === id).content

  const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      messages: [
        { role: "system", content: "You will dumb down inputs so less technical knowledge is required to understand, whilst retaining as much information as possible"},
        { role: "user", content: text},
      ]
      // messages: [
      //   { role: "user", content: "Hello World"},
      // ]
  })
  console.log(chat_completion.data)
  reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})

app.post('/bullet/:id', async (request, response) => {
  const id = Number(request.params.id)
  console.log('Request to bullet point' + id)

  const text = texts.find(t => t.id === id).content
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: "You will turn this text into concise bullet points whilst retaining as much information as possible"},
      { role: "user", content: text},
    ]
  })
  console.log(chat_completion.data)
  reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})

app.post('/summarize/:id', async (request, response) => {
  const id = Number(request.params.id)
  console.log('Request to summarize' + id)

  const text = texts.find(t => t.id === id).content
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: "You will summarize this text into concise sentences whilst retaining as much information as possible"},
      { role: "user", content: text},
    ]
})
  console.log(chat_completion.data)
  reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})

const idToString = (list) => {
  // try {
    const messages = list.map(c => texts.find(t => t.id === c))
    const messagesFormatted = messages.map(m => '"' + m.content + '", ')
    const last = messagesFormatted.length - 1
    let m = messagesFormatted[last]
    m = m.substring(0, m.length - 2) + "."
    messagesFormatted[last] = m
    const send = messagesFormatted.join('')

    return send  
}

app.post('/connections', async (request, response) => {
  const connections = request.body.connections
  if (connections.length === 0) {
    return response.send("Not enough connections")
  }
  console.log('Request for similarity')
  const send = idToString(connections)
  
  console.log(send)

  const prompt = "Find and Number what these articles agree on" 
  
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: prompt},
      { role: "user", content: send},
    ]
})
  console.log(chat_completion.data)
  reply = chat_completion.data.choices[0].message.content
  response.send(reply)
  
})

app.post('/search', async (request, response) => {
  const connections = request.body.connections
  const query = request.body.search

  console.log('Request for search query')  

  if (connections.length === 0) {
    return response.send("Not enough connections")
  }
  const articles = idToString(connections)
  console.log(articles)

  const init = "Use only the following articles to answer the question: " + articles

  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: init},
      { role: "user", content: query},
    ]
  })
  console.log(chat_completion.data)
  reply = chat_completion.data.choices[0].message.content
  response.send(reply)

})


const generateId = () => {
  const maxId = texts.length > 0 ? Math.max(...texts.map(n => n.id)) : 0
  return maxId + 1
}

app.post('/addText', (request, response) => {
  const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const text = {
      content: body.content,
      id: generateId()
    }
  texts = texts.concat(text)
  response.send(body.content)
  console.log(texts)
})



// TESTING PURPOSES
app.get('/test', async (request, response) => {
    console.log('test request')
    const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You will turn this text into concise bullet points whilst retaining as much information as possible"},
          { role: "user", content: text},
        ]
    })
    console.log(chat_completion.data)
    response.send(chat_completion.data)

  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})