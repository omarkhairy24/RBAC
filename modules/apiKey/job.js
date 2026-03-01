const agenda = require("../../config/agenda.jobs");
const ApiKey = require("./schema");

agenda.define('reset-monthly', async (job) => {
  try {
    const { apiKeyId } = job.attrs.data;
    const apiKey = await ApiKey.findById(apiKeyId);

    const nextMonthDate = new Date(apiKey.monthlyReset);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    const resetJobId = await agenda.schedule(nextMonthDate, 'reset-monthly', { apiKeyId });
    apiKey.requestsUsed = 0 ;
    apiKey.monthlyReset = nextMonthDate;
    apiKey.resetJobId = resetJobId;
    await apiKey.save();
    
  } catch (error) {
    console.error('Error in reset job:', error);
  }
});