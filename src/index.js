const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());



const users = [];

function checksExistsUserAccount(req, res, next) {
  const {username} = req.headers;

  const user = users.find((user)=> user.username === username)

  if(!user){
    return res.status(400).json({error: "User Account not found"})
  }

  req.user = user;

  return next();

}

app.post('/users', (req, res) => {
  const {name, username} = req.body;

  const userAlreadyExists = users.some((user)=> user.username === username)

  if(userAlreadyExists){
    return res.status(400).send({error: 'Username already exists'})
  }
  users.push({
    id: uuidv4(),
    name, 
    username, 
    todos: [],
  })

  res.send(users)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {

  const {user} = req;

  res.send(user.todos)
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {title, deadline} = req.body;

  
  const todo = { 
  id: uuidv4(),
  title: title,
  done: false, 
  deadline: new Date(deadline),
  created_at: new Date(),
  }

  user.todos.push(todo)

  res.send(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {title, deadline} = req.body;
  const {id} = req.params;

  const todoSelected = user.todos.find((todo)=> todo.id === id)


  if(!todoSelected){
    return res.status(400).json({error: "todo not found"})
  } else{
    todoSelected.title = title
    todoSelected.deadline = deadline
  }

  res.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {id} = req.params;

  const todoSelected = user.todos.find((todo)=> todo.id === id)


  if(!todoSelected){
    return res.status(400).json({error: "todo not found"})
  } else{
    todoSelected.done = true
  }

  res.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {id} = req.params;

  const newArrayTodo = user.todos.filter((todo)=> todo.id !== id)

  user.todos = newArrayTodo

  res.status(201).send()});

module.exports = app;