import 'lazysizes'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/index.scss'

// import a plugin
import 'lazysizes/plugins/parent-fit/ls.parent-fit'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
ReactDOM.createRoot(rootElement).render(<App />)
