export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoItemProps {
  key: string;
  todo: ITodo;
  editing?: boolean;
  onSave: (value: any) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
}

export interface ITodoItemState {
  editText: string;
}

export interface ITodoFooterProps {
  completedCount: number;
  onClearCompleted: (event: React.MouseEvent<HTMLButtonElement>) => void;
  nowShowing?: string;
  count: number;
}

export interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange: (() => void)): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

export interface IAppProps {
  model: ITodoModel;
}

export interface IAppState {
  editing: string | null;
  nowShowing?: string;
}