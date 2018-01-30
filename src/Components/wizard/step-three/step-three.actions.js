import {apiDataUpload} from "../../common/api";

export const REQUEST_DATA_UPLOAD = 'REQUEST_DATA_UPLOAD';
export const RECEIVE_DATA_UPLOAD = 'RECEIVE_DATA_UPLOAD';
export const ERROR_DATA_UPLOAD = 'ERROR_DATA_UPLOAD';

export const REQUEST_IMAGE_UPLOAD = 'REQUEST_IMAGE_UPLOAD';
export const RECEIVE_IMAGE_UPLOAD = 'RECEIVE_IMAGE_UPLOAD';
export const ERROR_IMAGE_UPLOAD = 'ERROR_IMAGE_UPLOAD';

//functions Data Upload
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

//functions Image Upload
function _requestImageUpload(status) {
    return {
        type: REQUEST_IMAGE_UPLOAD,
        isFetching: status
    }
}
function _receiveImageUpload(imgData, status) {
    return {
        type: RECEIVE_IMAGE_UPLOAD,
        imgData,
        isFetching: status
    }
}
function _errorImageUpload(error) {
    return {
        type: ERROR_IMAGE_UPLOAD,
        error
    }
}

export function uploadImages(imageData) {
    return dispatch => {
        dispatch(_requestImageUpload(true));
        apiDataUpload('/api/uploadFinalImage', imageData)
            .then(response =>{
                dispatch(_receiveImageUpload(response.data, false));
            })
            .catch(err => {
                dispatch(_errorImageUpload(err));
            })
    };
}

export function uploadData(data){
    return dispatch => {
        dispatch(_requestDataUpload(true));
        apiDataUpload('/api/uploadFinalData', data)
            .then(response => {
                dispatch(_receiveDataUpload(response.data, false));
            })
            .catch(err => {
                dispatch(_errorDataUpload(err));
            })
    };
}
