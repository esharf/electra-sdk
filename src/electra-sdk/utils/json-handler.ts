import { readFileSync, writeFileSync } from 'fs';
import { Json } from '../types/json.type';


export function readJsonFile(path: string): Json {
    const jsonBuffer = readFileSync(path);
    return JSON.parse(jsonBuffer.toString());
}

export function writeJsonFile(data: Json, path: string): void {
    writeFileSync(path, JSON.stringify(data));
}