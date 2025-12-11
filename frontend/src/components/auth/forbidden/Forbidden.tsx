import './Forbidden.css';
import forbidden from '../../../assets/forbidden.jpg'
import { NavLink } from 'react-router-dom';

export default function Forbidden() {
    return (
        <div className='Forbidden'>
            <img src={forbidden} />
            <br></br>
            <h2> <NavLink to="/vacations" >get me out of here!!</NavLink> </h2>
        </div>
    );
}