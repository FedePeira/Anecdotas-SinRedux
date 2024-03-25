import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from "react-router-dom"
import  { useField } from './hooks/index'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">Anecdotes</Link>
      <Link style={padding} to="/about">About App</Link>
      <Link style={padding} to="/create">Create Anecdote</Link>
    </div>
  )
}


const Anecdote = ({ find }) => { 
  const id = useParams().id
  const anecdote = find(id)
  console.log(anecdote)
  return(
    <div>
      <h2>{anecdote.author}</h2>
      <p>{anecdote.content}</p>
      <p>{anecdote.info}</p>
      <p>{anecdote.votes}</p>
    </div>
  )
}
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
Anecdote.propTypes = {
 find: PropTypes.func.isRequired,
}
AnecdoteList.propTypes = {
 anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string,
      info: PropTypes.string,
      votes: PropTypes.number
    })
 ).isRequired
}


const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)


const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)


const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    console.log(content.value, author.value, info.value)
    props.setNotification(`a new anecdote by ${author.value} has been created`)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input 
            name='content' 
            type={content.type} 
            value={content.value} 
            onChange={content.onChange} />
        </div>
        <div>
          author
          <input 
            name='author' 
            type={author.type} 
            value={author.value} 
            onChange={author.onChange} />
        </div>
        <div>
          url for more info
          <input 
            name='info' 
            type={info.type} 
            value={info.value} 
            onChange={info.onChange} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}
CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
}


const Notification = ({ message }) => {
  const [visible, setVisible] = useState(false);

  console.log(visible)
  useEffect(() => {
    if (message) {
      setVisible(true); 
      const timer = setTimeout(() => {
        setVisible(false); 
      }, 3000);

      return () => clearTimeout(timer); 
    }
 }, [message])

 if (!visible) {
    return null;
 }
  
  return(
    <p>{message}</p>
  )
}
Notification.propTypes = {
  message: PropTypes.string.isRequired,
}


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) => {
    return anecdotes.find(a => a.id === Number(id));
  }

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <Router>
      <h1>Software anecdotes</h1>
      <Menu/>
      <Notification message={notification}/>

      <Routes>
        <Route path="/:id" element={<Anecdote find={anecdoteById}/>} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew}  setNotification={setNotification}/>} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
