interface task {
  id: number;
  name: string;
  note: string;
  difficulty: string;
  createdon: string;
  type: string;
  startDate: string;
  status: string;
  deadline: string;
  deadlineTime: string;
  graceperiod: string;
  frequency: string;
  weekday: string;
  isPrivate: boolean;
  streak: string;
}

export default task;
