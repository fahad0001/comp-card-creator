import {connect} from 'react-redux';
import {getDataUpload} from "./step-three.actions";
import StepThree from "./StepThree";

const mapStateToProps = reducers => ({
    dataUploadInfo: reducers.dataUpload.dataUploadInfo
});
const mapDispatchToProps = dispatch => ({
    getDataUpload: (data) => dispatch(getDataUpload(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(StepThree);
