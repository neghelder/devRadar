import React, { useEffect, useState } from 'react';

//components
import DevItem from './components/DevItem';
import MainForm from './components/MainForm';

import './global.css';
import './App.css';

import './Main.css';
import api from './services/api'

/*What is React
  1. Component : A isolated block of HTML, CSS ans Javacript (like in angular) which does not interfere
    in the rest of the app and it can be replicated, so we don't duplicate code (DRY). 
  3. Property: is the info that a parent component can pass to the child items
  2. State: Informações mantidas pelo component (Lembrar: imutabilidade)
*/

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function LoadDevs(){
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    LoadDevs();
  },[]);

function updateDevList(newDevData){
  setDevs([...devs, newDevData]);
}

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <MainForm update={updateDevList}/>
      </aside>
      
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
