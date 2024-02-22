import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function CreateSpotForm() {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [country, setCountry] = useState('');const [state, setState] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsObj = {}
        if(!country) errorsObj.country = "Country is required"
        setErrors(errorsObj)
    }

    return (
        <>
        <h1>Create a New Spot</h1>
        <form onSubmit={handleSubmit}>
            <h2>Where's your place located?</h2>
            <caption>Guests will only get your exact address once they booked a reservation.</caption>
            <label>Country
                <input
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}

                />
            </label>
            {errors.country && (<p>{errors.country}</p>)}

            <label>Street Address
                <input
                type='text'
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                />
            </label>
            <label>City
            <input
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />
            </label>
            <label>State
                <input
                type='text'
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label>

            <h2>Describe your place to guests</h2>
            <caption>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</caption>
            <textarea placeholder='Please write at least 30 characters'></textarea>

        <button>Create Spot</button>
        </form>

    <div>CreateSpotForm</div>
    </>
    )
}

export default CreateSpotForm;
