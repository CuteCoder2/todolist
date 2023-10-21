import { Formik } from 'formik';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Input, ListGroup, ListGroupItem, ListGroupItemHeading, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { searchInitValues, searchSchema } from '../utils/initvalues';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai'
import { TiInputChecked } from 'react-icons/ti'
import { RiPassPendingLine } from 'react-icons/ri'

function index() {
  const [showModal, setShowModal] = useState(false)
  // const [todos, setTodos] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [todos, setTodos] = useState<any>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [showFailed, setShowFailed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const fetchTodos = async (s: string) => {
    try {
      const { data } = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + s);
      // setMeals(data.meals);
      const meals: string[] = []
      data.meals.map((meal: any) => {
        meals.push(meal.strMeal)
      })
      setMeals(meals)

    } catch (error) {
      console.error(error);
    }
  };
  const AddMealToToDoList = async (params: any) => {
    const { data } = await axios.post('http://localhost:8000/todo', params)
    const meals = [...todos]
    meals.unshift(data)
    setTodos(meals)
  }


  const removeTodo = (index: any) => {
    const updatedTodos = todos.filter((_: any, i: any) => i !== index);
    setTodos(updatedTodos);
  };
  const deleteMealFromToDoList = async (params: any) => {
    const { data } = await axios.delete('http://localhost:8000/todo', {
      data: { 'id': params.id }
    })
    if (data.status == 200) {
      removeTodo(params.index)
      setSuccessMsg("successfully deleted meal with id:" + params.id)
      setShowSuccess(true)
    } else {
      setDeleteMsg("Failed to delete meal with id:" + params.id)
      setShowFailed(true)
    }
  }

  const updateTodo = (index: any, data: any) => {
    let todoToUpdate = todos.filter((_: any, i: any) => i == index);
    todoToUpdate = todoToUpdate[0]
    todoToUpdate.status = data.status
    todoToUpdate.name = data.name
    const allTodos = todos
    allTodos[index] = todoToUpdate
    setTodos(allTodos);
  };
  const updateMealFromToDoList = async (params: any) => {
    const { data , status } = await axios.put('http://localhost:8000/todo', { 
      data: { 'id': params.id, 'status': params.status }
    })
    if (status == 200) {
      updateTodo(params.index, data)
      setSuccessMsg("successfully update meal with id:" + params.id)
      setShowSuccess(true)
    } else {
      setDeleteMsg("Failed to update meal with id:" + params.id)
      setShowFailed(true)
    }
  }

  const getToToDoList = async () => {
    const { data } = await axios.get('http://localhost:8000/todo')
    setTodos(data)
  }


  useEffect(() => {
    getToToDoList()
  }, [])

  useEffect(() => {
    if (showFailed) {
      setTimeout(() => {
        setShowFailed(false)
      }, 3000)
    }
    if (showSuccess) {
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }, [showFailed, showSuccess])

  return (
    <>
      <Alert isOpen={showSuccess} color='primary' > {successMsg} </Alert>
      <Alert isOpen={showFailed} color='danger' > {deleteMsg} </Alert>
      <Modal isOpen={showModal}>
        <ModalHeader className='bg-danger'>Search and add Meals</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='w-100' md={10}>
              <Formik
                initialValues={searchInitValues}
                validationSchema={searchSchema}
                onSubmit={(values) => {
                  fetchTodos(values.name)
                }}
              >
                {
                  ({ errors, handleBlur, handleChange, handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className='d-flex my-3 justify-content-between align-items-center'>
                        <div className='w-75'>
                          <Input name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                        </div>
                        <Button color='primary'>Search</Button>
                      </div>
                      <span className='text-danger my-2'>
                        {(errors.name ? errors.name : null)}
                      </span>
                    </Form>
                  )
                }
              </Formik>
            </Col>
            <Col>
              <ListGroup>
                <ListGroupItemHeading>
                  Results
                </ListGroupItemHeading>
                {
                  meals.map((meal, index) => (
                    <ListGroupItem>
                      <div className='d-flex w-100 justify-content-between align-items-center'>
                        {meal}
                        <Button
                        onClick={()=>{
                          AddMealToToDoList({name:meal})
                        }}
                         color='success'>
                          Add
                        </Button>
                      </div>
                    </ListGroupItem>
                  ))
                }
              </ListGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>


      <Container fluid={true} >
        <Row >
          <Col className='w-100'>
            <div className='d-flex border rounded p-2 justify-content-center align-items-center flex-column m-5'>
              <div className='w-50'>
                <Button onClick={() => setShowModal(true)} color='success'>Add</Button>
              </div>
              <div className='w-75 mt-2'>
                <ListGroup>
                  <ListGroupItemHeading>
                    Todo Meals
                  </ListGroupItemHeading>
                  {
                    todos.map((todo: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; status: string; id: any; }, index: Key | null | undefined) => (
                      <ListGroupItem key={index}>
                        <div className='d-flex justify-content-between align-items-center font-weight-bold'>
                          <span className='w-25'>
                            {(index + 1) + ': '}
                            {todo.name}
                          </span>
                          {
                            (todo.status == 'pen') ?
                              <span className='border w-25 text-center text-uppercase p-2 flex-1 rounded bg-warning font-weight-bold position-inline-block text-light'>Pending</span> :
                              <span className='border w-25 text-center text-uppercase p-2 flex-1 rounded bg-primary font-weight-bold position-inline-block text-light'>Done</span>
                          }
                          <div>
                            {
                              (todo.status == 'pen') ?
                            <Button color='success mx-1' onClick={() => {
                              updateMealFromToDoList({ "id": todo.id, "index": index, 'status': "wat" })
                            }}>
                              <RiPassPendingLine />
                            </Button>:
                            <Button color='info mx-1' onClick={() => {
                              updateMealFromToDoList({ "id": todo.id, "index": index, 'status': "pen" })
                            }}>
                              <TiInputChecked />
                            </Button>
                            }
                            <Button color='danger mx-1' onClick={() => {
                              deleteMealFromToDoList({ "id": todo.id, "index": index })
                            }}>
                              <AiOutlineDelete />
                            </Button>
                          </div>
                        </div>
                      </ListGroupItem>
                    ))
                  }
                </ListGroup>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default index