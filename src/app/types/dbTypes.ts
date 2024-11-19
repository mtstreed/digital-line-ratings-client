export interface DbResponse {
    model: string;
    pk: number;
    fields: Fields;
}

export interface Fields {
    objectid: number;
    external_id: string;
    type: string;
    status: string;
    naics_code: string;
    naics_desc: string;
    source: string;
    source_date: string;  // ISO 8601 date string
    val_method: string;
    val_date: string;    // ISO 8601 date string
    owner: string;
    voltage: number;
    volt_class: string;
    inferred: string;
    sub_1: string;
    sub_2: string;
    shape_len: number;
    global_id: string;
    shape_length: number;
    dynamic_line_rating: number;
    path: string;  // LineString representation in WKT format
    inferred_ampacity: number;
}