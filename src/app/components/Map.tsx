"use client"


import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { LatLngTuple, LatLngBounds, LatLng } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import MapComponent from "./MapComponent";
import { fetchLinesWithinBounds, fetchDbLineByObjectId } from "../utils/linesUtils";
import { LineData, Feature } from '../types/lineApiTypes';
import { DbResponse } from '../types/dbTypes';


interface MapProps {
    centerCoords: number[],
    zoom: number,
}


const visibleLineOptions = { color: 'yellow', weight: 1 }
const clickableLineOptions = { color: 'transparent', weight: 10 }


export default function Map({ centerCoords, zoom }: MapProps) {

    const center: LatLng = new LatLng(centerCoords[0], centerCoords[1]);
    const startingBounds = center.toBounds(50000); // Get bounds of 50km around center.

    const [lines, setLines] = useState<Feature[]>([]);
    const [bounds, setBounds] = useState<LatLngBounds | null>(startingBounds);
    const fetchIdRef = useRef(0); // Used to prevent stale requests
    const [dbLineData, setDbLineData] = useState<DbResponse>({} as DbResponse);

    const handleBoundsChange = (bounds: LatLngBounds | null) => {
        setBounds(bounds);
    };

    useEffect(() => {
        const fetchData = async () => {
            const fetchId = ++fetchIdRef.current;
            try {
                if (bounds) {
                    const lineData: LineData = await fetchLinesWithinBounds(bounds);
                    const features: Feature[] = lineData.features;
                    if (fetchId === fetchIdRef.current) {
                        setLines(features);
                    }
                } else {
                    setLines([]);
                }
            } catch (error) {
                if (fetchId === fetchIdRef.current) {
                    console.error("components/Map.tsx | useEffect | Error fetching line data:", error);
                }
            }
        };
        fetchData();
    }, [bounds]);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='<a href="https://carto.com/attributions">CARTO</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                opacity={0.8}
            />
            
            {lines && lines.length > 0 && lines.map((line: Feature) => (
                line.geometry.reversedPaths && ( // Check if reversedPaths is defined.
                    <div key={line.attributes.OBJECTID}>
                        <Polyline 
                            pathOptions={visibleLineOptions}
                            positions={line.geometry.reversedPaths[0] as LatLngTuple[]} 
                        />
                        <Polyline 
                            pathOptions={clickableLineOptions}
                            positions={line.geometry.reversedPaths[0] as LatLngTuple[]}
                        >
                            <Popup
                                eventHandlers={{
                                    add: async (e) => {
                                        const dynamicLineData: DbResponse[] = await fetchDbLineByObjectId(line.attributes.OBJECTID_1);
                                        setDbLineData(dynamicLineData[0]);
                                    }
                                }}
                            >
                                <div>
                                    <div>Static Ampacity: {dbLineData?.fields?.inferred_ampacity} A</div>
                                    <div>Dynamic Line Rating: {dbLineData?.fields?.dynamic_line_rating?.toFixed(2) ?? 'Loading...'} A</div>
                                </div>
                            </Popup>
                        </Polyline>
                    </div>
                )
            ))}
            <MapComponent onBoundsChange={handleBoundsChange}/>
        </MapContainer>
    );
}