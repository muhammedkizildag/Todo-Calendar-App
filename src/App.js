import { Box } from '@mui/material';
import './App.css';
import Calendar from './components/calendar';

function App() {
  return (
    <Box sx={{padding: '4px 16px 0 16px'}}>
      <Calendar></Calendar>
    </Box>
  );
}

export default App;
