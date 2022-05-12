module.exports = {
  capitalize: (user) => {
    const name = user.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },
};
