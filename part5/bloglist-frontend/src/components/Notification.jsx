import React from 'react'

const Notification = ({ message, type }) => {
  const notificationStyle = {
    color: type === 1 ? 'green' : 'red',
    background: 'grey',
    borderWidth: '5px',
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: type === 1 ? 'green' : 'red',
    fontSize: 16,
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
    marginTop: '10px',
    marginBottom: '10px',
  }
  if (message === null) {
    return null
  }
  return <div style={notificationStyle}>{message}</div>
}

export default Notification
