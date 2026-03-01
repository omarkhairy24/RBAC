const crypto = require('crypto');
const { AppError } = require('../../common/services/appError');
const agenda = require('../../config/agenda.jobs');

exports.generateApiKey = (length = 20) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
};

exports.resetMontlyJob = async (apiKey) =>{
  try {
    
    const nextRun = new Date(apiKey.monthlyReset);
    nextRun.setMonth(nextRun.getMonth() + 1);

    const job = await agenda.schedule(nextRun, 'reset-monthly', { apiKeyId: apiKey._id });

    apiKey.resetJobId = job.attrs._id;
    await apiKey.save();

  } catch (error) {
    throw AppError(error.message, 400)
  }
}