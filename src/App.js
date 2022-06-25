import { useState } from 'react'
import cx from 'classnames'
import { ReactComponent as AddIconSvg } from './img/ad-icon.svg'
import { ReactComponent as DeleteIconSvg } from './img/close-icon.svg'
import './styles.css'

const generateId = (function () {
  let id = 0

  return function () {
    id++
    return String(id)
  }
})()

function AddToDoForm({ onChange, onSubmit, value }) {
  return (
    // form
    <form
      className="form__input"
      onSubmit={event => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <input
        value={value}
        type="text"
        className="task_value"
        placeholder="Просто зроби це"
        onChange={event => {
          onChange(event.target.value)
          console.log('onChange', event.target.value)
        }}
      />
      <button className="form__button" type="submit">
        <AddIconSvg />
      </button>
    </form>
  )
}

function TaskEdit({ onEdit, value: defaultValue, onClose }) {
  let [value, setValue] = useState(defaultValue)

  function handleSubmit(event) {
    event.preventDefault()
    if (!value) return
    onEdit(value)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input__edit"
        value={value}
        type="text"
        onChange={event => {
          setValue(event.target.value)
        }}
        placeholder={defaultValue}
      />
      <button type="submit" className="task__edit__btn">
        OK
      </button>
      <button className="delete_button" type="button" onClick={onClose}>
        <DeleteIconSvg />
      </button>
    </form>
  )
}

function Task({ value, onDelete, id, onComplete, isDone, onEdit }) {
  let [isEditing, setIsEditing] = useState(false)

  function handleEdit(newValue) {
    onEdit(id, newValue)
  }

  function handleOpenEditMode() {
    setIsEditing(true)
  }

  function handleCloseEditMode() {
    setIsEditing(false)
  }

  function handleDelete() {
    onDelete(id)
  }

  function handleComplete(event) {
    onComplete(id, event.target.checked)
    console.log(event.target.checked)
  }
  // const rootClassname = "task " + (isDone ? "task_completed" : "");
  // const rootClassname = `task ${isDone ? "task_completed": ""}`;

  if (isEditing) {
    return (
      <li className="task">
        <TaskEdit
          onEdit={handleEdit}
          onClose={handleCloseEditMode}
          value={value}
        />
      </li>
    )
  }

  return (
    <li className={cx('task', { task_completed: isDone })}>
      <input
        type="checkbox"
        className="task__checkbox"
        checked={isDone}
        onChange={handleComplete}
      />
      <span className="task__text">{value}</span>
      <div className="div__btn__edit">
        <button
          className="task__edit__btn"
          type="button"
          onClick={handleOpenEditMode}
        >
          Edit
        </button>
      </div>
      <button className="delete_button" type="button" onClick={handleDelete}>
        <DeleteIconSvg />
      </button>
    </li>
  )
}

function Tasklist({ todos, onDelete, onComplete, onEdit }) {
  return (
    <ul>
      {[...todos]
        .sort((todoA, todoB) => {
          if (todoA.isDone && !todoB.isDone) return 1
          if (!todoA.isDone && todoB.isDone) return -1
          return 0
        })
        .map(todo => (
          <Task
            key={todo.id}
            value={todo.value}
            id={todo.id}
            isDone={todo.isDone}
            onComplete={onComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
    </ul>
  )
}

export default function App() {
  let [value, setValue] = useState('')
  let [todos, setTodos] = useState([])

  console.log(todos)

  function handleAddTodo() {
    if (!value) return
    let newTodo = { value: value, id: generateId(), isDone: false } //short code {value}
    let newTodos = [...todos, newTodo]
    setTodos(newTodos)
    setValue('')
    console.log(newTodos)
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  function handleCompleteTodo(id, isDone) {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, isDone }
        }
        return todo
      })
    )
  }

  function handleEditTodo(id, value) {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, value } : todo)))
  }

  return (
    <div className="wrap">
      <div className="App">
        <AddToDoForm
          value={value}
          onChange={setValue}
          onSubmit={handleAddTodo}
          // onChange handler
          // onSubmit handler
        />
        <Tasklist
          todos={todos}
          onDelete={handleDeleteTodo}
          onComplete={handleCompleteTodo}
          onEdit={handleEditTodo}
          // List of todos
        />
      </div>
    </div>
  )
}
