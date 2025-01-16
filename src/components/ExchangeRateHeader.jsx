import React from 'react';

    function ExchangeRateHeader({ exchangeRate }) {
      return (
        <div className="header">
          <h3>Tasa de Cambio VES/USD: {exchangeRate}</h3>
        </div>
      );
    }

    export default ExchangeRateHeader;
