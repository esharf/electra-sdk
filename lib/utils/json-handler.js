"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = exports.readJsonFile = void 0;
const fs_1 = require("fs");
function readJsonFile(path) {
    const jsonBuffer = (0, fs_1.readFileSync)(path);
    return JSON.parse(jsonBuffer.toString());
}
exports.readJsonFile = readJsonFile;
function writeJsonFile(data, path) {
    (0, fs_1.writeFileSync)(path, JSON.stringify(data));
}
exports.writeJsonFile = writeJsonFile;
//# sourceMappingURL=json-handler.js.map