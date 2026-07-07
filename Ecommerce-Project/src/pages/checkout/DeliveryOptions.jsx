import { FormatMoney } from "../../utils/Money";
import dayjs from "dayjs";
import axios from 'axios';

export function DeliveryOptions({ deliveryOptions, cart_item }) {
    return (
        <div className="delivery-options">
            <div className="delivery-options-title">
                Choose a delivery option:
            </div>
            {deliveryOptions.map((deliveryOption) => {

                let priceString = 'FREE Shipping'
                if (deliveryOption.priceCents > 0) {
                    priceString = `${FormatMoney(deliveryOption.priceCents)}-Shipping`
                }

                const updateDeliveryOption = async ()=>{
                    await axios.put(`api/cart-items/${cart_item.productId}`,{
                        deliveryOptionId: deliveryOption.id
                    })
                };

                return (
                    <div key={deliveryOption.id} className="delivery-option"
                        onClick={updateDeliveryOption}
                    >
                        <input type="radio"
                            checked={deliveryOption.id === cart_item.deliveryOptionId}
                            onChange={()=>{}}
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
    );
}