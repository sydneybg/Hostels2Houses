import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegStar } from 'react-icons/fa';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviews';


function NewReviewModal() {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);

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
        setErrors({review: 'Review text must be greater than ten characters'})
      }

      dispatchEvent(createReview({
        review: reviewText, //Correct direction? Should change all to just review?
        rating: rating,
        spotId: spotId
        //date?
      }))
      .then(closeModal)
    };

    return (
      <>
        <h2>How was your stay?</h2>
        {error && <p>{error}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
        />

        <div>
          <label>Stars</label>
          <StarRating
            value={rating}
            onChange={rate => setRating(rate)}
          />
        </div>

        <button disabled={!isValid} onClick={handleSubmit}>
          Submit Your Review
        </button>

      </>
    );

  }
