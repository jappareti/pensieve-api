const User = require('../models/user');
const CardsMailer = require('../../mailers/cards_mailer');

module.exports = (agenda) => {
  agenda.define('sendDueCardsReminder', async (job, done) => {
    try {
      const users = await User.find({ 'prefs.emailNotifs': true });

      users.forEach((user) => {
        const cardsMailer = new CardsMailer();
        cardsMailer.sendDueCardsReminder(user._id);
      });
      done();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    }
  });
};