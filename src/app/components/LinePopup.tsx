"use client";

import { useState } from "react";
import { Popup } from "react-leaflet";
import { fetchDbLineByObjectId } from "../utils/linesUtils";
import { DbResponse } from "../types/dbTypes";

export default function LinePopup({ objectId }: { objectId: number }) {
    const [data, setData] = useState<DbResponse | null>(null);

    return (
        <Popup eventHandlers={{ add: async () => {
            const result = await fetchDbLineByObjectId(objectId);
            setData(result[0]);
        }}}>
            <div>
                <div>Static Ampacity: {data?.fields?.inferred_ampacity ? `${data.fields.inferred_ampacity} Amps` : 'Loading...'}</div>
                <div>Dynamic Line Rating: {data?.fields?.dynamic_line_rating ? `${data.fields.dynamic_line_rating.toFixed(2)} Amps` : 'Loading...'}</div>
            </div>
        </Popup>
    );
}
