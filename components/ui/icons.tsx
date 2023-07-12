
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
    fill="none"
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
)

export const UserIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const QuestionMarkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const ClipbardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const FollowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
  >
    <path d="M18,0H6A3,3,0,0,0,3,3V23a1,1,0,0,0,1.352.937L12,21.068l7.648,2.869A1.026,1.026,0,0,0,20,24a1,1,0,0,0,1-1V3A3,3,0,0,0,18,0Zm1,21.557-6.648-2.494a1.015,1.015,0,0,0-.7,0L5,21.557V3A1,1,0,0,1,6,2H18a1,1,0,0,1,1,1Z"></path><path d="M15,8H13V6a1,1,0,0,0-2,0V8H9a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V10h2a1,1,0,0,0,0-2Z"></path>
  </svg>
)

export const GearIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const HeartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const ShareIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const ReplyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
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
)

export const FireIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
  >
    <path d="M12 24c-5 0-9-4-9-9 0-4 2.4-8.2 3.4-9.8C7 4.3 9.8 0 12 0c.6 0 1 .4 1 1s-.4 1-1 1c-1.4.2-7 7.4-7 13 0 3.9 3.1 7 7 7s7-3.1 7-7c0-.8-.1-1.6-.3-2.6-.5-1.9-1.4-4.1-2.7-6.1-.3-.5-.2-1.1.3-1.4.5-.3 1.1-.2 1.4.3 1.4 2.2 2.4 4.6 3 6.7.2 1.1.3 2.2.3 3.1 0 5-4 9-9 9z"></path><path d="M15 9.9c-.3 0-.6-.1-.8-.3C12.1 7.2 11 4.2 11 1c0-.6.4-1 1-1s1 .4 1 1c0 2.7 1 5.3 2.7 7.3.4.4.3 1-.1 1.4-.1.1-.4.2-.6.2z"></path><path d="M15 9.9c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4.7-.8 1.3-1.7 1.5-2.7.1-.5.7-.8 1.2-.7.5.1.9.7.7 1.2-.3 1.3-1.1 2.6-2 3.6-.2.2-.5.3-.7.3zM12 24c-2.8 0-5-2.2-5-5 0-3.1 3.1-8 5-8 .6 0 1 .4 1 1 0 .5-.4.9-.9 1-.7.4-3.1 3.6-3.1 6 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.3-.1-.7-.2-1.2-.2-.9-.7-1.9-1.3-2.9-.3-.5-.2-1.1.3-1.4.5-.3 1.1-.2 1.4.3.7 1.1 1.3 2.4 1.6 3.5.1.6.2 1.1.2 1.7 0 2.8-2.2 5-5 5z"></path><path d="M13.5 17c-.3 0-.6-.1-.8-.3-1.1-1.4-1.7-3-1.7-4.7 0-.6.4-1 1-1s1 .4 1 1c0 1.2.4 2.4 1.2 3.3.4.4.3 1-.1 1.4-.1.2-.4.3-.6.3z"></path><path d="M13.5 17c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4.3-.3.5-.7.6-1.1.1-.5.7-.9 1.2-.7.5.1.9.7.7 1.2-.2.8-.6 1.5-1.2 2-.1.2-.4.3-.6.3z"></path>
  </svg>
)

export const SaveIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path d="M15,8V4H5V8H15M12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18M17,2L21,6V18A2,2 0 0,1 19,20H5C3.89,20 3,19.1 3,18V4A2,2 0 0,1 5,2H17M11,22H13V24H11V22M7,22H9V24H7V22M15,22H17V24H15V22Z" />
  </svg>
)

export const ChatSendIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    fill="currentColor"
    >
    <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
)

export const GalleryIcon = (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="none"
    className="w-6 h-6">
    <g>
		<circle cx="6" cy="6" r="2"/>
    </g>
    <g>
      <path d="M24,23H4v-4H0V0h20v4h4V23z M6,21h16V6h-2v13H6V21z M3.2,17H18v-1.6l-4-4.8l-3.9,4.9l-3-3L3.2,17z M2,2v13.3l4.9-5.8l3,3 L14,7.4l4,4.8V2H2z"/>
    </g>
  </svg>
)

