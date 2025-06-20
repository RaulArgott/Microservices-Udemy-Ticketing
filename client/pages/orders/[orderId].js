import { useEffect, useState } from "react";
const OrderShow = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, []);

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }


    return (
        <div>
            <h1>Order Show</h1>
            <div>
                Time left to pay: {timeLeft} seconds
            </div>
            <button className="btn btn-primary">Pay</button>
        </div>
    );
}
OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}
export default OrderShow