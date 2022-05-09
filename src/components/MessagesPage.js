import { Table } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const MessagesPage = props => {
    const [messagesList, setMessagesList] = useState([])

    const removeMessageImage = "https://img.icons8.com/windows/344/delete-forever.png"
    const buttonStyle = { background: "none", border: "none" }

    const removeMessage = async message => {
        await fetch(`${props.apiServer}/remove_message?adminApiKey=${props.adminApiKey}&_id=${message._id}`)
        .then(async response => await response.json()).then(async response => {
            if (response.deletedCount === 1) {
                setMessagesList(messagesList.filter(item => item._id !== message._id))
            }
        })
    }

    useEffect(() => {try {
        fetch(`${props.apiServer}/get_messages?adminApiKey=${props.adminApiKey}`)
        .then(response => response.json()).then(response => {
            localStorage.setItem('isAuth', 'true')
            setMessagesList(response.messages)
        })
    } catch (error) {
        console.error(error)
        setMessagesList([])
    }}, [])

    return (<>
        <Table>
            <tbody>
                {messagesList.map(message =>
                    <tr>
                        <td>{message.subject}</td>
                        <td>{message.message}</td>
                        <td>{message.date}</td>
                        <td>{message.gmail}</td>
                        <td>
                            <button style={buttonStyle} onClick={()=>removeMessage(message)}>
                                <img src={removeMessageImage} style={{width: "25px"}}/>
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    </>)
}

export default MessagesPage
