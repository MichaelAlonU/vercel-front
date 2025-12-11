import './NotFound.css';
import notFoundImage from '../../../assets/forbidden.jpg'
export default function NotFound() {
    return (
        <div className='NotFound'>
            <h1> - 404 -</h1>
            <img src={notFoundImage}></img>
        </div>
    );
}