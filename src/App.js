import { Container } from 'react-bootstrap'
import RouteNavbar from './components/RouteNavbar'
import LoginPage from './components/LoginPage'
import TablePage from './components/TablePage'
import PostsPage from './components/PostsPage'
import MessagesPage from './components/MessagesPage'

import { useState } from 'react'
import './App.css'

const App = () => {
    const apiServer = "https://secret-stream-69608.herokuapp.com" // "http://localhost:5000"
    const [page, setPage] = useState(localStorage.getItem("isAuth") == "true" ? localStorage.getItem("page") : '')
    const [adminApiKey, setAdminApiKey] = useState(localStorage.getItem("adminApiKey") ? localStorage.getItem("adminApiKey") : '')

    return (<>
        <RouteNavbar setPage={setPage}/>
        <Container style={{marginTop: "65px", textAlign: "-webkit-center"}}>
            {{
                login: <LoginPage adminApiKey={adminApiKey} setAdminApiKey={setAdminApiKey} />,
                table: adminApiKey ? <TablePage adminApiKey={adminApiKey} apiServer={apiServer}/> : <br/>,
                posts: <PostsPage adminApiKey={adminApiKey} apiServer={apiServer}/>,
                messages: <MessagesPage adminApiKey={adminApiKey} apiServer={apiServer}/>
            }[page] || <div>Something went wrong</div>}
        </Container>
    </>)
}

export default App;
