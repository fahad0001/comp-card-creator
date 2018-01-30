import {
    REQUEST_DATA_UPLOAD,
    RECEIVE_DATA_UPLOAD,
    ERROR_DATA_UPLOAD,
    REQUEST_IMAGE_UPLOAD,
    RECEIVE_IMAGE_UPLOAD,
    ERROR_IMAGE_UPLOAD
} from './step-three.actions';

let defaultState = {
    dataUploadInfo: {
        data: [],
        isFetching: false,
        error: ''
    },
    imageUploadInfo: {
        imgData: [],
        isFetching: false,
        error: ''
    }
};

export function dataUpload(state = defaultState, action = {}){
    let newState = {};

    switch (action.type) {

        //Section for Data Upload
        case REQUEST_DATA_UPLOAD:
            newState = {
                data: [],
                isFetching: action.isFetching,
                error: ''
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        case RECEIVE_DATA_UPLOAD:
            newState = {
                data: action.data,
                isFetching: action.isFetching,
                error: ''
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        case ERROR_DATA_UPLOAD:
            newState = {
                data: [],
                isFetching: false,
                error: action.error
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        //Section for Image Upload
        case REQUEST_IMAGE_UPLOAD:
            newState = {
                imgData: [],
                isFetching: action.isFetching,
                error: ''
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        case RECEIVE_IMAGE_UPLOAD:
            newState = {
                imgData: action.imgData,
                isFetching: action.isFetching,
                error: ''
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        case ERROR_IMAGE_UPLOAD:
            newState = {
                imgData: [],
                isFetching: false,
                error: action.error
            };
            return Object.assign({}, state, {dataUploadInfo: newState});

        default:
            return state;
    }
}
