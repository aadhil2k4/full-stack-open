import React from 'react'


const Course = ({course}) => {

  const total = course.parts.reduce((s, p) => 
    s + p.exercises, 0
  )

  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map(part => 
        <p key={part.id}>{part.name}  {part.exercises}</p>
      )
      }
      <h3>total of {total} exercises</h3>
    </div>

  )
}

export default Course