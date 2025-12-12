import io from 'socket.io-client'

// const ioUrl = "import.meta.env.VITE_IO_SERVER_URL" || import.meta.env.VITE_REST_SERVER_URL
const socket = io(`https://p01--vacations-backend-io--dbq6h7qyvd5d.code.run`)

export default socket
