import 'lazysizes'
import * as ReactDOMClient from 'react-dom/client'
import App from './App'
import './styles/index.scss'

// import a plugin
import 'lazysizes/plugins/parent-fit/ls.parent-fit'

import Provider from './provider'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
// https://github.com/reactwg/react-18/discussions/125
ReactDOMClient.createRoot(rootElement).render(
  <Provider>
    <App />
  </Provider>,
)
