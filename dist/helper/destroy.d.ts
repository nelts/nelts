/*!
 * destroy
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
/// <reference types="node" />
import * as Stream from 'stream';
export interface StreamDestroySchema extends Stream {
    destroy?(): void;
    close?(): void;
}
export default function destroy(stream: StreamDestroySchema): StreamDestroySchema;
