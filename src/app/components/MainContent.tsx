"use client"

// Even with "use client" directive, Map component must use dynamic import to avoid server-side rendering.
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./Map"), { ssr: false });

export default function MainContent() {
    return(
        <div className="flex flex-col p-10 justify-start h-screen w-screen">

            <div className="bg-gray-100 mx-auto my-5 w-[80%] h-[480px]">
                {/* Coordinates prop given to Map cmp cannot be LatLng because that is a leaflet type. Leaflet
                    is a browser-only library, and importing LatLng causes server-side rendering errors, even
                    with "use client" directive. Instead, coordinates array is converted to LatLng later. */}
                <Map centerCoords={[40.775350, -73.966245]} zoom={13}></Map>
            </div>
        </div>
        
    );
}