import io from 'socket.io-client'

const ioUrl = import.meta.env.VITE_IO_SERVER_URL || import.meta.env.VITE_REST_SERVER_URL
const socket = io(`${ioUrl}`)

export default socket
