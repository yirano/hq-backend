import { config } from 'dotenv'

let loaded = false

export default {
  load: () => {
    // Prevents reloading env variables
    if (loaded) return
    const path = __dirname + '/../../.env'
    config({ path })
    loaded = true
  },
}

