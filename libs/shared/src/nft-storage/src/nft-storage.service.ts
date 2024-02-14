import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NFTStorage, File } from 'nft.storage';
import { download } from './fileStorage.helper';
import * as path from 'path';
import * as fs from 'fs';
import { FileTypeResult } from 'file-type'; // Import FileTypeResult from file-type
import { NftInfoDTO } from 'apps/assets/src/DTOs/NftInfo';

@Injectable()
export class NftStorageService {
  private client: NFTStorage;
  private fileTypeModule: any;

  constructor(private readonly configService: ConfigService) {
    this.client = new NFTStorage({ token: this.configService.get('API') });
    this.initializeFileTypeModule(); // Call the method to initialize the file-type module
  }

  private async initializeFileTypeModule() {
    try {
      // Dynamically import the file-type module
      const module = await import('file-type');
      this.fileTypeModule = module.default; // Assign the default export of the module
    } catch (error) {
      console.error('Error loading file-type module:', error);
    }
  }

  private async fileFromPath(filePath: string) {
    try {
      const content = await fs.promises.readFile(filePath);
      const type: FileTypeResult | undefined =
        await this.fileTypeModule?.fromFile(filePath);
      console.log(type);

      const mime = type?.mime as string;
      console.log(mime);
      return new File([content], path.basename(filePath), {
        type: 'image/*',
      });
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Throw the error to handle it outside the method if necessary
    }
  }

  async storeNft(nftInfo: NftInfoDTO, fileKey: string) {
    try {
      const baseDir = path.resolve(__dirname, '..', '..', '..', 'images');
      await download(nftInfo.imgUrl, `${baseDir}/${fileKey}`, () => {
        console.log('Downloaded image');
      });
      console.log('Image downloaded!');

      const content = await this.fileFromPath(`${baseDir}/${fileKey}`);
      const metadata = await this.client.store({
        name: nftInfo.model,
        description: nftInfo.toString(),
        image: content,
      });
      console.log('NFT stored:', metadata.url);
      return metadata.url;
    } catch (error) {
      console.error('Error storing NFT:', error);
      throw error; // Throw the error to handle it outside the method if necessary
    }
  }
}
