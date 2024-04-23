import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { RootState } from '../redux/store';
import { reorderTodo, updateTodoStatus, Todo, addComment, removeTodo } from '../redux/todoReducer';
import { FaTrash, FaEdit } from 'react-icons/fa';

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: any
): React.CSSProperties => ({
    userSelect: "none",
    background: isDragging ? "lightgreen" : "grey",
    padding: 8,
    margin: "0 0 8px 0",
    borderRadius: 5,
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 8,
    width: "30%",
    minHeight: 500
});

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos.todos);
    const dispatch = useDispatch();

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        if (result.destination.droppableId !== result.source.droppableId) {
            dispatch(updateTodoStatus({
                id: result.draggableId,
                newStatus: result.destination.droppableId as Todo['status']
            }));
        } else {
            dispatch(reorderTodo({
                startIndex: result.source.index,
                endIndex: result.destination.index,
                status: result.source.droppableId as Todo['status']
            }));
        }
    };

    const columns = {
        todo: "Todo",
        inProgress: "In Progress",
        done: "Done"
    };

    const handleDelete = (id: string) => {
        dispatch(removeTodo(id));
    };
    const handleEdit = (id: string) => {
        // handle edit logic here
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '10px' }}>
                {Object.entries(columns).map(([status, title]) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                            >
                                <h4>{title}</h4>
                                {todos.filter(todo => todo.status === status).map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                <div {...provided.dragHandleProps} style={{ marginBottom: 8 }}>
                                                    <BsGripVertical />
                                                </div>
                                                <Card >
                                                    <Accordion defaultActiveKey="0">
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header >
                                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                                    <span>{todo.title}</span>
                                                                    <div className="d-flex gap-2" style={{marginRight:5}}>
                                                                        <Button variant="primary" onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleEdit(todo.id)
                                                                        }}>
                                                                            <FaEdit />
                                                                        </Button>
                                                                        <Button variant="danger" onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleDelete(todo.id)
                                                                        }}>
                                                                            <FaTrash />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <Card className="d-flex justify-content-center align-items-center p-1 text-center m-1">
                                                                    <p>{todo.description}</p>
                                                                </Card>
                                                                <ul>
                                                                    {todo.comments.map((comment, index) => (
                                                                        <li key={index}>{comment}</li>
                                                                    ))}
                                                                </ul>
                                                                <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                                                    e.preventDefault();
                                                                    const commentInput = e.currentTarget.elements.namedItem('comment') as HTMLInputElement;
                                                                    if (commentInput) {
                                                                        const comment = commentInput.value;
                                                                        dispatch(addComment({ id: todo.id, comment }));
                                                                        commentInput.value = '';
                                                                    }
                                                                }}>
                                                                    <Form.Group className='d-flex'>
                                                                        <Form.Control name="comment" type="text" placeholder="Add a comment" />
                                                                        <Button type="submit">Add</Button>
                                                                    </Form.Group>

                                                                </Form>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TodoList;
