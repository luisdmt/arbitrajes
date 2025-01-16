import React, { useState, useEffect } from 'react';
    import * as localforage from 'localforage';

    function ArbitrageCalculator({ onLogout, user, exchangeRate }) {
      const [sellPrice, setSellPrice] = useState('');
      const [buyPrice, setBuyPrice] = useState('');
      const [vesAmount, setVesAmount] = useState('');
      const [profit, setProfit] = useState(null);
      const [history, setHistory] = useState([]);
      const [error, setError] = useState('');

      useEffect(() => {
        loadHistory();
      }, []);

      const loadHistory = async () => {
        const storedHistory = await localforage.getItem('history') || [];
        setHistory(storedHistory);
      };

      const saveHistory = async (newCalculation) => {
        const updatedHistory = [...history, newCalculation];
        setHistory(updatedHistory);
        await localforage.setItem('history', updatedHistory);
      };

      const calculateArbitrage = () => {
        const sell = parseFloat(sellPrice);
        const buy = parseFloat(buyPrice);
        const amount = parseFloat(vesAmount);
        const rate = parseFloat(exchangeRate);

        if (isNaN(sell) || isNaN(buy) || isNaN(amount) || isNaN(rate) || amount <= 0) {
          setProfit(null);
          setError('Por favor, ingrese valores válidos.');
          return;
        }

        setError('');
        const profitValue = (sell - buy) * (amount / rate);
        setProfit(profitValue);

        const newCalculation = {
          sellPrice: sell,
          buyPrice: buy,
          vesAmount: amount,
          exchangeRate: rate,
          profit: profitValue,
          timestamp: new Date().toLocaleString(),
        };
        saveHistory(newCalculation);
      };

      return (
        <div className="container">
          <h2>Calculadora de Arbitraje VES/USDT</h2>
          <p>Bienvenido, {user.username}!</p>
          <div className="form-group">
            <label>Precio de Venta (USD)</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Precio de Compra (USD)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Cantidad (VES)</label>
            <input
              type="number"
              value={vesAmount}
              onChange={(e) => setVesAmount(e.target.value)}
            />
          </div>
          <button onClick={calculateArbitrage}>Calcular Ganancia</button>
          {error && <div className="error-message">{error}</div>}
          {profit !== null && (
            <div className="form-group">
              <h3>Ganancia: {profit.toFixed(2)} VES</h3>
            </div>
          )}
          <div className="history-container">
            <h4>Historial de Cálculos</h4>
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <span>
                  {item.timestamp}: Venta: {item.sellPrice}, Compra: {item.buyPrice}, Cantidad: {item.vesAmount} VES, Ganancia: {item.profit.toFixed(2)} VES
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default ArbitrageCalculator;
