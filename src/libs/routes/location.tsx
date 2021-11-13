import { ReactLocation } from 'react-location'

// type
import type { MakeGenerics } from 'react-location'

type LocationGenerics = MakeGenerics<{}>
// Set up a ReactLocation instance
const location = new ReactLocation<LocationGenerics>()

export default location
