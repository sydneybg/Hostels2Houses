function NewReviewForm() {

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(null);

    const handleSubmit = () => {

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
