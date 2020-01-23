import React, { useState, useEffect} from 'react';

import api from '../../services/api' 

import './styles.css';

function MainForm({update}){
  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout : 30000
      }
    );
  }, []);
  
  async function addDev(e){
    e.preventDefault();
    
    const response = await api.post('/devs', {
      github_username,
      techs : techs.split(','),
      latitude,
      longitude
    })

    setGithub_username('');
    setTechs('');
    update(response.data);
  };

    return (
        <form>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input 
              name="github_username" 
              id="github_username" 
              required
              value={github_username}
              onChange={e => setGithub_username(e.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input 
              name="techs" 
              id="techs" 
              required 
              value={techs}
              onChange={e => setTechs(e.target.value)}/>
          </div>
          
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
                name="latitude" 
                id="latitude" 
                required 
                value={latitude}
                onChange={e => setLatitude(e.target.value)}/>
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input  
                name="longitude" 
                id="Longitude" 
                required 
                value={longitude}
                onChange={e => setLongitude(e.target.value)}/>
            </div>
          </div>
          <button type="submit" onClick={addDev} >Salvar</button>
        </form>
    )
}

export default MainForm;