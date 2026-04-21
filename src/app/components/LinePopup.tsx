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
                setData(result[0]);
            } catch {
                setError(true);
            }
        }}}>
            <div>
                {error ? (
                    <div>Failed to load line data.</div>
                ) : (
                    <>
                        <div>Static Ampacity: {data?.fields?.inferred_ampacity ? `${data.fields.inferred_ampacity} Amps` : 'Loading...'}</div>
                        <div>Dynamic Line Rating: {data?.fields?.dynamic_line_rating ? `${data.fields.dynamic_line_rating.toFixed(2)} Amps` : 'Loading...'}</div>
                    </>
                )}
            </div>
        </Popup>
    );
}
