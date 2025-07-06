import './App.css';

import ReadString from './FileParser.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Hello
        </h1>
      </header>

      <div className='App-body'>

        <MyCard className='Sample-card'></MyCard>

      </div>



      <footer className='App-foot'>
        <p>here's me foot</p>
      </footer>
    </div>
  );
}

function MyCard() {
  return (
    <Container className='Container'>
      <Row>
        <Col md={6} className="mx-auto">  {/* 4 out of 12 columns = 1/3 */}
          <Card className='TheCard'>
            <Card.Body>
              <ReadString />
              <Card.Title>1/3 Width Card</Card.Title>
              <Card.Text>This is one-third of the row.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mx-auto">  {/* 4 out of 12 columns = 1/3 */}
          <Card className='TheCard'>
            <Card.Body>
              <Card.Title>1/3 Width Card</Card.Title>
              <Card.Text>This is one-third of the row.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
export default App;
