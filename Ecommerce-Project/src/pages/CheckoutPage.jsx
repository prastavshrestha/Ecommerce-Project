import axios from 'axios';
import { Link } from 'react-router'
import dayjs from 'dayjs'
import { FormatMoney } from '../utils/Money';
import './CheckoutPage.css'
import './checkout-header.css'
import { useEffect, useState } from 'react';

export function CheckoutPage({ cart }) {

    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);

    useEffect(() => {
        axios.get('api/delivery-options?expand=estimatedDeliveryTime')
            .then((response) => {
                setDeliveryOptions(response.data);
            })

        axios.get('api/payment-summary')
            .then((response) => {
                setPaymentSummary(response.data)
            });
    }, []);

    return (
        <>
            <title>Checkout Page</title>
            <div className="checkout-header">
                <div className="header-content">
                    <div className="checkout-header-left-section">
                        <Link to="/">
                            <img className="logo" src="images/logo.png" />
                            <img className="mobile-logo" src="images/mobile-logo.png" />
                        </Link>
                    </div>

                    <div className="checkout-header-middle-section">
                        Checkout (<a className="return-to-home-link"
                            href="/">3 items</a>)
                    </div>

                    <div className="checkout-header-right-section">
                        <img src="images/icons/checkout-lock-icon.png" />
                    </div>
                </div>
            </div>

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <div className="order-summary">
                        {deliveryOptions.length > 0 && cart.map((cart_item) => {
                            const selectedDelivery = deliveryOptions.find((deliveryOption) => {
                                return deliveryOption.id === cart_item.deliveryOptionId
                            });

                            return (
                                <div key={cart_item.productId} className="cart-item-container">
                                    <div className="delivery-date">
                                        Delivery date: {dayjs(selectedDelivery.estimatedDeliveryTimeMs).format('dddd,MMMM,D')}
                                    </div>

                                    <div className="cart-item-details-grid">
                                        <img className="product-image"
                                            src={cart_item.product.image} />

                                        <div className="cart-item-details">
                                            <div className="product-name">
                                                {cart_item.product.name}
                                            </div>
                                            <div className="product-price">
                                                {FormatMoney(cart_item.product.priceCents)}
                                            </div>
                                            <div className="product-quantity">
                                                <span>
                                                    Quantity: <span className="quantity-label">{cart_item.quantity}</span>
                                                </span>
                                                <span className="update-quantity-link link-primary">
                                                    Update
                                                </span>
                                                <span className="delete-quantity-link link-primary">
                                                    Delete
                                                </span>
                                            </div>
                                        </div>

                                        <div className="delivery-options">
                                            <div className="delivery-options-title">
                                                Choose a delivery option:
                                            </div>
                                            {deliveryOptions.map((deliveryOption) => {

                                                let priceString = 'FREE Shipping'
                                                if (deliveryOption.priceCents > 0) {
                                                    priceString = `${FormatMoney(deliveryOption.priceCents)}-Shipping`
                                                }


                                                return (
                                                    <div key={deliveryOption.id} className="delivery-option">
                                                        <input type="radio"
                                                            checked={deliveryOption.id === cart_item.deliveryOptionId}
                                                            className="delivery-option-input"
                                                            name={`delivery-option-${cart_item.productId}`} />
                                                        <div>
                                                            <div className="delivery-option-date">
                                                                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd,MMMM,D')}
                                                            </div>
                                                            <div className="delivery-option-price">
                                                                {priceString}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="payment-summary">
                        <div className="payment-summary-title">
                            Payment Summary
                        </div>

                        {paymentSummary && (
                            <>
                                <div className="payment-summary-row">
                                    <div>Items ({paymentSummary.totalItems}):</div>
                                    <div className="payment-summary-money">{FormatMoney(paymentSummary.productCostCents)}</div>
                                </div>

                                <div className="payment-summary-row">
                                    <div>Shipping &amp; handling:</div>
                                    <div className="payment-summary-money">{FormatMoney(paymentSummary.shippingCostCents)}</div>
                                </div>

                                <div className="payment-summary-row subtotal-row">
                                    <div>Total before tax:</div>
                                    <div className="payment-summary-money">{FormatMoney(paymentSummary.totalCostBeforeTaxCents)}</div>
                                </div>

                                <div className="payment-summary-row">
                                    <div>Estimated tax (10%):</div>
                                    <div className="payment-summary-money">{FormatMoney(paymentSummary.taxCents)}</div>
                                </div>

                                <div className="payment-summary-row total-row">
                                    <div>Order total:</div>
                                    <div className="payment-summary-money">{FormatMoney(paymentSummary.totalCostCents)}</div>
                                </div>
                            </>
                        )}

                        <button className="place-order-button button-primary">
                            Place your order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}