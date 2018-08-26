import * as THREE from "three";
import React3, {ReactThreeRenderer} from "../../src";
import ResourceRenderer from "../../src/extensions/resources/ResourcesRenderer";

(global as any).React3 = React3;
(global as any).ReactThreeRenderer = ReactThreeRenderer;
(global as any).THREE = THREE;
(global as any).ResourceRenderer = ResourceRenderer;
