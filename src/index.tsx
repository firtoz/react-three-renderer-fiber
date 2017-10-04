import * as React from "react";
import * as ReactDOM from "react-dom";
import Simple from "../examples/simple";

// import r3r from './core/r3r';
//
// import {Hello} from "./components/Hello";
//
// ReactDOM.render(
//     <Hello
//         compiler="TypeScript"
//         framework="React"
//     />,
//     document.getElementById("example")
// );
// import React from 'react';
// import ReactDOM from 'react-dom';

ReactDOM.render(<Simple
  width={800}
  height={600}
/>, document.getElementById("example"));

// console.log(r3r);
