import mongoose from 'mongoose';

export default async function databaseInitialize(){
    const uri = 'mongodb://127.0.0.1:27017/crab';
    console.log('[Database] Connecting to database...');
    try {
        await mongoose.connect(uri);
        console.log('[Database] Database has been initialized!');
    } catch (err: any) {
        console.error('[Database] Error: ', err);
    }
}