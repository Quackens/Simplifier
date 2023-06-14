const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const OPENAI_KEY = "WITHHELD"
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey: OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)


let texts = []
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

app.post('/connections', async (request, response) => {
  const connections = request.body.connections

  const messages = connections.map(c => texts.find(t => t.id === c))
  const messagesFormatted = messages.map(m => '"' + m.content + '", ')
  const last = messagesFormatted.length - 1
  let m = messagesFormatted[last]
  m = m.substring(0, m.length - 2) + "."
  messagesFormatted[last] = m
  const send = messagesFormatted.join('')

  console.log('Request to connect')
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

    
    // console.log(data.choices[0])
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



/** 
const data = {"id":"chatcmpl-7RACve96jTsMYxAHcZN3F1swFu0kO","object":
"chat.completion","created":1686708449,"model":"gpt-3.5-turbo-0301",
"usage":{"prompt_tokens":10,"completion_tokens":24,"total_tokens":34},
"choices":[{"message":{"role":"assistant","content":"Hello there! As an 
AI language model, I'm happy to communicate with you. How can I assist 
you today?"},"finish_reason":"stop","index":0}]}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1> <a href="/api/notes">click</a>')
  })
*/