import "./App.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import ReadString from "./FileParser.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Finance Tracker App</h1>
      </header>

      <div className="App-body">
        <MyCard className="Sample-card"></MyCard>
      </div>

      <footer className="App-foot">
        <p>github.com/alicmc</p>
      </footer>
    </div>
  );
}

function MyCard() {
  return <ReadString />;
}
export default App;
