import './NewVacation.css';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import VacationDraft from '../../../models/VacationDraft';
import VacationService from '../../../services/auth-aware/VacationService';
import { useService } from '../../../hooks/use-service';
import { useNavigate } from 'react-router-dom';
import SpinnerButton from '../../common/spinner-button/SpinnerButton';
import { useState } from 'react';
import { useAppDispatcher } from '../../../redux/hooks';
import { newVacation } from '../../../redux/vacationSlice';
import { createNewVacationValidator } from '../validator';

export default function NewVacation() {
    const vacationService = useService(VacationService);
    const navigate = useNavigate();
    const dispatch = useAppDispatcher();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VacationDraft>({
        resolver: joiResolver(createNewVacationValidator),
        defaultValues: {
            destination: '',
            description: '',
            startTime: '',
            endTime: '',
            price: 0,
            image: null
        }
    });

    const [preview, setPreview] = useState<string | null>(null);

    function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        // setValue('image', file, { shouldValidate: true });
        // trigger('image');
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    async function onSubmit(data: VacationDraft) {
        console.log(`onSubmit data: `, data)
        if (data.image) {
            data.image = (data.image as unknown as FileList)[0];
        } else {
            return;
        }
        try {
            const newVac = await vacationService.newVacation(data);
            dispatch(newVacation(newVac));
            alert('Vacation created');
            reset();
            navigate('/vacations/manage');
        } catch (err) {
            console.error(err);
            alert('Failed to create vacation');
        }
    }

    return (

        <div className='NewVacation'>
            <h3> Add Vacation</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='new-vacation-form'>

                <label>Destination</label>
                <textarea {...register('destination')} />
                <div className='formError'>{errors.destination?.message}</div>

                <label>Description</label>
                <textarea {...register('description')} />
                <div className='formError'>  {errors.description?.message} </div>

                <label>Start time</label>
                <input type='datetime-local' {...register('startTime')} />
                <div className='formError'>{errors.startTime?.message}</div>

                <label>End time</label>
                <input type='datetime-local' {...register('endTime')} />
                <div className='formError'>{errors.endTime?.message}</div>

                <label>Price</label>
                <input type='number' {...register('price', { valueAsNumber: true })} />
                <div className='formError'>{errors.price?.message}</div>

                <label> Image </label>
                <input
                    type="file"
                    accept="image/*"
                    {...register('image'
                        , {
                        required: 'Image is required',
                        validate: {
                            fileType: (file: File | null | undefined) => {
                                if (!file) return 'Image is required';
                                return ['image/jpeg', 'image/png'].includes(file.type) || 'Only JPEG or PNG allowed';
                            }
                        }
                    }
                )}
                    onChange={previewImage}
                />
                {preview && <img src={preview} style={{ width: 200, marginTop: 10 }} />}

                <div className='formError'>{errors.image?.message}</div>

                {/* <input type="file" accept="image/*" {...register('image')} onChange={previewImage} />
                {preview && <img src={preview} style={{ width: 200, marginTop: 10 }} />}
                <div className='formError'>{errors.image?.message}</div> */}

                <SpinnerButton
                    buttonText='Add Vacation'
                    loadingText='adding vacation...'
                    isSubmitting={isSubmitting}
                />

                <button type='button' onClick={() => reset()}> Reset </button>

            </form>
        </div>
    );
}