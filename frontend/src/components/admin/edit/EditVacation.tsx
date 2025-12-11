import { useNavigate, useParams } from "react-router-dom";
import './EditVacation.css';
import { useService } from "../../../hooks/use-service";
import VacationService from "../../../services/auth-aware/VacationService";
import { useAppDispatcher, useAppSelector } from "../../../redux/hooks";
import VacationDraft from "../../../models/VacationDraft";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../common/spinner/Spinner";
import { joiResolver } from "@hookform/resolvers/joi";
import SpinnerButton from "../../common/spinner-button/SpinnerButton";
import { init, updateVacation } from "../../../redux/vacationSlice";
import useTitle from "../../../hooks/use-title";
import { updateVacationValidator } from "../validator";

function toDatetimeLocal(value: string | Date) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16); // YYYY-MM-DDTHH:MM
}

export default function EditVacation() {

    useTitle('Vacations R Us - Edit Vacation');
    const { id } = useParams<'id'>();
    const vacation = useAppSelector(state => state.vacations.vacations.find(v => v.id === id));
    const dispatch = useAppDispatcher();
    const navigate = useNavigate();
    const vacationService = useService(VacationService);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<VacationDraft>({
            resolver: joiResolver(updateVacationValidator)
        });

    useEffect(() => {
        (async () => {

            let vac = vacation;

            if (!vac) {
                const vacationsFromServer = await vacationService.getAll();
                dispatch(init(vacationsFromServer));
                vac = vacationsFromServer.find(v => v.id === id);

                if (!vac) {
                    alert("The desired vacation was not found");
                    navigate("/vacations");
                    return;
                }
            }
            let { destination, description, startTime, endTime, price } = vac
            const draft = {
                destination, description,
                startTime: toDatetimeLocal(startTime),
                endTime: toDatetimeLocal(endTime),
                price
            }
            reset(draft)

            setIsReady(true);

        })();
    }, [id, vacation, dispatch, reset]);

    function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    async function submit(draft: VacationDraft) {
        console.log(`onSubmit data: `, draft)
        try {
            setIsSubmitting(true);
            if (draft.image) {
                draft.image = (draft.image as unknown as FileList)[0];
            }
            const updatedVacation = await vacationService.editVacation(id!, draft);
            dispatch(updateVacation(updatedVacation))
            alert('Vacation updated successfully');
            navigate('/vacations');
        } catch (e) {
            alert(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='EditVacation'>
            {!isReady && <Spinner />}

            {isReady && (
                <>
                    <h3>Edit Vacation</h3>

                    <form onSubmit={handleSubmit(submit)}>

                        <label>Destination</label>
                        <textarea {...register('destination')} />
                        <div className='formError'>{errors.destination?.message}</div>

                        <label>Description</label>
                        <textarea {...register('description')} />
                        <div className='formError'>{errors.description?.message}</div>

                        <label>Start time</label>
                        <input type='datetime-local' {...register('startTime')} />
                        <div className='formError'>{errors.startTime?.message}</div>

                        <label>End time</label>
                        <input type='datetime-local' {...register('endTime')} />
                        <div className='formError'>{errors.endTime?.message}</div>

                        <label>Price</label>
                        <input type='number' {...register('price', { valueAsNumber: true })} />
                        <div className='formError'>{errors.price?.message}</div>

                        <label>Image</label>
                        <input type="file" accept="image/*" {...register('image')} onChange={previewImage} />
                        {preview ? (
                            <img src={preview} style={{ width: 200, marginTop: 10 }} />
                        ) : (
                            vacation?.imageUrl && <img src={vacation?.imageUrl} style={{ width: 200, marginTop: 10 }} />
                        )}
                        <div className='formError'>{errors.image?.message}</div>
                        {/* <button type="button" onClick={() => { setValue("image", null); setPreview(null);  }}> Remove Image </button> */}

                        <SpinnerButton
                            buttonText='Update Vacation'
                            loadingText='Updating vacation…'
                            isSubmitting={isSubmitting}
                        />

                        <button type='button' onClick={() => reset()}>Reset</button>

                    </form>
                </>
            )}
        </div>
    );
}
