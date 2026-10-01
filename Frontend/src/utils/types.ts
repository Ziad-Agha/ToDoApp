export interface Task {
  user_id:      string;
  task_id:      string;

  title:        string;
  note?:        string;
  difficulty:   string;
  created_on:   string;
  
  isPrivate:    boolean;
  isRegular:    boolean;

  status:       string;
  value:        number;
}

export interface newTask {
  title:        string;
  note?:        string | null;
  difficulty:   string;
  created_on:   Date;
  
  isRegular:    boolean;
  isPrivate:    boolean;
  
  status:       string;
  value:        number;
}

export interface TaskUpdate {
  title: string;
  note?: string;
  isPrivate: boolean;
}