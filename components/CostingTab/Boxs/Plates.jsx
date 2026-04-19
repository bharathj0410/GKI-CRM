import React from "react";

const Plates = ({ labelC, labelD }) => {
  return (
    <div className="w-[70rem] pt-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3292.72 1847.11">
        <defs>
          <style>
            {`
      .cls-1, .cls-3 {
        fill: none;
        stroke-linejoin: round;
        stroke-width: 2px;
      }

      .cls-1 {
        stroke: blue;
      }

      .cls-2 {
        font-size: 45px;
        fill: blue;
        font-family: Arial-BoldMT, Arial;
        font-weight: 700;
        text-align: center;
      }

      .cls-3 {
        stroke: #000;
      }`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <line className="cls-1" x1="1" y1="155.57" x2="1" y2="15.89" />
            <line className="cls-1" x1="41.36" y1="16.25" x2="1" y2="24.99" />
            <line className="cls-1" x1="41.36" y1="33.73" x2="1" y2="24.99" />
            <line className="cls-1" x1="1428.89" y1="24.99" x2="1" y2="24.99" />
            <text
              className="cls-2"
              transform="translate(1513.16 42.19) scale(1.01 1.09)"
            >
              {labelC}
            </text>
            <line
              className="cls-1"
              x1="3042.22"
              y1="33.73"
              x2="3082.58"
              y2="24.99"
            />
            <line
              className="cls-1"
              x1="3042.22"
              y1="16.25"
              x2="3082.58"
              y2="24.99"
            />
            <line
              className="cls-1"
              x1="1624.97"
              y1="24.99"
              x2="3082.58"
              y2="24.99"
            />
            <line
              className="cls-1"
              x1="3082.58"
              y1="15.89"
              x2="3082.58"
              y2="155.57"
            />
            <line
              className="cls-1"
              x1="3100.92"
              y1="173.78"
              x2="3186.22"
              y2="173.78"
            />
            <line
              className="cls-1"
              x1="3185.85"
              y1="213.83"
              x2="3177.05"
              y2="173.78"
            />
            <line
              className="cls-1"
              x1="3168.24"
              y1="213.83"
              x2="3177.05"
              y2="173.78"
            />
            <line
              className="cls-1"
              x1="3177.05"
              y1="940.23"
              x2="3177.05"
              y2="173.78"
            />
            <text
              className="cls-2"
              transform="translate(3159.97 1027.15) scale(1.01 1.09)"
            >
              {labelD}
            </text>
            <line
              className="cls-1"
              x1="3168.24"
              y1="1806.06"
              x2="3177.05"
              y2="1846.11"
            />
            <line
              className="cls-1"
              x1="3185.85"
              y1="1806.06"
              x2="3177.05"
              y2="1846.11"
            />
            <line
              className="cls-1"
              x1="3177.05"
              y1="1066.87"
              x2="3177.05"
              y2="1846.11"
            />
            <line
              className="cls-1"
              x1="3186.22"
              y1="1846.11"
              x2="3100.92"
              y2="1846.11"
            />
            <polyline
              className="cls-3"
              points="3082.58 173.78 3082.58 1846.11 1782.54 1846.11"
            />
            <line className="cls-3" x1="1" y1="1846.11" x2="1" y2="173.78" />
            <line
              className="cls-3"
              x1="1301.04"
              y1="1846.11"
              x2="1"
              y2="1846.11"
            />
            <line
              className="cls-3"
              x1="1802.32"
              y1="1846.11"
              x2="1301.04"
              y2="1846.11"
            />
            <line
              className="cls-3"
              x1="3082.58"
              y1="173.78"
              x2="1"
              y2="173.78"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Plates;
