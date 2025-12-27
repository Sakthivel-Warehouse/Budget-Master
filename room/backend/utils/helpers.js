const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateShareAmount = (totalAmount, memberCount) => {
  return Math.round((totalAmount / memberCount) * 100) / 100;
};

module.exports = { generateOTP, generateShareAmount };
