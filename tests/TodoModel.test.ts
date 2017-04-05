import { expect } from 'chai';

import { TodoModel } from '../src/TodoModel';
import { Future } from '../src/utils';

describe('TodoModel', () => {
    let todoModel: TodoModel;

    beforeEach(() => {
        todoModel = new TodoModel('test-model');
    });

    describe('#inform', () => {
        it('通知所有change事件的订阅者', async () => {
            let waitForSubscriber1 = new Future();
            let waitForSubscriber2 = new Future();
            let waitForSubscriber3 = new Future();

            // Subscriber 1
            todoModel.subscribe(() => {
                waitForSubscriber1.setResult();
            });
            // Subscriber 2
            todoModel.subscribe(() => {
                waitForSubscriber2.setResult();
            });
            // Subscriber 3
            todoModel.subscribe(() => {
                waitForSubscriber3.setResult();
            });

            todoModel.inform();

            await Promise.all([
                waitForSubscriber1.result(),
                waitForSubscriber2.result(),
                waitForSubscriber3.result()
            ]);
        });
    });
});