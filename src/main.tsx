import ReactDOM from 'react-dom'
import App from './App'
import './styles/index.scss'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
ReactDOM.createRoot(rootElement).render(<App />)