export const PhotoIcon = (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6">
    <path 
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

export const FeatherIcon = (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 42 42"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6">
    <path d="M16.05 40q-1.2 0-2.1-.9-.9-.9-.9-2.1v-5h6.2v-6.35q-1.9.15-3.8-.525T12.05 23v-2.9h-2.5L3 13.55q1.8-1.7 4.3-2.775T12.4 9.7q1.5 0 3.425.475 1.925.475 3.425 1.525V8H42v26.75q0 2.2-1.525 3.725T36.75 40Zm6.2-8H34.5v2.75q0 1 .625 1.625T36.75 37q1 0 1.625-.625T39 34.75V11H22.25v2.85L34.3 25.9v2.15h-2.15l-6.3-6.3-.85 1q-.65.75-1.3 1.15-.65.4-1.45.75ZM10.9 17.1h4.15v4.45q.85.55 1.675.825.825.275 1.675.275 1.25 0 2.55-.675 1.3-.675 1.9-1.375l.85-1-3.45-3.45q-1.6-1.6-3.6-2.525-2-.925-4.25-.925-1.35 0-2.45.325T7.7 13.9ZM31.5 35H16.05v2H32.2q-.3-.3-.5-.825-.2-.525-.2-1.175Zm-15.45 2v-2 2Z"/>
  </svg>
)

export const CheckBadge = (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    className="w-6 h-6">
    <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
)

export const DatabaseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>
)

export const DollarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="-2 -1.5 24 24"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d='M9 13.858h-.051A.949.949 0 0 1 8 12.909a1 1 0 1 0-2 0 2.949 2.949 0 0 0 2.949 2.949H9v1a1 1 0 0 0 2 0v-1a3 3 0 0 0 0-6v-2h.022c.54 0 .978.438.978.978a1 1 0 0 0 2 0 2.978 2.978 0 0 0-2.978-2.978H11v-1a1 1 0 0 0-2 0v1a3 3 0 1 0 0 6v2zm2 0v-2a1 1 0 0 1 0 2zm-2-6v2a1 1 0 1 1 0-2zm1 13c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' />
  </svg>
)

export const StarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d="M12.5095 17.7915C12.1888 17.6289 11.8112 17.6289 11.4905 17.7915L7.37943 19.8751C6.50876 20.3164 5.52842 19.5193 5.76452 18.562L6.72576 14.6645C6.81767 14.2918 6.72079 13.8972 6.46729 13.6117L3.29416 10.0378C2.66165 9.32543 3.11095 8.18715 4.05367 8.11364L8.48026 7.76848C8.89433 7.73619 9.25828 7.47809 9.43013 7.09485L10.9627 3.67703C11.3675 2.77432 12.6325 2.77432 13.0373 3.67703L14.5699 7.09485C14.7417 7.47809 15.1057 7.73619 15.5197 7.76848L19.9463 8.11364C20.889 8.18715 21.3384 9.32543 20.7058 10.0378L17.5327 13.6117C17.2792 13.8972 17.1823 14.2918 17.2742 14.6645L18.2355 18.562C18.4716 19.5193 17.4912 20.3164 16.6206 19.8751L12.5095 17.7915Z" />
  </svg>
)

export const ReadsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 32 32"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    	<path d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z"></path>
  </svg>
)

export const BookIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 512 512"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    	<path d="M495.867,306.415c3.578-1.875,6.141-5.219,7.031-9.156c0.875-3.922,0-8.047-2.422-11.266L290.102,5.508
		c-4.047-5.406-11.438-7.078-17.406-3.922L28.821,130.04L255.899,432.82L495.867,306.415z"/>
	<path d="M505.211,366.196l-3.391-3.25L251.696,493.617c-7.953,2.016-6.141-4.219-6.156-13.938
		c0.297-10.5,1.5-20.469,3.281-29.109L21.711,147.743c-3.031,14.188-4.297,32.063-2.359,51.219L4.243,178.79l15.109,20.172
		c0.422,4.141,0.953,8.344,1.703,12.594l222.844,297.14c2.438,3.25,6.875,4.25,10.453,2.344l249-131.593
		c2.359-1.234,3.953-3.531,4.328-6.156C508.039,370.68,507.133,368.024,505.211,366.196z"/>
	<polygon points="262.196,468.758 497.539,345.383 497.539,331.43 262.196,454.82 	"/>
  </svg>
)

