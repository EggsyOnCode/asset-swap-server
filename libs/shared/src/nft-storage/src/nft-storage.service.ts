import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NFTStorage, File } from 'nft.storage';

@Injectable()
export class NftStorageService {
  constructor(private readonly configService: ConfigService) {}
  client = new NFTStorage({ token: this.configService.get('API') });
  async storeNft(nftInfo, file_key) {
    const metadata = await this.client.store({
      name: nftInfo.model,
      description: nftInfo,
      image: new File(
        [
          /* data */
        ],
        file_key,
        { type: 'image/png' },
      ),
    });
    console.log(metadata.url);
  }
}
