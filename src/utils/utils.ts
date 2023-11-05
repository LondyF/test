import moment from 'moment';
import * as RNFS from 'react-native-fs';

export function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

export function decimalToHex(d: number, padding: number) {
  var hex = Number(d).toString(16);
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;

  while (hex.length < padding) {
    hex = '0' + hex;
  }

  return hex;
}

export const fromHexString = (hexString: any) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));

export function stringToBytes(str: string) {
  var bytes: Array<number> = [];
  for (var i = 0; i < str.length; ++i) {
    var code = str.charCodeAt(i);
    bytes = bytes.concat([code]);
  }
  return bytes;
}

export function insert(arr: any[], index: number, newItems: any[]) {
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted items
    ...newItems,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
}

export const convertISOdate = (isoDate: string | Date) => moment(isoDate).format('DD MMM YYYY');

export const convertISOdateWithTime = (isoDate: string | Date) =>
  moment(isoDate).format('DD MMM YYYY HH:mm');

export const getDatesBetweenDates = function (start: Date, end: Date) {
  for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const decodePolyline = (encoded: string) => {
  // array that holds the points

  var points = [];
  var index = 0,
    len = encoded.length;
  var lat = 0,
    lng = 0;
  while (index < len) {
    var b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii                                                                                    //and substract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

export const deleteTmpFolder = async () => {
  try {
    if (await RNFS.exists(RNFS.TemporaryDirectoryPath)) {
      RNFS.unlink(RNFS.TemporaryDirectoryPath);
    }
  } catch (e) {
    console.log(e);
  }
};
