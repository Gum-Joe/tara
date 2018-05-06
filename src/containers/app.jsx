/**
 * @overview Container for app
 */
import { connect } from "react-redux";
import Tara from "../components/app.jsx";

const mapStateToProps = (state) => {
  return state;
};

export const App = connect(mapStateToProps)(Tara); // eslint-disable-line import/prefer-default-export
