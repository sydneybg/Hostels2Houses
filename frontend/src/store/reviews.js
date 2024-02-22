import { csrfFetch } from "./csrf";

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';


export const loadReviews = (reviews, spotId) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
    spotId
  };
};

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`api/spots/${spotId}/reviews`)

    // console.log(response, 'RESPOONSE response')

    if(response.ok) {
        const spotReviews = await response.json()
        return dispatch(loadReviews(spotReviews, spotId))
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
        default:
            return state
    }

}

export default reviewsReducer;
