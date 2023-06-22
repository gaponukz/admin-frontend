import { Container } from 'react-bootstrap'
import RouteNavbar from './components/RouteNavbar'
import LoginPage from './components/LoginPage'
import TablePage from './components/TablePage'
import PostsPage from './components/PostsPage'
import MessagesPage from './components/MessagesPage'
import VersionsPage from './components/VersionsPage'
import { useState } from 'react'
import './App.css'

const App = () => {
    const apiServer = "http://51.75.76.105"
    const [page, setPage] = useState(localStorage.getItem("isAuth") == "true" ? localStorage.getItem("page") : 'login')
    const [adminApiKey, setAdminApiKey] = useState(localStorage.getItem("adminApiKey") ? localStorage.getItem("adminApiKey") : '')

    return (<>
        <RouteNavbar setPage={setPage}/>
        <Container style={{marginTop: "65px", textAlign: "-webkit-center"}}>
            {{
                login: <LoginPage setPage={setPage} adminApiKey={adminApiKey} setAdminApiKey={setAdminApiKey} />,
                table: adminApiKey ? <TablePage setPage={setPage} adminApiKey={adminApiKey} apiServer={apiServer}/> : <br/>,
                posts: <PostsPage setPage={setPage} adminApiKey={adminApiKey} apiServer={apiServer}/>,
                messages: <MessagesPage setPage={setPage} adminApiKey={adminApiKey} apiServer={apiServer}/>,
                versions: <VersionsPage setPage={setPage} adminApiKey={adminApiKey} apiServer={apiServer}/>
            }[page] || <div>Something went wrong</div>}
        </Container>
    </>)
}

export default App;
