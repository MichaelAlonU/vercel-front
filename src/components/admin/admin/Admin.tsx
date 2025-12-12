import { NavLink } from 'react-router-dom';
import useAdminGuard from '../../../hooks/use-isAdmin'
import './Admin.css'
import useTitle from '../../../hooks/use-title';

export default function Admin() {

    useAdminGuard();
    useTitle('Admin management panel');

    return (
        <div className='Admin'>
            <h2> Admin control panel </h2>
            <NavLink to="/add-vacation">
                Add a new vacation
            </NavLink>
            <NavLink to="/vacations-reports">
                See vacation reports
            </NavLink>



        </div>
    )
}