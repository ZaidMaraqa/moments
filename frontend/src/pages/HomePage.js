import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
// import axios from 'axios';

const HomePage = () => {
    let [notes, setNotes] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);

    useEffect(() => {
        getNotes();
    }, []);

    let getNotes = async () => {
        try {
            let response = await fetch('http://localhost:8000/api/notes/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();

            if (response.status === 200) {
                setNotes(data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            // logoutUser();
        }
    };

    

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>{note.text}</li>
                ))}
            </ul>
        </div>
    );
};


export default HomePage
