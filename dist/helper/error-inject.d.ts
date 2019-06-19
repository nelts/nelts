/// <reference types="node" />
import * as Stream from 'stream';
export default function ErrorInject(stream: Stream, error: (err: Error) => void): Stream;
