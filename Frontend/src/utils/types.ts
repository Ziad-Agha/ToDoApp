export interface Task {
  user_id: string;
  task_id: string;
  title: string;
  note?: string;
  difficulty: string;
  created_on: string;
  deadline: string;
  type: string;
  isPrivate: boolean;
  frequency: number;
  timeleft?: string;
  status: string;
  value: number;
}
