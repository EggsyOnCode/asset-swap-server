import * as fs from 'fs';
import axios from 'axios';

export const download = async function (url, dest, cb) {
  const writer = fs.createWriteStream(dest);
  console.log(dest);

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    response.data.pipe(writer);

    // writer.pipe(response.data);
    console.log('1');

    writer.on('finish', () => {
      console.log('File downloaded successfully!');
      writer.close(cb); // close() is async, call cb after close completes
    });
  } catch (err) {
    console.error('Error downloading the file:', err);
    fs.unlink(dest, () => {
      // Delete the file if an error occurs (async, no result checked)
      console.log('Deleted incomplete file:', dest);
    });
  }
};
