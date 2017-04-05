import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

import { ITodoItemProps, ITodoItemState } from './interfaces';

import * as constants from './constants';

export class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
  state: ITodoItemState;

  constructor(props: ITodoItemProps) {
    super(props);
    this.state = {
      editText: this.props.todo.title
    };
  }

  handleSubmit(event: React.FormEvent<HTMLInputElement>) {
    let value = this.state.editText.trim();
    if (value) {
      this.props.onSave(value);
      this.setState({
        editText: value
      });
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit() {
    this.props.onEdit();
    this.setState({
      editText: this.props.todo.title
    });
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === constants.ESCAPE_KEY) {
      this.setState({
        editText: this.props.todo.title
      });
      this.props.onCancel(event);
    } else if (event.keyCode === constants.ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      editText: event.currentTarget.value
    });
  }

  shouldComponentUpdate(nextProps: ITodoItemProps, nextState: ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  componentDidUpdate(prevProps: ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      let node = ReactDOM.findDOMNode<HTMLInputElement>(this.refs['editField']);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={_ => this.handleEdit()}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={event => this.handleSubmit(event)}
          onChange={event => this.handleChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
        />
      </li>
    )
  }
}