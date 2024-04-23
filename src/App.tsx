import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { addTodo } from './redux/todoReducer';
import TodoList from './components/todoList';
import { RootState } from './redux/store';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const todos = useSelector((state: RootState) => state.todos.todos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addTodo({
      title: title,
      description: description,
      status: 'todo',
      completed: false,
      comments: []
    }));
    setTitle('');
    setDescription('');
  };
console.log("todos : ",todos)
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Todo List</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formTodoTitle">
              <Form.Label>Todo Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter todo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formTodoDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Todo description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">Add Todo</Button>
      </Form>
  
      <TodoList />
    </Container>
  );
};

export default App;
