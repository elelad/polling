
export interface CalEvent{
  name: string;
  id: number;
  status: 'processing' | 'done';
}


export interface PollingResponse{
  events: CalEvent[];
}

export function* getId(): Generator<number> {
  let index = 0;
  while (index < 10) {
    yield index++;
  }
}

export const idGen = getId();
