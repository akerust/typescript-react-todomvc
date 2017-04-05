import * as React from 'react';

import { ITodoFooterProps } from './interfaces';

import * as utils from './utils';
import * as constants from './constants';

export class TodoFooter extends React.Component<ITodoFooterProps, {}> {
  render() {
    let activeTodoWord = utils.pluralize(this.props.count, 'item');
    let clearButton: any = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
            Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a 
              href="#/"
              className={classNames({ selected: nowShowing === constants.ALL_TODOS })}>
                All
            </a>
          </li>
          { ' ' }
          <li>
            <a
              href="#/active"
              className={classNames({ selected: nowShowing === constants.ACTIVE_TODOS })}>
                Active
            </a>
          </li>
          <li>
            <a
              href="#/completed"
              className={classNames({ selected: nowShowing === constants.COMPLETED_TODOS })}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}