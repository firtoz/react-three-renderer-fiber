import {expect} from "chai";
import * as React from "react";
import * as Sinon from "sinon";
// tslint:disable-next-line
import ReactThreeRendererDescriptor from "../../../../src/core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";
import r3rReconcilerConfig from "../../../../src/core/renderer/reconciler/r3rReconcilerConfig";
import {mockConsole, testContainers} from "../../index";

class TestDescriptor extends ReactThreeRendererDescriptor {
  constructor() {
    super();

    this.hasSimpleProp("defaultValueWithInit").withDefault("has-default");
    this.hasSimpleProp("defaultValueWithoutInit", false).withDefault("has-default");

    this.hasPropGroup(["groupedOne", "groupedTwo"], (instance: any, newValue: {
      "groupedOne": string,
      "groupedTwo": string,
    }) => {
      instance.groupedOne = newValue.groupedOne;
      instance.groupedTwo = newValue.groupedTwo;
    }).withDefault({
      groupedOne: "got a default for one",
      groupedTwo: "got a default for two",
    });

    this.hasPropGroup(["secondGroupedOne", "secondGroupedTwo"], (instance: any, newValue: {
      "secondGroupedOne": string,
      "secondGroupedTwo": string,
    }) => {
      instance.secondGroupedOne = newValue.secondGroupedOne;
      instance.secondGroupedTwo = newValue.secondGroupedTwo;
    });
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return {
      defaultValueWithInit: "before-setting",
      defaultValueWithoutInit: "before-setting",
      groupedOne: "grp-one",
      groupedOneNoInit: "grp-one",
      groupedTwo: "grp-two",
      groupedTwoNoInit: "grp-two",
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      test: any;
    }
  }
}

const hostDescriptors: Map<string, ReactThreeRendererDescriptor> = (r3rReconcilerConfig as any).hostDescriptors;

describe("with default values", () => {
  before("set test descriptor", () => {
    hostDescriptors.set("test", new TestDescriptor());
  });

  after("set test descriptor", () => {
    hostDescriptors.delete("test");
  });

  it("should not be used for initial render unless specified", () => {
    const testRef = Sinon.spy();

    ReactThreeRenderer.render(<test
      ref={testRef}
    />, testContainers.object3D);

    expect(testRef.lastCall.args[0].defaultValueWithoutInit).to.equal("before-setting");

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should be used for updates if specified", () => {
    const testRef = Sinon.spy();

    ReactThreeRenderer.render(<test
      ref={testRef}
    />, testContainers.object3D);

    expect(testRef.lastCall.args[0].defaultValueWithInit).to.equal("has-default");

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should work for grouped property updates", () => {
    const testRef = Sinon.spy();

    ReactThreeRenderer.render(<test
      ref={testRef}
    />, testContainers.object3D);

    expect(testRef.lastCall.args[0].groupedOne).to.equal("got a default for one");
    expect(testRef.lastCall.args[0].groupedTwo).to.equal("got a default for two");

    ReactThreeRenderer.unmountComponentAtNode(testContainers.object3D);
  });

  it("should give a warning if a grouped update does not contain defaults for all properties", () => {
    class TestDescriptorWithBadDefaults extends ReactThreeRendererDescriptor {
      constructor() {
        super();

        this.hasPropGroup(["groupedOne", "groupedTwo"], (instance: any, newValue: {
          "groupedOne": string,
          "groupedTwo": string,
        }) => {
          instance.groupedOne = newValue.groupedOne;
          instance.groupedTwo = newValue.groupedTwo;
        }).withDefault({
          groupedOne: "got a default for one",
        } as any);
      }

      public createInstance(props: any, rootContainerInstance: any): any {
        return {
          defaultValueWithInit: "before-setting",
          defaultValueWithoutInit: "before-setting",
          groupedOne: "grp-one",
          groupedOneNoInit: "grp-one",
          groupedTwo: "grp-two",
          groupedTwoNoInit: "grp-two",
        };
      }
    }

    mockConsole.expectWarnDev("TestDescriptorWithBadDefaults is" +
      " declaring a property group with properties [" +
      "\"groupedOne\", \"groupedTwo\"" +
      "] with default values, but is missing" +
      " the default values for [\"groupedTwo\"].");

    hostDescriptors.set("test2", new TestDescriptorWithBadDefaults());

    hostDescriptors.delete("test2");
  });
});
