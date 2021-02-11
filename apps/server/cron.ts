import { schedule } from 'node-cron';

export const setup = () => {
  schedule('* * * * *', () => {
    console.log('every minute', new Date());
  });
};

