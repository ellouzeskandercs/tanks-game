import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';
import { Game } from './game/game.tsx'


function App() {
  return (
    <div className="app-container">
      <header class="w-75">
        <h3 class="float-md-start mb-0">Tanks Game</h3>
        <nav class="nav nav-masthead justify-content-center float-md-end">
          <a class="nav-link active" aria-current="page" href="#">Play</a>
          <a class="nav-link" href="#">Best scores</a>
          <a class="nav-link" href="#">Forum</a>
        </nav>
      </header>
      <Game/>
    </div>
  );
}

export default App;
