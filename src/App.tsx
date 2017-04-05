import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IAppProps, IAppState, ITodo } from './interfaces';

import { TodoModel } from './TodoModel';
import { TodoFooter } from './TodoFooter';
import { TodoItem } from './TodoItem';

import * as constants from './constants';

/*
 * 原作者使用了director库中的Router进行路由切换，然而社区并没有提供相应的tsd文件
 * 所以这里放置一个简单的声明，所有在其之上的操作都无法得到静态类型系统的保障
 */
declare var Router: any;

class TodoApp extends React.Component<IAppProps, IAppState> {
  state: IAppState;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      nowShowing: constants.ALL_TODOS,
      editing: null
    };
  }

  componentDidMount() {
    let router = Router({
      '/': () => this.setState({ nowShowing: constants.ALL_TODOS }),
      '/active': () => this.setState({ nowShowing: constants.ACTIVE_TODOS }),
      '/completed': () => this.setState({ nowShowing: constants.COMPLETED_TODOS })
    });
    router.init('/');
  }

  handleNewTodoKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode !== constants.ENTER_KEY) {
      return;
    }
    event.preventDefault();
    let value = ReactDOM.findDOMNode<HTMLInputElement>(this.refs['newField']) .value.trim();
    if (value) {
      this.props.model.addTodo(value);
      ReactDOM.findDOMNode<HTMLInputElement>(this.refs['newField']).value = '';
    }
  }

  toggleAll(event: React.FormEvent<HTMLInputElement>) {
    let target = event.currentTarget;
    let checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  toggle(todoToToggle: ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  destroy(todo: ITodo) {
    this.props.model.destroy(todo);
  }

  edit(todo: ITodo) {
    this.setState({
      editing: todo.id
    });
  }

  save(todoToSave: ITodo, text: string) {
    this.props.model.save(todoToSave, text);
    this.setState({
      editing: null
    });
  }

  cancel() {
    this.setState({
      editing: null
    });
  }

  clearCompleted() {
    this.props.model.clearCompleted();
  }

  render() {
    let footer: any, main: any;
    const todos = this.props.model.todos;

    let shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case constants.ACTIVE_TODOS:
          return !todo.completed;
        case constants.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    let todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ _ => this.cancel() }
        />
      );
    });

    let activeTodoCount = todos.reduce((accum, todo) => {
      return todo.completed ? accum: accum + 1;
    }, 0);
    let completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = 
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={_ => this.clearCompleted()}
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={event => this.toggleAll(event)}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={event => this.handleNewTodoKeyDown(event)}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

let model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();