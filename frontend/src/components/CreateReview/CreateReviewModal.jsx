import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegStar } from 'react-icons/fa';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviews';


function NewReviewModal() {

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [button, setButton] = useState(false);

    useEffect(() => {
      if (rating === 0 || reviewText.length < 10) {
        return setButton(true)
      } else {
        setButton(false)
      }
    })

    const handleSubmit = (e) => {
      e.preventDefault()

      // Validation

      if(reviewText.length < 10 || !rating) {
        return;
      }

      // Dispatch action to submit review

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
