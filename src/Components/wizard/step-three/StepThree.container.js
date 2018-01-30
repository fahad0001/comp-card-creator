import {connect} from 'react-redux';
import {uploadData, uploadImages} from "./step-three.actions";
import StepThree from "./StepThree";

const mapStateToProps = reducers => ({
    dataUploadInfo: reducers.dataUpload.dataUploadInfo,
    imageUploadInfo: reducers.dataUpload.imageUploadInfo
});
const mapDispatchToProps = dispatch => ({
    uploadData: (data) => dispatch(uploadData(data)),
    uploadImages: (imageData) => dispatch(uploadImages(imageData))
});
export default connect(mapStateToProps, mapDispatchToProps)(StepThree);
