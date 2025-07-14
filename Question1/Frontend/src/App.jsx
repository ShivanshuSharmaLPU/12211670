import UrlForm from './components/UrlForm';
import StatsViewer from './components/StatsViewer';
import { Container } from '@mui/material';

function App() {
  return (
    <Container>
      <UrlForm />
      <hr />
      <StatsViewer />
    </Container>
  );
}

export default App;
