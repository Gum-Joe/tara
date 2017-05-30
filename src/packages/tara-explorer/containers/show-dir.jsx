/**
 * @overview Container for showd-dir component
 */
import { connect } from "react-redux";
import ShowDir from "../components/show-dir";

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ShowDir);
