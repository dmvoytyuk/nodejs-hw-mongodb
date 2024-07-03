import { TMP_UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExist } from './utils/createDirIfNotExists.js';

await initMongoConnection();
createDirIfNotExist(TMP_UPLOAD_DIR);
setupServer();
