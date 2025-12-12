import './VacationCard.css';
import { useAppDispatcher } from '../../../redux/hooks';
import { useService } from '../../../hooks/use-service';
import { addFollower, deleteVacation, markFollowedByCurrentUser, markUnfollowedByCurrentUser, removeFollower } from '../../../redux/vacationSlice';
import { useNavigate } from 'react-router';
import VacationService from '../../../services/auth-aware/VacationService';
import { clientId } from '../../../redux/store'
import socket from '../../../../io/io';

console.log("Client ID:", clientId);

interface Props {
    vacation: any;
    currentUserId?: string;
    isEditAllowed: boolean;
    isDeleteAllowed: boolean;
    isLikeAllowed: boolean;
}


export default function VacationCard({ vacation, currentUserId, isEditAllowed, isDeleteAllowed, isLikeAllowed }: Props) {
    const dispatcher = useAppDispatcher();
    const vacationService = useService(VacationService);
    const navigate = useNavigate();

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this vacation?")) return;
        try {
            await vacationService.remove(id);
            dispatcher(deleteVacation(id));
            alert("Vacation deleted successfully");
        } catch (err) {
            alert(err);
        }
    }

    async function toggleLike() {
        if (!currentUserId) return;
        try {
            if (vacation.followers?.find((f: any) => f.id === currentUserId)) {
                await vacationService.unfollow(vacation.id);
                console.log(`Current User ID: ${currentUserId} from unfollow...`)
                dispatcher(removeFollower({ vacId: vacation.id, userId: currentUserId }));
                dispatcher(markUnfollowedByCurrentUser({ vacId: vacation.id }))

                socket.emit("vacation-like", {
                    type: "unfollow",
                    vacationId: vacation.id,
                    userId: currentUserId,
                    from: clientId
                });

            } else {
                await vacationService.follow(vacation.id);
                console.log(`Current User ID: ${currentUserId} from follow...`)
                dispatcher(addFollower({ vacId: vacation.id, userId: currentUserId }));
                dispatcher(markFollowedByCurrentUser({ vacId: vacation.id }));
                socket.emit("vacation-like", {
                    type: "follow",
                    vacationId: vacation.id,
                    userId: currentUserId,
                    from: clientId
                });

            }
        } catch (err) {
            alert(err);
        }
    }

    const isLikedByCurrentUser = vacation.followers?.some((f: any) => f.id === currentUserId);

    return (
        <div className="VacationCard">
            <img src={vacation.imageUrl} alt={vacation.destination} />
            <div className="card-content">
                <h4>{vacation.destination} </h4>
                <h6>                    <span className="date">{new Date(vacation.startTime).toLocaleDateString()} - {new Date(vacation.endTime).toLocaleDateString()}</span>
                </h6>
                <div className="card-info">
                    <span className="price">${vacation.price}</span>
                </div>
                <p>{vacation.description.substring(0, 50)}...</p>
            </div>
            <div className="card-footer">
                {isLikeAllowed && <span className="followers-count">{vacation.followers?.length || 0} 👥</span>}
                <div className="btn-group">
                    {isLikeAllowed && (
                        <button className={`btn-like ${isLikedByCurrentUser ? 'liked' : ''}`} onClick={toggleLike}>
                            {isLikedByCurrentUser ? "❤️" : "🤍"}
                        </button>
                    )}
                    {isEditAllowed && (
                        <button className="btn-edit" onClick={() => navigate(`/vacations/edit/${vacation.id}`)}>✏️</button>
                    )}
                    {isDeleteAllowed && (
                        <button className="btn-delete" onClick={() => handleDelete(vacation.id)}>🗑️</button>
                    )}
                </div>
            </div>
        </div>
    );
}
