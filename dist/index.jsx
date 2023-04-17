import React, { useEffect, useRef, useState, } from "react";
const Resizable = ({ children, lockResize, edgeSize = 5, ...atributes }) => {
    const mainElementRef = useRef(null);
    const [size, setSize] = useState();
    const [onBorder, setOnBorder] = useState({
        onLeft: false,
        onTop: false,
        onBottom: false,
        onRight: false
    });
    const [onMouseDown, setOnMouseDown] = useState(false);
    const [cursor, setCursor] = useState("auto");
    const [userSelect, setUserSelect] = useState("auto");
    const [style, setStyle] = useState({});
    function ifOnRight(event) {
        return event.pageX - event.currentTarget.offsetLeft >= event.currentTarget.offsetWidth - edgeSize;
    }
    function ifOnBottom(event) {
        return event.pageY - event.currentTarget.offsetTop >= event.currentTarget.offsetHeight - edgeSize;
    }
    function ifOnTop(event) {
        return event.pageY <= event.currentTarget.offsetTop + edgeSize;
    }
    function ifOnLeft(event) {
        return event.pageX <= event.currentTarget.offsetLeft + edgeSize;
    }
    function handleSetBorder(event) {
        if (!onMouseDown && !lockResize) {
            // /console.log("event", event)
            setOnBorder({
                onBottom: ifOnBottom(event),
                onRight: ifOnRight(event),
                onLeft: ifOnLeft(event),
                onTop: ifOnTop(event)
            });
        }
    }
    function handleMouseLeave() {
        if (!onMouseDown)
            setCursor('auto');
    }
    function handleMouseDown() {
        setOnMouseDown(true);
    }
    function handleMouseUp() {
        setCursor('auto');
        setUserSelect('auto');
        setOnMouseDown(false);
    }
    function handleMouseMove(event) {
        if (onMouseDown && size && (onBorder.onBottom || onBorder.onRight || onBorder.onTop || onBorder.onLeft)) {
            let newWidth = size.width;
            let newHeight = size.height;
            if (onBorder.onRight) {
                newWidth += event.movementX;
            }
            if (onBorder.onLeft) {
                newWidth -= event.movementX;
            }
            if (onBorder.onBottom) {
                newHeight += event.movementY;
            }
            if (onBorder.onTop) {
                newHeight -= event.movementY;
            }
            setUserSelect('none');
            setSize({ width: newWidth, height: newHeight });
        }
    }
    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [size, onMouseDown]);
    useEffect(() => {
        setStyle({
            ...atributes.style,
            width: size?.width,
            height: size?.height,
        });
    }, [size]);
    useEffect(() => {
        let cursor = 'auto';
        if (onBorder.onBottom)
            cursor = 's-resize';
        if (onBorder.onTop)
            cursor = 'n-resize';
        if (onBorder.onRight)
            cursor = 'e-resize';
        if (onBorder.onLeft)
            cursor = 'w-resize';
        if (onBorder.onBottom && onBorder.onRight)
            cursor = 'se-resize';
        if (onBorder.onTop && onBorder.onRight)
            cursor = 'ne-resize';
        if (onBorder.onTop && onBorder.onLeft)
            cursor = 'nw-resize';
        if (onBorder.onBottom && onBorder.onLeft)
            cursor = 'sw-resize';
        setCursor(cursor);
    }, [onBorder]);
    useEffect(() => {
        document.body.style.cursor = cursor;
    }, [cursor]);
    useEffect(() => {
        document.body.style.userSelect = userSelect;
    }, [userSelect]);
    useEffect(() => {
        if (mainElementRef.current) {
            setSize({
                width: mainElementRef.current.offsetWidth,
                height: mainElementRef.current.offsetHeight
            });
        }
    }, []);
    return (<div {...atributes} ref={mainElementRef} style={style} onMouseDown={(event) => {
            if (atributes.onMouseDown)
                atributes.onMouseDown(event);
            handleMouseDown();
        }} onMouseMove={(event) => {
            if (atributes.onMouseMove)
                atributes.onMouseMove(event);
            handleSetBorder(event);
        }} onMouseLeave={(event) => {
            if (atributes.onMouseLeave)
                atributes.onMouseLeave(event);
            handleMouseLeave();
        }}>
      {children}
    </div>);
};
export default Resizable;
//# sourceMappingURL=index.jsx.map