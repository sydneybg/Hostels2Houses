import { useState } from "react";
import { createSpot } from "../../store/spots";
import { useNavigate } from 'react-router-dom';

// import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";



function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [images, setImages] = useState([]);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);


  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsObj = {};

    if (!country) errorsObj.country = "Country is required";

    if (!streetAddress) errorsObj.streetAddress = "Street Address is required";

    if (!city) errorsObj.city = "City is required";

    if (!state) errorsObj.state = "State is required";

    if (description.length < 30) {
        errorsObj.description = "Description must be at least 30 characters";
    }

    if (!title) {
        errorsObj.title = "Title is required";
    }

    if (!price) {
        errorsObj.price = "Price per night is required";
    }

    if (!images) {
        errorsObj.images = "Preview Image URL is required";
    }
    console.log(errorsObj)
    setErrors(errorsObj);

    if (Object.keys(errorsObj).length === 0) {
      return dispatch(createSpot({
        address: streetAddress,
        city,
        state,
        country,
        lat,
        lng,
        name: title,
        description,
        price
}))
      .then(data => navigate(`/spots/${data.id}`))
      .catch(async (res) => {
        const data = await res.json();
      });
      }
  };

  //useParams to get the spotId and then create the new route

  return (
    <>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <h2>Where is your place located?</h2>
        <caption>
          Guests will only get your exact address once they booked a
          reservation.
        </caption>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        {errors.country && <p>{errors.country}</p>}

        <label>
          Street Address
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
        </label>
        {errors.streetAddress && <p>{errors.streetAddress}</p>}

        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        {errors.city && <p>{errors.city}</p>}

        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        {errors.state && <p>{errors.state}</p>}

        <label>
          Lat
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        {errors.lat && <p>{errors.lat}</p>}

        <label>
          Lng
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
        {errors.lng && <p>{errors.lng}</p>}

        <h2>Describe your place to guests</h2>
        <caption>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </caption>
        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"></textarea>
        {errors.description && <p>{errors.description}</p>}

        <h2>Create a title for your spot</h2>
        <p>
          Catch guests&#39; attention with a spot title that highlights what makes
          your place special.
        </p>

        <input
          placeholder="Name of your spot"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p>{errors.title}</p>}

        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>

        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p>{errors.price}</p>}

        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>

        <input
          placeholder="Preview Image URL"
          value={images}
          onChange={(e) => setImages(e.target.value)}

        />

        <button>Create Spot</button>
      </form>
    </>
  );
}

export default CreateSpotForm;
