import { csrfFetch } from "./csrf";
import { createAction } from 'redux-actions';

const loadReviews = createAction(LOAD_REVIEWS, (reviews, spotId) => ({
  reviews,
  spotId
}));

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`api/spots/${spotId}/reviews`)

    console.log(response, 'response')

    if(response.ok) {
        const spotReviews = await response.json()
        return dispatch(loadReviews(spotReviews, spotId))
    }

}


const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const allSpotReviews = {}
        }
        return allSpotReviews
    }
    return state 
}
