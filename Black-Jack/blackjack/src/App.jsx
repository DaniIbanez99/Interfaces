import React, { useState, useEffect } from 'react';
import './App.css';

const palos = ['♠', '♦', '♣', '♥'];
const cartas = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const Barajar = () => {
  const mazo = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
      mazo.push(cartas[j] + palos[i]);
    }
  }

  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }

  return mazo;
};

const calcular = (hand) => {
  let score = hand.reduce((acc, carta) => {
    const valor = carta.slice(0, -1); 
    if (valor === 'J' || valor === 'Q' || valor === 'K') {
      return acc + 10;
    } else if (valor === 'A') {
      return acc + 11;
    } else {
      return acc + parseInt(valor, 10);
    }
  }, 0);

  hand.filter((carta) => carta.includes('A')).forEach(() => {
    if (score > 21) {
      score -= 10;
    }
  });

  return score;
};

const Carta = ({ carta }) => {
  const valorCarta = carta.slice(0, -1);
  const paloCarta = carta.slice(-1);
  return (
    <div className="carta">
      <div className="valor-carta">{valorCarta}</div>
      <div className="palo-carta">{paloCarta}</div>
    </div>
  );
};

const App = () => {
  const [deck, setDeck] = useState(Barajar());
  const [Jugador, setJugador] = useState([]);
  const [crupier, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [CrupierScore, setCrupierScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const repartir = () => {
    const nuevoMazo = Barajar();
    setDeck(nuevoMazo);
    setJugador([nuevoMazo.pop()]);
    setDealerHand([nuevoMazo.pop(), nuevoMazo.pop()]);
    setGameOver(false);
  };

  const pedirCarta = () => {
    const nuevoMazo = [...deck];
    const nuevaManoJugador = [...Jugador, nuevoMazo.pop()];
    setDeck(nuevoMazo);
    setJugador(nuevaManoJugador);
    const nuevaPuntuacion = calcular(nuevaManoJugador);
    setPlayerScore(nuevaPuntuacion);

    if (nuevaPuntuacion > 21) {
      setGameOver(true);
      setTimeout(() => {
        alert("Te has pasado, el crupier gana.");
      }, 1000);
    }
  };

  const plantarse = () => {
    let nuevoMazo = [...deck];
    let nuevaManoDealer = [...crupier];

    while (calcular(nuevaManoDealer) < 17) {
      nuevaManoDealer.push(nuevoMazo.pop());
    }

    setDeck(nuevoMazo);
    setDealerHand(nuevaManoDealer);
    const puntuacionDealerFinal = calcular(nuevaManoDealer);
    setCrupierScore(puntuacionDealerFinal);
    setGameOver(true);

    const puntuacionJugadorFinal = playerScore;

    setTimeout(() => {
      if (puntuacionDealerFinal > 21 || puntuacionJugadorFinal > puntuacionDealerFinal && puntuacionJugadorFinal <= 21) {
        alert("¡El jugador gana!");
      } else if (puntuacionDealerFinal === puntuacionJugadorFinal) {
        alert("¡Es un empate!");
      } else {
        alert("¡El crupiers gana!");
      }
    }, 1000); 

    if (puntuacionDealerFinal > 21) {
      setGameOver(true);
      setTimeout(() => {
        alert("Te has pasado, el crupier gana.");
      }, 1000);
    }
  };

  const pedircartaCrupier = () => {
    if (!gameOver) {
      const nuevoMazo = [...deck];
      const nuevaManoDealer = [...crupier, nuevoMazo.pop()];
      setDeck(nuevoMazo);
      setDealerHand(nuevaManoDealer);
      const nuevaPuntuacion = calcular(nuevaManoDealer);
      setCrupierScore(nuevaPuntuacion);

      if (nuevaPuntuacion > 21) {
        setGameOver(true);
        setTimeout(() => {
          alert("Te has pasado, gana el jugador.");
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const mazoInicial = Barajar();
    setDeck(mazoInicial);
    repartir();
  }, []);

  useEffect(() => {
    const puntuacionInicialJugador = calcular(Jugador);
    setPlayerScore(puntuacionInicialJugador);

    if (puntuacionInicialJugador === 21) {
      plantarse();
    }
  }, [Jugador]);

  useEffect(() => {
    if (gameOver) {
      const puntuacionDealerFinal = calcular(crupier);
      setCrupierScore(puntuacionDealerFinal);
    }
  }, [gameOver]);

  return (
    <div id='mesa'>
      <h1>Blackjack</h1>
      <div className="seccion-jugador">
        <h2>Jugador</h2>
        <p>Puntuación: {playerScore}</p>
        <div className="mano">
          {Jugador.map((carta, index) => (
            <Carta key={index} carta={carta} />
          ))}
        </div>
        {!gameOver && (
          <div>
            <button onClick={pedirCarta}>Pedir</button>
            <button onClick={plantarse}>Plantarse</button>
          </div>
        )}
      </div>
      <div className="seccion-dealer">
        <h2>Crupier</h2>
        <p>Puntuación: {gameOver ? CrupierScore : crupier[0] ? calcular([crupier[0]]) : '?'}</p>
        <div className="mano">
          {gameOver
            ? crupier.map((carta, index) => <Carta key={index} carta={carta} />)
            : crupier.map((carta, index) => (index === 0 ? <Carta key={index} carta={carta} /> : <div key={index} className="carta dorso"></div>))}
        </div>
        {!gameOver && (
          <button onClick={pedircartaCrupier}>Pedir carta al Crupier</button>
        )}
      </div>
      <button onClick={repartir}>Nueva Ronda</button>
    </div>
  );
};

export default App;
