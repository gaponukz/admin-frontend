import { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { Col, Row } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { FloatingLabel } from 'react-bootstrap'

const VersionsPage = props => {
    const [versions, setVersions] = useState([])
    const [currentVersion, setCurrentVersion] = useState()
    const [showAddWindow, setShowAddWindow] = useState(false)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${props.adminApiKey}` }
        fetch(`${props.apiServer}/versions/get_versions`, { headers })
        .then(async response => await response.json()).then(async response => {
            setVersions(response.awiable ? response.awiable : [])
            setCurrentVersion(response.current)
        }).catch(err => {
            setVersions([])
            setCurrentVersion(undefined)
            console.log(err);
        })
    }, [isSending])
    
    return (<div style={{textAlign: 'left'}}>
        <AddBuildButton setShowAddWindow={setShowAddWindow}/>
        <AddBuildModal
            showAddWindow={showAddWindow}
            setShowAddWindow={setShowAddWindow}
            adminApiKey={props.adminApiKey}
            apiServer={props.apiServer}
            onAddBuild={() => {setIsSending(!isSending)}}
        />

        <ListGroup variant="flush">
            {versions.map(version => 
                <ListGroup.Item>
                    <Row>
                        <Col>
                            {version === currentVersion ? <b>{version}</b> : version} {' '}
                        </Col>
                        <Col>
                        <div style={{textAlign: 'right'}}>
                            <Button variant="dark" size="sm" onClick={() => {
                                const headers = { 'Authorization': `Bearer ${props.adminApiKey}` }
                                fetch(`${props.apiServer}/versions/set_current_version?version=${version}`, {
                                    method: "POST",
                                    headers: headers
                                }).then(response => response.json()).then(response => {
                                    setIsSending(!isSending)
                                })
                            }}>Set as current version</Button> {' '}
                            
                            <Button variant="info" size="sm" onClick={() => {
                                const headers = { 'Authorization': `Bearer ${props.adminApiKey}` }

                                fetch(`${props.apiServer}/versions/get_build_info?version=${version}`, {headers: headers})
                                .then(response => response.json()).then(info => {
                                    console.log(info)
                                    alert(`version: ${info.version}\nfile: ${info.file_path}\ndescription: ${info.description}\ncreated at: ${info.created_at}`)
                                })

                            }}>Show info</Button> {' '}
                            <Button variant="danger" size="sm" onClick={() => {
                                const headers = { 'Authorization': `Bearer ${props.adminApiKey}` }

                                fetch(`${props.apiServer}/versions/delete_build?version=${version}`, {method: 'DELETE', headers: headers})
                                .then(response => response.json()).then(info => {
                                    setIsSending(!isSending)
                                })

                            }}>Delete</Button> {' '}
                        </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
            )}
        </ListGroup>
    </div>)
}

const AddBuildButton = props => {
    const addPostPhoto = "https://img.icons8.com/windows/344/add--v1.png"
    const buttonStyle = {
        background: "none",
        border: "none"
    }

    return (
        <div style={{textAlign: "end", marginBottom: "10px"}}>
            <button style={buttonStyle} onClick={()=> {
                props.setShowAddWindow(true)
            }}>
                <img src={addPostPhoto} style={{width: "35px"}}/>
            </button>
        </div>
    )
}

const AddBuildModal = props => {
    const [version, setVersion] = useState("")
    const [description, setDescription] = useState('')
    const [file, setFile] = useState()

    return (
        <Modal
        show={props.showAddWindow}
        onHide={()=>props.setShowAddWindow(false)}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header closeButton>
            <Modal.Title>
                Add build
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h6>Version</h6>
            <FormControl
                style={{marginBottom: "15px"}}
                defaultValue={version}
                onChange={event => setVersion(event.target.value)}
                aria-label="Title"
            />

            <h6>Description</h6>
            <FloatingLabel controlId="floatingTextarea2" label="description">
                <Form.Control
                    as="textarea"onChange={event => setDescription(event.target.value)}
                    defaultValue={description}
                    placeholder="Leave a description here"
                    style={{ height: '100px' }}
                />
            </FloatingLabel>
            
            <h6>Zip archive</h6>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload zip</Form.Label>
                <Form.Control type="file" onChange={(event) => {
                    setFile(event.target.files[0])
                }}/>
            </Form.Group>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
                const headers = { 'Authorization': `Bearer ${props.adminApiKey}` }
                const formData = new FormData()

                formData.append('file', file)
                formData.append('version', version)
                formData.append('description', description)
                
                // props.apiServer
                fetch(`${props.apiServer}/versions/upload_files`, {
                    method: "POST",
                    body: formData,
                    headers: headers
                }).then(response => response.json()).then(newCreatedPost => {
                    console.log(newCreatedPost);
                    if (newCreatedPost) {
                        props.onAddBuild()
                        props.setShowAddWindow(false)
                        setDescription("")
                        setVersion("")
                        setFile("")
                    }
                })
            }}>
                Add
            </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default VersionsPage