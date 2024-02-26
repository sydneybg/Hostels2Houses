import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegStar } from 'react-icons/fa';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviews';
import { useSelector } from 'react-redux';



function RatingInput({rating, setRating}){
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      <label>Stars</label>
      {stars.map(star => (
        <FaRegStar
          key={star}
          size={32}
          color={rating >= star ? "yellow" : "grey"}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}


function NewReviewModal() {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);

const path = window.location.pathname

const spotId = path.split('/')[2]
  const sessionUser = useSelector((state) => state.session.user);


    useEffect(() => {

      if (rating === 0 || reviewText.length < 10) {
        return setDisabled(true)

      } else {
        setDisabled(false)
      }
    }, [rating, reviewText])

    const handleSubmit = (e) => {
      e.preventDefault()
      setErrors({});

      if(!rating) {
        return setErrors({rating: 'Please provide a star rating'})
      }

      if(reviewText.length < 10) {
        return setErrors({review: 'Review text must be greater than ten characters'})
      }

      dispatch(createReview({
        review: reviewText,
        stars: rating,
        spotId: spotId,
        user: sessionUser
      }))
      .then(closeModal)
      .catch()
    };

    const isValid = Object.keys(errors).length === 0;



    return (
      <>
        <h2>How was your stay?</h2>
        {errors.review && <p>{errors.review}</p>}
        {errors.rating && <p>{errors.rating}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
        />

        <div>
          <label>Stars</label>
          <RatingInput
          rating={rating}
          setRating={setRating}
          />
        </div>

        <button disabled={!isValid} onClick={handleSubmit}>
          Submit Your Review
        </button>

      </>
    );

  }

  export default NewReviewModal;
