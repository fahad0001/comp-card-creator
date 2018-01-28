import {combineReducers} from 'redux';
import {dataUpload} from "./wizard/step-three/step-three.reducers";

const store =  combineReducers({
    dataUpload
});
export default store;
