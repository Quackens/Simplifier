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


let text = ''

app.get('/texts', (request, response) => {
  response.send(text)
})

app.post('/simplify', async (request, response) => {
  console.log('Request to simplify text')
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
  const reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})

app.post('/bullet', async (request, response) => {
  console.log('Request to bullet point')
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: "You will turn this text into concise bullet points whilst retaining as much information as possible"},
      { role: "user", content: text},
    ]
  })
  console.log(chat_completion.data)
  const reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})

app.post('/summarize', async (request, response) => {
  console.log('Request to summarize')
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      { role: "system", content: "You will summarize this text into concise sentences whilst retaining as much information as possible"},
      { role: "user", content: text},
    ]
})
  console.log(chat_completion.data)
  const reply = chat_completion.data.choices[0].message.content
  response.send(reply)
})


app.post('/texts', (request, response) => {
  const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    // const text = {
    //   content: body.content,
    //   id: generateId()
    // }
  // texts = texts.concat(text)
  text = body.content
  console.log(text)
})

app.get('/initial', async (request, response) => {
    console.log('initial request')
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

const generateId = () => {
  const maxId = texts.length > 0 ? Math.max(...texts.map(n => n.id)) : 0
  return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1> <a href="/api/notes">click</a>')
  })
*/