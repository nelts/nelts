
import * as Stream from 'stream';

export default function ErrorInject(stream: Stream, error: (err: Error) => void) {
  if (stream instanceof Stream
    && !~stream.listeners('error').indexOf(error)) {
    stream.on('error', error);
  }
  return stream;
};