import * as React from "react";
import * as ReactDOM from "react-dom";

import {Provider} from "react-redux";
import store from "./redux/store";

import App from "./app";

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("app"));

if (typeof module.hot !== "undefined") module.hot.accept();
