export type svgProps = {
  fill?: string
  stroke?: string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const currentColor = "currentColor"
const colorOrDefault = (color:string|undefined) => color || currentColor
const sizeToClass = (size:string|undefined) => size === undefined 
    ? 'w-10' : // undefined
    size === 'xs' ? 'w-4' :
    size === 'sm' ? 'w-8' :
    size === 'lg' ? 'w-16' :
    size === 'xl' ? 'w-32' :
    size === '2xl' ? 'w-64' :
    'w-10' // default or 'md'
const getClassName = (className = '', size='md') => className+' '+sizeToClass(size)

export const CyfrLogo = ({...props}:svgProps) => (
  <svg
    viewBox="0 0 11 10"
    fill={colorOrDefault(props.fill)}
    stroke={colorOrDefault(props.stroke)}
    strokeWidth={props.stroke ? 20 : 2}
    className={getClassName(props.className,props.size)}
  >
    <g id="layer1" transform="translate(-176.15202,-71.52597)">
      <g
        transform="matrix(0.00307684,0,0,0.00373848,173.2788,65.097667)"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 2674.3111,3861.5989 0.01,-245.8231 5.7168,-2.6221 c 11.3294,-5.1965 20.5964,-16.2117 24.4117,-29.0169 1.9878,-6.6713 1.9886,-19.9521 0,-26.6284 -5.0912,-17.1078 -20.7371,-30.8326 -38.7903,-34.0273 -21.6778,-3.8361 -44.4316,9.5406 -52.9168,31.1093 -2.9272,7.441 -3.5777,21.5031 -1.3449,29.0748 3.5902,12.1743 10.4426,21.237 20.8424,27.5652 l 5.5793,3.3949 v 245.9543 245.9544 l -11.6649,-0.2658 -11.665,-0.2658 -1.4001,-3.7855 c -0.7701,-2.082 -10.8027,-31.4672 -22.2949,-65.3005 -28.7603,-84.6717 -43.1665,-122.0408 -63.4819,-164.6707 -33.0381,-69.3269 -72.7559,-123.9843 -113.273,-155.8798 -15.0886,-11.8779 -37.5555,-25.5665 -53.4694,-32.578 -0.3267,-0.1439 73.8693,-851.4529 74.2488,-851.9153 0.1344,-0.1637 3.8525,2.2152 8.2624,5.2865 23.5496,16.4009 53.2281,33.3253 77.618,44.2621 108.5225,48.6635 210.578,40.5957 309.6,-24.4747 4.752,-3.1228 14.5436,-10.0523 21.7589,-15.3991 l 13.119,-9.7213 0.5735,4.4308 c 0.3154,2.437 18.484,189.8983 40.3747,416.5808 21.8907,226.6825 40.0227,413.6767 40.2935,415.5425 0.4861,3.3499 0.3988,3.4507 -6.9336,8.0101 -76.011,47.2637 -137.7368,137.6571 -195.7811,286.7082 -7.7922,20.0093 -20.1934,54.0353 -32.7678,89.9065 -9.0338,25.7709 -17.3512,49.0075 -18.8855,52.7608 -0.5735,1.4032 -1.9814,1.6562 -9.2143,1.6562 h -8.5373 l 0.01,-245.8231 z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 2637.8212,2767.706 c -38.2835,-3.6687 -66.9259,-12.177 -97.44,-28.9445 -40.9364,-22.4945 -76.3498,-59.5339 -96.9864,-101.439 -17.9595,-36.4689 -25.4646,-71.3203 -24.1677,-112.2266 1.1106,-35.0244 8.0883,-63.0615 23.6833,-95.1606 24.3058,-50.0287 69.6301,-92.6157 120.8571,-113.5582 5.9839,-2.4462 5.9467,-1.1049 0.4971,-17.9618 -5.8889,-18.2158 -16.2633,-38.299 -27.9615,-54.1293 -6.7465,-9.1297 -22.4259,-25.3474 -31.9219,-33.0182 -16.4944,-13.3237 -39.5976,-26.5604 -61.688,-35.3434 -11.8441,-4.709 -15.2079,-7.1177 -18.0026,-12.8908 -2.9435,-6.0805 -2.4295,-14.9274 1.1844,-20.3884 3.0502,-4.6092 10.9123,-8.8699 16.367,-8.8699 4.0893,0 18.5938,5.3555 34.1507,12.6095 44.8317,20.9045 81.2295,52.8619 104.8179,92.0305 10.2683,17.0503 20.2168,40.2956 24.5489,57.36 0.9718,3.828 2.2112,6.9513 2.7543,6.9408 0.5431,-0.011 4.6594,-0.669 9.1474,-1.4631 17.9642,-3.1786 56.8414,-2.8266 75.1493,0.6806 3.0522,0.5846 5.7317,0.8806 5.9546,0.6577 0.2229,-0.223 1.9717,-5.5738 3.8861,-11.8907 16.4848,-54.3959 49.7093,-97.6279 98.8499,-128.6249 10.961,-6.914 38.3664,-20.3666 50.8795,-24.9755 7.975,-2.9374 10.3967,-3.4412 14.3115,-2.9776 13.1225,1.5541 21.4249,15.7717 16.1603,27.6735 -2.6526,5.9966 -7.7791,9.8684 -18.9513,14.3135 -28.0409,11.1566 -54.1872,27.4236 -73.8226,45.9289 -19.7415,18.6053 -38.2746,48.2005 -47.1023,75.2166 -4.264,13.0499 -5.1366,17.9602 -3.1913,17.9602 2.9877,0 32.7855,15.6521 43.6174,22.9111 35.073,23.5046 62.3675,54.6147 80.5485,91.8089 8.2384,16.8538 12.8449,28.9892 16.6748,43.9288 14.3972,56.1589 8.2869,113.0017 -17.6855,164.5235 -19.2479,38.1823 -49.1183,70.9945 -85.66,94.0964 -18.2182,11.5176 -45.6468,23.1664 -67.2742,28.571 -22.973,5.7408 -52.9043,8.4986 -72.1847,6.651 z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 3000.8288,3151.3751 c -4.6742,-23.1096 -12.9451,-77.1894 -16.8277,-110.0303 -7.7224,-65.3184 -9.7031,-99.2492 -9.6885,-165.9695 0.012,-53.6173 0.5723,-67.6117 4.3837,-109.44 27.1271,-297.7034 168.9885,-541.3587 421.0384,-723.1581 209.8349,-151.3503 500.3544,-259.4318 826.1386,-307.3468 42.4814,-6.2481 103.7928,-13.0832 136.3477,-15.2005 l 11.28,-0.7336 -0.015,2.8996 c -0.01,1.5946 -0.4307,9.1635 -0.939,16.8195 -1.5263,22.9895 -4.6229,84.454 -7.1821,142.56 -5.8027,131.7494 -6.9819,155.1886 -10.166,202.08 -8.6108,126.807 -23.2414,213.1729 -48.8119,288.1421 -51.3122,150.4397 -153.8449,257.0463 -331.7662,344.9478 -143.5843,70.9374 -350.8163,135.134 -504.9599,156.4272 -43.5941,6.022 -69.4275,7.9656 -121.92,9.173 -41.0249,0.9436 -50.619,1.7655 -74.4,6.3734 -103.6324,20.0805 -188.9997,89.5967 -243.3909,198.1981 -9.2728,18.5147 -15.9103,34.2877 -22.5969,53.6981 l -5.4566,15.8397 -1.0679,-5.2797 z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 2304.4085,3155.2153 c -0.2838,-0.792 -1.8998,-5.76 -3.591,-11.04 -7.7994,-24.3497 -23.0562,-57.9713 -37.464,-82.56 -57.912,-98.8333 -140.1079,-158.4256 -240.8923,-174.6477 -20.8247,-3.3519 -33.9825,-4.3832 -56.16,-4.4018 -23.9993,-0.02 -57.2459,-1.4433 -79.2,-3.3904 -113.6274,-10.0773 -261.7175,-46.2585 -408.5162,-99.8083 -103.6649,-37.8152 -195.8545,-83.4422 -263.9638,-130.6426 -70.6796,-48.9816 -127.2847,-107.4586 -165.3215,-170.7891 -50.03321,-83.3041 -77.8575,-181.9541 -91.92601,-325.92 -5.77517,-59.0985 -8.58855,-106.573 -14.93396,-252 -3.03931,-69.655 -6.10351,-131.6665 -7.66121,-155.04 -0.5102,-7.656 -0.9344,-16.4699 -0.9425,-19.5863 l -0.015,-5.6663 11.78321,0.6299 c 34.60873,1.8501 106.19837,10.2819 160.89847,18.9503 281.7488,44.6495 534.9669,133.5812 731.6197,256.9493 118.383,74.2663 217.584,162.3998 294.8123,261.9213 67.0105,86.354 118.8473,185.084 151.9256,289.3618 26.1772,82.5225 40.9436,165.5624 46.8598,263.5199 1.5199,25.165 1.5209,102.6771 0,130.08 -3.5083,63.2806 -10.612,124.9607 -21.7255,188.64 -4.7368,27.1408 -4.8285,27.5584 -5.5877,25.44 z"
        />
      </g>
    </g>
  </svg>)

export const HouseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

export const UserIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

export const QuestionMarkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>
);

export const ClipbardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

export const GearIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const HeartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

export const ShareIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
    />
  </svg>
);

export const ReplyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

export const FireIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
    />
  </svg>
);
