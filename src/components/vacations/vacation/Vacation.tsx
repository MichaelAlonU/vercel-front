import { useEffect, useState } from 'react';
import './Vacation.css';
import Spinner from '../../common/spinner/Spinner';
import useTitle from '../../../hooks/use-title';
import { useAppDispatcher, useAppSelector } from '../../../redux/hooks';
import { init } from '../../../redux/vacationSlice';
import VacationService from '../../../services/auth-aware/VacationService';
import { RootState } from '../../../redux/store';
import VacationCard from '../VacationCard/VacationCard';
import { useService } from '../../../hooks/use-service';

export default function Vacations() {
    useTitle('Vacations R Us');

    const vacationService = useService(VacationService);
    const vacations = useAppSelector((state: RootState) => state.vacations.vacations);
    const isAdmin = useAppSelector((state: RootState) => state.auth.user.isAdmin);
    const currentUserId = useAppSelector((state: RootState) => state.auth.user.id);
    const dispatcher = useAppDispatcher();

    // const token = localStorage.getItem('jwt');
    // const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    // Pagination
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [followedOnly, setFollowedOnly] = useState(false);
    const [upcomingOnly, setUpcomingOnly] = useState(false);
    const [activeOnly, setActiveOnly] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                if (vacations.length === 0) {
                    const vacationFromServer = await vacationService.getAll();
                    dispatcher(init(vacationFromServer));
                }
            } catch (e) {
                alert(e);
            }
        })();
    }, [dispatcher, vacations.length, vacationService]);

    // Apply sorting by start date ascending
    let sortedVacations = [...vacations].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Apply filters
    const now = new Date();
    let filteredVacations = sortedVacations.filter(vac => {
        const isFollowedByCurrentUser = vac.followers?.some((f: any) => f.id === currentUserId);

        if (followedOnly && !isFollowedByCurrentUser) return false;
        if (upcomingOnly && new Date(vac.startTime) <= now) return false;
        if (activeOnly && (new Date(vac.startTime) > now || new Date(vac.endTime) < now)) return false;
        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredVacations.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedVacations = filteredVacations.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <div className='Vacations'>
            <div className="filters-section">
                <label className="filter-label">
                    <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={followedOnly}
                        onChange={e => { setFollowedOnly(e.target.checked); setCurrentPage(1); }}
                    />
                    <span>Only Followed</span>
                </label>
                <label className="filter-label">
                    <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={upcomingOnly}
                        onChange={e => { setUpcomingOnly(e.target.checked); setCurrentPage(1); }}
                    />
                    <span>Upcoming Only</span>
                </label>
                <label className="filter-label">
                    <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={activeOnly}
                        onChange={e => { setActiveOnly(e.target.checked); setCurrentPage(1); }}
                    />
                    <span>Active Now</span>
                </label>
            </div>

            {paginatedVacations.length > 0 ? (
                <>
                    <div className="vacation-cards-grid">
                        {paginatedVacations.map(vac => (
                            <VacationCard
                                key={vac.id}
                                vacation={vac}
                                currentUserId={currentUserId}
                                isEditAllowed={isAdmin}
                                isDeleteAllowed={isAdmin}
                                isLikeAllowed={!isAdmin}
                            />
                        ))}
                    </div>

                    <div className="pagination-section">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <span className="pagination-info">{currentPage} / {totalPages}</span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p>No vacations found.</p>
                    <Spinner />
                </>
            )}
        </div>
    );
}
