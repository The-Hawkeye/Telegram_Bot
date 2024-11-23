import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        console.log(process.env.MONGO_URI);
        return await mongoose.connect(process.env.MONGO_URI);
      } catch (err) {
        console.log(err);
      }
    },
  },
];
