export interface WorldPos {
    latitude: number
    longitude: number
  }

  export interface Result {
    station_id: string
    value: number
  }

  export interface Device {
    device_id: string
    id: string
    location: WorldPos
    name: string
  }

  export interface DataObject {
    readings: Array<Result>
    timestamp: string
  }

  export interface MetadataObject {
    reading_type: string
    reading_unit: string
    stations: Array<Device>
  }

  export interface LookupResult {
    items: Array<DataObject>
    metadata: MetadataObject
  }

  export type ReadonlyDate = Readonly<
  Omit<
    Date,
    | "setTime"
    | "setMilliseconds"
    | "setUTCMilliseconds"
    | "setSeconds"
    | "setUTCSeconds"
    | "setMinutes"
    | "setUTCMinutes"
    | "setHours"
    | "setUTCHours"
    | "setDate"
    | "setUTCDate"
    | "setMonth"
    | "setUTCMonth"
    | "setFullYear"
    | "setUTCFullYear"
  >
>;