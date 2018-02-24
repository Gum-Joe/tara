/**
 * @overview Theme provider
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { updateTheme } from "../actions";
import compileTheme from "../renderer/boot/compile-theme";

export default class Theme extends Component {
   async componentDidMount() {
        // Setup theme
        const theme = await compileTheme();
        console.log(theme.html);
        this.props.dispatch(updateTheme({
            css: theme.css,
            html: theme.html,
        }));
    }

    render() {
        return (
            <div>
                <style>
                    { this.props.theme.css }
                </style>
                { this.props.theme.html ? <this.props.theme.html /> : <div />}
                { this.props.children }
            </div>
        );
    }
}

Theme.propTypes = {
    dispatch: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
};