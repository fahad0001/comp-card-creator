import React, {Component} from 'react';
import StripeCheckout from "react-stripe-checkout";

export default class StripePayment extends Component {
    render() {
        let style={
            payBtn: {
                width: '170px',
                marginBottom: '15px',
                color: 'white',
                fontSize: '15px',
                backgroundColor: '#4ea7c1'
            }
        };
        return (
            <StripeCheckout
                email={'fahadmir0001@gmail.com'}
                name="Comp Card Payment"
                description="Payment of Online Comp Card Creator"
                amount={this.props.payment * 100}
                token={token => this.props.returnedToken(token)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}>
                <button style={style.payBtn} className="btn btn-outline-default">PAY</button>
            </StripeCheckout>

        );
    }
}
