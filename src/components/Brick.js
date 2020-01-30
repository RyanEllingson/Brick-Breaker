import React from "react";

export default function Brick({ style }) {
    return (
        <div
            style={{
                position: "absolute",
                width: "100px",
                height: "25px",
                background: "salmon",
                border: "2px solid #333",
                ...style
            }}
        />
    );
}