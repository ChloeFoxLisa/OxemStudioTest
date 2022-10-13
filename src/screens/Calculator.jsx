import { Slider } from "@material-ui/core";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import loader from "./../img/loader.svg";

export const Calculator = () => {
    const [carPrice, setCarPrice] = useState(3300000);
    const [carPriceGlobal, setCarPriceGlobal] = useState(3300000);
    const [initial, setInitial] = useState(420000);
    const [percent, setPercent] = useState('13%');
    const [percentSlider, setPercentSlider] = useState(13);
    const [months, setMonths] = useState(60);
    const [monthsGlobal, setMonthsGlobal] = useState(60);
    const [leasing, setLeasing] = useState(4467313);
    const [monthPrice, setMonthPrice] = useState(114455);
    const [isLocked, setIsLocked] = useState(false);

    const carPriceBlur = useCallback(() => {
        carPrice < 1000000 ? setCarPrice(1000000) : carPrice > 6000000 ? setCarPrice(6000000) : setCarPrice(carPrice);
    }, [carPrice])

    const percentBlur = useCallback(() => {
        let percents = percent.slice(0, -1)
        percents < 10 ? setPercent('10%') : percents > 60 ? setPercent('60%') : setPercent(percent);
    }, [percent])

    const monthsBlur = useCallback(() => {
        months < 1 ? setMonths(1) : months > 60 ? setMonths(60) : setMonths(months);
    }, [months])


    const handleChangeCarPrice = (e, data) => {
        let number;
        data ? number = data : number = e.target.value;
        number = String(number).replaceAll(' ', '');
        if (isNaN(number.replace(carPrice, ''))) {
            setCarPrice(carPrice)
        } else {
            number < 1000000 ? setCarPriceGlobal(1000000) : number > 6000000 ? setCarPriceGlobal(6000000) : setCarPriceGlobal(carPrice);
            setCarPrice(number);
        }
    }

    const handleChangePercent = (e, data) => {
        let number;
        data ? number = data.toString() : number = e.target.value.slice(0, -1);
        if (isNaN(number.replace(percentSlider, ''))) {
            setPercent(percent)
        } else {
            number < 10 ? setPercentSlider(10) : number > 60 ? setPercentSlider(60) : setPercentSlider(number);
            setPercent(number + "%");
        }
    }

    const handleChangeMonths = (e, data) => {
        data ? setMonths(data) : setMonths(e.target.value);
        let number;
        data ? number = data : number = e.target.value;
        number = String(number).replaceAll(' ', '');
        if (isNaN(number.replace(carPrice, ''))) {
            setMonths(months)
        } else {
            number < 1 ? setMonthsGlobal(1) : number > 60 ? setMonthsGlobal(60) : setMonthsGlobal(months);
            setMonths(number);
        }
    }

    useEffect(() => {
        setInitial(Math.round(carPriceGlobal * (percentSlider / 100)));
    }, [carPriceGlobal, percentSlider]);

    useEffect(() => {
        setLeasing(initial + monthsGlobal * monthPrice);
    }, [initial, monthsGlobal, monthPrice]);

    useEffect(() => {
        const monthPay = Math.round((carPriceGlobal - initial) * ((0.035 * Math.pow((1 + 0.035), monthsGlobal))) / (Math.pow((1 + 0.035), monthsGlobal) - 1));
        setMonthPrice(monthPay);
    }, [carPriceGlobal, initial, monthsGlobal]);

    function changePriceFormat(price) {
        return `${String(price).split("").reverse().map((el, i) => (i + 1) % 3 === 0 ? ` ${el}` : el).reverse().join("")}`;
    }

    const handleSendData = async () => {
        setIsLocked(true);

        const data = {
            "car_coast": carPriceGlobal,
            "initail_payment": initial,
            "initail_payment_percent": percentSlider,
            "lease_term": monthsGlobal,
            "total_sum": leasing,
            "monthly_payment_from": monthPrice
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        const response = await fetch('https://hookb.in/eK160jgYJ6UlaRPldJ1P', requestOptions);

        if (response.ok) {
            setIsLocked(false);
        } else {
            setIsLocked(false);
            console.log("Ошибка HTTP: " + response.status);
        }
    }

    return (
        <main className="calculator center">
            <h1 className="calculator__title">Рассчитайте стоимость<br />автомобиля в лизинг</h1>
            <div className="calculator__content">
                <div className="calculator__content__sliders">
                    <div className={isLocked ? 'calculator__content__sliders__el disabled' : 'calculator__content__sliders__el'}>
                        <p className="calculator__content__sliders__el__title">Стоимость автомобиля</p>
                        <input
                            onBlur={carPriceBlur}
                            id="priceForm"
                            onChange={handleChangeCarPrice}
                            value={changePriceFormat(carPrice)}
                            className="calculator__content__sliders__el__input"
                            disabled={isLocked} />
                        <div className="calculator__content__sliders__el__input__addendum">₽</div>
                        <Slider
                            onChange={handleChangeCarPrice}
                            className="calculator__content__sliders__el__slider"
                            min={1000000}
                            max={6000000}
                            value={carPrice}
                            disabled={isLocked}
                            aria-label="Default" />
                    </div>
                    <div className={isLocked ? 'calculator__content__sliders__el disabled' : 'calculator__content__sliders__el'}>
                        <p className="calculator__content__sliders__el__title">Первоначальный взнос</p>
                        <div className="calculator__content__sliders__el__input" type="number">{changePriceFormat(initial) + " ₽"}</div>
                        <input
                            onBlur={percentBlur}
                            onChange={handleChangePercent}
                            value={percent}
                            className="calculator__content__sliders__el__input__addendum percent"
                            disabled={isLocked} />
                        <Slider
                            onChange={handleChangePercent}
                            className="calculator__content__sliders__el__slider"
                            min={10}
                            max={60}
                            value={percentSlider}
                            disabled={isLocked}
                            aria-label="Default" />
                    </div>
                    <div className={isLocked ? 'calculator__content__sliders__el disabled' : 'calculator__content__sliders__el'}>
                        <p className="calculator__content__sliders__el__title">Срок лизинга</p>
                        <input
                            onBlur={monthsBlur}
                            onChange={handleChangeMonths}
                            value={months}
                            disabled={isLocked}
                            className="calculator__content__sliders__el__input" />
                        <div className="calculator__content__sliders__el__input__addendum">мес.</div>
                        <Slider
                            onChange={handleChangeMonths}
                            className="calculator__content__sliders__el__slider"
                            min={1}
                            max={60}
                            value={months}
                            disabled={isLocked}
                            aria-label="Default"
                        />
                    </div>
                </div>
                <div className="calculator__content__money">
                    <div className="calculator__content__money__el">
                        <p className="calculator__content__money__el__title">Сумма договора лизинга</p>
                        <div className="calculator__content__money__el__amount">{changePriceFormat(leasing) + " ₽"}</div>
                    </div>
                    <div className="calculator__content__money__el">
                        <p className="calculator__content__money__el__title">Ежемесячный платеж от</p>
                        <div className="calculator__content__money__el__amount">{changePriceFormat(monthPrice) + " ₽"}</div>
                    </div>
                    {isLocked && <button
                        onClick={handleSendData}
                        className="calculator__content__money__button locked"
                        disabled={isLocked}><img src={loader} alt="" /></button>}
                    {!isLocked && <button
                        onClick={handleSendData}
                        className="calculator__content__money__button"
                        disabled={isLocked}>Оставить заявку</button>}
                </div>
            </div>
        </main>
    );
}