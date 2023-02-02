import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'


const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    let getNotes = async()=>{
        let response = await fetch('http://localhost:8000/api/notes/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access),
            }
        })
        console.log(response)
        let data = await response.json()
        console.log(data)
        if(response.status === 200){
            setNotes(data)
        }
        else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    useEffect(()=> {
        getNotes()
    }, [])
    return (
        <div>
            <p>You are at the home page! </p>

            <ul>
                {notes.map(note => (
                    <li key={note.id} >{note.body}</li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage
