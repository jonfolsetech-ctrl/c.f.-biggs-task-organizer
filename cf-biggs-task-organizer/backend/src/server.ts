import { app } from './app.js';
import { config } from './config.js';
import { startReminderWorker } from './services/reminder.service.js';

app.listen(config.port, () => {
  console.log(`CF Biggs Task Organizer API running on port ${config.port}`);
  startReminderWorker();
});
