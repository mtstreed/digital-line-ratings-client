"use client";

import { useState } from "react";
import { Popup } from "react-leaflet";
import { fetchDbLineByObjectId } from "../utils/linesUtils";
import { DbResponse } from "../types/dbTypes";

export default function LinePopup({ objectId }: { objectId: number }) {
    const [data, setData] = useState<DbResponse | null>(null);
    const [error, setError] = useState(false);

    return (
        <Popup eventHandlers={{ add: async () => {
            try {
                const result = await fetchDbLineByObjectId(objectId);
                setData(result);
            } catch {
                setError(true);
            }
        }}}>
            <div>
                {error ? (
                    <div>Failed to load line data.</div>
                ) : (
                    <>
                        <div>Static Ampacity: {data?.inferred_ampacity ? `${data.inferred_ampacity} Amps` : 'Loading...'}</div>
                        <div>Dynamic Line Rating: {data?.dynamic_line_rating ? `${data.dynamic_line_rating.toFixed(2)} Amps` : 'Loading...'}</div>
                    </>
                )}
            </div>
        </Popup>
    );
}
