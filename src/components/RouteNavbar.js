import { Container, Navbar, Nav } from 'react-bootstrap'

const RouteNavbar = props => {
    return (
        <Navbar bg="dark" variant="dark" fixed="top" >
            <Container fluid>
                <Navbar.Brand href="#">Users</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>{props.setPage('login'); localStorage.setItem('page', 'login')}} href="#">Login</Nav.Link>
                    <Nav.Link onClick={()=>{props.setPage('table'); localStorage.setItem('page', 'table')}} href="#">Table</Nav.Link>
                    <Nav.Link onClick={()=>{props.setPage('posts'); localStorage.setItem('page', 'posts')}} href="#">News</Nav.Link>
                    <Nav.Link onClick={()=>{props.setPage('messages'); localStorage.setItem('page', 'messages')}} href="#">Messages</Nav.Link>
                    <Nav.Link onClick={()=>{props.setPage('versions'); localStorage.setItem('page', 'versions')}} href="#">Versions</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default RouteNavbar