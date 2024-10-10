/* eslint-disable react/prop-types */

import { useQueryClient, useMutation } from '@tanstack/react-query'
import { updateAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const Anecdote = ({ anecdote }) => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `anecdote "${anecdote.content}" voted`,
      })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div key={anecdote.id} className="anecdote">
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  )
}

export default Anecdote