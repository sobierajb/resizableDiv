import React, { FunctionComponent } from "react";
interface IResizable extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
    lockResize?: boolean;
    edgeSize?: number;
}
declare const Resizable: FunctionComponent<IResizable>;
export default Resizable;
