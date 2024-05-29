import { useState, useEffect } from "react";
import phoneBook from './services/server'

const Notification = ({message, id}) =>{
  let messagestyle
  id===1 ?  messagestyle ={
    color: "green",
    background: "grey",
    borderWidth: "5px",
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "green",
    fontSize: 16,
    marginTop: "10px",
    marginBottom: "10px"
  } : messagestyle ={
    color: "red",
    background: "grey",
    borderWidth: "5px",
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "red",
    fontSize: 16,
    marginTop: "10px",
    marginBottom: "10px"
  }


  if (message===null){
    return null
  }
  return(
    <div style={messagestyle}>
     <h2>{message}</h2>
    </div>
  )
}

const Persons = ({ filteredPersons, setPersons}) => {

  const handleDelete = async (person) =>{
    const confirm = window.confirm(`Delete ${person.name}?`)
    if(confirm){
    try{
      await phoneBook.Delete(person.id)
      setPersons(filteredPersons.filter((p)=> p.id !== person.id))
      
    } catch(error){
      console.log(error)
    }
  }
  }

  return filteredPersons.map((person) => (
    <div key={person.id}>
      {person.name} {person.number}
      <button onClick={()=>handleDelete(person)}>delete</button>
    </div>
  ));
};

const Filter = ({ search, setSearch }) => {
  return (
    <div>
      Filter shown with{" "}
      <input
        key="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  handleInput,
}) => {
  return (
    <form onSubmit={handleInput}>
      <div>
        Name:
        <input
          key="name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <br />
        Number:
        <input
          key="number"
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [error, seterror] = useState(null);
  const [errorID, setErrorID] = useState(1);

  useEffect(()=>{
    phoneBook.getAll()
    .then(initial=>{
      setPersons(initial)
    })
  .catch(error => {
    seterror(error.response.data.error)
    setErrorID(2)
    setTimeout(()=>{seterror(null)},2000)
})
  },[])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInput = async (event) => {
    event.preventDefault();
    const alreadyExist = persons.some(
      (person) => person.name === newName 
    );
    const alreadyExistbutnewNumber = persons.find(
      (person) => person.name === newName && person.number!==newNumber
    );
    if(alreadyExistbutnewNumber){
      const confirm = window.confirm(`${newName} is already added to the phonebook, replace the old number with new one?`)
      if (confirm){
        try{
          await phoneBook.update(alreadyExistbutnewNumber.id, {name: newName, number: newNumber})
          const updatedPersons = persons.map((person)=>person.id===alreadyExistbutnewNumber.id ? {...person, number: newNumber} : person)
          setPersons(updatedPersons)
          setNewName("")
          setNewNumber("")
          seterror(`Updated ${newName}'s number`)
          setErrorID(1);
          setTimeout(()=>{seterror(null);
        },2000)
          return
        }catch(error){
          seterror(error.response.data.error)
          setErrorID(2)
          setTimeout(()=>{seterror(null)},2000)
        }
      }
    }
    else if (alreadyExist) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    else{
    try{
      const newPerson = await phoneBook.create( {name: newName, number: newNumber})
    setPersons([...persons, newPerson]);
    setNewName("");
    setNewNumber("");
    seterror(`Added ${newName}`)
    setErrorID(1)
    setTimeout(()=>{seterror(null)
  },2000)
    } catch(error){
        seterror(error.response.data.error);
        setErrorID(2)
        setTimeout(() => seterror(null), 2000);
      }
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />
      <Notification message={error} id={errorID}/>
      <h2>add a new </h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        handleInput={handleInput}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} setPersons={setPersons} />
    </div>
  );
}

export default App;