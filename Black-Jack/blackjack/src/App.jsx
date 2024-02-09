import { useState, useEffect  } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const palos = ['♠', '♣', '♦', '♥'];
const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


const BlackjackTable = ({cartasCrupier}) => {
  return (
    <div className="blackjack-table">
      <div className="row">
        <PlayerRow playerName="Crupier" cartas={cartasCrupier} />
      </div>
      <div className="row">
        <PlayerRow playerName="Jugador" cartas={cartasJugador} />
      </div>
    </div>
  );
};

const PlayerRow = ({ playerName, cartas }) => {
  return (
    <div className="player-row">
      <h2>{playerName}</h2>
      <div className='hand'>
        {cartas.map((carta, index) => (
          <Card key={index} palo={carta.palo} valor={carta.valor} />
        ))}
      </div>
      <p>Cartas en mano: {cartas.map(carta => carta.valor + carta.palo).join(", ")}</p>
    </div>
  );
};

const Card = ({ palo, valor }) => {
  return (
    <div className="card">
      <span className="card-value">{valor}</span>
      <span className="card-suit">{palo}</span>
    </div>
  );
};

const App = () => {

  const [cartasJugador, setCartasJugador] = useState([]);
  const [cartasCrupier, setCartasCrupier] = useState([]);
  const [sumaJugador, setSumaJugador] = useState(0);
  const [sumaCrupier, setSumaCrupier] = useState(0);
  const [rondaTerminada, setRondaTerminada] = useState(false);
  const [cartasUtilizadas, setCartasUtilizadas] = useState([]);
  

  const solicitarSiguienteCarta = (jugador) => {
    const valorAleatorio = Math.floor(Math.random() * valores.length);
    const paloAleatorio = Math.floor(Math.random() * palos.length);
    const nuevaCarta = {
      valor: valores[valorAleatorio],
      palo: palos[paloAleatorio]
    };
    if (jugador === "jugador") {
      setCartasJugador([...cartasJugador, nuevaCarta]);
    } else if (jugador === "crupier") {
      setCartasCrupier([...cartasCrupier, nuevaCarta]);
    }
  };
  
  const plantarse = () => {
    while (sumaCartas(cartasCrupier) < 17) {
      solicitarSiguienteCarta(setCartasCrupier);
    }
  };

  const sumaCartas = (cartas) => {
    return cartas.reduce((suma, carta) => {
      const valorCarta = parseInt(carta.valor) || (carta.valor === 'A' ? 11 : 10);
      return suma + valorCarta;
    }, 0);
  };
  const iniciarNuevaRonda = () => {
    setRondaTerminada(false); 
    setSumaJugador(0);
    setSumaCrupier(0); 
    setCartasJugador([]); 
    setCartasCrupier([]);
  };
  const terminarRonda = () => {
    setRondaTerminada(true);
    setSumaJugador(0); 
    setSumaCrupier(0); 
  };

  useEffect(() => {
    // Calcula la suma de las cartas del jugador
    const sumaJugadorCalculada = calcularSumaCartas(cartasJugador);
    setSumaJugador(sumaJugadorCalculada);
  }, [cartasJugador]);

  useEffect(() => {
    // Calcula la suma de las cartas del crupier
    const sumaCrupierCalculada = calcularSumaCartas(cartasCrupier);
    setSumaCrupier(sumaCrupierCalculada);
  }, [cartasCrupier]);

  // Función para calcular la suma de las cartas
  const calcularSumaCartas = (cartas) => {
    let suma = 0;
    cartas.forEach(carta => {
      const valorCarta = parseInt(carta.valor) || (carta.valor === 'A' ? 11 : 10);
      suma += valorCarta;
    });
    return suma;
  };

  const cartaYaUtilizada = (carta) => {
    return cartasUtilizadas.some((c) => c.valor === carta.valor && c.palo === carta.palo);
  };
 
 
  return (
    <div>
      <BlackjackTable />
      <div>
        <p>Suma de las cartas del Jugador: {sumaJugador}</p>
        <p>Suma de las cartas del Crupier: {sumaCrupier}</p>      
      </div>
      {rondaTerminada && (
        <button onClick={iniciarNuevaRonda}>Nueva Ronda</button>
      )}
      <button onClick={terminarRonda}>Terminar Ronda</button>
      <button onClick={ () => solicitarSiguienteCarta("jugador")}>Solicitar siguiente carta</button>
      <button onClick={() => solicitarSiguienteCarta("crupier")}>Solicitar siguiente carta Crupier</button>
      <button onClick={plantarse}>Plantarse</button>
      <BlackjackTable cartasJugador={cartasJugador} cartasCrupier={cartasCrupier} />

    </div>
   
  );
};

export default App;
