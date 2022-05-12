import { Table, Modal, Button, InputGroup, FormControl, Row, Col, Form, Toast } from 'react-bootstrap'
import { useState, useEffect } from 'react'

import "react-datepicker/dist/react-datepicker.css"

const UTCDate = (date = null) => {
    const currentDate = date ? new Date(date) : new Date() 
    return new Date(currentDate.toUTCString().substr(0, 25))
}

const nowDateAdd = (hours) => {
    return UTCDate(new Date().getTime() + hours * 3600000)
}

const TablePage = props => {
    const editUserPhoto = "https://img.icons8.com/windows/344/edit-user.png"
    const removeUserPhoto = "https://img.icons8.com/windows/344/remove-user-male--v3.png"
    const buttonStyle = { background: "none", border: "none" }

    const [usersList, setUsersList] = useState([])
    const [isLoginSuccessful, setLoginSuccess] = useState(false)
    const [currentSelectedUser, setCurrentSelectedUser] = useState({})

    const [showUpadeUserWindow, setShowUpadeUserWindow] = useState(false)
    const [showAddUserWindow, setShowAddUserWindow] = useState(false)

    const [currentDateTime, setCurrentDateTime] = useState(UTCDate().toLocaleString())

    const removeUser = key => {
        fetch(`${props.apiServer}/remove_user?adminApiKey=${props.adminApiKey}&key=${key}`)
        .then(response => response.json()).then(response => {
            if (response.deletedCount === 1) {
                setUsersList(usersList.filter(user => user.key !== key))
            }
        })
    }

    useEffect(() => {
        setInterval(() => {
            setCurrentDateTime(UTCDate().toLocaleString())
        }, 1000)
        try {
            fetch(`${props.apiServer}/get_users?adminApiKey=${props.adminApiKey}`)
            .then(response => response.json()).then(response => {
                setLoginSuccess(response.isLoginSuccess)
                setUsersList(response.users)
                if (!response.isLoginSuccess) {
                    props.setPage('login')
                }
            })
        } catch (error) {
            setLoginSuccess(false)
            setUsersList([])
            props.setPage('login')
        }
    }, [])
    return (<>
        <div>{currentDateTime}</div>
        <AddUserButton
            isLoginSuccessful={isLoginSuccessful}
            setShowAddUserWindow={setShowAddUserWindow}
        />

        <AddUserModal
            setShowAddUserWindow={setShowAddUserWindow}
            showAddUserWindow={showAddUserWindow}
            usersList={usersList}
            setUsersList={setUsersList}
            adminApiKey={props.adminApiKey}
            apiServer={props.apiServer}
        />

        <Table hover>
            <thead>
                <tr>
                    <th>#</th> <th>Username</th> <th>Has trial</th> 
                    <th>Start</th> <th>End</th> <th>Active</th> <th></th>
                </tr>
            </thead>
            <tbody>
                {usersList.map((user, index) =>
                    <tr>
                        <td>{index}</td>
                        <td>{user.username}</td>
                        <td>{user.has_trial ? "Yes" : "No"}</td>
                        <td>{user.start_preiod_date.toLocaleString()}</td>
                        <td>{user.end_preiod_date.toLocaleString()}</td>
                        <td>{user.is_key_active ? "Yes": "No"}</td>
                        <td>
                            <button style={buttonStyle} onClick={() => {
                                setCurrentSelectedUser(user)
                                setShowUpadeUserWindow(true)
                            }}>
                                <img src={editUserPhoto} style={{width: "25px"}}/>
                            </button>
                            <button style={buttonStyle} onClick={()=>removeUser(user.key)}>
                                <img src={removeUserPhoto} style={{width: "25px"}}/>
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        <UpdateUserModal 
            showUpadeUserWindow={showUpadeUserWindow}
            setShowUpadeUserWindow={setShowUpadeUserWindow}
            currentSelectedUser={currentSelectedUser}
            setCurrentSelectedUser={setCurrentSelectedUser}
            adminApiKey={props.adminApiKey}
            apiServer={props.apiServer}
        />
    </>)
}

const UpdateUserModal = props => {
    const [show, setShow] = useState(true)
    const [userPeriodDate, setUserPeriodDate] = useState(0)
    const [username, setUsername] = useState('')
    const [userHasTrial, setUserTrial] = useState(false)

    return (
        <Modal
            show={props.showUpadeUserWindow}
            onHide={()=>props.setShowUpadeUserWindow(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Update user info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Username</h6>
                <InputGroup className="mb-3" style={{marginBottom: "15px"}}>
                    <FormControl
                        placeholder={props.currentSelectedUser.username}
                        onChange={event => setUsername(event.target.value)}
                        aria-label="username"
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        
                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&username=${username}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                newUserObject.username = username
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>
                        Save
                    </Button>
                </InputGroup>
                
                <h6>How much left</h6>
                <InputGroup className="mb-3" style={{marginBottom: "15px"}}>
                    <FormControl
                        placeholder={(
                            UTCDate(props.currentSelectedUser.end_preiod_date)
                            - (props.currentSelectedUser.is_key_active ? UTCDate() : UTCDate(props.currentSelectedUser.start_preiod_date))
                        ) / (60 * 60 * 1000)}
                        onChange={event => setUserPeriodDate(event.target.value)}
                        aria-label="period"
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        const date = nowDateAdd(userPeriodDate == "inf" ? 27713136 : userPeriodDate)
                        const dateTimeNow = UTCDate()

                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&end_preiod_date=${date}&start_preiod_date=${dateTimeNow}&is_key_active=${false}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                
                                newUserObject.is_key_active = false
                                newUserObject.end_preiod_date = date
                                newUserObject.start_preiod_date = dateTimeNow
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>
                        Save
                    </Button>
                </InputGroup>

                <h6>Has trival</h6>
                <Row>
                    <Col>
                        <Form.Select
                            onChange={event => setUserTrial(event.target.value)}
                        >
                            <option>Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Button variant="outline-secondary" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        const hasTrial = userHasTrial === "yes"
                        
                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&has_trial=${hasTrial}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                newUserObject.has_trial = userHasTrial === "yes"
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>Save</Button>
                    </Col>
                </Row>
                <br/>
                <Button variant="outline-secondary" onClick={async () => {
                    await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${props.currentSelectedUser.key}&uuid=${null}`)
                    .then(async response => await response.json()).then(async response => {
                        if (response.modifiedCount === 1) {
                            let newUserObject = props.currentSelectedUser
                            newUserObject.uuid = null
                            props.setCurrentSelectedUser(newUserObject)
                        }
                    })
                }}>Reset user device uuid</Button>
            </Modal.Body>
            <Toast style={{margin: "15px"}} onClose={() => setShow(false)} show={show}>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Copy key!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>{props.currentSelectedUser.key}</Toast.Body>
            </Toast>
        </Modal>
    )
}

const AddUserModal = props => {
    const [show, setShow] = useState(false)
    const [currentKey, setCurrentKey] = useState('')
    const [userPeriodDate, setUserPeriodDate] = useState(4)
    const [username, setUsername] = useState('')

    return (
        <Modal
            show={props.showAddUserWindow}
            onHide={()=>{
                props.setShowAddUserWindow(false)
                setShow(false)
            }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add user
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h6>Username</h6>
                <FormControl
                    style={{marginBottom: "15px"}}
                    defaultValue={username}
                    onChange={event => setUsername(event.target.value)}
                    aria-label="username"
                    aria-describedby="basic-addon2"
                />

                <h6>Get access for (hours)</h6>
                <FormControl
                    style={{marginBottom: "15px"}}
                    defaultValue={userPeriodDate}
                    onChange={event => setUserPeriodDate(event.target.value)}
                    aria-label="period"
                    aria-describedby="basic-addon2"
                /> 

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => {
                    const date = nowDateAdd(userPeriodDate == "inf" ? 27713136 : userPeriodDate)

                    fetch(`${props.apiServer}/add_user?adminApiKey=${props.adminApiKey}&username=${username}&end_preiod_date=${date}&start_preiod_date=${UTCDate()}`)
                    .then(response => response.json()).then(newCreatedUser => {
                        props.setUsersList(props.usersList.concat([newCreatedUser]))

                        setCurrentKey(newCreatedUser ? newCreatedUser.key : "Error")
                        setUsername("")
                        setShow(true)
                    })
                }}>
                    Add
                </Button>
            </Modal.Footer>

            <Toast style={{margin: "15px"}} onClose={() => {
                setShow(false)
                props.setShowAddUserWindow(false)
            }} show={show} delay={20000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Copy key!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>{currentKey}</Toast.Body>
            </Toast>
        </Modal>
    ) 
}

const AddUserButton = props => {
    const addUserPhoto = "https://img.icons8.com/windows/344/add-user-male--v1.png"
    const buttonStyle = {
        background: "none",
        border: "none"
    }
    if (!props.isLoginSuccessful) return (<></>)
    return (
        <div style={{textAlign: "end"}}>
            <button style={buttonStyle} onClick={()=>props.setShowAddUserWindow(true)}>
                <img src={addUserPhoto} style={{width: "35px"}}/>
            </button>
        </div>
    )
}

export default TablePage