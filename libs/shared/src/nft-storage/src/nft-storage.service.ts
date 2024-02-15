import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NFTStorage, File } from 'nft.storage';
import { download } from './fileStorage.helper';
import * as path from 'path';
import * as fs from 'fs';
import { FileTypeResult } from 'file-type'; // Import FileTypeResult from file-type
import { NftInfoDTO } from 'apps/assets/src/DTOs/NftInfo';
import { Url } from 'url';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class NftStorageService {
  private client: NFTStorage;
  private fileTypeModule: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmiiter: EventEmitter2,
  ) {
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

  private async fileFromPath(filePath: string, mimeType) {
    try {
      const content = await fs.promises.readFile(filePath);
      const type: FileTypeResult | undefined =
        await this.fileTypeModule?.fromFile(filePath);
      console.log(type);

      console.log(mimeType);
      return new File([content], path.basename(filePath), {
        type: mimeType,
      });
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Throw the error to handle it outside the method if necessary
    }
  }

  async storeNft(nftInfo: NftInfoDTO, fileKey: string) {
    try {
      const baseDir = path.resolve(__dirname, '..', '..', '..', 'images');
      const imageURL = nftInfo.imgUrl;
      const fileName = path.basename(new URL(imageURL).pathname); // Extract filename from the URL
      const fileExtension = path.extname(fileName).toLowerCase(); // Extract file extension from the filename
      const mimeType = this.getMimeTypeFromExtension(fileExtension);
      await download(nftInfo.imgUrl, `${baseDir}/${fileKey}`, () => {
        console.log('Downloaded image');
      });
      console.log('Image downloaded!');

      const content = await this.fileFromPath(
        `${baseDir}/${fileKey}`,
        mimeType,
      );
      console.log(content.name);
      const metadata = await this.client.store({
        name: nftInfo.model,
        description: JSON.stringify(nftInfo),
        image: content,
      });
      console.log(metadata);

      console.log('NFT stored:', metadata.url);
      this.eventEmiiter.emit('nftStored', `${baseDir}/${fileKey}`);

      return metadata.url;
    } catch (error) {
      console.error('Error storing NFT:', error);
      throw error; // Throw the error to handle it outside the method if necessary
    }
  }
  getMimeTypeFromExtension(extension: string) {
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.bmp':
        return 'image/bmp';
      default:
        return 'application/octet-stream'; // Default MIME type for unknown extensions
    }
  }

  @OnEvent('nftStored', { async: true })
  async deleteImageFile(filePath: string) {
    try {
      await fs.unlink(filePath, () => {
        console.log('Image file deleted successfully:', filePath);
      });
    } catch (error) {
      console.error('Error deleting image file:', error);
      throw error;
    }
  }
}
