const OrderIndex = ({ orders }) => {
    return (
        <>
            <h1>Orders</h1>
            <ul>
                {orders.map(order => <li key={order.id}>{order.ticket.title} - {order.status}</li>)}
            </ul>
        </>
    );
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders')

    return { orders: data }
}

export default OrderIndex