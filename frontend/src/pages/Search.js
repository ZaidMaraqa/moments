import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../css/search.css'

const SearchPage = () => {
    let {authTokens, logoutUser} = useContext(AuthContext);
    let [searchUser, setSearchUser] = useState('')
    let [data, setData] = useState({ results: [] });


    let searchUsers = async () => {
      try {
        let response = await fetch(`http://localhost:8000/api/userList?username=${encodeURIComponent(searchUser)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
        
        let data = await response.json();
        if (response.status === 200) {
          setData(data);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.log(error);
        // logoutUser();
      }
    };

     useEffect(() => {
        searchUsers();
    }, [searchUser]);


    return(
        <div className='searchPage'>
          <input className='search-input'
          type="search" 
          placeholder='Search...' 
          value={searchUser} 
          onChange={e => {setSearchUser(e.target.value);
          }}
          />
          <ul className='search-results'>
            {data.results && 
              data.results.map((srch) =>( 
              <li key={srch.username}>
                 <Link to={`/userprofile/${srch.id}`}>{srch.username}</Link>
                 </li>
                ))}
              </ul>
        </div>
    );

};

export default SearchPage;