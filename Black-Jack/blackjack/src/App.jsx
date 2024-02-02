import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  // Estado para las cartas del crupier y del jugador
  const [crupierCards, setCrupierCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);

  // Función para manejar la distribución inicial de las cartas
  const dealCards = () => {

    // Lógica para repartir cartas (puedes adaptar esto según tu implementación)

    // Actualizar el estado de las cartas del crupier y del jugador
    setCrupierCards([...crupierCards, nuevaCartaCrupier]);
    setPlayerCards([...playerCards, nuevaCartaJugador]);
}

  return (
    <>
        <div>
      <button onClick={dealCards}>Repartir Cartas</button>

      {/* Fila para las cartas del Crupier */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {crupierCards.map((carta, index) => (
          <div key={index} style={{ margin: '10px' }}>
            {/* Aquí renderiza la información de la carta del Crupier */}
            {carta}
          </div>
        ))}
      </div>

      {/* Fila para las cartas del Jugador */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {playerCards.map((carta, index) => (
          <div key={index} style={{ margin: '10px' }}>
            {/* Aquí renderiza la información de la carta del Jugador */}
            {carta}
          </div>
        ))}
      </div>
    </div>

    </>
  )
}

export default App
