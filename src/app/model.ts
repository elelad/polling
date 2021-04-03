
export interface CalEvent{
  name: string;
  id: number;
  status: EventStatus;
}


export interface PollingResponse{
  id: number | string;
  status: EventStatus;
}

export interface PollingListenerModel{
  done: PollingResponse[];
  inProgress: (string | number)[];
}

export function* getId(): Generator<number> {
  let index = 0;
  while (index < 10) {
    index++;
    if (index > 9) {
      index = 0;
    }
    yield index;
  }
}

export const idGen = getId();

export enum EventStatus{
  processing, done
}
