import dirtyChai = require("dirty-chai");
import * as React from "react";
import * as sinon from "sinon";
import {BoxGeometry} from "three";
import {IPropsWithChildren} from "../../../src/core/renderer/hostDescriptors/common/IPropsWithChildren";
import ResourceContainer from "../../../src/extensions/resources/ResourceContainer";
import ResourceRenderer from "../../../src/extensions/resources/ResourcesRenderer";
import {mockConsole} from "../index";
import "../utils/dirty-chai-wrapper";

const resourceRenderer = new ResourceRenderer();
// export default new ReactThreeRenderer(r3rReconcilerConfig);

chai.use(dirtyChai);

// tslint:disable-next-line no-empty-interface
export interface IResourcesProps extends IPropsWithChildren {

}

describe("ResourceRenderer", () => {
  it("returns a ResourceContainer", (done) => {
    const container = {};

    const resourcesRef = sinon.spy();

    const resourceContainer = resourceRenderer.render(<resources ref={resourcesRef}/>, container);

    chai.expect(resourceContainer).to.be.instanceOf(ResourceContainer);
    chai.expect(resourceContainer).to.equal(resourcesRef.lastCall.args[0]);

    resourceRenderer.unmountComponentAtNode(container, () => {
      done();
    });
  });

  it("can render resources", (done) => {
    const container = {};

    const resourcesRef = sinon.spy();
    const geometryRef = sinon.spy();

    const resourceContainer = resourceRenderer.render(<resources ref={resourcesRef}>
      <boxGeometry
        resource-id="hey"
        width={20}
        height={20}
        depth={20}
        ref={geometryRef}/>
    </resources>, container);

    const geometry = geometryRef.lastCall.args[0];

    if (geometry == null) {
      return;
    }

    chai.expect(geometry).to.be.instanceOf(BoxGeometry);
    chai.expect(resourceContainer).to.equal(resourcesRef.lastCall.args[0]);
    chai.expect(ResourceContainer.GetContainerForResource(geometry)).to.equal(resourcesRef.lastCall.args[0]);
    chai.expect(resourceContainer.get("hey")).to.equal(geometry);

    resourceRenderer.unmountComponentAtNode(container, () => {
      chai.expect(geometryRef.lastCall.args[0]).to.be.null("");
      done();
    });
  });

  it("should complain if multiple resources use same key", (done) => {
    const container = {};

    resourceRenderer.render(<resources>
      <boxGeometry
        resource-id="hey"
        width={20}
        height={20}
        depth={20}/>
      <meshBasicMaterial
        resource-id="hey"
      />
    </resources>, container);

    mockConsole.expectError("The resource with the resource ID 'hey' is already defined.");

    resourceRenderer.render(<resources/>, container);

    resourceRenderer.unmountComponentAtNode(container, () => {
      done();
    });
  });

  it("can unmount resources", (done) => {
    const container = {};

    const geometryRef = sinon.spy();

    const resourceContainer: ResourceContainer = resourceRenderer.render(<resources>
      <boxGeometry
        resource-id="hey"
        width={20}
        height={20}
        depth={20}
        ref={geometryRef}/>
    </resources>, container);

    // remove the geometry

    resourceRenderer.render(<resources/>, container);

    chai.expect(geometryRef.callCount).to.equal(2);
    chai.expect(geometryRef.lastCall.args[0]).to.be.null("");
    chai.expect(resourceContainer.get("hey")).to.be.undefined("");

    // chai.expect(resourceContainer).to.equal(resourcesRef.lastCall.args[0]);
    // chai.expect(GetResourceContainer(geometry)).to.equal(resourcesRef.lastCall.args[0]);
    // chai.expect(resourceContainer.get("hey")).to.equal(geometry);

    resourceRenderer.unmountComponentAtNode(container, () => {
      chai.expect(geometryRef.lastCall.args[0]).to.be.null("");
      done();
    });
  });

  it("can mount to children", (done) => {
    const container = {};

    // const geometryRef = sinon.spy();

    const resourceContainer: ResourceContainer = resourceRenderer.render(<resources>
      <resources>
        <boxGeometry
          resource-id="hey"
          width={20}
          height={20}
          depth={20}/>
      </resources>
      <resources>
        <boxGeometry
          resource-id="yo"
          width={20}
          height={20}
          depth={20}/>
        <resources>
          <boxGeometry
            resource-id="nesting"
            width={20}
            height={20}
            depth={20}/>
        </resources>
      </resources>
    </resources>, container);

    // remove the geometry

    // resourceRenderer.render(<resources/>, container);

    // chai.expect(geometryRef.callCount).to.equal(2);
    // chai.expect(geometryRef.lastCall.args[0]).to.be.null();
    chai.expect(resourceContainer.get("hey")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("yo")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting")).not.to.be.undefined("");

    resourceRenderer.render(<resources>
      <resources>
        <boxGeometry
          resource-id="hey"
          width={20}
          height={20}
          depth={20}/>
      </resources>
      <resources>
        <boxGeometry
          resource-id="yo"
          width={20}
          height={20}
          depth={20}/>
        <resources>
          <boxGeometry
            resource-id="nesting"
            width={20}
            height={20}
            depth={20}/>
          <boxGeometry
            resource-id="nesting 2"
            width={20}
            height={20}
            depth={20}/>
        </resources>
      </resources>
    </resources>, container);

    chai.expect(resourceContainer.get("hey")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("yo")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting 2")).not.to.be.undefined("");

    resourceRenderer.render(<resources>
      <resources>
        <boxGeometry
          resource-id="hey"
          width={20}
          height={20}
          depth={20}/>
      </resources>
      <resources>
        <boxGeometry
          resource-id="yo"
          width={20}
          height={20}
          depth={20}/>
      </resources>
    </resources>, container);

    chai.expect(resourceContainer.get("hey")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("yo")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting")).to.be.undefined("");
    chai.expect(resourceContainer.get("nesting 2")).to.be.undefined("");

    resourceRenderer.render(<resources>
      <resources>
        <boxGeometry
          resource-id="hey"
          width={20}
          height={20}
          depth={20}/>
      </resources>
      <resources>
        <boxGeometry
          resource-id="yo"
          width={20}
          height={20}
          depth={20}/>
        <resources>
          <boxGeometry
            resource-id="nesting"
            width={20}
            height={20}
            depth={20}/>
          <resources>
            <resources>
              <boxGeometry
                resource-id="nesting 2"
                width={20}
                height={20}
                depth={20}/>
            </resources>
          </resources>
        </resources>
      </resources>
    </resources>, container);

    chai.expect(resourceContainer.get("hey")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("yo")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting 2")).not.to.be.undefined("");

    resourceRenderer.render(<resources>
      <resources>
        <boxGeometry
          resource-id="hey"
          width={20}
          height={20}
          depth={20}/>
      </resources>
      <resources>
        <boxGeometry
          resource-id="yo"
          width={20}
          height={20}
          depth={20}/>
        <resources>
          <resources>
            <resources>
              <boxGeometry
                resource-id="nesting 2"
                width={20}
                height={20}
                depth={20}/>
            </resources>
          </resources>
        </resources>
      </resources>
    </resources>, container);

    chai.expect(resourceContainer.get("hey")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("yo")).not.to.be.undefined("");
    chai.expect(resourceContainer.get("nesting")).to.be.undefined("");
    chai.expect(resourceContainer.get("nesting 2")).not.to.be.undefined("");

    // chai.expect(resourceContainer).to.equal(resourcesRef.lastCall.args[0]);
    // chai.expect(GetResourceContainer(geometry)).to.equal(resourcesRef.lastCall.args[0]);
    // chai.expect(resourceContainer.get("hey")).to.equal(geometry);

    resourceRenderer.unmountComponentAtNode(container, () => {
      //   chai.expect(geometryRef.lastCall.args[0]).to.be.null();
      done();
    });

  });
});
