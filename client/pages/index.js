const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => <tr className="ticket" key={ticket.id}><td>{ticket.title}</td><td>{ticket.price}</td><td><a href={`/tickets/${ticket.id}`}>View</a></td></tr>);
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => <tr key={ticket.id}><td>{ticket.title}</td><td>{ticket.price}</td><td><a href={`/tickets/${ticket.id}`}>View</a></td></tr>)}
                </tbody>
            </table>
        </div>
    );
}
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');

    return { tickets: data };
}

export default LandingPage;