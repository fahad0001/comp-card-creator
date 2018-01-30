import {connect} from 'react-redux';
import {getDataUpload} from "./step-three.actions";
import StepThree from "./StepThree";

const mapStateToProps = reducers => ({
    dataUploadInfo: reducers.dataUpload.dataUploadInfo
});
const mapDispatchToProps = dispatch => ({
    uploadData: (data) => dispatch(uploadData(data)),
    uploadImages: (imageData) => dispatch(uploadImages(imageData))
});
export default connect(mapStateToProps, mapDispatchToProps)(StepThree);