export const ChapterDetailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 512 512"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d="M426.666667,1.42108547e-14 L426.666667,341.333333 L3.55271368e-14,341.333333 L3.55271368e-14,1.42108547e-14 L426.666667,1.42108547e-14 Z M384,42.6666667 L42.6666667,42.6666667 L42.6666667,298.666667 L384,298.666667 L384,42.6666667 Z M341.333333,213.333333 L341.333333,245.333333 L234.666667,245.333333 L234.666667,213.333333 L341.333333,213.333333 Z M341.333333,149.333333 L341.333333,181.333333 L234.666667,181.333333 L234.666667,149.333333 L341.333333,149.333333 Z M192,85.3333333 L192,170.666667 L85.3333333,170.666667 L85.3333333,85.3333333 L192,85.3333333 Z M341.333333,85.3333333 L341.333333,117.333333 L234.666667,117.333333 L234.666667,85.3333333 L341.333333,85.3333333 Z" />
  </svg>
)

export const HamburgerIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 32 32"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d="M1.375 9.156h18.063c0.781 0 1.375-0.594 1.375-1.375 0-0.75-0.594-1.344-1.375-1.344h-18.063c-0.781 0-1.375 0.594-1.375 1.344 0 0.781 0.594 1.375 1.375 1.375zM1.375 14.625h18.063c0.781 0 1.375-0.594 1.375-1.375 0-0.75-0.594-1.344-1.375-1.344h-18.063c-0.781 0-1.375 0.594-1.375 1.344 0 0.781 0.594 1.375 1.375 1.375zM1.375 20.094h18.063c0.781 0 1.375-0.594 1.375-1.344 0-0.781-0.594-1.375-1.375-1.375h-18.063c-0.781 0-1.375 0.594-1.375 1.375 0 0.75 0.594 1.344 1.375 1.344zM1.375 25.563h18.063c0.781 0 1.375-0.594 1.375-1.344 0-0.781-0.594-1.375-1.375-1.375h-18.063c-0.781 0-1.375 0.594-1.375 1.375 0 0.75 0.594 1.344 1.375 1.344z"></path>
  </svg>
)

export const PrevIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 512 512"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d="M7.9,256c0,-137 111.1,-248.1 248.1,-248.1c137,0 248.1,111.1 248.1,248.1c0,137 -111.1,248.1 -248.1,248.1c-137,0 -248.1,-111.1 -248.1,-248.1z"></path>
    <path d="M231.4,258.7c30.7,-30.7 61.4,-61.4 92.1,-92.1c26.8,-26.8 -14.9,-68.2 -41.8,-41.3c-37.6,37.6 -75.2,75.2 -112.8,112.8c-11.4,11.4 -11,30.3 0.2,41.5c37.6,37.6 75.2,75.2 112.8,112.8c26.8,26.8 68.2,-14.9 41.3,-41.8c-30.6,-30.7 -61.2,-61.3 -91.8,-91.9z" opacity={1}></path>
  </svg>
)

export const NextIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor"
    viewBox="0 0 512 512"
    strokeWidth={1}
    stroke="none"
    className="w-6 h-6"
   >
    <path d="M7.9,256c0,-137 111.1,-248.1 248.1,-248.1c137,0 248.1,111.1 248.1,248.1c0,137 -111.1,248.1 -248.1,248.1c-137,0 -248.1,-111.1 -248.1,-248.1z"></path>
    <path d="M357.4,237.8c-37.6,-37.6 -75.2,-75.2 -112.8,-112.8c-26.8,-26.8 -68.2,14.9 -41.3,41.8c30.6,30.6 61.3,61.2 91.9,91.9c-30.7,30.7 -61.4,61.4 -92.1,92.1c-26.8,26.8 14.9,68.2 41.8,41.3c37.6,-37.6 75.2,-75.2 112.8,-112.8c11.2,-11.3 10.9,-30.3 -0.3,-41.5z" opacity={1}></path>
  </svg>
)

export const FeedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" 
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
   >
  <circle cx="7.5" cy="7.5" r="2.5"/> 
  <path d="M22 13H2"/> <path d="M18 6h-5m5 3h-5"/> <path d="M5 2h14a3 3 0 0 1 3 3v17H2V5a3 3 0 0 1 3-3z"/> 
  </svg>
)