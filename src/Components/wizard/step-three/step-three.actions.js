import {apiDataUpload} from "../../common/api";

export const REQUEST_DATA_UPLOAD = 'REQUEST_DATA_UPLOAD';
export const RECEIVE_DATA_UPLOAD = 'RECEIVE_DATA_UPLOAD';
export const ERROR_DATA_UPLOAD = 'ERROR_DATA_UPLOAD';

//functions dribble API
function _requestDataUpload(status) {
    return {
        type: REQUEST_DATA_UPLOAD,
        isFetching: status
    }
}
function _receiveDataUpload(data, status) {
    return {
        type: RECEIVE_DATA_UPLOAD,
        data,
        isFetching: status
    }
}
function _errorDataUpload(error) {
    return {
        type: ERROR_DATA_UPLOAD,
        error
    }
}

export function getDataUpload(data){
    return dispatch => {
        dispatch(_requestDataUpload(true));
        apiDataUpload('https://requestb.in/1b3by4k1', data)
            .then(response => {
                dispatch(_receiveDataUpload(data, false));
            })
            .catch(err => {
                dispatch(_errorDataUpload(err));
            })
    };
}
