import dayjs from 'dayjs';
import axios from 'axios';
import { FormatMoney } from '../../utils/Money';
import { DeliveryOptions } from './DeliveryOptions';

export function OrderSummary({deliveryOptions,cart}) {
    return (
        <div className="order-summary">
            {deliveryOptions.length > 0 && cart.map((cart_item) => {
                const selectedDelivery = deliveryOptions.find((deliveryOption) => {
                    return deliveryOption.id === cart_item.deliveryOptionId
                });

                const deleteCartItem = async()=>{
                    await axios.delete(`/api/cart-items/${cart_item.productId}`)
                };

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
                                    <span className="delete-quantity-link link-primary"
                                        onClick={deleteCartItem}
                                    >
                                        Delete
                                    </span>
                                </div>
                            </div>

                            <DeliveryOptions 
                                deliveryOptions={deliveryOptions}
                                cart_item={cart_item}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}