function formatSimpleDate(isoString) {
    const date = new Date(isoString);

    if (isNaN(date)) {
        throw new Error('Invalid date string');
    }

    const day = padZero(date.getUTCDate());
    const month = padZero(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function capitalise(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

module.exports = { formatSimpleDate, capitalise };