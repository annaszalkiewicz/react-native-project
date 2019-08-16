import { combineReducers } from 'redux';

import places from './places';
import uiReducer from './uiReducer';
import authReducer from './auth';

const rootReducer = combineReducers({ places, uiReducer, auth: authReducer });

export default rootReducer;