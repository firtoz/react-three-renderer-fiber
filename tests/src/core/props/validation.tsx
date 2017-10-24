import {expect} from "chai";
import * as PropTypes from "prop-types";
import * as React from "react";
import hostDescriptors from "../../../../src/core/hostDescriptors";
import {ReactThreeRendererDescriptor} from "../../../../src/core/hostDescriptors/common/ReactThreeRendererDescriptor";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";
import {mockConsole, testContainers} from "../../index";

class TestDescriptor extends ReactThreeRendererDescriptor {
  constructor() {
    super();

    this.hasSimpleProp("numberValue").withType(PropTypes.number);
    this.hasSimpleProp("requiredNumberValue").withType(PropTypes.number.isRequired);
    this.hasSimpleProp("stringValue").withType(PropTypes.string);

    this.hasPropGroup([
      "groupNumberValue",
      "requiredGroupStringValue",
    ], () => {
      // no-op
    }).withTypes({
      groupNumberValue: PropTypes.number,
      requiredGroupStringValue: PropTypes.string.isRequired,
    });
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return {};
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      test: any;
    }
  }
}

describe("validation", () => {
  before("set test descriptor", () => {
    hostDescriptors.test = new TestDescriptor();
  });

  after("set test descriptor", () => {
    delete hostDescriptors.test;
  });

  it("should give warnings for incorrect types of values", () => {
    mockConsole.expectErrorDev(
      "Warning: Failed prop type:" +
      " Invalid prop `numberValue` of" +
      " type `string` supplied to `test`, expected `number`.\n    in test");

    ReactThreeRenderer.render(<test
      numberValue={"string-value"}
      requiredNumberValue={5}
      requiredGroupStringValue="a"
    />, testContainers.object3D);

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should give warnings for required types when values are missing", () => {
    mockConsole.expectErrorDev(
      "Warning: Failed prop type:" +
      " The prop `requiredNumberValue`" +
      " is marked as required in `test`," +
      " but its value is `undefined`.\n    in test");

    ReactThreeRenderer.render(<test
      requiredGroupStringValue="a"
    />, testContainers.object3D);

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should give warnings for incorrect types in groups", () => {
    mockConsole.expectErrorDev(
      "Warning: Failed prop type:" +
      " Invalid prop `groupNumberValue` of" +
      " type `string` supplied to `test`, expected `number`.\n    in test");

    ReactThreeRenderer.render(<test
      requiredNumberValue={5}
      groupNumberValue="string value"
      requiredGroupStringValue="a"
    />, testContainers.object3D);

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should give warnings for required types when values are missing in groups", () => {
    mockConsole.expectErrorDev(
      "Warning: Failed prop type:" +
      " The prop `requiredGroupStringValue`" +
      " is marked as required in `test`," +
      " but its value is `undefined`.\n    in test");

    ReactThreeRenderer.render(<test
      requiredNumberValue={5}
    />, testContainers.object3D);

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should give no warnings when everything is right", () => {
    ReactThreeRenderer.render(<test
      numberValue={10}
      requiredNumberValue={5}
      groupNumberValue={15}
      requiredGroupStringValue="a"
    />, testContainers.object3D);

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should throw an error when a group is missing types for some fields", () => {
    class BadTestDescriptor extends ReactThreeRendererDescriptor {
      constructor() {
        super();

        this.hasPropGroup([
          "groupNumberValue",
          "requiredGroupStringValue",
        ], () => {
          // no-op
        }).withTypes({
          groupNumberValueWithTypo: PropTypes.number,
          requiredGroupStringValue: PropTypes.string.isRequired,
        });
      }

      public createInstance(props: any, rootContainerInstance: any): any {
        return {};
      }
    }

    expect(() => {
      console.log(new BadTestDescriptor());
    }).to.throw(`Property group for ["groupNumberValue", "requiredGroupStringValue"] has mismatching types:
Found property type for unknown property "groupNumberValueWithTypo"
Missing type for property "groupNumberValue"`);
  });
});
