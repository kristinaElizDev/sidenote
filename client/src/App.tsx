import { Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Timeline from './components/timeline'


export const BASE_URL = "http://localhost:4000/api"
function App() {

  return (
    <Stack h="100vh">
        <Navbar />
        <Timeline/>
    </Stack>
  )
}

export default App
