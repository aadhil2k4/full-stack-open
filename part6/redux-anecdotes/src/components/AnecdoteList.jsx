import { useSelector, useDispatch } from 'react-redux'
import { addVotes } from '../reducers/anecdoteReducer'


const AnecdoteList = () => {

    const dispatch = useDispatch()
  
    const vote = (id) => {
      console.log('vote', id)
      dispatch(addVotes(id))
    }

    const anecdotes = useSelector(state=>{
      if(state.filters === null){
        return state.anecdotes.sort((a,b)=>b.votes-a.votes)
      }
      return state.anecdotes.filter((anecdote)=>anecdote.content.toLowerCase().includes(state.filters.toLowerCase())).sort((a,b)=>b.votes-a.votes)
    })

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
