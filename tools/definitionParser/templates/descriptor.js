import * as THREE from "three";
import {<%=name%>} from "three";
import {WrappedEntityDescriptor, WrapperDetails} from "../../common/ObjectWrapper";

interface I<%=name%>Props extends IObject3DProps {
  <% _.forEach(parameters, function(param) { %><%= param.name %><%= param.required ? "" : "?" %>: <%= param.type %>; // <%= param.documentation %>
  <% }); %>
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      <%=camelName%>: IThreeElementPropsBase<<%=name%>> & I<%=name%>Props;
    }
  }
}

class <%=name%>Wrapper extends WrapperDetails<I<%=name%>Props,<%=name%>> {
  constructor(props: I<%=name%>Props) {
    super(props);
  }

  this.wrapObject(new <%=name%>(<% _.forEach(parameters, function(param) { %>props.<%= param.name %>,<% }); %>));
  }
}

class <%=name%>Descriptor extends WrappedEntityDescriptor<I<%=name%>Props,
  <%=name%>,
  <%=name%>Wrapper> {
    constructor() {
      super(<%=name%>Wrapper, <%=name%>);

      this.hasRemountProps(
        <% _.forEach(parameters, function(param) { %> "<%= param.name %>",<% }); %>
      );
    }
  }

export default <%=name%>Descriptor;
