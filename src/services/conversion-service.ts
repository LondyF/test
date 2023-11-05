//@ts-nocheck
import {Platform} from 'react-native';

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import {WebSQLDatabase} from 'expo-sqlite';

import SecureStorage from '@helpers/secureStorage';

const isAndroid = () => Platform.OS === 'android';

const SQLITE_FOLDER_PATH = FileSystem.documentDirectory + 'SQLite/';

const DB_FILE_NAME = 'app.db3';
const DB_PATH = SQLITE_FOLDER_PATH + DB_FILE_NAME;

const IOS_OLD_DB_PATH = `../Library/${DB_FILE_NAME}`;
const OLD_DB_PATH =
  FileSystem.documentDirectory! +
  (isAndroid() ? DB_FILE_NAME : IOS_OLD_DB_PATH);

const doesSQLiteFolderExist = async () => {
  try {
    return (await FileSystem.getInfoAsync(SQLITE_FOLDER_PATH)).exists;
  } catch (e) {
    return false;
  }
};

const moveOldSQLiteFile = async () => {
  try {
    if (!(await doesSQLiteFolderExist())) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + 'SQLite',
      );
    }

    if (isAndroid()) {
      await FileSystem.moveAsync({
        from: OLD_DB_PATH,
        to: DB_PATH,
      });
    } else {
      await FileSystem.copyAsync({
        from: OLD_DB_PATH,
        to: DB_PATH,
      });
    }

    return true;
  } catch (e) {
    return false;
  }
};

const openDatabase = () => {
  return SQLite.openDatabase(DB_FILE_NAME);
};

const getUserFromDB = (db: WebSQLDatabase) =>
  new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from User', [], (_, {rows: {_array}}) => {
          if (_array.length <= 0) {
            return reject('No User Found');
          }

          return resolve(_array[0] as User);
        });
      },
      error => {
        return reject(error);
      },
    );
  });

// const clearDatabase = (db: WebSQLDatabase) =>
//   new Promise((resolve, reject) => {
//     db.transaction(
//       (tx) => {
//         tx.executeSql('DELETE FROM User', null, (_, { rows: { _array } }) => {
//           return resolve(_array);
//         });
//       },
//       (error) => reject(error),
//     );
//   });

const storeUser = async ({
  pin,
  account,
  locationEnabled,
  cameraEnabled,
  language,
  apuid,
  fingerprintPassword,
  fingerprintenabled,
}: User) => {
  const userToStore: User = {
    account,
    apuId: apuid,
    lang: language,
    pin: pin.toString(),
    biometricPassword: fingerprintPassword,
    biometricEnabled: !!fingerprintenabled,
    locationEnabled: !!locationEnabled,
    cameraEnabled: !!cameraEnabled,
  };

  const success = await SecureStorage.setItem(
    'user',
    JSON.stringify(userToStore),
  );

  if (!success) {
    throw new Error('Failed saving');
  }

  return userToStore;
};

export const doesSQLiteDatabaseExist = async () => {
  try {
    return (await FileSystem.getInfoAsync(OLD_DB_PATH)).exists;
  } catch {
    return false;
  }
};

export const doConversion = async () => {
  try {
    const doesExist = await doesSQLiteDatabaseExist();

    if (doesExist) {
      await moveOldSQLiteFile();

      const db = openDatabase();
      const user = await getUserFromDB(db);
      const storedUser = await storeUser(user as User);

      return storedUser;
    }
  } catch (e) {
    return null;
  }
};
