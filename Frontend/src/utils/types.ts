export interface Task {
  user_id:      string;
  task_id:      string;
  title:        string;
  note?:        string;
  difficulty:   string;
  created_on:   string;
  start_date:   string;
  weekday:      string;
  deadline:     string;
  type:         string;
  isPrivate:    boolean;
  frequency:    number;
  status:       string;
  value:        number;
}

export interface newTask {
  title:        string;
  note?:        string | null;
  difficulty:   string;
  created_on:   Date;
  start_date:   Date | null;
  deadline:     Date | null;
  weekday:      string;
  type:         string;
  isPrivate:    boolean;
  frequency:    number;
  status:       string;
  value:        number;
}

export interface TaskUpdate {
  title: string;
  note?: string;
  isPrivate: boolean;
}