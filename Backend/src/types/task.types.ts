interface task {
  id: number;
  name: string;
  note: string;
  difficulty: string;
  createdon: Date;
  type: string;
  startDate: Date;
  status: string;
  deadline: Date;
  graceperiod: string;
  frequency: number;
  weekday: string;
  isPrivate: boolean;
  streak: string;
}

export default task;
