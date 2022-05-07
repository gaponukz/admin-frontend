import { Table } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const MessagesPage = props => {
    const [messagesList, setMessagesList] = useState([])
    const [isLoginSuccessful, setLoginSuccess] = useState(false)

    useEffect(() => {try {
        fetch(`${props.apiServer}/get_messages?adminApiKey=${props.adminApiKey}`)
        .then(response => response.json()).then(response => {
            setLoginSuccess(response.isLoginSuccess)
            localStorage.setItem('isAuth', 'true')
            setMessagesList(response.messages)
        })
    } catch (error) {
        console.error(error)
        setLoginSuccess(false)
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
                    </tr>
                )}
            </tbody>
        </Table>
    </>)
}

export default MessagesPage