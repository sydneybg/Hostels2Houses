import { csrfFetch } from './csrf';

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const ADD_REVIEW = 'reviews/ADD_REVIEW';


export const loadReviews = (reviews, spotId) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
    spotId
  };
};

export const addReview = (review, User) => ({
    type: ADD_REVIEW,
    payload: {...review, User}
})

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok) {
        const spotReviews = await response.json()
        return dispatch(loadReviews(spotReviews.Reviews, spotId))
    }
}

export const createReview = ({ spotId, review, stars, user }) => async (dispatch) => {
console.log('create review')
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            review: review,
            stars: stars
        })
    })
    if (response.ok) {
        const review = await response.json();
        dispatch(addReview(review, user));
      }
}

const reviewsReducer = (state = {}, action) => {
    let allSpotReviews;
    switch (action.type) {
        case LOAD_REVIEWS:
        allSpotReviews = {
            ...state,
            [action.spotId]: action.reviews
        };

        return allSpotReviews;

        case ADD_REVIEW: {
            let copyOfState = {...state};
            copyOfState[action.payload.spotId] = copyOfState[action.payload.spotId] || []
            copyOfState[action.payload.spotId].push(action.payload)
            return copyOfState;
        }


        default:
            return state
    }

}

export default reviewsReducer;
