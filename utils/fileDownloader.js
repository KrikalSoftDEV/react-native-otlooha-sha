import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import FileViewer from 'react-native-file-viewer';
import { Toast } from 'react-native-toast-notifications';
export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 29) {
      // Android 9 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to download and store PDF files',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // Android 10+ doesn't require runtime storage permission
    return true;
  } else if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  }

  return false;
};


export const downloadFileOffline = async (fileUrl, fileName, onProgress) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return null;

    const localPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const fileExists = await RNFS.exists(localPath);
    if (fileExists) {
      console.log('File already exists at:', localPath);
      //  Toast.show('Already Downloaded PDF!', {
      //                         type: 'success',
      //                         placement: 'bottom',
      //                         duration:1000
                            
      //                     });
      return localPath;
    }

    const download = RNFS.downloadFile({
      fromUrl: fileUrl,
      toFile: localPath,
      begin: res => {
        console.log('Download started:', res);
      },
      progress: res => {
        const percent = res.contentLength > 0
          ? res.bytesWritten / res.contentLength
          : 0;

        if (onProgress) onProgress(percent);
      },
      progressInterval: 100,     // update every 100ms
      progressDivider: 1,        // update every percent step
    });

    const result = await download.promise;

    if (result.statusCode === 200) {
      console.log('Download complete:', localPath);
      return localPath;
    } else {
      throw new Error(`Download failed with status ${result.statusCode}`);
    }
  } catch (error) {
    console.error('File download failed:', error);
    return null;
  }
};

// if download and View pdf

// export const downloadFileOffline = async (fileUrl, fileName, onProgress) => {
//   try {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       console.warn('Permission denied');
//       return false;
//     }

//     const localPath =
//       Platform.OS === 'android'
//         ? `${RNFS.DownloadDirectoryPath}/${fileName}`
//         : `${RNFS.DocumentDirectoryPath}/${fileName}`;

//     const fileExists = await RNFS.exists(localPath);

//     if (fileExists) {
//       console.log('📄 File exists, opening:', localPath);
//       await FileViewer.open(localPath, { showOpenWithDialog: true });
//       return true;
//     }

//     // Start download
//     const download = RNFS.downloadFile({
//       fromUrl: fileUrl,
//       toFile: localPath,
//       begin: res => console.log('⬇️ Download started:', res),
//       progress: res => {
//         const percent = res.contentLength > 0
//           ? res.bytesWritten / res.contentLength
//           : 0;
//         onProgress?.(percent);
//       },
//       progressInterval: 100,
//       progressDivider: 1,
//     });

//     const result = await download.promise;

//     if (result.statusCode === 200) {
//       console.log('✅ Download complete, opening:', localPath);
//       await FileViewer.open(localPath, { showOpenWithDialog: true });
//       return true;
//     } else {
//       throw new Error(`Download failed with status ${result.statusCode}`);
//     }
//   } catch (error) {
//     console.error('❌ Failed to download or open PDF:', error);
//     return false;
//   }
// };

