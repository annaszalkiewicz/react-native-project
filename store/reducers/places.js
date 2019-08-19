import { Dimensions } from 'react-native';
import PlaceholderImage from "../../assets/placeholder-image.jpg";
// import {
//   ADD_PLACE,
//   DELETE_PLACE,
//   SELECT_PLACE,
//   DESELECT_PLACE
// } from "../actions/actionsTypes";
import { SET_PLACES, REMOVE_PLACE, UPDATE_MODE, PLACE_ADDED, START_ADD_PLACE} from "../actions/actionsTypes";

const initialState = {
  places: [],
  viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
  placeAdded: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return {
        ...state,
        places: action.places
      }

    case START_ADD_PLACE:
      return {
        ...state,
        placeAdded: false
      }
      
    case PLACE_ADDED:
      return {
        ...state,
        placeAdded: true
      }
    // case ADD_PLACE:
    //   return {
    //     ...state,
    //     places: state.places.concat({
    //       key: Math.random().toString(),
    //       name: action.name,
    //       image: {
    //         uri: action.image.uri
    //       },
    //       location: action.location
    //     })
    //   };

    case REMOVE_PLACE:
      return {
        ...state,
        places: state.places.filter(place => {
          return place.key !== action.key;
        }),
      };

    case UPDATE_MODE:
      return {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape'
      };

    // case SELECT_PLACE:
    //   return {
    //     ...state,
    //     selectedPlace: state.places.find(place => {
    //       return place.key === action.key;
    //     })
    //   };

    // case DESELECT_PLACE:
    //   return {
    //     ...state,
    //     selectedPlace: null
    //   };

    default:
      return state;
  }
};

export default reducer;
