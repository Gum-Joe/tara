/**
 * @overview Container for app
 */
import { connect } from "react-redux";
import ThemeComponent from "../components/theme";

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ThemeComponent); // eslint-disable-line import/prefer-default-export
