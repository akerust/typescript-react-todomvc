import { ITodoModel, ITodo } from './interfaces';

import * as utils from './utils';

export class TodoModel implements ITodoModel {
  todos: Array<ITodo>;
  onChanges: Array<() => void> = [];

  constructor(public key: string) {
    this.todos = utils.store(key);
  }

  subscribe(onChange: () => void) {
    this.onChanges.push(onChange);
  }

  inform() {
    utils.store(this.key, this.todos);
    this.onChanges.forEach((cb) => { cb(); });
  }

  addTodo(title: string) {
    this.todos = this.todos.concat({
      id: utils.uuid(),
      title: title,
      completed: false
    });
    this.inform();
  }

  toggleAll(checked: boolean) {
    this.todos = this.todos.map((todo) => {
      return utils.extend({}, todo, {
        completed: checked
      });
    });
    this.inform();
  }

  toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map((todo) => {
      return todo !== todoToToggle ? todo : utils.extend({}, todo, {
        completed: !todo.completed
      });
    });
    this.inform();
  }

  destroy(todo: ITodo) {
    this.todos = this.todos.filter((candidate) => {
      return candidate !== todo;
    });
    this.inform();
  }

  save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map((todo) => {
      return todo !== todoToSave ? todo : utils.extend({}, todo, {
        title: text
      });
    });
    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => {
      return !todo.completed;
    });
    this.inform();
  }
}