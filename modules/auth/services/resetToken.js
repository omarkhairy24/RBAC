const crypto = require('crypto');

exports.generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  return { resetToken, resetTokenHash, resetTokenExpires };
};