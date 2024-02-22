import { csrfFetch } from "./csrf";
import { createAction } from 'redux-actions';


const loadSpots = createAction(LOAD_SPOTS, (spot)=> {
    return {
        type: LOAD_SPOTS,
        spots
    }
})

const loadOneSpot = createAction(GET_SPOT_DETAILS,(spot) => {
    return {
        type: GET_SPOT_DETAILS,
        spot
    }
})

const loadSpotImages = createAction(LOAD_SPOT_IMAGES, (spotImage, spotId) => {
    return {
        type: LOAD_SPOT_IMAGES,
        spotImage,
        spotId
    }
})



export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots")

    if(response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))
    }
}

export const getSpot = (spotId) =>  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if(response.ok) {
        const spot = await response.json();
        dispatch(loadOneSpot(spot))
    }
}

export const getReviews = (spotId) => async (dispatch) => {
    const reponse = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(reponse.ok){
        const review = await reponse.json();
        dispatch(loadOneSpot(review))
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(loadOneSpot(newSpot));
        return newSpot
    } else {
        const errors = await response.json();
        return errors;
    }
}

export const createSpotImage = (spotId, spotImage) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spotImage)
    })

    if (response.ok) {
        const newImage = await response.json();
        dispatch(loadSpotImages(newImage, spotId))
        return newImage
    } else {
        const errors = await response.json();
        return errors;
    }
}


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const spotsState = {}
            action.spots.Spots.forEach(spot => {
                spotsState[spot.id] = spot
            })
            return spotsState
        }
        case GET_SPOT_DETAILS : {
            const spotState = {};
            spotState[action.spot.id] = action.spot
            return spotState
        } case LOAD_SPOT_IMAGES : {
            return {...state, [action.spot.id]: action.spot}
        }
        default:
            return state
    }
}

export default spotsReducer;
